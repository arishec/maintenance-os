'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LayoutShell } from '@/components/layout-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const locationOptions = [
  { value: 'kitchen', label: 'Kitchen' },
  { value: 'bathroom', label: 'Bathroom' },
  { value: 'basement', label: 'Basement' },
  { value: 'exterior', label: 'Exterior' },
  { value: 'hvac_closet', label: 'HVAC Closet' },
  { value: 'roof', label: 'Roof' },
  { value: 'garage', label: 'Garage' },
  { value: 'other', label: 'Other' },
];

const urgencyOptions = [
  { value: 'emergency', label: 'Emergency' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

const statusOptions = [
  { value: 'new', label: 'New' },
  { value: 'classified', label: 'Classified' },
  { value: 'awaiting_dispatch', label: 'Awaiting Dispatch' },
  { value: 'awaiting_quotes', label: 'Awaiting Quotes' },
  { value: 'quotes_received', label: 'Quotes Received' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'canceled', label: 'Canceled' },
  { value: 'archived', label: 'Archived' },
];

export default function EditIssuePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [issueId, setIssueId] = useState('');
  const [description, setDescription] = useState('');
  const [locationInProperty, setLocationInProperty] = useState('');
  const [urgency, setUrgency] = useState('');
  const [status, setStatus] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    async function loadIssue() {
      try {
        const { id } = await params;
        setIssueId(id);

        const res = await fetch(`/api/issues/${id}`);
        if (!res.ok) {
          setError('Failed to load issue');
          return;
        }

        const responseData = await res.json();
        const issue = responseData.issue;

        setDescription(issue.description || '');
        setLocationInProperty(issue.locationInProperty || '');
        setUrgency(issue.urgency || '');
        setStatus(issue.status || '');
        setTitle(issue.title || '');
      } catch {
        setError('Failed to load issue');
      } finally {
        setLoading(false);
      }
    }

    loadIssue();
  }, [params]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setSaving(true);

    const body: Record<string, string | undefined> = {
      description,
      locationInProperty: locationInProperty || undefined,
      title: title || undefined,
    };
    if (urgency) body.urgency = urgency;
    if (status) body.status = status;

    try {
      const res = await fetch(`/api/issues/${issueId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errData = await res.json();
        setError(errData.error || 'Failed to update issue.');
        setSaving(false);
        return;
      }

      router.push(`/issues/${issueId}`);
      router.refresh();
    } catch {
      setError('An error occurred. Please try again.');
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <LayoutShell>
        <Card className="mx-auto max-w-2xl">
          <CardContent className="pt-6">
            <p>Loading issue...</p>
          </CardContent>
        </Card>
      </LayoutShell>
    );
  }

  return (
    <LayoutShell>
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>Edit Issue</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Title</label>
              <Textarea
                name="title"
                placeholder="Issue title"
                rows={1}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Description *</label>
              <Textarea
                name="description"
                required
                placeholder="Describe the issue..."
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Location</label>
              <Select
                name="locationInProperty"
                value={locationInProperty}
                onChange={(e) => setLocationInProperty(e.target.value)}
              >
                <option value="">Not specified</option>
                {locationOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Urgency</label>
              <Select
                name="urgency"
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
              >
                <option value="">Not set</option>
                {urgencyOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Status</label>
              <Select
                name="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/issues/${issueId}`)}
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
