import { redirect } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requireDbUser } from '@/lib/auth';
import { LayoutShell } from '@/components/layout-shell';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LocalTime } from '@/components/local-time';
import { HistoryFilters } from './history-filters';

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
    include: {
      property: true,
      jobs: { include: { contractor: true } },
      timelineEvents: {
        where: { eventType: { in: ['issue_resolved', 'job_canceled', 'job_completed'] } },
        take: 1,
        orderBy: { createdAt: 'desc' },
      },
    },
    orderBy: [{ completedAt: 'desc' }, { createdAt: 'desc' }],
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
              <p className="text-muted-foreground mb-2">No completed repairs yet.</p>
              <p className="text-muted-foreground/70 text-xs">Issues will appear here once they&apos;re finished. Go report one to get started!</p>
            </div>
          </CardContent>
        </Card>
      ) : (() => {
        // Serialize issues data for client component
        const serializedIssues = completedIssues.map((issue) => {
          const closingEvent = issue.timelineEvents?.[0];
          const payload = closingEvent?.eventPayloadJson as Record<string, unknown> | null;
          const isSelfResolved = payload?.selfResolved === true;
          const reasonText = typeof payload?.reason === 'string' && payload.reason !== 'No reason provided' ? payload.reason : null;
          const cost = issue.jobs.length > 0 ? parseFloat(issue.jobs[0].selectedEstimate?.toString() || '0') : null;

          return {
            id: issue.id,
            title: issue.title,
            status: issue.status,
            completedAt: issue.completedAt?.toISOString() || null,
            category: issue.category,
            propertyName: issue.property.nickname || issue.property.addressLine1,
            propertyId: issue.propertyId,
            contractorName: issue.jobs.length > 0 ? issue.jobs.map((j) => j.contractor.name).join(', ') : '',
            cost,
            isSelfResolved,
            reason: reasonText,
          };
        });

        const hasCosts = completedIssues.some((i) => i.jobs.some((j) => j.selectedEstimate));
        const hasCategories = completedIssues.some((i) => i.category);
        const completedCount = completedIssues.filter((i) => i.status === 'completed').length;
        const canceledCount = completedIssues.filter((i) => i.status === 'canceled').length;

        return (
          <>
            <p className="text-sm text-muted-foreground mb-4">
              {completedCount > 0 && `${completedCount} completed`}{completedCount > 0 && canceledCount > 0 && ', '}{canceledCount > 0 && `${canceledCount} canceled`}
              {hasCosts && (() => {
                const total = completedIssues.reduce((sum, i) => sum + i.jobs.reduce((s, j) => s + (j.selectedEstimate ? parseFloat(j.selectedEstimate.toString()) : 0), 0), 0);
                return total > 0 ? ` \u2014 ${formatCurrency(total)} total` : '';
              })()}
            </p>
            <HistoryFilters issues={serializedIssues}>
              {(filtered) => (
                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="border-b border-border bg-muted/50">
                          <tr className="text-muted-foreground">
                            <th className="text-left p-4 font-medium">Date</th>
                            <th className="text-left p-4 font-medium">Property</th>
                            <th className="text-left p-4 font-medium">Issue</th>
                            {hasCategories && <th className="text-left p-4 font-medium">Category</th>}
                            <th className="text-left p-4 font-medium">Contractor</th>
                            {hasCosts && <th className="text-left p-4 font-medium">Cost</th>}
                            <th className="text-left p-4 font-medium">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filtered.map((filteredIssue) => {
                            // Find the original issue to get full details
                            const originalIssue = completedIssues.find((i) => i.id === filteredIssue.id)!;
                            return (
                              <tr key={filteredIssue.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                                <td className="p-4 text-muted-foreground text-xs">
                                  {filteredIssue.completedAt ? new Date(filteredIssue.completedAt).toLocaleDateString() : '—'}
                                </td>
                                <td className="p-4 text-muted-foreground">{filteredIssue.propertyName}</td>
                                <td className="p-4">
                                  <Link href={`/issues/${filteredIssue.id}`} className="font-medium hover:underline">
                                    {filteredIssue.title || 'Untitled Issue'}
                                  </Link>
                                </td>
                                {hasCategories && (
                                  <td className="p-4">
                                    {filteredIssue.category ? (
                                      <Badge className="border-slate-200 bg-slate-50 text-slate-700">
                                        {getCategoryLabel(filteredIssue.category)}
                                      </Badge>
                                    ) : (
                                      '—'
                                    )}
                                  </td>
                                )}
                                <td className="p-4 text-muted-foreground text-sm">{filteredIssue.contractorName || '—'}</td>
                                {hasCosts && (
                                  <td className="p-4 text-muted-foreground text-sm">
                                    {filteredIssue.cost ? formatCurrency(filteredIssue.cost) : '—'}
                                  </td>
                                )}
                                <td className="p-4">
                                  {(() => {
                                    if (filteredIssue.isSelfResolved) {
                                      return (
                                        <div>
                                          <Badge className="bg-blue-50 text-blue-700 border-blue-200">Self-resolved</Badge>
                                          {filteredIssue.reason && (
                                            <p className="text-xs text-muted-foreground mt-1 max-w-[200px] truncate">
                                              {filteredIssue.reason}
                                            </p>
                                          )}
                                        </div>
                                      );
                                    }
                                    if (filteredIssue.status === 'canceled') {
                                      return (
                                        <div>
                                          <Badge className="bg-red-50 text-red-700 border-red-200">Canceled</Badge>
                                          {filteredIssue.reason && (
                                            <p className="text-xs text-muted-foreground mt-1 max-w-[200px] truncate">
                                              {filteredIssue.reason}
                                            </p>
                                          )}
                                        </div>
                                      );
                                    }
                                    return (
                                      <Badge className={getIssueStatusColor(filteredIssue.status)}>
                                        {getIssueStatusLabel(filteredIssue.status)}
                                      </Badge>
                                    );
                                  })()}
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
            </HistoryFilters>
          </>
        );
      })()}
    </LayoutShell>
  );
}
