'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Toast } from '@/components/ui/toast';

interface ExtractedData {
  totalAmount: number | null;
  vendorName: string | null;
  date: string | null;
  description: string | null;
}

interface DocumentExtractionProps {
  attachmentId: string;
  fileName: string;
  mimeType: string;
  issueId: string;
  jobId?: string | null;
}

export function DocumentExtraction({
  attachmentId,
  fileName,
  mimeType,
  issueId,
  jobId,
}: DocumentExtractionProps) {
  const router = useRouter();
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const isExtractable = mimeType === 'application/pdf' || mimeType.startsWith('image/');

  const handleExtract = async () => {
    setIsExtracting(true);
    setError(null);

    try {
      const res = await fetch(`/api/issues/${issueId}/extract-document`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attachmentId }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Extraction failed');
      }

      const result = await res.json();
      setExtractedData(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Extraction failed');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleApplyToJob = async () => {
    if (!jobId || !extractedData?.totalAmount) {
      setError('No job selected or no amount to apply');
      return;
    }

    setIsApplying(true);
    setError(null);

    try {
      const res = await fetch(`/api/jobs/${jobId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actualCost: extractedData.totalAmount }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update job cost');
      }

      setToastMessage(`Applied $${extractedData.totalAmount.toLocaleString()} to job cost`);
      setTimeout(() => {
        setToastMessage(null);
        router.refresh();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to apply cost');
    } finally {
      setIsApplying(false);
    }
  };

  if (!isExtractable) {
    return null;
  }

  // Show extraction results
  if (extractedData) {
    return (
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-900">Extracted Invoice Details</p>
            <p className="text-xs text-blue-700 mt-0.5">From: {fileName}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 bg-white rounded p-3">
          {extractedData.totalAmount !== null && (
            <div>
              <label className="text-xs font-medium text-muted-foreground">Total Amount</label>
              <p className="text-lg font-bold text-blue-600">
                ${extractedData.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
          )}
          {extractedData.vendorName && (
            <div>
              <label className="text-xs font-medium text-muted-foreground">Vendor</label>
              <p className="text-sm font-medium">{extractedData.vendorName}</p>
            </div>
          )}
          {extractedData.date && (
            <div>
              <label className="text-xs font-medium text-muted-foreground">Date</label>
              <p className="text-sm">{new Date(extractedData.date).toLocaleDateString()}</p>
            </div>
          )}
          {extractedData.description && (
            <div className="col-span-2">
              <label className="text-xs font-medium text-muted-foreground">Description</label>
              <p className="text-sm">{extractedData.description}</p>
            </div>
          )}
        </div>

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 p-2">
            <p className="text-xs text-red-700">{error}</p>
          </div>
        )}

        <div className="flex gap-2">
          {jobId && extractedData.totalAmount ? (
            <Button
              size="sm"
              onClick={handleApplyToJob}
              disabled={isApplying}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isApplying ? 'Applying...' : 'Apply to Job Cost'}
            </Button>
          ) : (
            <p className="text-xs text-muted-foreground">No active job to apply cost to</p>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={() => setExtractedData(null)}
          >
            Clear
          </Button>
        </div>

        {toastMessage && <Toast message={toastMessage} type="success" />}
      </div>
    );
  }

  // Show extraction button
  return (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        variant="outline"
        onClick={handleExtract}
        disabled={isExtracting}
        className="text-xs"
      >
        {isExtracting ? 'Extracting...' : '📄 Extract Details'}
      </Button>
      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}
