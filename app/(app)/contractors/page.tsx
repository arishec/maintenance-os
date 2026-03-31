import { redirect } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requireDbUser } from '@/lib/auth';
import { LayoutShell } from '@/components/layout-shell';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatPhone } from '@/lib/utils';

function tradeLabel(trade: string): string {
  return trade.split('_').join(' ');
}

export default async function ContractorsPage() {
  let user;
  try {
    user = await requireDbUser();
  } catch {
    redirect('/sign-in');
  }

  const contractors = await prisma.contractor.findMany({
    where: { ownerUserId: user.id, isArchived: false },
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
        <h1 className="text-2xl font-bold">Contractors</h1>
        <Link href="/contractors/new">
          <Button size="sm">Add Contractor</Button>
        </Link>
      </div>

      {contractors.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No contractors added yet.</p>
              <Link href="/contractors/new">
                <Button>Add your first contractor</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {contractors.map((contractor) => {
            const completedJobs = contractor.jobs.filter((j) => j.status === 'completed').length;
            const totalDispatches = contractor.dispatches.length;
            const totalReplies = contractor.dispatches.reduce(
              (sum, d) => sum + d.responses.length, 0
            );
            const responseRate = totalDispatches > 0
              ? Math.round((totalReplies / totalDispatches) * 100)
              : null;

            // Find most recent dispatch date as "last used"
            const lastUsedDate = contractor.dispatches.length > 0
              ? contractor.dispatches.reduce((latest, d) =>
                  d.createdAt > latest ? d.createdAt : latest,
                  contractor.dispatches[0].createdAt
                )
              : null;

            // Build context line
            const contextParts: string[] = [];
            if (completedJobs > 0) {
              contextParts.push(`${completedJobs} job${completedJobs !== 1 ? 's' : ''} completed`);
            } else if (totalDispatches > 0) {
              contextParts.push(`Used ${totalDispatches} time${totalDispatches !== 1 ? 's' : ''}`);
            }
            if (responseRate !== null) {
              contextParts.push(
                responseRate >= 80 ? 'Responds quickly' :
                responseRate >= 50 ? 'Usually responds' :
                'Slow to respond'
              );
            }

            return (
              <Link key={contractor.id} href={`/contractors/${contractor.id}`}>
                <Card className="hover:shadow-md transition-all hover:-translate-y-0.5 h-full cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold leading-tight">{contractor.name}</h3>
                        {contractor.companyName && <p className="text-sm text-muted-foreground">{contractor.companyName}</p>}
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className="border-slate-200 bg-slate-50 text-slate-700">{tradeLabel(contractor.trade)}</Badge>
                        {contractor.isPreferred && <span className="text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-1 rounded-full">Preferred</span>}
                      </div>
                      {contextParts.length > 0 && (
                        <p className="text-xs text-muted-foreground">
                          {contextParts.join(' · ')}
                        </p>
                      )}
                      {lastUsedDate && (
                        <p className="text-xs text-muted-foreground/70">
                          Last contacted {new Date(lastUsedDate).toLocaleDateString()}
                        </p>
                      )}
                      <div className="space-y-1 text-sm">
                        {contractor.phone && (
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">Phone:</span>
                            <span>{formatPhone(contractor.phone)}</span>
                          </div>
                        )}
                        {contractor.email && (
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">Email:</span>
                            <span>{contractor.email}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </LayoutShell>
  );
}
