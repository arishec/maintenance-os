'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Toast } from '@/components/ui/toast';

interface Contractor {
  id: string;
  name: string;
  companyName?: string | null;
}

interface ManualQuoteButtonProps {
  issueId: string;
  existingContractors?: Contractor[];
}

export function ManualQuoteButton({ issueId, existingContractors = [] }: ManualQuoteButtonProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [contractors, setContractors] = useState<Contractor[]>(existingContractors);
  const [selectedContractorId, setSelectedContractorId] = useState('');
  const [flatEstimate, setFlatEstimate] = useState('');
  const [availabilityText, setAvailabilityText] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Fetch contractors if not provided
  useEffect(() => {
    if (isOpen && contractors.length === 0) {
      fetch('/api/contractors')
        .then(r => r.json())
        .then(data => {
          if (data.contractors) setContractors(data.contractors);
        })
        .catch(() => {});
    }
  }, [isOpen, contractors.length]);

  const handleSubmit = async () => {
    if (!selectedContractorId) return;
    setIsLoading(true);
    setError(null);

    try {
      const payload: Record<string, unknown> = {
        contractorId: selectedContractorId,
      };

      if (flatEstimate) payload.flatEstimate = parseFloat(flatEstimate);
      if (availabilityText.trim()) payload.availabilityText = availabilityText.trim();
      if (notes.trim()) payload.notes = notes.trim();

      const res = await fetch(`/api/issues/${issueId}/manual-quote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to add quote');
      }

      setSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        resetForm();
        router.refresh();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedContractorId('');
    setFlatEstimate('');
    setAvailabilityText('');
    setNotes('');
    setError(null);
    setSuccess(false);
  };

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        onClick={() => setIsOpen(true)}
      >
        Add quote manually
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => !isLoading && (setIsOpen(false), resetForm())}
          />
          <div className="relative z-10 w-full max-w-md mx-4 rounded-xl bg-white p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-semibold">Add Quote Manually</h3>
            <p className="text-xs text-muted-foreground">
              Record a quote received by phone, text, or in person.
            </p>

            {/* Contractor select */}
            <div>
              <label className="text-sm font-medium">Contractor</label>
              <select
                value={selectedContractorId}
                onChange={(e) => setSelectedContractorId(e.target.value)}
                className="mt-1 w-full rounded-lg border border-border p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading || success}
              >
                <option value="">Select contractor...</option>
                {contractors.length === 0 && (
                  <option value="" disabled>No contractors yet — add one first</option>
                )}
                {contractors.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}{c.companyName ? ` — ${c.companyName}` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="text-sm font-medium">Quote amount ($)</label>
              <input
                type="number"
                value={flatEstimate}
                onChange={(e) => setFlatEstimate(e.target.value)}
                placeholder="e.g. 365"
                className="mt-1 w-full rounded-lg border border-border p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading || success}
              />
            </div>

            {/* Availability */}
            <div>
              <label className="text-sm font-medium">Availability</label>
              <input
                type="text"
                value={availabilityText}
                onChange={(e) => setAvailabilityText(e.target.value)}
                placeholder="e.g. Monday, next week"
                className="mt-1 w-full rounded-lg border border-border p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading || success}
              />
            </div>

            {/* Notes */}
            <div>
              <label className="text-sm font-medium">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Anything else they said..."
                className="mt-1 w-full h-20 rounded-lg border border-border p-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading || success}
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}
            {success && <p className="text-sm text-green-600">Quote added successfully!</p>}

            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => { setIsOpen(false); resetForm(); }}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isLoading || !selectedContractorId || success}
              >
                {isLoading ? 'Saving...' : 'Add Quote'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {success && <Toast message="Quote added successfully!" type="success" />}
    </>
  );
}
