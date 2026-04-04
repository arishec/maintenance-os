'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Toast } from '@/components/ui/toast';

interface SelectContractorButtonProps {
  issueId: string;
  responseId: string;
  contractorId: string;
  contractorName: string;
  companyName?: string | null;
  price?: string | null;
  availability?: string | null;
}

export function SelectContractorButton({
  issueId,
  responseId,
  contractorName,
  companyName,
  price,
  availability,
}: SelectContractorButtonProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/issues/${issueId}/select-contractor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ responseId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to select contractor');
      }

      setIsOpen(false);
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        router.refresh();
      }, 2000);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button size="sm" onClick={() => setIsOpen(true)}>
        Select Contractor
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => !isLoading && setIsOpen(false)}
          />

          {/* Modal */}
          <div className="relative z-10 w-full max-w-md mx-4 rounded-xl bg-white p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-semibold">
              Hire {contractorName}?
            </h3>
            <p className="text-sm text-muted-foreground">
              This will mark {contractorName} as the selected contractor for this issue and start the job workflow.
            </p>

            {(price || availability) && (
              <div className="rounded-lg bg-muted/50 p-3 space-y-1 text-sm">
                {price && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Quote</span>
                    <span className="font-medium">${Number(price).toLocaleString()}</span>
                  </div>
                )}
                {availability && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Availability</span>
                    <span className="font-medium">{availability}</span>
                  </div>
                )}
                {companyName && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Company</span>
                    <span className="font-medium">{companyName}</span>
                  </div>
                )}
              </div>
            )}

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={isLoading}
              >
                {isLoading ? 'Confirming...' : 'Confirm Selection'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Success toast */}
      {showToast && <Toast message={`${contractorName} selected. Job started.`} type="success" />}
    </>
  );
}
