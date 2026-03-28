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
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            More settings coming soon — notification preferences, integrations, and account management.
          </CardContent>
        </Card>
      </div>
    </LayoutShell>
  );
}
