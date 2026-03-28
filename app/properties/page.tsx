import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requireDbUser } from '@/lib/auth';
import { LayoutShell } from '@/components/layout-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = { robots: { index: false, follow: false } };
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
      issues: { where: { status: { notIn: ['completed', 'canceled', 'archived'] } } },
      _count: { select: { issues: true } },
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
              {properties.map((property) => (
                <Link key={property.id} href={`/properties/${property.id}`}>
                  <div className="grid gap-2 rounded-xl border border-border p-4 md:grid-cols-[220px_minmax(0,1fr)_140px_140px] md:items-center hover:bg-muted/50 transition-colors">
                    <div className="font-medium">{property.nickname || 'Unnamed Property'}</div>
                    <div className="text-sm text-muted-foreground">{formatAddress(property)}</div>
                    <div className="text-sm">{property.issues.length} open issue{property.issues.length !== 1 ? 's' : ''}</div>
                    <div className="text-sm text-muted-foreground">{property._count.issues} total</div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </LayoutShell>
  );
}
