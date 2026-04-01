'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { X, Camera, ImagePlus } from 'lucide-react';
import { compressImage } from '@/lib/compress-image';

interface SelectedFile {
  id: string;
  file: File;
  preview: string;
}

interface PhotoUploadProps {
  issueId: string;
  onUploadComplete?: () => void;
  onError?: (error: string) => void;
  multiple?: boolean;
}

export function PhotoUpload({
  issueId,
  onUploadComplete,
  onError,
  multiple = true,
}: PhotoUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const files = Array.from(e.target.files || []);

      const newFiles: SelectedFile[] = files.map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        preview: URL.createObjectURL(file),
      }));

      if (multiple) {
        setSelectedFiles([...selectedFiles, ...newFiles]);
      } else {
        selectedFiles.forEach((f) => URL.revokeObjectURL(f.preview));
        setSelectedFiles(newFiles);
      }

      // Reset inputs so same file can be selected again
      if (cameraInputRef.current) cameraInputRef.current.value = '';
      if (galleryInputRef.current) galleryInputRef.current.value = '';
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to select photo';
      if (onError) onError(msg);
    }
  };

  const removeFile = (id: string) => {
    setSelectedFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter((f) => f.id !== id);
    });
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      return;
    }

    setUploading(true);
    let uploadError: string | null = null;

    try {
      for (const { id, file } of selectedFiles) {
        try {
          setUploadProgress((prev) => ({ ...prev, [id]: 0 }));

          // Compress image to fit within Vercel's 4.5MB body limit
          const compressed = await compressImage(file);

          const formData = new FormData();
          formData.append('file', compressed);

          const response = await fetch(`/api/issues/${issueId}/photos`, {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            // Handle non-JSON error responses (e.g. Vercel 413 HTML page)
            const contentType = response.headers.get('content-type') || '';
            if (contentType.includes('application/json')) {
              const data = await response.json();
              throw new Error(data.error || 'Upload failed');
            } else {
              throw new Error(
                response.status === 413
                  ? 'Photo is too large. Please try a smaller photo.'
                  : `Upload failed (${response.status}). Please try again.`
              );
            }
          }

          setUploadProgress((prev) => ({ ...prev, [id]: 100 }));
        } catch (err) {
          const errorMsg = err instanceof Error ? err.message : 'Upload failed. Please try again.';
          uploadError = errorMsg;
          setUploadProgress((prev) => ({ ...prev, [id]: -1 }));
        }
      }

      if (!uploadError) {
        setSelectedFiles([]);
        setUploadProgress({});
        if (onUploadComplete) {
          onUploadComplete();
        }
      } else {
        if (onError) {
          onError(uploadError);
        }
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Hidden file inputs */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
      />
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Take Photo + Gallery buttons */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => cameraInputRef.current?.click()}
          disabled={uploading}
          className="flex-1"
        >
          <Camera className="mr-2 h-4 w-4" />
          Take Photo
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => galleryInputRef.current?.click()}
          disabled={uploading}
          className="flex-1"
        >
          <ImagePlus className="mr-2 h-4 w-4" />
          Gallery
        </Button>
      </div>

      {selectedFiles.length > 0 && (
        <>
          <div className="grid grid-cols-3 gap-2">
            {selectedFiles.map(({ id, preview, file }) => {
              const progress = uploadProgress[id];
              const isUploading = uploading && progress !== undefined && progress !== 100;
              const hasFailed = progress === -1;

              return (
                <div key={id} className="relative">
                  <div className="relative h-24 w-full overflow-hidden rounded-lg bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={preview}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                    {isUploading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <div className="text-center text-sm text-white">
                          {progress}%
                        </div>
                      </div>
                    )}
                    {hasFailed && (
                      <div className="absolute inset-0 flex items-center justify-center bg-red-500/50">
                        <div className="text-center text-sm text-white">
                          Failed
                        </div>
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(id)}
                    disabled={uploading}
                    className="absolute -right-1.5 -top-1.5 rounded-full bg-red-500 p-0.5 text-white hover:bg-red-600 disabled:opacity-50"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })}
          </div>

          <Button
            type="button"
            onClick={handleUpload}
            disabled={uploading || selectedFiles.length === 0}
            className="w-full"
          >
            {uploading ? 'Uploading...' : `Upload ${selectedFiles.length} Photo${selectedFiles.length !== 1 ? 's' : ''}`}
          </Button>
        </>
      )}
    </div>
  );
}
