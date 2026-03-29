import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requireDbUserOrRedirect } from '@/lib/auth';
import { LayoutShell } from '@/components/layout-shell';
import { Card, CardContent } from '@/components/ui/card';
import {
  getNeedsAttentionItems,
  getScheduledTodayItems,
  getWaitingOnContractorsItems,
  getRecentActivityItems,
  getOverviewCounts,
} from '@/lib/dashboard';
import { NeedsAttentionList } from '@/components/dashboard/needs-attention-list';
import { ScheduledTodayList } from '@/components/dashboard/scheduled-today-list';
import { WaitingOnContractorsList } from '@/components/dashboard/waiting-on-contractors-list';
import { RecentActivityList } from '@/components/dashboard/recent-activity-list';
import { OverviewCards } from '@/components/dashboard/overview-cards';

export default async function DashboardPage() {
  const user = await requireDbUserOrRedirect();

  // Detect new user for onboarding
  const properties = await prisma.property.findMany({ where: { ownerUserId: user.id }, select: { id: true, nickname: true, addressLine1: true } });
  const contractorCount = await prisma.contractor.count({ where: { ownerUserId: user.id, isArchived: false } });
  const issueCount = await prisma.issue.count({ where: { propertyId: { in: properties.map((p) => p.id) } } });
  const isNewUser = properties.length === 0 || contractorCount === 0 || issueCount === 0;

  // Fetch all dashboard data in parallel
  const [attentionItems, scheduledToday, waitingItems, recentActivity, counts] = await Promise.all([
    getNeedsAttentionItems(user.id),
    getScheduledTodayItems(user.id),
    getWaitingOnContractorsItems(user.id),
    getRecentActivityItems(user.id),
    getOverviewCounts(user.id),
  ]);

  return (
    <LayoutShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isNewUser ? 'Welcome! Get set up in 3 quick steps.' : 'What needs your attention today.'}
          </p>
        </div>

        {/* Onboarding stepper for new users */}
        {isNewUser && (
          <Card className="border-blue-200 bg-blue-50/50">
            <CardContent className="py-6">
              <h2 className="text-base font-semibold mb-4">Get started</h2>
              <div className="grid gap-3 sm:grid-cols-3">
                <Link href="/properties" className={`flex items-start gap-3 rounded-lg border p-4 transition-colors ${properties.length > 0 ? 'border-green-300 bg-green-50' : 'border-blue-300 bg-white hover:bg-blue-50'}`}>
                  <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${properties.length > 0 ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'}`}>
                    {properties.length > 0 ? '\u2713' : '1'}
                  </span>
                  <div>
                    <p className="text-sm font-medium">{properties.length > 0 ? 'Property added' : 'Add a property'}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{properties.length > 0 ? properties[0].nickname || properties[0].addressLine1 : 'Where is the repair needed?'}</p>
                  </div>
                </Link>
                <Link href="/contractors" className={`flex items-start gap-3 rounded-lg border p-4 transition-colors ${contractorCount > 0 ? 'border-green-300 bg-green-50' : properties.length > 0 ? 'border-blue-300 bg-white hover:bg-blue-50' : 'border-gray-200 bg-gray-50 opacity-60'}`}>
                  <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${contractorCount > 0 ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'}`}>
                    {contractorCount > 0 ? '\u2713' : '2'}
                  </span>
                  <div>
                    <p className="text-sm font-medium">{contractorCount > 0 ? 'Contractor added' : 'Add a contractor'}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{contractorCount > 0 ? `${contractorCount} contractor${contractorCount !== 1 ? 's' : ''}` : 'Who should we contact?'}</p>
                  </div>
                </Link>
                <Link href="/issues/new" className={`flex items-start gap-3 rounded-lg border p-4 transition-colors ${issueCount > 0 ? 'border-green-300 bg-green-50' : contractorCount > 0 ? 'border-blue-300 bg-white hover:bg-blue-50' : 'border-gray-200 bg-gray-50 opacity-60'}`}>
                  <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${issueCount > 0 ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'}`}>
                    {issueCount > 0 ? '\u2713' : '3'}
                  </span>
                  <div>
                    <p className="text-sm font-medium">{issueCount > 0 ? 'Issue reported' : 'Report an issue'}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{issueCount > 0 ? 'AI classified and ready to go' : 'AI classifies it instantly'}</p>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Section 1 — Needs attention (most important) */}
        {attentionItems.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-3">
              Needs attention
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                {attentionItems.length} item{attentionItems.length !== 1 ? 's' : ''}
              </span>
            </h2>
            <NeedsAttentionList items={attentionItems} />
          </section>
        )}

        {/* Section 2 — Scheduled today */}
        {scheduledToday.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-3">Scheduled today</h2>
            <ScheduledTodayList items={scheduledToday} />
          </section>
        )}

        {/* Section 3 — Waiting on contractors */}
        {waitingItems.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-3">
              Waiting on contractors
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                {waitingItems.length} issue{waitingItems.length !== 1 ? 's' : ''}
              </span>
            </h2>
            <WaitingOnContractorsList items={waitingItems} />
          </section>
        )}

        {/* Two-column: Recent activity + Overview */}
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_1fr]">
          {/* Section 4 — Recent activity */}
          <section>
            <h2 className="text-lg font-semibold mb-3">Recent activity</h2>
            {recentActivity.length === 0 ? (
              <Card>
                <CardContent className="py-6 text-center">
                  <p className="text-sm text-muted-foreground">No activity yet. Report an issue to get started.</p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-2">
                  <RecentActivityList items={recentActivity} />
                </CardContent>
              </Card>
            )}
          </section>

          {/* Section 5 — Overview counts (secondary) */}
          <section>
            <h2 className="text-lg font-semibold mb-3">Overview</h2>
            <OverviewCards counts={counts} />
          </section>
        </div>
      </div>
    </LayoutShell>
  );
}
