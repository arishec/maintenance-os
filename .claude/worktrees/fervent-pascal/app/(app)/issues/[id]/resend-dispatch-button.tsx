'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Toast } from '@/components/ui/toast';

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

  return (
    <>
      <Button
        size="sm"
        variant="ghost"
        className="text-xs h-7 px-2"
        onClick={handleResend}
        disabled={isLoading || status === 'success'}
        title={`Resend to ${contractorName}`}
      >
        {isLoading ? 'Sending...' : status === 'success' ? 'Resent!' : 'Resend'}
      </Button>
      {status === 'success' && <Toast message={`Request resent to ${contractorName}`} type="success" />}
      {status === 'error' && <Toast message="Failed to resend request" type="error" />}
    </>
  );
}
