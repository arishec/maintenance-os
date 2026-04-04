'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';

export function ArchiveButton({ contractorId }: { contractorId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleArchive() {
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`/api/contractors/${contractorId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to archive contractor.');
        setLoading(false);
        setShowConfirm(false);
        return;
      }

      router.push('/contractors');
      router.refresh();
    } catch {
      setError('An error occurred. Please try again.');
      setLoading(false);
      setShowConfirm(false);
    }
  }

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setShowConfirm(true)}
        disabled={loading}
        className="text-red-600 hover:text-red-700 hover:bg-red-50"
      >
        {loading ? 'Archiving...' : 'Archive'}
      </Button>
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 mt-2">
          {error}
        </div>
      )}
      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogTitle>Archive this contractor?</AlertDialogTitle>
          <AlertDialogDescription>
            This contractor will be moved to your archived list. You can restore them later if needed.
          </AlertDialogDescription>
          <div className="flex justify-end gap-3 mt-4">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleArchive}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Archive
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
