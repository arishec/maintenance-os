import { redirect } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requireDbUser } from '@/lib/auth';
import { LayoutShell } from '@/components/layout-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default async function PropertiesPage() {
  let user;
  try {
    user = await requireDbUser();
  } catch {
    redirect('/sign-in');
  }

  const properties = await prisma.property.findMany({
    where: { ownerUserId: user.id },
    include: {
      issues: {
        select: { id: true, status: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const formatAddress = (property: typeof properties[0]) => {
    const parts = [property.addressLine1, property.addressLine2, property.city, property.state, property.postalCode].filter(Boolean);
    return parts.join(', ');
  };

  return (
    <LayoutShell>
      <div className="flex items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold">Properties</h1>
        <Link href="/properties/new">
          <Button size="sm">Add Property</Button>
        </Link>
      </div>

      {properties.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No properties yet.</p>
              <Link href="/properties/new">
                <Button>Add your first property</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="space-y-3 p-6">
              {properties.map((property) => {
                const openIssues = property.issues.filter(
                  (i) => !['completed', 'canceled', 'archived'].includes(i.status)
                ).length;
                const awaitingQuotes = property.issues.filter(
                  (i) => i.status === 'awaiting_quotes'
                ).length;
                const quotesReceived = property.issues.filter(
                  (i) => i.status === 'quotes_received'
                ).length;
                const activeJobs = property.issues.filter(
                  (i) => i.status === 'active_job'
                ).length;
                const totalIssues = property.issues.length;

                // Build summary parts
                const summaryParts: string[] = [];
                if (openIssues > 0) summaryParts.push(`${openIssues} open`);
                if (awaitingQuotes > 0) summaryParts.push(`${awaitingQuotes} awaiting quotes`);
                if (quotesReceived > 0) summaryParts.push(`${quotesReceived} ready to review`);
                if (activeJobs > 0) summaryParts.push(`${activeJobs} active job${activeJobs !== 1 ? 's' : ''}`);

                return (
                  <Link key={property.id} href={`/issues?property=${property.id}`}>
                    <div className="rounded-xl border border-border p-4 hover:bg-muted/50 hover:shadow-sm transition-all cursor-pointer space-y-2">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="font-medium">{property.nickname || 'Unnamed Property'}</div>
                          <div className="text-sm text-muted-foreground truncate">{formatAddress(property)}</div>
                        </div>
                        <div className="text-sm text-muted-foreground flex-shrink-0">
                          {totalIssues} total issue{totalIssues !== 1 ? 's' : ''}
                        </div>
                      </div>
                      {summaryParts.length > 0 && (
                        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs">
                          {summaryParts.map((part, idx) => (
                            <span
                              key={idx}
                              className={
                                part.includes('ready to review')
                                  ? 'text-green-700 font-medium'
                                  : part.includes('active')
                                    ? 'text-blue-700 font-medium'
                                    : 'text-muted-foreground'
                              }
                            >
                              {part}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </LayoutShell>
  );
}
