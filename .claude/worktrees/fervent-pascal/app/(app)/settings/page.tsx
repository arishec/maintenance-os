import { redirect } from 'next/navigation';
import { requireDbUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { LayoutShell } from '@/components/layout-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LocalTime } from '@/components/local-time';

export default async function SettingsPage() {
  let user;
  try {
    user = await requireDbUser();
  } catch {
    redirect('/sign-in');
  }

  // Pull real usage stats
  const [propertyCount, contractorCount, issueCount, completedCount] = await Promise.all([
    prisma.property.count({ where: { ownerUserId: user.id } }),
    prisma.contractor.count({ where: { ownerUserId: user.id, isArchived: false } }),
    prisma.issue.count({ where: { property: { ownerUserId: user.id } } }),
    prisma.issue.count({ where: { property: { ownerUserId: user.id }, status: 'completed' } }),
  ]);

  return (
    <LayoutShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your account and preferences
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Email</label>
              <p className="text-sm">{user.email}</p>
            </div>
            {user.fullName && (
              <div>
                <label className="text-xs font-medium text-muted-foreground">Name</label>
                <p className="text-sm">{user.fullName}</p>
              </div>
            )}
            <div>
              <label className="text-xs font-medium text-muted-foreground">Member since</label>
              <p className="text-sm"><LocalTime date={user.createdAt} format="date" /></p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-2xl font-bold">{propertyCount}</p>
                <p className="text-xs text-muted-foreground">Propert{propertyCount !== 1 ? 'ies' : 'y'}</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{contractorCount}</p>
                <p className="text-xs text-muted-foreground">Contractor{contractorCount !== 1 ? 's' : ''}</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{issueCount}</p>
                <p className="text-xs text-muted-foreground">Issue{issueCount !== 1 ? 's' : ''} reported</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{completedCount}</p>
                <p className="text-xs text-muted-foreground">Repair{completedCount !== 1 ? 's' : ''} completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Email notifications</p>
                <p className="text-xs text-muted-foreground">Contractor replies, job updates, and quote alerts sent to {user.email}</p>
              </div>
              <div className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">Active</div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">SMS dispatch</p>
                <p className="text-xs text-muted-foreground">Send repair requests to contractors via text message</p>
              </div>
              <div className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded">Pending carrier approval</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium">Beta</p>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                Free
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              All features are free during beta — unlimited properties, contractors, and issues.
            </p>
          </CardContent>
        </Card>
      </div>
    </LayoutShell>
  );
}
