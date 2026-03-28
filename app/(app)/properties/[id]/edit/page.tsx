'use client';

import { useEffect, useState } from 'react';
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

export default function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [nickname, setNickname] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [propertyId, setPropertyId] = useState('');

  useEffect(() => {
    async function loadProperty() {
      try {
        const { id } = await params;
        setPropertyId(id);

        const res = await fetch(`/api/properties/${id}`);
        if (!res.ok) {
          setError('Failed to load property');
          return;
        }

        const data = await res.json();
        const property = data.property;

        setNickname(property.nickname || '');
        setAddressLine1(property.addressLine1);
        setAddressLine2(property.addressLine2 || '');
        setCity(property.city);
        setState(property.state);
        setPostalCode(property.postalCode);
        setPropertyType(property.propertyType);
      } catch (err) {
        setError('Failed to load property');
      } finally {
        setLoading(false);
      }
    }

    loadProperty();
  }, [params]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setSaving(true);

    const body = {
      nickname: nickname || undefined,
      addressLine1,
      addressLine2: addressLine2 || undefined,
      city,
      state,
      postalCode,
      propertyType,
    };

    try {
      const res = await fetch(`/api/properties/${propertyId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to update property.');
        setSaving(false);
        return;
      }

      router.push(`/properties/${propertyId}`);
      router.refresh();
    } catch (err) {
      setError('An error occurred. Please try again.');
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <LayoutShell>
        <Card className="mx-auto max-w-2xl">
          <CardContent className="pt-6">
            <p>Loading property...</p>
          </CardContent>
        </Card>
      </LayoutShell>
    );
  }

  return (
    <LayoutShell>
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>Edit Property</CardTitle>
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
              <Input
                name="nickname"
                placeholder="e.g. Home, Rental #1"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Address *</label>
              <Input
                name="addressLine1"
                required
                placeholder="Street address"
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Address Line 2</label>
              <Input
                name="addressLine2"
                placeholder="Apt, suite, unit"
                value={addressLine2}
                onChange={(e) => setAddressLine2(e.target.value)}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium">City *</label>
                <Input
                  name="city"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">State *</label>
                <Input
                  name="state"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">ZIP *</label>
                <Input
                  name="postalCode"
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Property Type *</label>
              <Select
                name="propertyType"
                required
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
              >
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
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </LayoutShell>
  );
}
