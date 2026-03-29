import { redirect } from 'next/navigation';
import { requireDbUser } from '@/lib/auth';
import { LayoutShell } from '@/components/layout-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function SettingsPage() {
  let user;
  try {
    user = await requireDbUser();
  } catch {
    redirect('/sign-in');
  }

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
              <div className="text-xs text-muted-foreground bg-green-50 text-green-700 px-2 py-1 rounded">Active</div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Job updates</p>
                <p className="text-xs text-muted-foreground">Notifications when jobs are scheduled, started, or completed</p>
              </div>
              <div className="text-xs text-muted-foreground bg-green-50 text-green-700 px-2 py-1 rounded">Active</div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Email digests</p>
                <p className="text-xs text-muted-foreground">Weekly summary of all property activity</p>
              </div>
              <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">Off</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Billing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Free plan</p>
                <p className="text-xs text-muted-foreground">3 contractor dispatches included</p>
              </div>
              <a href="/pricing" className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline">
                Upgrade
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </LayoutShell>
  );
}
