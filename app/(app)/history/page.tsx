import { redirect } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requireDbUser } from '@/lib/auth';
import { LayoutShell } from '@/components/layout-shell';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import {
  getCategoryLabel,
  getIssueStatusColor,
  getIssueStatusLabel,
} from '@/lib/status';

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
              <p className="text-muted-foreground mb-2">No completed or canceled issues yet.</p>
              <p className="text-muted-foreground/70 text-xs">Once a repair is finished or canceled, it will appear here with its final details.</p>
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
                    <th className="text-left p-4 font-medium">Cost</th>
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
                        <Badge className="border-slate-200 bg-slate-50 text-slate-700">{getCategoryLabel(issue.category)}</Badge>
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
                        <Badge className={getIssueStatusColor(issue.status)}>{getIssueStatusLabel(issue.status)}</Badge>
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
