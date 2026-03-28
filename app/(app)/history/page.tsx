import { redirect } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requireDbUser } from '@/lib/auth';
import { LayoutShell } from '@/components/layout-shell';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function categoryLabel(category: string | null): string {
  if (!category) return 'unknown';
  return category.split('_').join(' ');
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

function statusLabel(status: string): string {
  return status.split('_').join(' ');
}

function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}

export default async function HistoryPage() {
  let user;
  try {
    user = await requireDbUser();
  } catch {
    redirect('/sign-in');
  }

  const propertyIds = await prisma.property
    .findMany({
      where: { ownerUserId: user.id },
      select: { id: true },
    })
    .then((props) => props.map((p) => p.id));

  const completedIssues = await prisma.issue.findMany({
    where: { propertyId: { in: propertyIds }, status: { in: ['completed', 'canceled'] } },
    include: { property: true, jobs: { include: { contractor: true } } },
    orderBy: { completedAt: 'desc' },
  });

  return (
    <LayoutShell>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">History</h1>
        <p className="text-muted-foreground text-sm mt-1">Completed and canceled issues</p>
      </div>

      {completedIssues.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-2">No completed jobs yet.</p>
              <p className="text-muted-foreground/70 text-xs">Once you finish a repair, it will appear here with full history.</p>
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
                    <th className="text-left p-4 font-medium">Date Completed</th>
                    <th className="text-left p-4 font-medium">Property</th>
                    <th className="text-left p-4 font-medium">Issue</th>
                    <th className="text-left p-4 font-medium">Category</th>
                    <th className="text-left p-4 font-medium">Contractor</th>
                    <th className="text-left p-4 font-medium">Estimate</th>
                    <th className="text-left p-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {completedIssues.map((issue) => (
                    <tr key={issue.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="p-4 text-muted-foreground text-xs">{issue.completedAt ? new Date(issue.completedAt).toLocaleDateString() : '—'}</td>
                      <td className="p-4 text-muted-foreground">{issue.property.nickname || 'Unnamed Property'}</td>
                      <td className="p-4">
                        <Link href={`/issues/${issue.id}`} className="font-medium hover:underline">
                          {issue.title || 'Untitled Issue'}
                        </Link>
                      </td>
                      <td className="p-4">
                        <Badge className="border-slate-200 bg-slate-50 text-slate-700">{categoryLabel(issue.category)}</Badge>
                      </td>
                      <td className="p-4 text-muted-foreground text-sm">
                        {issue.jobs.length > 0 ? (
                          <div className="space-y-1">
                            {issue.jobs.map((job) => (
                              <div key={job.id}>{job.contractor.name}</div>
                            ))}
                          </div>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="p-4 text-muted-foreground text-sm">
                        {issue.jobs.length > 0 ? (
                          <div className="space-y-1">
                            {issue.jobs.map((job) => (
                              <div key={job.id}>{formatCurrency(job.selectedEstimate ? parseFloat(job.selectedEstimate.toString()) : undefined)}</div>
                            ))}
                          </div>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="p-4">
                        <Badge className={statusColor(issue.status)}>{statusLabel(issue.status)}</Badge>
                      </td>
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
