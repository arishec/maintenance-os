import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { requireDbUser } from '@/lib/auth';
import { LayoutShell } from '@/components/layout-shell';
import { Card, CardContent } from '@/components/ui/card';
import { HistoryTable } from './history-filters';

export const dynamic = 'force-dynamic';

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
        <p className="text-muted-foreground text-sm mt-1">Completed and canceled repairs</p>
      </div>

      {completedIssues.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-2">No completed repairs yet.</p>
              <p className="text-muted-foreground/70 text-xs">Repairs will appear here once they&apos;re finished. Go report one to get started!</p>
            </div>
          </CardContent>
        </Card>
      ) : (() => {
        const hasCosts = completedIssues.some((i) => i.jobs.some((j) => j.actualCost || j.selectedEstimate));
        const hasCategories = completedIssues.some((i) => i.category);
        const completedCount = completedIssues.filter((i) => i.status === 'completed').length;
        const canceledCount = completedIssues.filter((i) => i.status === 'canceled').length;

        // Serialize for client component — plain JSON, no functions or Date objects
        const serializedIssues = completedIssues.map((issue) => {
          const closingEvent = issue.timelineEvents?.[0];
          const payload = closingEvent?.eventPayloadJson as Record<string, unknown> | null;
          const isSelfResolved = payload?.selfResolved === true;
          const reasonText = typeof payload?.reason === 'string' && payload.reason !== 'No reason provided' ? payload.reason : null;
          const cost = issue.jobs.reduce((s, j) => {
            const jobCost = j.actualCost ?? j.selectedEstimate;
            return s + (jobCost ? parseFloat(jobCost.toString()) : 0);
          }, 0) || null;

          return {
            id: issue.id,
            title: issue.title,
            status: issue.status,
            completedAt: issue.completedAt?.toISOString() ?? null,
            category: issue.category,
            propertyName: issue.property.nickname || issue.property.addressLine1,
            propertyId: issue.propertyId,
            contractorName: issue.jobs.length > 0 ? issue.jobs.map((j) => j.contractor.name).join(', ') : '',
            cost,
            isSelfResolved,
            reason: reasonText,
          };
        });

        return (
          <>
            <p className="text-sm text-muted-foreground mb-4">
              {completedCount > 0 && `${completedCount} completed`}{completedCount > 0 && canceledCount > 0 && ', '}{canceledCount > 0 && `${canceledCount} canceled`}
              {hasCosts && (() => {
                const total = completedIssues.reduce((sum, i) => sum + i.jobs.reduce((s, j) => {
                  const jobCost = j.actualCost ?? j.selectedEstimate;
                  return s + (jobCost ? parseFloat(jobCost.toString()) : 0);
                }, 0), 0);
                return total > 0 ? ` \u2014 ${formatCurrency(total)} total` : '';
              })()}
            </p>
            <HistoryTable
              issues={serializedIssues}
              hasCosts={hasCosts}
              hasCategories={hasCategories}
            />
          </>
        );
      })()}
    </LayoutShell>
  );
}
