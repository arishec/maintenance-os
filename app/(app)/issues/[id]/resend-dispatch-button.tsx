'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface ResendDispatchButtonProps {
  issueId: string;
  dispatchId: string;
  contractorName: string;
}

export function ResendDispatchButton({ issueId, dispatchId, contractorName }: ResendDispatchButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleResend = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/issues/${issueId}/resend-dispatch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dispatchId }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to resend');
      }

      setStatus('success');
      setTimeout(() => {
        setStatus('idle');
        router.refresh();
      }, 1500);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 2000);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'success') {
    return <span className="text-xs text-green-600">Resent!</span>;
  }

  if (status === 'error') {
    return <span className="text-xs text-red-600">Failed</span>;
  }

  return (
    <Button
      size="sm"
      variant="ghost"
      className="text-xs h-7 px-2"
      onClick={handleResend}
      disabled={isLoading}
      title={`Resend to ${contractorName}`}
    >
      {isLoading ? 'Sending...' : 'Resend'}
    </Button>
  );
}
