import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requireDbUserOrRedirect } from '@/lib/auth';
import { LayoutShell } from '@/components/layout-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IssueSummaryCard } from '@/components/issue-summary-card';

export default async function DashboardPage() {
  const user = await requireDbUserOrRedirect();

  const properties = await prisma.property.findMany({ where: { ownerUserId: user.id } });
  const propertyIds = properties.map((p) => p.id);

  const [openIssues, awaitingQuotes, quotesReceived, activeJobs, recentIssues, notifications] = await Promise.all([
    prisma.issue.count({ where: { propertyId: { in: propertyIds }, status: { notIn: ['completed', 'canceled', 'archived'] } } }),
    prisma.issue.count({ where: { propertyId: { in: propertyIds }, status: 'awaiting_quotes' } }),
    prisma.issue.count({ where: { propertyId: { in: propertyIds }, status: 'quotes_received' } }),
    prisma.job.count({ where: { issue: { propertyId: { in: propertyIds } }, status: { in: ['selected', 'scheduled', 'in_progress'] } } }),
    prisma.issue.findMany({
      where: { propertyId: { in: propertyIds }, status: { notIn: ['archived'] } },
      include: {
        property: true,
        dispatches: { include: { responses: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.notification.findMany({
      where: { userId: user.id, readAt: null },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
  ]);

  const stats: Array<{ label: string; subtext: string; value: number; href: string; highlight?: boolean; badge?: string }> = [
    { label: 'Open issues', subtext: 'Issues that need attention', value: openIssues, href: '/issues?view=open' },
    { label: 'Awaiting quotes', subtext: 'Waiting on contractor responses', value: awaitingQuotes, href: '/issues?view=awaiting_quotes' },
    {
      label: 'Quotes received',
      subtext: 'Ready for you to review',
      value: quotesReceived,
      href: '/issues?view=quotes_received',
      highlight: quotesReceived > 0,
      badge: quotesReceived > 0 ? `${quotesReceived} new response${quotesReceived !== 1 ? 's' : ''}` : undefined,
    },
    { label: 'Active jobs', subtext: 'Work currently in progress', value: activeJobs, href: '/issues?view=active_jobs' },
  ];

  return (
    <LayoutShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {properties.length === 0
              ? 'Welcome! Add a property to get started.'
              : 'Your maintenance overview.'}
          </p>
          {properties.length === 0 && (
            <Link href="/properties" className="mt-3 inline-flex items-center justify-center rounded-md border border-blue-600 bg-white px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors">
              Add Property
            </Link>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <Link key={stat.label} href={stat.href}>
              <Card className={`cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 ${
                stat.highlight ? 'border-green-300 bg-green-50' : ''
              }`}>
                <CardHeader className="pb-1">
                  <CardTitle className={`text-sm ${stat.highlight ? 'text-green-700' : 'text-muted-foreground'}`}>
                    {stat.label}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  <div className={`text-3xl font-semibold ${stat.highlight ? 'text-green-800' : ''}`}>
                    {stat.value}
                  </div>
                  <p className={`text-xs ${stat.highlight ? 'text-green-600' : 'text-muted-foreground/70'}`}>
                    {stat.badge || stat.subtext}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Recent issues</h2>
            {recentIssues.length === 0 ? (
              <Card className="border-dashed border-2">
                <CardContent className="py-12 text-center space-y-4">
                  <div className="mx-auto w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium">You don&apos;t have any issues yet</p>
                    <p className="text-xs text-muted-foreground mt-1">Start by reporting your first repair. Our AI will classify it instantly.</p>
                  </div>
                  <Link href="/issues/new" className="inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
                    Report Issue
                  </Link>
                </CardContent>
              </Card>
            ) : (
              recentIssues.map((issue) => {
                const totalDispatches = issue.dispatches?.length ?? 0;
                const totalReplies = issue.dispatches?.reduce(
                  (sum, d) => sum + (d.responses?.length ?? 0), 0
                ) ?? 0;
                return (
                  <Link key={issue.id} href={`/issues/${issue.id}`}>
                    <IssueSummaryCard
                      title={issue.title ?? 'Untitled issue'}
                      property={issue.property.nickname ?? issue.property.addressLine1}
                      status={issue.status}
                      urgency={issue.urgency ?? 'medium'}
                      category={issue.category ?? 'unknown'}
                      description={issue.description}
                      dispatchCount={totalDispatches}
                      replyCount={totalReplies}
                    />
                  </Link>
                );
              })
            )}
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Notifications</h2>
            <Card>
              <CardContent className="divide-y divide-border">
                {notifications.length === 0 ? (
                  <p className="py-4 text-center text-sm text-muted-foreground">No new activity yet.</p>
                ) : (
                  notifications.map((n) => {
                    const inner = (
                      <div className={`py-3 ${n.issueId ? 'cursor-pointer hover:bg-muted/50 -mx-2 px-2 rounded-lg transition-colors' : ''}`}>
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
                          <span className="text-sm font-medium">{n.title}</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1 ml-4">{n.body}</div>
                        <div className="text-xs text-muted-foreground/60 mt-0.5 ml-4">
                          {new Date(n.createdAt).toLocaleDateString()} at{' '}
                          {new Date(n.createdAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                        </div>
                      </div>
                    );
                    return n.issueId ? (
                      <Link key={n.id} href={`/issues/${n.issueId}`}>{inner}</Link>
                    ) : (
                      <div key={n.id}>{inner}</div>
                    );
                  })
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </LayoutShell>
  );
}
