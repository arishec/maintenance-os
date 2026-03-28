import { redirect } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requireDbUser } from '@/lib/auth';
import { LayoutShell } from '@/components/layout-shell';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

function urgencyColor(urgency: string | null): string {
  const map: Record<string, string> = {
    emergency: 'border-red-200 bg-red-50 text-red-700',
    high: 'border-orange-200 bg-orange-50 text-orange-700',
    medium: 'border-yellow-200 bg-yellow-50 text-yellow-700',
    low: 'border-green-200 bg-green-50 text-green-700',
  };
  return map[urgency ?? ''] ?? 'border-slate-200 bg-slate-50 text-slate-700';
}

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

function categoryLabel(category: string | null): string {
  if (!category) return 'unknown';
  return category.split('_').join(' ');
}

function statusLabel(status: string): string {
  return status.split('_').join(' ');
}

function urgencyLabel(urgency: string | null): string {
  if (!urgency) return 'unknown';
  return urgency.charAt(0).toUpperCase() + urgency.slice(1);
}

// Status filter groups mapped from dashboard card labels
const STATUS_FILTERS: Record<string, string[]> = {
  open: ['new', 'classified', 'awaiting_dispatch', 'awaiting_quotes', 'quotes_received', 'contractor_selected', 'scheduled', 'in_progress'],
  awaiting_quotes: ['awaiting_quotes'],
  active_jobs: ['contractor_selected', 'scheduled', 'in_progress'],
};

const FILTER_LABELS: Record<string, string> = {
  open: 'Open issues',
  awaiting_quotes: 'Awaiting quotes',
  active_jobs: 'Active jobs',
};

export default async function IssuesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  let user;
  try {
    user = await requireDbUser();
  } catch {
    redirect('/sign-in');
  }

  const { status: statusFilter } = await searchParams;

  const propertyIds = await prisma.property
    .findMany({
      where: { ownerUserId: user.id },
      select: { id: true },
    })
    .then((props) => props.map((p) => p.id));

  // Build the where clause based on filter
  const statusWhere = statusFilter && STATUS_FILTERS[statusFilter]
    ? { in: STATUS_FILTERS[statusFilter] }
    : undefined;

  const issues = await prisma.issue.findMany({
    where: {
      propertyId: { in: propertyIds },
      ...(statusWhere ? { status: statusWhere } : {}),
    },
    include: { property: true },
    orderBy: { createdAt: 'desc' },
  });

  const activeFilterLabel = statusFilter && FILTER_LABELS[statusFilter]
    ? FILTER_LABELS[statusFilter]
    : null;

  return (
    <LayoutShell>
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">Issues</h1>
          {activeFilterLabel && (
            <div className="flex items-center gap-2">
              <Badge className="border-blue-200 bg-blue-50 text-blue-700">{activeFilterLabel}</Badge>
              <Link href="/issues" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Clear filter
              </Link>
            </div>
          )}
        </div>
        <Link href="/issues/new">
          <Button size="sm">Report Issue</Button>
        </Link>
      </div>

      {issues.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No issues reported yet.</p>
              <Link href="/issues/new">
                <Button>Report your first issue</Button>
              </Link>
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
                    <th className="text-left p-4 font-medium">Title</th>
                    <th className="text-left p-4 font-medium">Property</th>
                    <th className="text-left p-4 font-medium">Category</th>
                    <th className="text-left p-4 font-medium">Urgency</th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-left p-4 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {issues.map((issue) => (
                    <tr key={issue.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <Link href={`/issues/${issue.id}`} className="font-medium hover:underline">
                          {issue.title || 'Untitled Issue'}
                        </Link>
                      </td>
                      <td className="p-4 text-muted-foreground">{issue.property.nickname || 'Unnamed Property'}</td>
                      <td className="p-4">
                        <Badge className="border-slate-200 bg-slate-50 text-slate-700">{categoryLabel(issue.category)}</Badge>
                      </td>
                      <td className="p-4">
                        <Badge className={urgencyColor(issue.urgency)}>{urgencyLabel(issue.urgency)}</Badge>
                      </td>
                      <td className="p-4">
                        <Badge className={statusColor(issue.status)}>{statusLabel(issue.status)}</Badge>
                      </td>
                      <td className="p-4 text-muted-foreground text-xs">{new Date(issue.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </LayoutShell>
  );
}
