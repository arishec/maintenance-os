'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { X } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { PhotoUploadButton } from './photo-upload-button';
import { Toast } from '@/components/ui/toast';

interface Photo {
  id: string;
  signedUrl: string | null;
  aiDescription?: string | null;
}

interface PhotosSectionProps {
  issueId: string;
  photos: Photo[];
}

export function PhotosSection({ issueId, photos: initialPhotos }: PhotosSectionProps) {
  const router = useRouter();
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos);

  // Sync local state when server re-renders with new photos (e.g. after upload + router.refresh)
  useEffect(() => {
    setPhotos(initialPhotos);
  }, [initialPhotos]);
  const [photoToDelete, setPhotoToDelete] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDeletePhotoClick = (photoId: string) => {
    setPhotoToDelete(photoId);
    setShowDeleteDialog(true);
  };

  const confirmDeletePhoto = async () => {
    if (!photoToDelete) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/issues/${issueId}/photos/${photoToDelete}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError((data as { error?: string }).error || 'Failed to delete photo');
        setDeleting(false);
        return;
      }

      setPhotos((prev) => prev.filter((p) => p.id !== photoToDelete));
      setShowDeleteDialog(false);
      setPhotoToDelete(null);
      setDeleting(false);
      router.refresh();
    } catch {
      setError('An error occurred. Please try again.');
      setDeleting(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Photos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {photos.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {photos.map((photo) => (
                <div key={photo.id} className="space-y-1">
                  <div className="relative h-32 sm:h-48 w-full overflow-hidden rounded-xl bg-muted group">
                    <Image
                      src={photo.signedUrl || ''}
                      alt="Issue photo"
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, 33vw"
                      loading="lazy"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeletePhotoClick(photo.id)}
                      disabled={deleting}
                      className="absolute -right-1.5 -top-1.5 rounded-full bg-red-500 p-0.5 text-white shadow-sm hover:bg-red-600 disabled:opacity-50 transition-opacity"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  {photo.aiDescription && (
                    <p className="text-xs text-muted-foreground leading-snug px-1">
                      <span className="font-medium text-foreground">AI:</span> {photo.aiDescription}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
          {photos.length === 0 && (
            <p className="text-sm text-muted-foreground">No photos yet. Add some to help document the issue.</p>
          )}
          <PhotoUploadButton issueId={issueId} />
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete photo?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this photo? This action cannot be undone.
          </AlertDialogDescription>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeletePhoto} disabled={deleting} className="bg-red-600 hover:bg-red-700">
              {deleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
      {error && <Toast message={error} type="error" />}
    </>
  );
}
