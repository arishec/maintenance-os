'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { Toast } from '@/components/ui/toast';

export function CloseIssueButton({ issueId, issueStatus }: { issueId: string; issueStatus: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [selfResolved, setSelfResolved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'error' } | null>(null);

  // Don't show on already closed/completed issues
  if (['completed', 'canceled', 'archived'].includes(issueStatus)) return null;

  async function handleClose() {
    setLoading(true);
    try {
      const res = await fetch(`/api/issues/${issueId}/close`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reason: reason.trim() || undefined,
          selfResolved,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setToast({ message: data.error || 'Failed to close issue', type: 'error' });
        setTimeout(() => setToast(null), 3000);
        setLoading(false);
        return;
      }
      router.refresh();
      setOpen(false);
    } catch {
      setToast({ message: 'Failed to close issue', type: 'error' });
      setTimeout(() => setToast(null), 3000);
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center rounded-full border border-red-200 bg-white px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
      >
        Close Issue
      </button>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogTitle>Close this issue?</AlertDialogTitle>
          <AlertDialogDescription>
            {selfResolved
              ? 'This will mark the issue as resolved. Any pending contractor requests will be ignored.'
              : 'This will cancel the issue. Any pending contractor requests will be ignored.'}
          </AlertDialogDescription>

          <div className="space-y-3 mt-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="self-resolved"
                checked={selfResolved}
                onChange={(e) => setSelfResolved(e.target.checked)}
                className="h-5 w-5 rounded border-border"
              />
              <label htmlFor="self-resolved" className="text-sm">I resolved this myself</label>
            </div>

            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={selfResolved ? 'How did you resolve it? (optional)' : 'Reason for closing (optional)'}
              rows={2}
            />
          </div>

          <div className="flex gap-2 justify-end mt-4">
            <AlertDialogCancel>Keep Open</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClose}
              disabled={loading}
              className={selfResolved ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
            >
              {loading ? 'Closing...' : selfResolved ? 'Mark Resolved' : 'Close Issue'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
      {toast && <Toast message={toast.message} type={toast.type} />}
    </>
  );
}
