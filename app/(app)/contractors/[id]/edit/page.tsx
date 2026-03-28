'use client';

import { useState, useEffect } from 'react';
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

interface Contractor {
  id: string;
  name: string;
  companyName: string | null;
  trade: string;
  phone: string | null;
  email: string | null;
  notes: string | null;
  isPreferred: boolean;
}

export default function EditContractorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [contractor, setContractor] = useState<Contractor | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [contractorId, setContractorId] = useState('');

  useEffect(() => {
    async function loadParams() {
      const { id } = await params;
      setContractorId(id);
      await loadContractor(id);
    }
    loadParams();
  }, [params]);

  async function loadContractor(id: string) {
    try {
      const res = await fetch(`/api/contractors/${id}`);
      if (!res.ok) {
        setError('Failed to load contractor.');
        return;
      }
      const data = await res.json();
      setContractor(data.contractor);
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setPageLoading(false);
    }
  }

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
    };

    try {
      const res = await fetch(`/api/contractors/${contractorId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to update contractor.');
        setLoading(false);
        return;
      }

      router.push(`/contractors/${contractorId}`);
      router.refresh();
    } catch (err) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  }

  if (pageLoading) {
    return (
      <LayoutShell>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading contractor...</p>
        </div>
      </LayoutShell>
    );
  }

  if (!contractor) {
    return (
      <LayoutShell>
        <div className="text-center py-8">
          <p className="text-red-600">Contractor not found.</p>
        </div>
      </LayoutShell>
    );
  }

  return (
    <LayoutShell>
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>Edit Contractor</CardTitle>
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
              <Input
                name="name"
                required
                placeholder="Full name or contact person"
                defaultValue={contractor.name}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Company Name</label>
              <Input
                name="companyName"
                placeholder="Company or business name"
                defaultValue={contractor.companyName || ''}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Trade *</label>
              <Select name="trade" required defaultValue={contractor.trade}>
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
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Phone</label>
                <Input
                  name="phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  defaultValue={contractor.phone || ''}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Email</label>
                <Input
                  name="email"
                  type="email"
                  placeholder="contractor@example.com"
                  defaultValue={contractor.email || ''}
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Notes</label>
              <Textarea
                name="notes"
                placeholder="Additional information about this contractor"
                defaultValue={contractor.notes || ''}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPreferred"
                name="isPreferred"
                className="h-4 w-4 rounded border-border"
                defaultChecked={contractor.isPreferred}
              />
              <label htmlFor="isPreferred" className="text-sm font-medium">
                Mark as preferred contractor
              </label>
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </LayoutShell>
  );
}
