'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export function ArchiveButton({ contractorId }: { contractorId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleArchive() {
    if (!window.confirm('Are you sure you want to archive this contractor?')) {
      return;
    }

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
        return;
      }

      router.push('/contractors');
      router.refresh();
    } catch (err) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  }

  return (
    <>
      <Button
        variant="outline"
        onClick={handleArchive}
        disabled={loading}
        className="text-red-600 hover:text-red-700 hover:bg-red-50"
      >
        {loading ? 'Archiving...' : 'Archive'}
      </Button>
      {error && (
        <div className="absolute top-4 right-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
    </>
  );
}
