'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { LayoutShell } from '@/components/layout-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { PaywallModal } from '@/components/paywall-modal';

interface Issue {
  id: string;
  title: string | null;
  description: string;
  category: string | null;
  urgency: string | null;
  recommendedTrade: string | null;
  photos: Array<{ id: string; fileUrl: string | null }>;
}

interface Contractor {
  id: string;
  name: string;
  trade: string;
  phone: string | null;
  email: string | null;
  isPreferred: boolean;
}

interface SelectedContractor {
  contractorId: string;
  channel: 'sms' | 'email';
}

export default function DispatchPage() {
  const router = useRouter();
  const params = useParams();
  const issueId = params.id as string;

  const [issue, setIssue] = useState<Issue | null>(null);
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [selected, setSelected] = useState<SelectedContractor[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [customMessage, setCustomMessage] = useState('');
  const [includePhotos, setIncludePhotos] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPaywall, setShowPaywall] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`/api/issues/${issueId}`).then(r => r.json()),
      fetch('/api/contractors').then(r => r.json()),
    ]).then(([issueData, contractorData]) => {
      setIssue(issueData.issue);
      setContractors(contractorData.contractors);
    });
  }, [issueId]);

  // Filter contractors by recommended trade
  const tradeMap: Record<string, string[]> = {
    plumbing: ['plumbing', 'handyman'],
    electrical: ['electrical', 'handyman'],
    hvac: ['hvac', 'handyman'],
    roofing: ['roofing', 'general_contractor'],
    appliance: ['appliance_repair', 'handyman'],
    structural: ['general_contractor', 'handyman'],
    pest: ['pest_control'],
    cleaning: ['cleaning'],
    exterior: ['landscaping', 'handyman', 'general_contractor'],
    general_handyman: ['handyman', 'general_contractor'],
  };

  const relevantTrades = issue?.recommendedTrade ? (tradeMap[issue.category ?? ''] ?? []) : [];
  const filteredContractors = showAll || relevantTrades.length === 0
    ? contractors
    : contractors.filter(c => relevantTrades.includes(c.trade));

  function toggleContractor(contractor: Contractor) {
    const exists = selected.find(s => s.contractorId === contractor.id);
    if (exists) {
      setSelected(selected.filter(s => s.contractorId !== contractor.id));
    } else {
      const channel = contractor.phone ? 'sms' : 'email';
      setSelected([...selected, { contractorId: contractor.id, channel: channel as 'sms' | 'email' }]);
    }
  }

  function setChannel(contractorId: string, channel: 'sms' | 'email') {
    setSelected(selected.map(s => s.contractorId === contractorId ? { ...s, channel } : s));
  }

  async function handleSend() {
    if (selected.length === 0) return;
    setLoading(true);
    setError('');

    const res = await fetch(`/api/issues/${issueId}/dispatch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contractors: selected,
        includePhotos,
        customMessage: customMessage || undefined,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      if (data.error === 'PAYWALL_REQUIRED') {
        setShowPaywall(true);
        setLoading(false);
        return;
      }
      setError(data.error || 'Failed to send requests.');
      setLoading(false);
      return;
    }

    router.push(`/issues/${issueId}`);
    router.refresh();
  }

  if (!issue) {
    return <LayoutShell><div className="py-12 text-center text-sm text-muted-foreground">Loading...</div></LayoutShell>;
  }

  return (
    <LayoutShell>
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Contact Contractors</h1>
          <p className="mt-1 text-sm text-muted-foreground">Select who to contact for this issue.</p>
        </div>

        {/* Issue Summary */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-medium">{issue.title ?? 'Untitled issue'}</div>
                <div className="mt-1 text-sm text-muted-foreground">{issue.description.slice(0, 150)}</div>
              </div>
              <div className="flex gap-2">
                {issue.category && <Badge>{issue.category}</Badge>}
                {issue.urgency && <Badge>{issue.urgency}</Badge>}
              </div>
            </div>
          </CardContent>
        </Card>

        {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

        {/* Contractor List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Select Contractors</CardTitle>
              {relevantTrades.length > 0 && (
                <button onClick={() => setShowAll(!showAll)} className="text-sm text-primary hover:underline">
                  {showAll ? 'Show recommended' : 'Show all'}
                </button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {filteredContractors.length === 0 ? (
              <p className="text-sm text-muted-foreground">No contractors found. Add one first.</p>
            ) : (
              <div className="space-y-3">
                {filteredContractors.map(contractor => {
                  const isSelected = selected.some(s => s.contractorId === contractor.id);
                  const sel = selected.find(s => s.contractorId === contractor.id);
                  return (
                    <div
                      key={contractor.id}
                      className={`flex items-center gap-4 rounded-xl border p-4 cursor-pointer transition-colors ${isSelected ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'}`}
                      onClick={() => toggleContractor(contractor)}
                    >
                      <input type="checkbox" checked={isSelected} readOnly className="h-4 w-4 rounded" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium">{contractor.name}</div>
                        <div className="text-xs text-muted-foreground">{contractor.trade.replace(/_/g, ' ')}</div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {contractor.phone && <div>{contractor.phone}</div>}
                        {contractor.email && <div>{contractor.email}</div>}
                      </div>
                      {isSelected && (
                        <select
                          value={sel?.channel}
                          onChange={e => { e.stopPropagation(); setChannel(contractor.id, e.target.value as 'sms' | 'email'); }}
                          onClick={e => e.stopPropagation()}
                          className="rounded-lg border border-border bg-white px-2 py-1 text-sm"
                        >
                          {contractor.phone && <option value="sms">SMS</option>}
                          {contractor.email && <option value="email">Email</option>}
                        </select>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Options */}
        <Card>
          <CardContent className="space-y-4 pt-6">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Custom message (optional)</label>
              <Textarea
                value={customMessage}
                onChange={e => setCustomMessage(e.target.value)}
                placeholder="Override the default message..."
                rows={3}
              />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={includePhotos} onChange={e => setIncludePhotos(e.target.checked)} className="h-4 w-4 rounded" />
              Include photos in request
            </label>
          </CardContent>
        </Card>

        {/* Send Button */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">{selected.length} contractor{selected.length !== 1 ? 's' : ''} selected</div>
          <Button onClick={handleSend} disabled={selected.length === 0 || loading}>
            {loading ? 'Sending...' : `Send Request${selected.length !== 1 ? 's' : ''}`}
          </Button>
        </div>
      </div>
      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        trigger="dispatch"
      />
    </LayoutShell>
  );
}
