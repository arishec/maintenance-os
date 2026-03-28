'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface SelectContractorButtonProps {
  issueId: string;
  responseId: string;
  contractorId: string;
}

export function SelectContractorButton({
  issueId,
  responseId,
  contractorId,
}: SelectContractorButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelect = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/issues/${issueId}/select-contractor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contractorId,
          responseId,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to select contractor');
      }

      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Button
        size="default"
        variant="secondary"
        onClick={handleSelect}
        disabled={isLoading}
      >
        {isLoading ? 'Selecting...' : 'Select'}
      </Button>
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
