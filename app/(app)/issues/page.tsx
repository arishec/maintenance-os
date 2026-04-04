import Link from 'next/link';
import { Prisma, IssueCategory, Urgency } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireDbUserOrRedirect } from '@/lib/auth';

export const dynamic = 'force-dynamic';
import { LayoutShell } from '@/components/layout-shell';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LocalTime } from '@/components/local-time';
import {
  ISSUE_STATUS_LABELS,
  VIEW_STATUS_MAP,
  VIEW_LABELS,
  type IssueView,
  getIssueStatusColor,
  getUrgencyColor,
  getUrgencyLabel,
  getCategoryLabel,
  JOB_STATUS_LABELS,
} from '@/lib/status';

// ──────────────────────────────────────────────
// Build URL with filters
// ──────────────────────────────────────────────

function buildFilterUrl(
  base: Record<string, string | undefined>,
  overrides: Record<string, string | undefined>,
): string {
  const merged = { ...base, ...overrides };
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(merged)) {
    if (v) params.set(k, v);
  }
  const qs = params.toString();
  return `/issues${qs ? `?${qs}` : ''}`;
}

// ──────────────────────────────────────────────
// Page component
// ──────────────────────────────────────────────

export default async function IssuesPage({
  searchParams,
}: {
  searchParams: Promise<{
    view?: string;
    property?: string;
    urgency?: string;
    category?: string;
    search?: string;
  }>;
}) {
  const user = await requireDbUserOrRedirect();

  const params = await searchParams;
  const rawView = params.view;
  const currentView: IssueView =
    rawView && rawView in VIEW_STATUS_MAP ? (rawView as IssueView) : 'all';
  const searchFilter = params.search || undefined;

  const properties = await prisma.property.findMany({
    where: { ownerUserId: user.id },
    select: { id: true, nickname: true, addressLine1: true },
  });
  const propertyIds = properties.map((p) => p.id);

  // Early return: no properties yet
  if (properties.length === 0) {
    return (
      <LayoutShell>
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-xl sm:text-2xl font-bold">Issues</h1>
          </div>
          <Card>
            <CardContent className="py-12 text-center">
              <h2 className="text-lg font-semibold">Add a property first</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                You need at least one property before you can report an issue.
              </p>
              <Link href="/properties/new">
                <Button className="mt-4">Add your first property</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </LayoutShell>
    );
  }

  // Normalize and validate URL filter params to prevent "haunted" empty states
  const validPropertyIds = new Set(propertyIds);
  const propertyFilter =
    params.property && validPropertyIds.has(params.property) ? params.property : undefined;

  const validUrgencies = new Set(['emergency', 'high', 'medium', 'low']);
  const urgencyFilter =
    params.urgency && validUrgencies.has(params.urgency) ? params.urgency : undefined;

  const validCategories = new Set(Object.values(IssueCategory) as string[]);
  const categoryFilter =
    params.category && validCategories.has(params.category) ? params.category : undefined;

  // Preserve current filters for building tab URLs
  const currentFilters: Record<string, string | undefined> = {
    property: propertyFilter,
    urgency: urgencyFilter,
    category: categoryFilter,
    search: searchFilter,
  };

  // Build Prisma where clause
  const statuses = VIEW_STATUS_MAP[currentView];
  const where: Prisma.IssueWhereInput = {
    propertyId: propertyFilter ? propertyFilter : { in: propertyIds },
    ...(statuses ? { status: { in: [...statuses] } } : {}),
    ...(urgencyFilter ? { urgency: urgencyFilter as Urgency } : {}),
    ...(categoryFilter ? { category: categoryFilter as IssueCategory } : {}),
  };

  // Text search across title, description, property name
  if (searchFilter) {
    where.OR = [
      { title: { contains: searchFilter, mode: 'insensitive' } },
      { description: { contains: searchFilter, mode: 'insensitive' } },
      {
        property: {
          is: { nickname: { contains: searchFilter, mode: 'insensitive' } },
        },
      },
      {
        property: {
          is: { addressLine1: { contains: searchFilter, mode: 'insensitive' } },
        },
      },
    ];
  }

  // Run all queries in parallel (all depend on propertyIds which we already have)
  const [issues, viewCounts, usedUrgencies, usedCategories] = await Promise.all([
    prisma.issue.findMany({
      where,
      include: {
        property: true,
        dispatches: {
          include: { contractor: true, responses: true },
        },
        jobs: {
          where: { status: { not: 'canceled' } },
          include: { contractor: true },
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { updatedAt: 'desc' },
    }),
    prisma.issue.groupBy({
      by: ['status'],
      where: { propertyId: { in: propertyIds } },
      _count: true,
    }),
    prisma.issue.findMany({
      where: { propertyId: { in: propertyIds }, urgency: { not: null } },
      select: { urgency: true },
      distinct: ['urgency'],
    }),
    prisma.issue.findMany({
      where: { property: { ownerUserId: user.id }, category: { not: null } },
      select: { category: true },
      distinct: ['category'],
    }),
  ]);

  const hasActiveFilters = Boolean(propertyFilter || urgencyFilter || categoryFilter || searchFilter);

  // Only show view tabs that have issues (always show All and Open)
  const statusCountMap = new Map(viewCounts.map((v) => [v.status, v._count]));
  const alwaysShowViews = new Set(['all', 'open', 'canceled', 'archived']);
  const viewsWithIssues = Object.entries(VIEW_STATUS_MAP).filter(([key, statuses]) => {
    if (alwaysShowViews.has(key)) return true;
    if (key === currentView) return true; // always show the active tab
    if (!statuses) return true;
    return statuses.some((s) => (statusCountMap.get(s) ?? 0) > 0);
  }).map(([key]) => key);

  const urgenciesWithIssues = new Set(usedUrgencies.map((u) => u.urgency as string));
  const categories = usedCategories
    .map((i) => i.category as string)
    .filter(Boolean)
    .sort((a, b) => getCategoryLabel(a).localeCompare(getCategoryLabel(b)));

  return (
    <LayoutShell>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-xl sm:text-2xl font-bold">Issues</h1>
          <Link href="/issues/new">
            <Button size="sm">Report Issue</Button>
          </Link>
        </div>

        {/* View tabs */}
        <div className="flex overflow-x-auto gap-1 -mx-1 px-1 pb-1 no-scrollbar">
          {Object.entries(VIEW_LABELS).filter(([key]) => viewsWithIssues.includes(key)).map(([key, label]) => {
            const isActive = currentView === key;
            return (
              <Link
                key={key}
                href={buildFilterUrl({ view: key === 'all' ? undefined : key, ...currentFilters }, {})}
              >
                <button
                  className={`px-3 py-2 text-sm rounded-md transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-foreground text-background font-medium'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  {label}
                </button>
              </Link>
            );
          })}
        </div>

        {/* Filter bar — only show if there are filters to display */}
        {(properties.length > 1 || urgenciesWithIssues.size > 0 || categories.length > 0 || hasActiveFilters) && (
        <div className="flex flex-wrap items-center gap-2 pb-1">
          {/* Property filter */}
          {properties.length > 1 && (
            <div className="flex items-center gap-1">
              {properties.map((p) => {
                const isActive = propertyFilter === p.id;
                return (
                  <Link
                    key={p.id}
                    href={buildFilterUrl(
                      { view: currentView === 'all' ? undefined : currentView, ...currentFilters },
                      { property: isActive ? undefined : p.id },
                    )}
                  >
                    <Badge
                      className={`cursor-pointer transition-colors ${
                        isActive
                          ? 'bg-foreground text-background'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {p.nickname || p.addressLine1}
                    </Badge>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Urgency filter — only show urgencies that exist */}
          <div className="flex items-center gap-1">
            {['emergency', 'high', 'medium', 'low'].filter((u) => urgencyFilter === u || urgenciesWithIssues.has(u)).map((u) => {
              const isActive = urgencyFilter === u;
              return (
                <Link
                  key={u}
                  href={buildFilterUrl(
                    { view: currentView === 'all' ? undefined : currentView, ...currentFilters },
                    { urgency: isActive ? undefined : u },
                  )}
                >
                  <Badge
                    className={`cursor-pointer transition-colors ${
                      isActive
                        ? getUrgencyColor(u) + ' ring-2 ring-offset-1 ring-slate-400'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {getUrgencyLabel(u)}
                  </Badge>
                </Link>
              );
            })}
          </div>

          {/* Category filter */}
          <div className="flex items-center gap-1">
            {categories.map((c) => {
              const isActive = categoryFilter === c;
              return (
                <Link
                  key={c}
                  href={buildFilterUrl(
                    { view: currentView === 'all' ? undefined : currentView, ...currentFilters },
                    { category: isActive ? undefined : c },
                  )}
                >
                  <Badge
                    className={`cursor-pointer transition-colors ${
                      isActive
                        ? 'bg-foreground text-background'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {getCategoryLabel(c)}
                  </Badge>
                </Link>
              );
            })}
          </div>

          {/* Clear all filters */}
          {hasActiveFilters && (
            <Link
              href={buildFilterUrl({ view: currentView === 'all' ? undefined : currentView }, {})}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors ml-2"
            >
              Clear filters
            </Link>
          )}
        </div>
        )}

        {/* Results */}
        {issues.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  {hasActiveFilters || currentView !== 'all'
                    ? 'No issues match your current filters.'
                    : 'No repairs reported yet. When you report a repair, you can track it here.'}
                </p>
                {hasActiveFilters || currentView !== 'all' ? (
                  <Link href="/issues">
                    <Button variant="outline" size="sm">Clear all filters</Button>
                  </Link>
                ) : (
                  <Link href="/issues/new">
                    <Button>Report your first issue</Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-border bg-muted/50">
                    <tr className="text-muted-foreground">
                      <th className="text-left p-3 sm:p-4 font-medium w-0"></th>
                      <th className="text-left p-3 sm:p-4 font-medium">Issue</th>
                      <th className="text-left p-3 sm:p-4 font-medium hidden sm:table-cell">Property</th>
                      <th className="text-left p-3 sm:p-4 font-medium hidden lg:table-cell">Category</th>
                      <th className="text-left p-3 sm:p-4 font-medium">Status</th>
                      <th className="text-left p-3 sm:p-4 font-medium hidden md:table-cell">Contractor</th>
                      <th className="text-left p-3 sm:p-4 font-medium hidden md:table-cell">Updated</th>
                      <th className="p-3 sm:p-4 w-0"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {issues.map((issue) => {
                      const activeJob = issue.jobs[0];
                      const totalDispatches = issue.dispatches?.length ?? 0;
                      const totalReplies = issue.dispatches?.reduce(
                        (sum, d) => sum + (d.responses?.length ?? 0), 0
                      ) ?? 0;

                      // Derive a more specific status label
                      let derivedStatus = ISSUE_STATUS_LABELS[issue.status] || issue.status;
                      let statusSub = '';
                      if (issue.status === 'active_job' && activeJob) {
                        derivedStatus = JOB_STATUS_LABELS[activeJob.status] || 'Active Job';
                      }
                      if (issue.status === 'quotes_received' && totalReplies > 0) {
                        statusSub = `${totalReplies} response${totalReplies !== 1 ? 's' : ''}`;
                      } else if (issue.status === 'awaiting_quotes' && totalDispatches > 0) {
                        statusSub = `${totalDispatches} contacted`;
                      }

                      // Urgency left border color
                      const urgencyBorder = issue.urgency === 'emergency' || issue.urgency === 'high'
                        ? 'border-l-red-400'
                        : issue.urgency === 'medium'
                          ? 'border-l-amber-400'
                          : 'border-l-transparent';

                      return (
                        <tr key={issue.id} className={`border-b border-l-[3px] border-border hover:bg-muted/30 transition-colors ${urgencyBorder} ${issue.status === 'quotes_received' ? 'bg-green-50/50' : ''}`}>
                          <td className="p-0 w-0"></td>
                          <td className="p-3 sm:p-4">
                            <Link href={`/issues/${issue.id}`} className="font-medium hover:underline">
                              {issue.title || 'Untitled Issue'}
                            </Link>
                            <p className="text-xs text-muted-foreground mt-0.5 sm:hidden">
                              {issue.property.nickname || issue.property.addressLine1 || 'Unnamed'}
                            </p>
                          </td>
                          <td className="p-3 sm:p-4 text-muted-foreground hidden sm:table-cell">
                            {issue.property.nickname || issue.property.addressLine1 || 'Unnamed'}
                          </td>
                          <td className="p-3 sm:p-4 hidden lg:table-cell">
                            <div className="flex items-center gap-1.5">
                              <Badge className="border-slate-200 bg-slate-50 text-slate-700">
                                {getCategoryLabel(issue.category)}
                              </Badge>
                              {(issue.urgency === 'emergency' || issue.urgency === 'high') && (
                                <Badge className="bg-red-100 text-red-700 border-red-200 text-xs">
                                  {issue.urgency === 'emergency' ? 'Emergency' : 'High'}
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className="p-3 sm:p-4">
                            <div>
                              <div className="flex items-center gap-1.5">
                                <Badge className={getIssueStatusColor(issue.status)}>
                                  {derivedStatus}
                                </Badge>
                                {issue.status === 'quotes_received' && totalReplies > 0 && (
                                  <span className="relative flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                                  </span>
                                )}
                              </div>
                              {statusSub && (
                                <p className="text-xs text-muted-foreground mt-1">{statusSub}</p>
                              )}
                            </div>
                          </td>
                          <td className="p-3 sm:p-4 text-muted-foreground text-xs hidden md:table-cell">
                            {activeJob?.contractor?.companyName || activeJob?.contractor?.name
                              ? (activeJob?.contractor?.companyName || activeJob?.contractor?.name)
                              : totalDispatches > 0
                                ? totalReplies > 0
                                  ? `${totalReplies} replied / ${totalDispatches} contacted`
                                  : `${totalDispatches} contacted`
                                : '—'}
                          </td>
                          <td className="p-3 sm:p-4 text-muted-foreground text-xs hidden md:table-cell">
                            <LocalTime date={issue.updatedAt} format="date" />
                          </td>
                          <td className="p-3 sm:p-4">
                            <Link
                              href={`/issues/${issue.id}`}
                              className="inline-flex items-center rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary hover:bg-primary/20 transition-colors whitespace-nowrap"
                            >
                              {activeJob ? 'View job' : 'Open'} →
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        <p className="text-xs text-muted-foreground">
          {issues.length} issue{issues.length !== 1 ? 's' : ''}
          {currentView !== 'all' && ` in ${VIEW_LABELS[currentView]?.toLowerCase()}`}
        </p>
      </div>
    </LayoutShell>
  );
}
