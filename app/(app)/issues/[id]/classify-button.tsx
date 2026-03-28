'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export function ClassifyButton({ issueId }: { issueId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleClassify() {
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/issues/${issueId}/classify`, {
        method: 'POST',
      });

      if (!res.ok) {
        const errData = await res.json();
        setError(errData.error || 'Classification failed');
        setLoading(false);
        return;
      }

      router.refresh();
    } catch {
      setError('Classification failed. Check your API key.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Button onClick={handleClassify} disabled={loading}>
        {loading ? 'Classifying...' : 'Classify with AI'}
      </Button>
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
