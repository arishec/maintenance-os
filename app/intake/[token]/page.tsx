'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';

const locations = [
  { value: 'kitchen', label: 'Kitchen' },
  { value: 'bathroom', label: 'Bathroom' },
  { value: 'bedroom', label: 'Bedroom' },
  { value: 'living_room', label: 'Living Room' },
  { value: 'basement', label: 'Basement' },
  { value: 'exterior', label: 'Exterior' },
  { value: 'hvac_closet', label: 'HVAC Closet' },
  { value: 'roof', label: 'Roof' },
  { value: 'garage', label: 'Garage' },
  { value: 'other', label: 'Other' },
];

const urgencyOptions = [
  { value: 'emergency', label: 'Emergency' },
  { value: 'urgent', label: 'Urgent' },
  { value: 'normal', label: 'Normal' },
  { value: 'not_sure', label: 'Not sure' },
];

export default function IntakePage() {
  const params = useParams();
  const token = params.token as string;

  const [valid, setValid] = useState<boolean | null>(null);
  const [propertyName, setPropertyName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [classification, setClassification] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/intake/${token}`)
      .then(r => r.json())
      .then(data => {
        setValid(data.valid);
        if (data.propertyNickname) setPropertyName(data.propertyNickname);
      })
      .catch(() => setValid(false));
  }, [token]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const form = new FormData(e.currentTarget);
    const body = {
      reporterName: form.get('reporterName') as string || undefined,
      reporterContact: form.get('reporterContact') as string || undefined,
      description: form.get('description') as string,
      locationInProperty: form.get('locationInProperty') as string || undefined,
      urgencyHint: form.get('urgencyHint') as string || undefined,
    };

    const res = await fetch(`/api/intake/${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || 'Failed to submit issue.');
      setLoading(false);
      return;
    }

    const data = await res.json();
    setClassification({
      title: data.issue.title,
      category: data.issue.category,
      urgency: data.issue.urgency,
      reasoningSummary: data.issue.reasoningSummary,
    });
    setSubmitted(true);
    setLoading(false);
  }

  if (valid === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Validating link...</p>
      </div>
    );
  }

  if (!valid) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Card className="max-w-md">
          <CardContent className="py-8 text-center">
            <h2 className="text-lg font-semibold">Invalid Link</h2>
            <p className="mt-2 text-sm text-muted-foreground">This link is invalid or has been deactivated.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (submitted && classification) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <div className="text-xs text-muted-foreground">Maintenance OS</div>
            <CardTitle>Issue Submitted</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Your issue has been submitted. The property manager will be notified.</p>
            <div className="rounded-xl border border-border bg-slate-50 p-4 space-y-2">
              <div className="text-sm"><span className="font-medium">Title:</span> {classification.title}</div>
              <div className="text-sm"><span className="font-medium">Category:</span> {classification.category}</div>
              <div className="text-sm"><span className="font-medium">Urgency:</span> {classification.urgency}</div>
              {classification.reasoningSummary && (
                <div className="text-sm"><span className="font-medium">Summary:</span> {classification.reasoningSummary}</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="text-xs text-muted-foreground">Maintenance OS</div>
          <CardTitle>Report a Maintenance Issue</CardTitle>
          {propertyName && <p className="text-sm text-muted-foreground">{propertyName}</p>}
        </CardHeader>
        <CardContent>
          {error && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Your Name</label>
              <Input name="reporterName" placeholder="Optional" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Your Contact</label>
              <Input name="reporterContact" placeholder="Phone or email (optional)" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">What's the issue? *</label>
              <Textarea name="description" required placeholder="Describe the problem..." rows={4} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Where in the property?</label>
              <Select name="locationInProperty" defaultValue="">
                <option value="">Select location</option>
                {locations.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
              </Select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">How urgent?</label>
              <Select name="urgencyHint" defaultValue="normal">
                {urgencyOptions.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
              </Select>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Issue'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
