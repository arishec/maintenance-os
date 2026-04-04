'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { LayoutShell } from '@/components/layout-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { PaywallModal } from '@/components/paywall-modal';
import { formatPhone } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';

function formatLabel(value: string): string {
  const special: Record<string, string> = {
    hvac: 'HVAC', general_handyman: 'General Handyman',
    general_contractor: 'General Contractor', appliance_repair: 'Appliance Repair',
    pest_control: 'Pest Control',
  };
  if (special[value.toLowerCase()]) return special[value.toLowerCase()];
  return value.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function formatContractorStats(stats?: ContractorStats): string | null {
  if (!stats) return null;
  const parts: string[] = [];

  // Jobs or dispatches
  if (stats.completedJobs > 0) {
    parts.push(`${stats.completedJobs} job${stats.completedJobs !== 1 ? 's' : ''} completed`);
  } else if (stats.totalDispatches > 0) {
    parts.push(`contacted ${stats.totalDispatches}x`);
  }

  // Response speed
  if (stats.totalDispatches >= 2) {
    if (stats.replied === 0) {
      parts.push('no responses');
    } else if (stats.avgResponseMs !== null) {
      const hours = stats.avgResponseMs / (1000 * 60 * 60);
      if (hours < 2) parts.push('responds quickly');
      else if (hours < 24) parts.push('usually responds');
    }
  }

  return parts.length > 0 ? parts.join(' · ') : null;
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

interface ContractorStats {
  totalDispatches: number;
  replied: number;
  responseRate: number | null;
  totalJobs: number;
  completedJobs: number;
  avgResponseMs: number | null;
}

interface Contractor {
  id: string;
  name: string;
  trade: string;
  phone: string | null;
  email: string | null;
  isPreferred: boolean;
  preferredChannel: string | null;
  stats?: ContractorStats;
}

interface SelectedContractor {
  contractorId: string;
  channel: 'sms' | 'email';
}

// Compute fit score for a contractor based on stats and trade match
function computeScore(
  contractor: Contractor,
  issueCategory: string | null,
  tradeMap: Record<string, string[]>
): number {
  let score = 0;

  // 1. Trade match (40 points for direct match, 20 for related like handyman)
  if (issueCategory) {
    const relevantTrades = tradeMap[issueCategory] ?? [];
    if (relevantTrades.includes(contractor.trade)) {
      // Direct match or primary match gets 40 points
      const primaryTrade = relevantTrades[0];
      score += contractor.trade === primaryTrade ? 40 : 20;
    }
  }

  if (contractor.stats) {
    // 2. Response rate (up to 25 points)
    if (contractor.stats.responseRate !== null) {
      score += Math.round(25 * contractor.stats.responseRate);
    }

    // 3. Completed jobs (up to 20 points — min(completedJobs * 4, 20))
    score += Math.min(contractor.stats.completedJobs * 4, 20);

    // 4. Response speed (up to 15 points — faster is better)
    if (contractor.stats.avgResponseMs !== null) {
      const hours = contractor.stats.avgResponseMs / (1000 * 60 * 60);
      if (hours < 1) score += 15;
      else if (hours < 2) score += 13;
      else if (hours < 4) score += 11;
      else if (hours < 8) score += 9;
      else if (hours < 24) score += 6;
      else score += 2;
    }
  }

  return Math.min(Math.round(score), 100);
}

// Generate recommendation text for top contractors
function getRecommendationText(contractor: Contractor): string | null {
  if (!contractor.stats) return null;
  const parts: string[] = [];

  // Response time
  if (contractor.stats.avgResponseMs !== null && contractor.stats.replied > 0) {
    const hours = contractor.stats.avgResponseMs / (1000 * 60 * 60);
    if (hours < 1) parts.push('Responds in ~1 hr');
    else if (hours < 2) parts.push('Responds in ~2 hrs');
    else if (hours < 24) parts.push(`Responds in ~${Math.round(hours)} hrs`);
    else parts.push('Responds in 1+ days');
  }

  // Completed jobs
  if (contractor.stats.completedJobs > 0) {
    parts.push(`${contractor.stats.completedJobs} job${contractor.stats.completedJobs !== 1 ? 's' : ''} completed`);
  }

  return parts.length > 0 ? parts.join(' · ') : null;
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
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPaywall, setShowPaywall] = useState(false);
  const [successCount, setSuccessCount] = useState<number | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Inline add contractor form
  const [showAddForm, setShowAddForm] = useState(false);
  const [addingContractor, setAddingContractor] = useState(false);
  const [addError, setAddError] = useState('');
  const [newContractor, setNewContractor] = useState({
    name: '', trade: 'handyman', phone: '', email: '', companyName: '',
  });

  useEffect(() => {
    Promise.all([
      fetch(`/api/issues/${issueId}`).then(r => r.json()),
      fetch('/api/contractors?stats=1').then(r => r.json()),
    ]).then(([issueData, contractorData]) => {
      setIssue(issueData.issue);
      setContractors(contractorData.contractors ?? []);
      setIsLoadingData(false);
    }).catch(() => {
      setError('Failed to load issue or contractors. Please refresh.');
      setIsLoadingData(false);
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
  const unsorted = showAll || relevantTrades.length === 0 || tradeFiltered.length === 0
    ? contractors
    : tradeFiltered;
  // Sort by fit score (preferred contractors get +10 bonus)
  const filteredContractors = [...unsorted].sort((a, b) => {
    const scoreA = computeScore(a, issue?.category ?? null, tradeMap) + (a.isPreferred ? 10 : 0);
    const scoreB = computeScore(b, issue?.category ?? null, tradeMap) + (b.isPreferred ? 10 : 0);
    return scoreB - scoreA;
  });

  function toggleContractor(contractor: Contractor) {
    const exists = selected.find(s => s.contractorId === contractor.id);
    if (exists) {
      setSelected(selected.filter(s => s.contractorId !== contractor.id));
    } else {
      // Use contractor's preferred channel if set, otherwise default to email
      let channel: 'sms' | 'email' = contractor.email ? 'email' : 'sms';
      if (contractor.preferredChannel === 'sms' && contractor.phone) {
        channel = 'sms';
      } else if (contractor.preferredChannel === 'email' && contractor.email) {
        channel = 'email';
      }
      setSelected([...selected, { contractorId: contractor.id, channel }]);
    }
  }

  function setChannel(contractorId: string, channel: 'sms' | 'email') {
    setSelected(selected.map(s => s.contractorId === contractorId ? { ...s, channel } : s));
  }

  async function handleAddContractor() {
    if (!newContractor.name.trim()) return;
    if (!newContractor.phone.trim() && !newContractor.email.trim()) {
      setAddError('Phone or email is required.');
      return;
    }
    if (newContractor.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newContractor.email.trim())) {
      setAddError('Please enter a valid email address.');
      return;
    }
    setAddingContractor(true);
    setAddError('');

    try {
      const res = await fetch('/api/contractors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newContractor.name.trim(),
          trade: newContractor.trade,
          phone: newContractor.phone.trim() || undefined,
          email: newContractor.email.trim() || undefined,
          companyName: newContractor.companyName.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to add contractor');
      }

      const data = await res.json();
      const created = data.contractor;
      setContractors(prev => [...prev, created]);
      // Auto-select the new contractor with their preferred channel
      let channel: 'sms' | 'email' = created.email ? 'email' : 'sms';
      if (created.preferredChannel === 'sms' && created.phone) {
        channel = 'sms';
      } else if (created.preferredChannel === 'email' && created.email) {
        channel = 'email';
      }
      setSelected(prev => [...prev, { contractorId: created.id, channel }]);
      setNewContractor({ name: '', trade: 'handyman', phone: '', email: '', companyName: '' });
      setShowAddForm(false);
    } catch (err) {
      setAddError(err instanceof Error ? err.message : 'Failed to add contractor');
    } finally {
      setAddingContractor(false);
    }
  }

  function handleSendClick() {
    if (selected.length === 0) return;
    setShowConfirmDialog(true);
  }

  async function handleSendConfirmed() {
    setShowConfirmDialog(false);
    setLoading(true);
    setError('');

    try {
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
        let msg = 'Failed to send requests.';
        try { const data = await res.json(); if (data.error === 'PAYWALL_REQUIRED') { setShowPaywall(true); setLoading(false); return; } msg = data.error || msg; } catch { /* non-JSON */ }
        setError(msg);
        setLoading(false);
        return;
      }

      setSuccessCount(selected.length);
      setLoading(false);
      setTimeout(() => {
        router.push(`/issues/${issueId}`);
        router.refresh();
      }, 2000);
    } catch {
      setError('Network error — please check your connection and try again.');
      setLoading(false);
    }
  }

  if (isLoadingData) {
    return (
      <LayoutShell>
        <div className="py-12 text-center">
          <div className="flex justify-center mb-4">
            <div className="animate-spin">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Loading issue and contractors...</p>
        </div>
      </LayoutShell>
    );
  }

  if (!issue) {
    return <LayoutShell><div className="py-12 text-center text-sm text-muted-foreground">Issue not found</div></LayoutShell>;
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
            {filteredContractors.length === 0 && !showAddForm ? (
              <p className="text-sm text-muted-foreground">No contractors found. Add one below.</p>
            ) : (
              <div className="space-y-3">
                {filteredContractors.map((contractor, idx) => {
                  const isSelected = selected.some(s => s.contractorId === contractor.id);
                  const sel = selected.find(s => s.contractorId === contractor.id);
                  const score = computeScore(contractor, issue?.category ?? null, tradeMap) + (contractor.isPreferred ? 10 : 0);
                  const isTopRecommended = score > 70 && idx === 0; // Top recommended is the first with score > 70
                  const recommText = isTopRecommended ? getRecommendationText(contractor) : null;

                  // Determine score indicator color
                  let scoreIndicatorColor = 'bg-gray-300'; // below 40
                  if (score >= 70) scoreIndicatorColor = 'bg-green-500';
                  else if (score >= 40) scoreIndicatorColor = 'bg-yellow-500';

                  return (
                    <div key={contractor.id} className="space-y-2">
                      {isTopRecommended && recommText && (
                        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-50 border border-green-200">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                          <span className="text-sm font-medium text-green-700">Recommended:</span>
                          <span className="text-sm text-green-600">{recommText}</span>
                        </div>
                      )}
                      <div
                        className={`flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 rounded-xl border p-4 cursor-pointer transition-colors ${isSelected ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'}`}
                        onClick={() => toggleContractor(contractor)}
                      >
                        <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                          <input type="checkbox" checked={isSelected} readOnly className="h-5 w-5 rounded flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium flex items-center gap-2">
                              {contractor.name}
                              <div className={`w-2 h-2 rounded-full ${scoreIndicatorColor}`} title={`Fit score: ${score}/100`} />
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {contractor.trade.replace(/_/g, ' ')}
                              {(() => {
                                const statsLine = formatContractorStats(contractor.stats);
                                return statsLine ? <span> · {statsLine}</span> : null;
                              })()}
                            </div>
                            <div className="text-xs text-muted-foreground mt-0.5 sm:hidden truncate">
                              {contractor.phone && <span>{formatPhone(contractor.phone)}</span>}
                              {contractor.phone && contractor.email && <span> · </span>}
                              {contractor.email && <span>{contractor.email}</span>}
                            </div>
                            {contractor.preferredChannel && (
                              <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded mt-0.5 inline-block">
                                Prefers {contractor.preferredChannel === 'sms' ? 'SMS' : 'email'}
                              </span>
                            )}
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
                          {contractor.email && <option value="email">Email</option>}
                          {contractor.phone && <option value="sms">SMS</option>}
                        </select>
                      )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Inline Add Contractor */}
            {showAddForm ? (
              <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50/50 p-4 space-y-3">
                <h4 className="text-sm font-semibold">Add a new contractor</h4>
                {addError && <p className="text-sm text-red-600">{addError}</p>}
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-medium mb-1">Name *</label>
                    <Input
                      value={newContractor.name}
                      onChange={e => setNewContractor(p => ({ ...p, name: e.target.value }))}
                      placeholder="e.g. John Smith"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Company</label>
                    <Input
                      value={newContractor.companyName}
                      onChange={e => setNewContractor(p => ({ ...p, companyName: e.target.value }))}
                      placeholder="e.g. Smith Plumbing"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Trade *</label>
                    <Select
                      value={newContractor.trade}
                      onChange={e => setNewContractor(p => ({ ...p, trade: e.target.value }))}
                    >
                      <option value="plumbing">Plumbing</option>
                      <option value="electrical">Electrical</option>
                      <option value="hvac">HVAC</option>
                      <option value="roofing">Roofing</option>
                      <option value="appliance_repair">Appliance Repair</option>
                      <option value="handyman">Handyman</option>
                      <option value="pest_control">Pest Control</option>
                      <option value="landscaping">Landscaping</option>
                      <option value="cleaning">Cleaning</option>
                      <option value="restoration">Restoration</option>
                      <option value="general_contractor">General Contractor</option>
                      <option value="other">Other</option>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Phone</label>
                    <Input
                      type="tel"
                      value={newContractor.phone}
                      onChange={e => setNewContractor(p => ({ ...p, phone: e.target.value }))}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium mb-1">Email</label>
                    <Input
                      type="email"
                      value={newContractor.email}
                      onChange={e => setNewContractor(p => ({ ...p, email: e.target.value }))}
                      placeholder="john@smithplumbing.com"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleAddContractor} disabled={addingContractor || !newContractor.name.trim()}>
                    {addingContractor ? 'Adding...' : 'Add & Select'}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => { setShowAddForm(false); setAddError(''); }}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowAddForm(true)}
                className="mt-3 flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>
                Add a new contractor
              </button>
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
          <Button onClick={handleSendClick} disabled={selected.length === 0 || loading}>
            {loading ? 'Sending...' : `Send Request${selected.length !== 1 ? 's' : ''}`}
          </Button>
        </div>
      </div>
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Dispatch</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div>
                <p>Send the issue details to {selected.length} contractor{selected.length !== 1 ? 's' : ''}?</p>
                <ul className="mt-3 space-y-1.5">
                  {selected.map(s => {
                    const c = contractors.find(ct => ct.id === s.contractorId);
                    return c ? (
                      <li key={s.contractorId} className="flex items-center justify-between text-sm">
                        <span className="font-medium text-foreground">{c.name}</span>
                        <span className="text-xs text-muted-foreground capitalize">{s.channel === 'sms' ? 'SMS' : 'Email'}</span>
                      </li>
                    ) : null;
                  })}
                </ul>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSendConfirmed}>
              Send Request{selected.length !== 1 ? 's' : ''}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        trigger="dispatch"
      />
    </LayoutShell>
  );
}
