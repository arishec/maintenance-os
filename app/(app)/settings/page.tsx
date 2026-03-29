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
                <p className="text-sm font-medium">SMS dispatch</p>
                <p className="text-xs text-muted-foreground">SMS delivery to US numbers is pending carrier approval. Email dispatch works now.</p>
              </div>
              <div className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded">Pending</div>
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
                Active
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              All features are free during beta — unlimited issues, contractor dispatch, and more.
            </p>
          </CardContent>
        </Card>
      </div>
    </LayoutShell>
  );
}
