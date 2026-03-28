'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface JobProps {
  id: string;
  status: string;
  contractorName: string;
  companyName?: string | null;
  agreedPrice?: string | null;
  scheduledFor?: string | null;
  startedAt?: string | null;
  completedAt?: string | null;
  notes?: string | null;
}

const JOB_STATUS_LABELS: Record<string, string> = {
  contractor_selected: 'Contractor Selected',
  scheduled: 'Scheduled',
  in_progress: 'In Progress',
  completed: 'Completed',
  canceled: 'Canceled',
};

const JOB_STATUS_COLORS: Record<string, string> = {
  contractor_selected: 'bg-blue-100 text-blue-800',
  scheduled: 'bg-indigo-100 text-indigo-800',
  in_progress: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  canceled: 'bg-gray-100 text-gray-600',
};

// Allowed transitions
const NEXT_ACTIONS: Record<string, { label: string; nextStatus: string }[]> = {
  contractor_selected: [
    { label: 'Mark as Scheduled', nextStatus: 'scheduled' },
    { label: 'Mark In Progress', nextStatus: 'in_progress' },
  ],
  scheduled: [
    { label: 'Mark In Progress', nextStatus: 'in_progress' },
  ],
  in_progress: [
    { label: 'Mark Completed', nextStatus: 'completed' },
  ],
};

export function JobLifecyclePanel({ job }: { job: JobProps }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const actions = NEXT_ACTIONS[job.status] || [];

  const handleStatusChange = async (nextStatus: string) => {
    setIsLoading(nextStatus);
    setError(null);

    try {
      const res = await fetch(`/api/jobs/${job.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
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

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this job?')) return;
    await handleStatusChange('canceled');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Job Tracking</CardTitle>
          <Badge className={JOB_STATUS_COLORS[job.status] || ''}>
            {JOB_STATUS_LABELS[job.status] || job.status}
          </Badge>
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

        {/* Status progress bar */}
        {job.status !== 'canceled' && job.status !== 'completed' && (
          <div className="flex items-center gap-1">
            {['contractor_selected', 'scheduled', 'in_progress', 'completed'].map((step, idx) => {
              const steps = ['contractor_selected', 'scheduled', 'in_progress', 'completed'];
              const currentIdx = steps.indexOf(job.status);
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
        {actions.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {actions.map((action) => (
              <Button
                key={action.nextStatus}
                size="sm"
                onClick={() => handleStatusChange(action.nextStatus)}
                disabled={isLoading !== null}
              >
                {isLoading === action.nextStatus ? 'Updating...' : action.label}
              </Button>
            ))}
            {job.status !== 'completed' && (
              <Button
                size="sm"
                variant="outline"
                className="text-red-600 hover:text-red-700"
                onClick={handleCancel}
                disabled={isLoading !== null}
              >
                Cancel Job
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
