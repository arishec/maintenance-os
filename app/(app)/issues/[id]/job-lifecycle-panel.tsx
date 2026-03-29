'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
}

export function JobLifecyclePanel({ job }: { job: JobProps }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [actualCost, setActualCost] = useState('');
  const [completionNotes, setCompletionNotes] = useState('');

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

      router.refresh();
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
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(null);
    }
  };

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this job?')) return;
    await handleStatusChange('canceled');
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
            {job.scheduledFor && (
              <div>
                <label className="text-xs font-medium text-muted-foreground">Scheduled For</label>
                <p className="text-sm">{new Date(job.scheduledFor).toLocaleDateString()}</p>
              </div>
            )}
            {job.startedAt && (
              <div>
                <label className="text-xs font-medium text-muted-foreground">Started</label>
                <p className="text-sm">{new Date(job.startedAt).toLocaleDateString()}</p>
              </div>
            )}
            {job.completedAt && (
              <div>
                <label className="text-xs font-medium text-muted-foreground">Completed</label>
                <p className="text-sm">{new Date(job.completedAt).toLocaleDateString()}</p>
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
                onClick={handleCancel}
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
                onClick={handleCancel}
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
                onClick={handleCancel}
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
              <label className="block text-sm font-medium mb-1">Actual cost ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={actualCost}
                onChange={(e) => setActualCost(e.target.value)}
                placeholder="e.g. 450.00"
                className="w-full rounded-lg border border-border p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Notes (optional)</label>
              <textarea
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
    </>
  );
}
