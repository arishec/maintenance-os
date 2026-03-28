import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requireDbUser } from '@/lib/auth';
import { LayoutShell } from '@/components/layout-shell';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = { robots: { index: false, follow: false } };
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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
          {contractors.map((contractor) => (
            <Link key={contractor.id} href={`/contractors/${contractor.id}`}>
              <Card className="hover:shadow-md transition-shadow h-full cursor-pointer">
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold leading-tight">{contractor.name}</h3>
                      {contractor.companyName && <p className="text-sm text-muted-foreground">{contractor.companyName}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="border-slate-200 bg-slate-50 text-slate-700">{tradeLabel(contractor.trade)}</Badge>
                      {contractor.isPreferred && <span className="text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-1 rounded-full">Preferred</span>}
                    </div>
                    <div className="space-y-1 text-sm">
                      {contractor.phone && (
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Phone:</span>
                          <span>{contractor.phone}</span>
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
          ))}
        </div>
      )}
    </LayoutShell>
  );
}
