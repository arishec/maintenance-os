import { redirect } from 'next/navigation';
import { requireDbUser } from '@/lib/auth';
import { LayoutShell } from '@/components/layout-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ManageSubscriptionButton } from './manage-subscription-button';

export default async function SettingsPage() {
  let user;
  try {
    user = await requireDbUser();
  } catch {
    redirect('/sign-in');
  }

  const isPro = user.plan === 'pro';

  return (
    <LayoutShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Contractor replies</p>
                <p className="text-xs text-muted-foreground">Get notified when a contractor responds to your request</p>
              </div>
              <div className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">Active</div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Job updates</p>
                <p className="text-xs text-muted-foreground">Notifications when jobs are scheduled, started, or completed</p>
              </div>
              <div className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">Active</div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Email digests</p>
                <p className="text-xs text-muted-foreground">Weekly summary of all property activity</p>
              </div>
              <div className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">Off</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Billing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{isPro ? 'Pro plan' : 'Free plan'}</p>
                  <span className={`text-xs px-2 py-0.5 rounded ${isPro ? 'bg-blue-50 text-blue-700' : 'bg-muted text-muted-foreground'}`}>
                    {isPro ? 'Active' : 'Current'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {isPro
                    ? 'Unlimited issues, SMS & email contractor dispatch'
                    : 'Track up to 3 issues total'}
                </p>
              </div>
              {!isPro && (
                <a href="/pricing" className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline">
                  Upgrade
                </a>
              )}
            </div>
            {isPro && (
              <div className="pt-2 border-t border-border">
                <ManageSubscriptionButton />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </LayoutShell>
  );
}
