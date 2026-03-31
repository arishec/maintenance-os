import { redirect } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requireDbUser } from '@/lib/auth';
import { LayoutShell } from '@/components/layout-shell';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LocalTime } from '@/components/local-time';
import { ArchiveButton } from './archive-button';
import { formatPhone } from '@/lib/utils';

function tradeLabel(trade: string): string {
  return trade.split('_').join(' ');
}

export default async function ContractorDetailPage({
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
  const contractor = await prisma.contractor.findUnique({
    where: { id },
    include: {
      dispatches: true,
      jobs: true,
    },
  });

  if (!contractor) {
    redirect('/contractors');
  }

  if (contractor.ownerUserId !== user.id) {
    redirect('/contractors');
  }

  const completedJobs = contractor.jobs.filter((job) => job.status === 'completed').length;
  const activeJobs = contractor.jobs.filter((job) => ['selected', 'scheduled', 'in_progress'].includes(job.status)).length;
  const dispatchCount = contractor.dispatches.length;

  return (
    <LayoutShell>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold truncate">{contractor.name}</h1>
          {contractor.companyName && (
            <p className="text-sm text-muted-foreground truncate">{contractor.companyName}</p>
          )}
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Link href={`/contractors/${id}/edit`}>
            <Button variant="outline" size="sm">Edit</Button>
          </Link>
          <ArchiveButton contractorId={id} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Contractor Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Trade</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge className="border-slate-200 bg-slate-50 text-slate-700">
                  {tradeLabel(contractor.trade)}
                </Badge>
                {contractor.isPreferred && (
                  <span className="text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-1 rounded-full">
                    Preferred
                  </span>
                )}
              </div>
            </div>

            {contractor.phone && (
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <a
                  href={`tel:${contractor.phone}`}
                  className="text-base font-medium hover:underline"
                >
                  {formatPhone(contractor.phone)}
                </a>
              </div>
            )}

            {contractor.email && (
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <a
                  href={`mailto:${contractor.email}`}
                  className="text-base font-medium hover:underline"
                >
                  {contractor.email}
                </a>
              </div>
            )}

            {contractor.notes && (
              <div>
                <p className="text-sm text-muted-foreground">Notes</p>
                <p className="text-base mt-1 whitespace-pre-wrap">{contractor.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {dispatchCount === 0 && completedJobs === 0 && activeJobs === 0 ? (
              <p className="text-sm text-muted-foreground">No activity yet — dispatch an issue to this contractor to get started.</p>
            ) : (
              <>
                {activeJobs > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground">Active Jobs</p>
                    <p className="text-2xl font-bold mt-1 text-blue-600">{activeJobs}</p>
                  </div>
                )}
                {completedJobs > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground">Jobs Completed</p>
                    <p className="text-2xl font-bold mt-1">{completedJobs}</p>
                  </div>
                )}
                {dispatchCount > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground">Dispatches Sent</p>
                    <p className="text-2xl font-bold mt-1">{dispatchCount}</p>
                  </div>
                )}
              </>
            )}
            <div>
              <p className="text-sm text-muted-foreground">Added</p>
              <p className="text-base font-medium mt-1">
                <LocalTime date={contractor.createdAt} format="date" />
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Link href="/contractors">
          <Button variant="outline">Back to Contractors</Button>
        </Link>
      </div>
    </LayoutShell>
  );
}
