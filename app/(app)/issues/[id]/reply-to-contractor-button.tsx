'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface ReplyToContractorButtonProps {
  issueId: string;
  contractorId: string;
  contractorResponseId?: string;
  contractorName: string;
  contractorEmail?: string | null;
  contractorPhone?: string | null;
  dispatchChannel: string;
  issueTitle: string;
  hasExistingReply?: boolean;
}

export function ReplyToContractorButton({
  issueId,
  contractorId,
  contractorResponseId,
  contractorName,
  contractorEmail,
  contractorPhone,
  dispatchChannel,
  issueTitle,
  hasExistingReply = false,
}: ReplyToContractorButtonProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [channel, setChannel] = useState<'email' | 'sms'>(
    dispatchChannel === 'sms' && contractorPhone ? 'sms' : 'email'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const canEmail = !!contractorEmail;
  const canSms = !!contractorPhone;

  const handleSend = async () => {
    if (!message.trim()) return;
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/issues/${issueId}/reply-to-contractor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: message.trim(),
          channel,
          contractorId,
          contractorResponseId,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to send reply');
      }

      setSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        setMessage('');
        setSuccess(false);
        router.refresh();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        onClick={() => setIsOpen(true)}
      >
        {hasExistingReply ? 'Reply again' : 'Reply'}
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => !isLoading && setIsOpen(false)}
          />
          <div className="relative z-10 w-full max-w-md mx-4 rounded-xl bg-white p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-semibold">Reply to {contractorName}</h3>
            <p className="text-xs text-muted-foreground">Re: {issueTitle}</p>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="w-full h-32 rounded-lg border border-border p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading || success}
            />

            {/* Channel selector */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Send via:</span>
              {!canEmail && !canSms && (
                <span className="text-sm text-amber-600">No contact method available for this contractor</span>
              )}
              {canEmail && (
                <button
                  type="button"
                  onClick={() => setChannel('email')}
                  className={`px-3 py-1.5 rounded-lg text-sm border ${
                    channel === 'email'
                      ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium'
                      : 'border-border text-muted-foreground hover:bg-muted'
                  }`}
                >
                  Email
                </button>
              )}
              {canSms && (
                <button
                  type="button"
                  onClick={() => setChannel('sms')}
                  className={`px-3 py-1.5 rounded-lg text-sm border ${
                    channel === 'sms'
                      ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium'
                      : 'border-border text-muted-foreground hover:bg-muted'
                  }`}
                >
                  SMS
                </button>
              )}
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}
            {success && <p className="text-sm text-green-600">Message sent!</p>}

            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSend}
                disabled={isLoading || !message.trim() || success}
              >
                {isLoading ? 'Sending...' : 'Send Reply'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
