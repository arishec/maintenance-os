'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LayoutShell } from '@/components/layout-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const trades = [
  { value: 'plumbing', label: 'Plumbing' },
  { value: 'electrical', label: 'Electrical' },
  { value: 'hvac', label: 'HVAC' },
  { value: 'roofing', label: 'Roofing' },
  { value: 'appliance_repair', label: 'Appliance Repair' },
  { value: 'handyman', label: 'Handyman' },
  { value: 'pest_control', label: 'Pest Control' },
  { value: 'landscaping', label: 'Landscaping' },
  { value: 'cleaning', label: 'Cleaning' },
  { value: 'restoration', label: 'Restoration' },
  { value: 'general_contractor', label: 'General Contractor' },
  { value: 'other', label: 'Other' },
];

export default function NewContractorPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const body = {
      name: form.get('name') as string,
      companyName: form.get('companyName') as string || undefined,
      trade: form.get('trade') as string,
      phone: form.get('phone') as string || undefined,
      email: form.get('email') as string || undefined,
      notes: form.get('notes') as string || undefined,
      isPreferred: form.get('isPreferred') === 'on',
      preferredChannel: (form.get('preferredChannel') as string) || null,
    };

    try {
      const res = await fetch('/api/contractors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to create contractor.');
        setLoading(false);
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  }

  return (
    <LayoutShell>
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>Add Contractor</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Name *</label>
              <Input name="name" required placeholder="Full name or contact person" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Company Name</label>
              <Input name="companyName" placeholder="Company or business name" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Trade *</label>
              <Select name="trade" required defaultValue="">
                <option value="" disabled>
                  Select trade
                </option>
                {trades.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-3">Provide at least a phone number or email (one is required)</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Phone</label>
                  <Input name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="(555) 123-4567" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Email</label>
                  <Input name="email" type="email" inputMode="email" autoComplete="email" placeholder="contractor@example.com" />
                </div>
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Preferred Contact Method</label>
              <Select name="preferredChannel" defaultValue="">
                <option value="">No preference</option>
                <option value="sms">SMS / Text</option>
                <option value="email">Email</option>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">How this contractor prefers to be contacted — auto-selected when dispatching</p>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Notes</label>
              <Textarea name="notes" placeholder="Additional information about this contractor" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPreferred"
                  name="isPreferred"
                  className="h-5 w-5 rounded border-border"
                />
                <label htmlFor="isPreferred" className="text-sm font-medium">
                  Mark as preferred contractor
                </label>
              </div>
              <p className="text-xs text-muted-foreground ml-6 mt-1">Preferred contractors appear first when dispatching repair requests</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <p className="text-xs font-semibold text-gray-900 mb-2">SMS Consent Notice</p>
              <p className="text-xs text-muted-foreground mb-2">
                By adding this contractor, you confirm that the contractor has agreed to receive repair
                request notifications via SMS from Maintenance OS (ifbids.com). Message and data rates
                may apply. Message frequency varies (typically 1-5 per month). The contractor can opt out
                at any time by replying <strong>STOP</strong> to any SMS message, or by contacting
                support@ifbids.com. Reply <strong>HELP</strong> for help.
              </p>
              <p className="text-xs text-muted-foreground">
                No mobile information will be shared with third parties or affiliates for
                marketing or promotional purposes. See our{' '}
                <a href="/privacy" target="_blank" className="text-blue-600 underline hover:text-blue-700">
                  Privacy Policy
                </a>{' '}
                and{' '}
                <a href="/terms#sms" target="_blank" className="text-blue-600 underline hover:text-blue-700">
                  Terms of Service
                </a>{' '}
                for full details on our SMS messaging practices.
              </p>
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Add Contractor'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </LayoutShell>
  );
}
