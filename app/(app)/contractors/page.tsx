import { redirect } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requireDbUser } from '@/lib/auth';
import { LayoutShell } from '@/components/layout-shell';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ContractorList } from './contractor-filters';

export default async function ContractorsPage({ searchParams }: { searchParams: Promise<{ archived?: string }> }) {
  let user;
  try {
    user = await requireDbUser();
  } catch {
    redirect('/sign-in');
  }

  const params = await searchParams;
  const showArchived = params.archived === '1';

  const contractors = await prisma.contractor.findMany({
    where: { ownerUserId: user.id, isArchived: showArchived },
    include: {
      jobs: {
        select: { id: true, status: true, completedAt: true },
      },
      dispatches: {
        where: { status: { notIn: ['failed', 'expired'] } },
        select: {
          id: true,
          createdAt: true,
          responses: { select: { id: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <LayoutShell>
      <div className="flex items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Contractors</h1>
          {showArchived && (
            <p className="text-sm text-muted-foreground mt-1">Showing archived contractors</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Link href={showArchived ? '/contractors' : '/contractors?archived=1'}>
            <Button variant="outline" size="sm">
              {showArchived ? 'Show Active' : 'Show Archived'}
            </Button>
          </Link>
          {!showArchived && (
            <Link href="/contractors/new">
              <Button size="sm">Add Contractor</Button>
            </Link>
          )}
        </div>
      </div>

      {contractors.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              {showArchived ? (
                <>
                  <p className="text-muted-foreground mb-4">No archived contractors.</p>
                  <Link href="/contractors">
                    <Button variant="outline">Back to Active</Button>
                  </Link>
                </>
              ) : (
                <>
                  <p className="text-muted-foreground mb-4">No contractors yet. Add contractors you work with so you can send them repair requests.</p>
                  <Link href="/contractors/new">
                    <Button>Add your first contractor</Button>
                  </Link>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (() => {
        // Pre-compute all display data in the server component
        const contractorDisplayData = contractors.map((contractor) => {
          const completedJobs = contractor.jobs.filter((j) => j.status === 'completed').length;
          const totalDispatches = contractor.dispatches.length;
          const totalReplies = contractor.dispatches.reduce(
            (sum, d) => sum + d.responses.length, 0
          );
          const responseRate = totalDispatches > 0
            ? Math.round((totalReplies / totalDispatches) * 100)
            : null;

          const lastUsedDate = contractor.dispatches.length > 0
            ? contractor.dispatches.reduce((latest, d) =>
                d.createdAt > latest ? d.createdAt : latest,
                contractor.dispatches[0].createdAt
              )
            : null;

          const contextParts: string[] = [];
          if (completedJobs > 0) {
            contextParts.push(`${completedJobs} job${completedJobs !== 1 ? 's' : ''} completed`);
          } else if (totalDispatches > 0) {
            contextParts.push(`Used ${totalDispatches} time${totalDispatches !== 1 ? 's' : ''}`);
          }
          if (responseRate !== null && totalDispatches >= 3) {
            contextParts.push(
              responseRate >= 80 ? 'Responds quickly' :
              responseRate >= 50 ? 'Usually responds' :
              'Slow to respond'
            );
          }

          return {
            id: contractor.id,
            name: contractor.name,
            companyName: contractor.companyName,
            phone: contractor.phone,
            email: contractor.email,
            trade: contractor.trade,
            isPreferred: contractor.isPreferred,
            contextParts,
            lastUsedDate: lastUsedDate?.toISOString() ?? null,
          };
        });

        return (
          <ContractorList
            contractors={contractorDisplayData}
            showArchived={showArchived}
          />
        );
      })()}
    </LayoutShell>
  );
}
