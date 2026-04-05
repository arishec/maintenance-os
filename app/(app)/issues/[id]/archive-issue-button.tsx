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
import { Toast } from '@/components/ui/toast';

export function ArchiveIssueButton({ issueId, issueStatus }: { issueId: string; issueStatus: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Only show on completed or canceled issues
  if (!['completed', 'canceled'].includes(issueStatus)) return null;

  async function handleArchive() {
    setLoading(true);
    try {
      const res = await fetch(`/api/issues/${issueId}/archive`, {
        method: 'POST',
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setToast({ message: data.error || 'Failed to archive issue', type: 'error' });
        setTimeout(() => setToast(null), 3000);
        setLoading(false);
        return;
      }
      setToast({ message: 'Issue archived', type: 'success' });
      setTimeout(() => setToast(null), 3000);
      router.refresh();
      setOpen(false);
    } catch {
      setToast({ message: 'Failed to archive issue', type: 'error' });
      setTimeout(() => setToast(null), 3000);
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
      >
        Archive
      </button>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogTitle>Archive this issue?</AlertDialogTitle>
          <AlertDialogDescription>
            Archived issues are moved out of your main view. You can still find them under the Archived tab on the Issues page.
          </AlertDialogDescription>

          <div className="flex gap-2 justify-end mt-4">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleArchive}
              disabled={loading}
              className="bg-slate-600 hover:bg-slate-700"
            >
              {loading ? 'Archiving...' : 'Archive Issue'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
      {toast && <Toast message={toast.message} type={toast.type} />}
    </>
  );
}
