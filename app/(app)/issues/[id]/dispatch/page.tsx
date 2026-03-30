'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { LayoutShell } from '@/components/layout-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { PaywallModal } from '@/components/paywall-modal';
import { formatPhone } from '@/lib/utils';

function formatLabel(value: string): string {
  const special: Record<string, string> = {
    hvac: 'HVAC', general_handyman: 'General Handyman',
    general_contractor: 'General Contractor', appliance_repair: 'Appliance Repair',
    pest_control: 'Pest Control',
  };
  if (special[value.toLowerCase()]) return special[value.toLowerCase()];
  return value.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

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
  const [successCount, setSuccessCount] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([
      fetch(`/api/issues/${issueId}`).then(r => r.json()),
      fetch('/api/contractors').then(r => r.json()),
    ]).then(([issueData, contractorData]) => {
      setIssue(issueData.issue);
      setContractors(contractorData.contractors ?? []);
    }).catch(() => {
      setError('Failed to load issue or contractors. Please refresh.');
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

  const relevantTrades = issue?.category ? (tradeMap[issue.category] ?? []) : [];
  const tradeFiltered = contractors.filter(c => relevantTrades.includes(c.trade));
  // If no contractors match the recommended trade, show all by default
  const filteredContractors = showAll || relevantTrades.length === 0 || tradeFiltered.length === 0
    ? contractors
    : tradeFiltered;

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

    setSuccessCount(selected.length);
    setLoading(false);
    setTimeout(() => {
      router.push(`/issues/${issueId}`);
      router.refresh();
    }, 2000);
  }

  if (!issue) {
    return <LayoutShell><div className="py-12 text-center text-sm text-muted-foreground">Loading...</div></LayoutShell>;
  }

  if (successCount !== null) {
    return (
      <LayoutShell>
        <div className="mx-auto max-w-md py-16 text-center space-y-4">
          <div className="mx-auto w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600"><path d="M20 6 9 17l-5-5"/></svg>
          </div>
          <h2 className="text-xl font-semibold">Request sent to {successCount} contractor{successCount !== 1 ? 's' : ''}</h2>
          <p className="text-sm text-muted-foreground">
            You&apos;ll be notified when they respond. Status: <span className="font-medium text-foreground">Awaiting quotes</span>
          </p>
        </div>
      </LayoutShell>
    );
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
            <div className="space-y-2">
              <div>
                <div className="font-medium">{issue.title ?? 'Untitled issue'}</div>
                <div className="mt-1 text-sm text-muted-foreground">{issue.description.slice(0, 150)}</div>
              </div>
              <div className="flex flex-wrap gap-2">
                {issue.category && <Badge>{formatLabel(issue.category)}</Badge>}
                {issue.urgency && <Badge>{formatLabel(issue.urgency)}</Badge>}
              </div>
            </div>
          </CardContent>
        </Card>

        {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

        {/* SMS notice — remove once A2P 10DLC campaign is approved */}
        {selected.some(s => s.channel === 'sms') && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            <strong>Heads up:</strong> SMS delivery to US numbers may be delayed while our carrier registration is being approved. Email dispatch is fully reliable right now.
          </div>
        )}

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
                      className={`flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 rounded-xl border p-4 cursor-pointer transition-colors ${isSelected ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'}`}
                      onClick={() => toggleContractor(contractor)}
                    >
                      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                        <input type="checkbox" checked={isSelected} readOnly className="h-5 w-5 rounded flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium">{contractor.name}</div>
                          <div className="text-xs text-muted-foreground">{contractor.trade.replace(/_/g, ' ')}</div>
                          <div className="text-xs text-muted-foreground mt-0.5 sm:hidden truncate">
                            {contractor.phone && <span>{formatPhone(contractor.phone)}</span>}
                            {contractor.phone && contractor.email && <span> · </span>}
                            {contractor.email && <span>{contractor.email}</span>}
                          </div>
                        </div>
                      </div>
                      <div className="hidden sm:block text-sm text-muted-foreground flex-shrink-0">
                        {contractor.phone && <div>{formatPhone(contractor.phone)}</div>}
                        {contractor.email && <div className="truncate max-w-[200px]">{contractor.email}</div>}
                      </div>
                      {isSelected && (
                        <select
                          value={sel?.channel}
                          onChange={e => { e.stopPropagation(); setChannel(contractor.id, e.target.value as 'sms' | 'email'); }}
                          onClick={e => e.stopPropagation()}
                          className="rounded-lg border border-border bg-white px-3 py-2 text-sm ml-8 sm:ml-0 w-fit"
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
              <input type="checkbox" checked={includePhotos} onChange={e => setIncludePhotos(e.target.checked)} className="h-5 w-5 rounded" />
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
