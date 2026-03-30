import { redirect } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requireDbUser } from '@/lib/auth';
import { LayoutShell } from '@/components/layout-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PropertyDetailClient } from './property-detail-client';
import { formatLabel } from '@/lib/status';

const propertyTypeLabels: Record<string, string> = {
  single_family: 'Single Family',
  condo: 'Condo',
  apartment: 'Apartment',
  townhouse: 'Townhouse',
  duplex: 'Duplex',
  other: 'Other',
};

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  let user;
  try {
    user = await requireDbUser();
  } catch {
    redirect('/sign-in');
  }

  const { id } = await params;

  const property = await prisma.property.findFirst({
    where: { id, ownerUserId: user.id },
  });

  if (!property) {
    redirect('/properties');
  }

  const linkedContractors = await prisma.propertyContractor.findMany({
    where: { propertyId: id },
    include: { contractor: true },
    orderBy: { createdAt: 'desc' },
  });

  const availableContractors = await prisma.contractor.findMany({
    where: {
      ownerUserId: user.id,
      isArchived: false,
      NOT: {
        propertyLinks: {
          some: { propertyId: id },
        },
      },
    },
    orderBy: { name: 'asc' },
  });

  const intakeLinkData = await prisma.propertyIntakeLink
    .findFirst({
      where: { propertyId: id, isActive: true },
    })
    .then((link) => ({ hasActiveLink: !!link }))
    .catch(() => ({ hasActiveLink: false }));

  const issues = await prisma.issue.findMany({
    where: { propertyId: id },
    orderBy: { createdAt: 'desc' },
  });

  const formatAddress = (): string => {
    const parts = [property.addressLine1, property.addressLine2, property.city, property.state, property.postalCode].filter(
      Boolean
    );
    return parts.join(', ');
  };

  return (
    <LayoutShell>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold truncate">{property.nickname || 'Unnamed Property'}</h1>
          <p className="mt-1 text-sm text-muted-foreground truncate">{formatAddress()}</p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Link href={`/properties/${id}/edit`}>
            <Button variant="outline" size="sm">Edit</Button>
          </Link>
          <PropertyDetailClient propertyId={id} />
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Property Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Type</p>
                <p className="mt-1">{propertyTypeLabels[property.propertyType] || property.propertyType}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Address</p>
                <p className="mt-1">{formatAddress()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Linked Contractors</CardTitle>
          </CardHeader>
          <CardContent>
            {linkedContractors.length === 0 ? (
              <p className="text-sm text-muted-foreground">No contractors linked to this property.</p>
            ) : (
              <div className="space-y-3">
                {linkedContractors.map((link) => (
                  <div key={link.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                    <div>
                      <p className="font-medium">{link.contractor.name}</p>
                      {link.contractor.companyName && (
                        <p className="text-sm text-muted-foreground">{link.contractor.companyName}</p>
                      )}
                    </div>
                    <PropertyDetailClient
                      propertyId={id}
                      contractorId={link.contractor.id}
                      action="unlink"
                    />
                  </div>
                ))}
              </div>
            )}
            {availableContractors.length > 0 && (
              <div className="mt-4">
                <PropertyDetailClient
                  propertyId={id}
                  availableContractors={availableContractors}
                  action="addContractor"
                />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tenant Intake Link</CardTitle>
          </CardHeader>
          <CardContent>
            <PropertyDetailClient
              propertyId={id}
              hasIntakeLink={intakeLinkData.hasActiveLink}
              action="intakeLink"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Issues ({issues.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {issues.length === 0 ? (
              <p className="text-sm text-muted-foreground">No issues for this property.</p>
            ) : (
              <div className="space-y-2">
                {issues.map((issue) => (
                  <Link key={issue.id} href={`/issues/${issue.id}`}>
                    <div className="rounded-lg border border-border p-3 hover:bg-muted/50 transition-colors">
                      <p className="font-medium">{issue.title || 'Untitled Issue'}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">{issue.description}</p>
                      <div className="mt-2 flex gap-2">
                        <span className="text-xs rounded-full bg-muted px-2 py-1">
                          {issue.status}
                        </span>
                        {issue.urgency && (
                          <span className="text-xs rounded-full bg-muted px-2 py-1">
                            {formatLabel(issue.urgency)}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </LayoutShell>
  );
}
