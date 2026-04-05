'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LayoutShell } from '@/components/layout-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

const propertyTypes = [
  { value: 'single_family', label: 'Single Family' },
  { value: 'condo', label: 'Condo' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'duplex', label: 'Duplex' },
  { value: 'other', label: 'Other' },
];

export default function NewPropertyPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const body = {
      nickname: form.get('nickname') as string || undefined,
      addressLine1: form.get('addressLine1') as string,
      addressLine2: form.get('addressLine2') as string || undefined,
      city: form.get('city') as string,
      state: form.get('state') as string,
      postalCode: form.get('postalCode') as string,
      propertyType: form.get('propertyType') as string,
    };

    try {
      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to create property.');
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
          <CardTitle>Add Property</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Nickname</label>
              <Input name="nickname" placeholder="e.g. Home, Rental #1" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Address *</label>
              <Input name="addressLine1" required placeholder="Street address" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Address Line 2</label>
              <Input name="addressLine2" placeholder="Apt, suite, unit" />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium">City *</label>
                <Input name="city" required />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">State *</label>
                <Input name="state" required />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">ZIP *</label>
                <Input name="postalCode" required />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Property Type *</label>
              <Select name="propertyType" required defaultValue="">
                <option value="" disabled>
                  Select type
                </option>
                {propertyTypes.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </Select>
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Add Property'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </LayoutShell>
  );
}
