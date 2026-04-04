'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PhotoUpload } from '@/components/photo-upload';

interface PhotoUploadButtonProps {
  issueId: string;
}

export function PhotoUploadButton({ issueId }: PhotoUploadButtonProps) {
  const router = useRouter();
  const [error, setError] = useState('');

  const handleUploadComplete = () => {
    setError('');
    router.refresh();
  };

  return (
    <div className="space-y-3">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <PhotoUpload
        issueId={issueId}
        onUploadComplete={handleUploadComplete}
        onError={setError}
      />
    </div>
  );
}
