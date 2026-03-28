import { redirect } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requireDbUser } from '@/lib/auth';
import { LayoutShell } from '@/components/layout-shell';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// ──────────────────────────────────────────────
// View → DB status mapping (per spec)
// ──────────────────────────────────────────────

const VIEW_STATUS_MAP: Record<string, string[] | undefined> = {
  all: undefined,
  open: [
    'new',
    'classified',
    'awaiting_dispatch',
    'awaiting_quotes',
    'quotes_received',
    'contractor_selected',
    'scheduled',
    'in_progress',
  ],
  awaiting_quotes: ['awaiting_quotes'],
  active_jobs: ['contractor_selected', 'scheduled', 'in_progress'],
  completed: ['completed'],
  canceled: ['canceled'],
  archived: ['archived'],
};

const VIEW_LABELS: Record<string, string> = {
  all: 'All',
  open: 'Open',
  awaiting_quotes: 'Awaiting quotes',
  active_jobs: 'Active jobs',
  completed: 'Completed',
  canceled: 'Canceled',
  archived: 'Archived',
};

// ──────────────────────────────────────────────
// Display labels (user-friendly)
// ──────────────────────────────────────────────

const STATUS_DISPLAY: Record<string, string> = {
  new: 'New',
  classified: 'Ready to send',
  awaiting_dispatch: 'Ready to send',
  awaiting_quotes: 'Awaiting quotes',
  quotes_received: 'Quotes received',
  contractor_selected: 'Contractor selected',
  scheduled: 'Scheduled',
  in_progress: 'In progress',
  completed: 'Completed',
  canceled: 'Canceled',
  archived: 'Archived',
};

function statusColor(status: string): string {
  const map: Record<string, string> = {
    new: 'border-slate-200 bg-slate-50 text-slate-700',
    classified: 'border-blue-200 bg-blue-50 text-blue-700',
    awaiting_dispatch: 'border-blue-200 bg-blue-50 text-blue-700',
    awaiting_quotes: 'border-yellow-200 bg-yellow-50 text-yellow-700',
    quotes_received: 'border-purple-200 bg-purple-50 text-purple-700',
    contractor_selected: 'border-indigo-200 bg-indigo-50 text-indigo-700',
    scheduled: 'border-indigo-200 bg-indigo-50 text-indigo-700',
    in_progress: 'border-blue-200 bg-blue-50 text-blue-700',
    completed: 'border-green-200 bg-green-50 text-green-700',
    canceled: 'border-slate-200 bg-slate-50 text-slate-700',
    archived: 'border-slate-200 bg-slate-50 text-slate-700',
  };
  return map[status] ?? 'border-slate-200 bg-slate-50 text-slate-700';
}

function urgencyColor(urgency: string | null): string {
  const map: Record<string, string> = {
    emergency: 'border-red-200 bg-red-50 text-red-700',
    high: 'border-orange-200 bg-orange-50 text-orange-700',
    medium: 'border-yellow-200 bg-yellow-50 text-yellow-700',
    low: 'border-green-200 bg-green-50 text-green-700',
  };
  return map[urgency ?? ''] ?? 'border-slate-200 bg-slate-50 text-slate-700';
}

function categoryLabel(category: string | null): string {
  if (!category) return 'Unknown';
  return category.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function urgencyLabel(urgency: string | null): string {
  if (!urgency) return 'Unknown';
  return urgency.charAt(0).toUpperCase() + urgency.slice(1);
}

// ──────────────────────────────────────────────
// Build URL with filters
// ──────────────────────────────────────────────

function buildFilterUrl(
  base: Record<string, string | undefined>,
  overrides: Record<string, string | undefined>,
) {
  const merged = { ...base, ...overrides };
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(merged)) {
    if (v) params.set(k, v);
  }
  const qs = params.toString();
  return `/issues${qs ? `?${qs}` : ''}` as never;
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
  let user;
  try {
    user = await requireDbUser();
  } catch {
    redirect('/sign-in');
  }

  const params = await searchParams;
  const currentView = params.view && VIEW_STATUS_MAP[params.view] !== undefined ? params.view : 'all';
  const propertyFilter = params.property || undefined;
  const urgencyFilter = params.urgency || undefined;
  const categoryFilter = params.category || undefined;
  const searchFilter = params.search || undefined;

  // Preserve current filters for building tab URLs
  const currentFilters: Record<string, string | undefined> = {
    property: propertyFilter,
    urgency: urgencyFilter,
    category: categoryFilter,
    search: searchFilter,
  };

  const properties = await prisma.property.findMany({
    where: { ownerUserId: user.id },
    select: { id: true, nickname: true, addressLine1: true },
  });
  const propertyIds = properties.map((p) => p.id);

  // Build Prisma where clause
  const statuses = VIEW_STATUS_MAP[currentView];
  const where: Record<string, unknown> = {
    propertyId: propertyFilter
      ? propertyFilter
      : { in: propertyIds },
    ...(statuses ? { status: { in: statuses } } : {}),
    ...(urgencyFilter ? { urgency: urgencyFilter } : {}),
    ...(categoryFilter ? { category: categoryFilter } : {}),
  };

  // Text search across title, description, property name
  if (searchFilter) {
    where.OR = [
      { title: { contains: searchFilter, mode: 'insensitive' } },
      { description: { contains: searchFilter, mode: 'insensitive' } },
      { property: { nickname: { contains: searchFilter, mode: 'insensitive' } } },
      { property: { addressLine1: { contains: searchFilter, mode: 'insensitive' } } },
    ];
  }

  const issues = await prisma.issue.findMany({
    where,
    include: {
      property: true,
      jobs: {
        where: { status: { not: 'canceled' } },
        include: { contractor: true },
        take: 1,
        orderBy: { createdAt: 'desc' },
      },
    },
    orderBy: { updatedAt: 'desc' },
  });

  const hasActiveFilters = propertyFilter || urgencyFilter || categoryFilter || searchFilter;

  // Categories that exist in the user's issues for the dropdown
  const categories = [
    'plumbing', 'electrical', 'hvac', 'roofing', 'appliance',
    'structural', 'pest', 'cleaning', 'exterior', 'general_handyman',
  ];

  return (
    <LayoutShell>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-2xl font-bold">Issues</h1>
          <Link href="/issues/new">
            <Button size="sm">Report Issue</Button>
          </Link>
        </div>

        {/* View tabs */}
        <div className="flex flex-wrap gap-1">
          {Object.entries(VIEW_LABELS).map(([key, label]) => {
            const isActive = currentView === key;
            return (
              <Link
                key={key}
                href={buildFilterUrl({ view: key === 'all' ? undefined : key, ...currentFilters }, {})}
              >
                <button
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
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

        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-2">
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

          {/* Urgency filter */}
          <div className="flex items-center gap-1">
            {['emergency', 'high', 'medium', 'low'].map((u) => {
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
                        ? urgencyColor(u) + ' ring-2 ring-offset-1 ring-slate-400'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {urgencyLabel(u)}
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
                    {categoryLabel(c)}
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

        {/* Results */}
        {issues.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  {hasActiveFilters || currentView !== 'all'
                    ? 'No issues match your current filters.'
                    : 'No issues reported yet.'}
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
                      <th className="text-left p-4 font-medium">Issue</th>
                      <th className="text-left p-4 font-medium">Property</th>
                      <th className="text-left p-4 font-medium">Category</th>
                      <th className="text-left p-4 font-medium">Urgency</th>
                      <th className="text-left p-4 font-medium">Status</th>
                      <th className="text-left p-4 font-medium">Contractor</th>
                      <th className="text-left p-4 font-medium">Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {issues.map((issue) => {
                      const activeJob = issue.jobs[0];
                      return (
                        <tr key={issue.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                          <td className="p-4">
                            <Link href={`/issues/${issue.id}`} className="font-medium hover:underline">
                              {issue.title || 'Untitled Issue'}
                            </Link>
                          </td>
                          <td className="p-4 text-muted-foreground">
                            {issue.property.nickname || issue.property.addressLine1 || 'Unnamed'}
                          </td>
                          <td className="p-4">
                            <Badge className="border-slate-200 bg-slate-50 text-slate-700">
                              {categoryLabel(issue.category)}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <Badge className={urgencyColor(issue.urgency)}>
                              {urgencyLabel(issue.urgency)}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <Badge className={statusColor(issue.status)}>
                              {STATUS_DISPLAY[issue.status] || issue.status}
                            </Badge>
                          </td>
                          <td className="p-4 text-muted-foreground text-xs">
                            {activeJob?.contractor?.companyName || activeJob?.contractor?.name || '—'}
                          </td>
                          <td className="p-4 text-muted-foreground text-xs">
                            {new Date(issue.updatedAt).toLocaleDateString()}
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
