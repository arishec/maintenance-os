'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export function RestoreButton({ contractorId }: { contractorId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleRestore(e: React.MouseEvent) {
    e.preventDefault(); // prevent card link navigation
    e.stopPropagation();
    setLoading(true);
    try {
      const res = await fetch(`/api/contractors/${contractorId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isArchived: false }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || 'Failed to restore contractor');
        return;
      }
      router.refresh();
    } catch {
      alert('Failed to restore contractor');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleRestore}
      disabled={loading}
      className="mt-2 w-full"
    >
      {loading ? 'Restoring…' : 'Restore Contractor'}
    </Button>
  );
}
