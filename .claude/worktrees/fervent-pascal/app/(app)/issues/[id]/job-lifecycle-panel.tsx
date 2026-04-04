'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Toast } from '@/components/ui/toast';
import { LocalTime } from '@/components/local-time';
import {
  JOB_STATUS_LABELS,
  JOB_STATUS_COLORS,
  JOB_STATUS_MICROCOPY,
  JOB_PROGRESS_STEPS,
} from '@/lib/status';

interface JobProps {
  id: string;
  status: string;
  contractorName: string;
  companyName?: string | null;
  agreedPrice?: string | null;
  actualCost?: string | null;
  completionNotes?: string | null;
  scheduledFor?: string | null;
  startedAt?: string | null;
  completedAt?: string | null;
  notes?: string | null;
  contractorAvailabilityDate?: string | null;
  contractorAvailabilityText?: string | null;
}

export function JobLifecyclePanel({ job }: { job: JobProps }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  // Pre-fill schedule date from contractor's stated availability
  const defaultScheduleDate = (() => {
    if (!job.contractorAvailabilityDate) return '';
    const d = new Date(job.contractorAvailabilityDate);
    // Only pre-fill if the date is in the future
    if (d <= new Date()) return '';
    return d.toISOString().split('T')[0];
  })();
  const [scheduleDate, setScheduleDate] = useState(defaultScheduleDate);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [actualCost, setActualCost] = useState(job.agreedPrice || '');
  const [completionNotes, setCompletionNotes] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [selfResolved, setSelfResolved] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleStatusChange = async (nextStatus: string, extra?: { scheduledFor?: string }) => {
    setIsLoading(nextStatus);
    setError(null);

    try {
      const res = await fetch(`/api/jobs/${job.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus, ...extra }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update job');
      }

      // Show success toast based on status
      let message = 'Job updated successfully';
      if (nextStatus === 'scheduled') message = 'Job scheduled successfully';
      else if (nextStatus === 'in_progress') message = 'Job marked as in progress';
      else if (nextStatus === 'canceled') message = 'Job canceled';

      setToastMessage(message);
      setTimeout(() => {
        setToastMessage(null);
        router.refresh();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(null);
    }
  };

  const handleScheduleConfirm = () => {
    if (!scheduleDate) return;
    // Parse as local date (noon) to avoid timezone off-by-one
    const [y, m, d] = scheduleDate.split('-').map(Number);
    const dateTime = new Date(y, m - 1, d, 12, 0, 0).toISOString();
    setShowScheduleModal(false);
    handleStatusChange('scheduled', { scheduledFor: dateTime });
  };

  const handleCompleteConfirm = async () => {
    setIsLoading('completed');
    setError(null);
    setShowCompleteModal(false);
    try {
      const res = await fetch(`/api/jobs/${job.id}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actualCost: actualCost || null,
          completionNotes: completionNotes || null,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to complete job');
      }
      setToastMessage('Job completed successfully!');
      setTimeout(() => {
        setToastMessage(null);
        router.refresh();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(null);
    }
  };

  const handleCancelConfirm = async () => {
    setShowCancelModal(false);
    setIsLoading('canceled');
    setError(null);
    try {
      const res = await fetch(`/api/jobs/${job.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'canceled', cancelReason: cancelReason || undefined, selfResolved }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to cancel job');
      }
      setToastMessage(selfResolved ? 'Issue resolved and closed.' : 'Job canceled. You can dispatch to another contractor.');
      setTimeout(() => {
        setToastMessage(null);
        router.refresh();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(null);
      setSelfResolved(false);
      setCancelReason('');
    }
  };

  const microcopy = JOB_STATUS_MICROCOPY[job.status] || '';

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Job Tracking</CardTitle>
            <div className="text-right">
              <Badge className={JOB_STATUS_COLORS[job.status] || ''}>
                {JOB_STATUS_LABELS[job.status] || job.status}
              </Badge>
              {microcopy && (
                <p className="text-xs text-muted-foreground mt-1">{microcopy}</p>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Scheduled date — prominent banner when set */}
          {job.scheduledFor && job.status !== 'completed' && job.status !== 'canceled' && (
            <div className="flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3">
              <span className="text-2xl">📅</span>
              <div>
                <p className="text-sm font-semibold text-blue-900">
                  Scheduled for <LocalTime date={job.scheduledFor} format="date" />
                </p>
                <p className="text-xs text-blue-700 mt-0.5">
                  {job.contractorName} is expected to arrive on this date
                </p>
              </div>
            </div>
          )}

          {/* No date set — prompt to set one */}
          {!job.scheduledFor && job.status === 'scheduled' && (
            <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
              <span className="text-2xl">⚠️</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-amber-900">No date set yet</p>
                <p className="text-xs text-amber-700 mt-0.5">
                  Set a specific date so you can track when {job.contractorName} is arriving
                </p>
              </div>
              <Button size="sm" onClick={() => setShowScheduleModal(true)}>
                Set Date
              </Button>
            </div>
          )}

          {/* Job details */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Contractor</label>
              <p className="text-sm font-medium">{job.contractorName}</p>
              {job.companyName && <p className="text-xs text-muted-foreground">{job.companyName}</p>}
            </div>
            {job.agreedPrice && (
              <div>
                <label className="text-xs font-medium text-muted-foreground">Agreed Price</label>
                <p className="text-sm font-medium">${Number(job.agreedPrice).toLocaleString()}</p>
              </div>
            )}
            {job.actualCost && (
              <div>
                <label className="text-xs font-medium text-muted-foreground">Actual Cost</label>
                <p className="text-sm font-medium">${Number(job.actualCost).toLocaleString()}</p>
              </div>
            )}
            {job.startedAt && (
              <div>
                <label className="text-xs font-medium text-muted-foreground">Started</label>
                <p className="text-sm"><LocalTime date={job.startedAt} format="date" /></p>
              </div>
            )}
            {job.completedAt && (
              <div>
                <label className="text-xs font-medium text-muted-foreground">Completed</label>
                <p className="text-sm"><LocalTime date={job.completedAt} format="date" /></p>
              </div>
            )}
          </div>

          {job.notes && (
            <div>
              <label className="text-xs font-medium text-muted-foreground">Notes</label>
              <p className="text-sm mt-1">{job.notes}</p>
            </div>
          )}
          {job.completionNotes && (
            <div>
              <label className="text-xs font-medium text-muted-foreground">Completion Notes</label>
              <p className="text-sm mt-1">{job.completionNotes}</p>
            </div>
          )}

          {/* Status progress bar */}
          {job.status !== 'canceled' && job.status !== 'completed' && (
            <div className="flex items-center gap-1">
              {JOB_PROGRESS_STEPS.map((step, idx) => {
                const steps = JOB_PROGRESS_STEPS;
                const currentIdx = (steps as readonly string[]).indexOf(job.status);
                const isActive = idx <= currentIdx;
                return (
                  <div
                    key={step}
                    className={`h-1.5 flex-1 rounded-full ${isActive ? 'bg-blue-500' : 'bg-gray-200'}`}
                  />
                );
              })}
            </div>
          )}

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          {/* Action buttons */}
          {job.status === 'selected' && (
            <div className="flex flex-wrap items-center gap-2">
              <Button
                size="sm"
                onClick={() => setShowScheduleModal(true)}
                disabled={isLoading !== null}
              >
                Mark as Scheduled
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleStatusChange('in_progress')}
                disabled={isLoading !== null}
              >
                {isLoading === 'in_progress' ? 'Updating...' : 'Mark In Progress'}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-red-600 hover:text-red-700"
                onClick={() => setShowCancelModal(true)}
                disabled={isLoading !== null}
              >
                Cancel Job
              </Button>
            </div>
          )}

          {job.status === 'scheduled' && (
            <div className="flex flex-wrap items-center gap-2">
              <Button
                size="sm"
                onClick={() => handleStatusChange('in_progress')}
                disabled={isLoading !== null}
              >
                {isLoading === 'in_progress' ? 'Updating...' : 'Mark In Progress'}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-red-600 hover:text-red-700"
                onClick={() => setShowCancelModal(true)}
                disabled={isLoading !== null}
              >
                Cancel Job
              </Button>
            </div>
          )}

          {job.status === 'in_progress' && (
            <div className="flex flex-wrap items-center gap-2">
              <Button
                size="sm"
                onClick={() => setShowCompleteModal(true)}
                disabled={isLoading !== null}
              >
                {isLoading === 'completed' ? 'Completing...' : 'Mark Completed'}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-red-600 hover:text-red-700"
                onClick={() => setShowCancelModal(true)}
                disabled={isLoading !== null}
              >
                Cancel Job
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Completion Modal — captures actual cost + notes */}
      {showCompleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowCompleteModal(false)}
          />
          <div className="relative z-10 w-full max-w-sm mx-4 rounded-xl bg-white p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-semibold">Mark this job complete</h3>
            <p className="text-sm text-muted-foreground">
              Record the final cost so you can track maintenance spending over time.
            </p>
            <div>
              <label htmlFor="actual-cost" className="block text-sm font-medium mb-1">Actual cost ($)</label>
              <input
                id="actual-cost"
                type="number"
                step="0.01"
                min="0"
                value={actualCost}
                onChange={(e) => setActualCost(e.target.value)}
                placeholder="e.g. 450.00"
                className="w-full rounded-lg border border-border p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {job.agreedPrice && (
                <p className="text-xs text-muted-foreground mt-1">Pre-filled from agreed quote. Adjust if the final cost was different.</p>
              )}
            </div>
            <div>
              <label htmlFor="completion-notes" className="block text-sm font-medium mb-1">Notes (optional)</label>
              <textarea
                id="completion-notes"
                value={completionNotes}
                onChange={(e) => setCompletionNotes(e.target.value)}
                placeholder="e.g. Replaced pipe and tightened fittings"
                rows={3}
                className="w-full rounded-lg border border-border p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowCompleteModal(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCompleteConfirm}>
                Save and Complete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Job Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowCancelModal(false)}
          />
          <div className="relative z-10 w-full max-w-sm mx-4 rounded-xl bg-white p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-semibold">Cancel this job?</h3>
            <p className="text-sm text-muted-foreground">
              {selfResolved
                ? 'This will close the issue as resolved and notify the contractor.'
                : `${job.contractorName} will be notified the job has been canceled. The issue will reopen so you can dispatch to someone else.`}
            </p>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={selfResolved}
                onChange={(e) => setSelfResolved(e.target.checked)}
                className="h-4 w-4 rounded"
              />
              I resolved this issue myself
            </label>
            <div>
              <label className="block text-sm font-medium mb-1">Reason (optional)</label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder={selfResolved ? 'e.g. Fixed it myself, turned out to be minor' : 'e.g. Found a cheaper option, no longer needed'}
                rows={2}
                className="w-full rounded-lg border border-border p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
              />
            </div>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => { setShowCancelModal(false); setCancelReason(''); setSelfResolved(false); }}
              >
                Keep Job
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={handleCancelConfirm}
              >
                {selfResolved ? 'Close Issue' : 'Cancel Job'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Date Picker Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowScheduleModal(false)}
          />
          <div className="relative z-10 w-full max-w-sm mx-4 rounded-xl bg-white p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-semibold">When is this scheduled?</h3>
            <p className="text-sm text-muted-foreground">
              Select the date the contractor is expected to arrive.
            </p>
            {job.contractorAvailabilityText && defaultScheduleDate && (
              <p className="text-xs text-blue-600">
                Pre-filled from contractor&apos;s availability: &ldquo;{job.contractorAvailabilityText}&rdquo;
              </p>
            )}
            <input
              type="date"
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full rounded-lg border border-border p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowScheduleModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleScheduleConfirm}
                disabled={!scheduleDate}
              >
                Confirm Schedule
              </Button>
            </div>
          </div>
        </div>
      )}

      {toastMessage && <Toast message={toastMessage} type="success" />}
    </>
  );
}
