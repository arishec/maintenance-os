import { redirect } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requireDbUser } from '@/lib/auth';
import { LayoutShell } from '@/components/layout-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IssueSummaryCard } from '@/components/issue-summary-card';

export default async function DashboardPage() {
  let user;
  try {
    user = await requireDbUser();
  } catch {
    redirect('/sign-in');
  }

  const properties = await prisma.property.findMany({ where: { ownerUserId: user.id } });
  const propertyIds = properties.map((p) => p.id);

  const [openIssues, awaitingQuotes, activeJobs, recentIssues, notifications] = await Promise.all([
    prisma.issue.count({ where: { propertyId: { in: propertyIds }, status: { notIn: ['completed', 'canceled', 'archived'] } } }),
    prisma.issue.count({ where: { propertyId: { in: propertyIds }, status: 'awaiting_quotes' } }),
    prisma.job.count({ where: { issue: { propertyId: { in: propertyIds } }, status: { in: ['contractor_selected', 'scheduled', 'in_progress'] } } }),
    prisma.issue.findMany({
      where: { propertyId: { in: propertyIds }, status: { notIn: ['archived'] } },
      include: { property: true },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.notification.findMany({
      where: { userId: user.id, readAt: null },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
  ]);

  const stats = [
    { label: 'Open issues', value: openIssues },
    { label: 'Awaiting quotes', value: awaitingQuotes },
    { label: 'Active jobs', value: activeJobs },
    { label: 'Properties', value: properties.length },
  ];

  return (
    <LayoutShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {properties.length === 0
              ? 'Get started by adding your first property.'
              : 'Your maintenance overview.'}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">{stat.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Recent issues</h2>
            {recentIssues.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-sm text-muted-foreground">
                  No issues yet. Report your first issue to get started.
                </CardContent>
              </Card>
            ) : (
              recentIssues.map((issue) => (
                <Link key={issue.id} href={`/issues/${issue.id}`}>
                  <IssueSummaryCard
                    title={issue.title ?? 'Untitled issue'}
                    property={issue.property.nickname ?? issue.property.addressLine1}
                    status={issue.status}
                    urgency={issue.urgency ?? 'medium'}
                    category={issue.category ?? 'unknown'}
                    description={issue.description.slice(0, 120)}
                  />
                </Link>
              ))
            )}
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Notifications</h2>
            <Card>
              <CardContent className="divide-y divide-border">
                {notifications.length === 0 ? (
                  <p className="py-4 text-center text-sm text-muted-foreground">No new notifications.</p>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className="py-3">
                      <div className="text-sm font-medium">{n.title}</div>
                      <div className="text-xs text-muted-foreground">{n.body}</div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </LayoutShell>
  );
}
