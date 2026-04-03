'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Attachment {
  id: string;
  fileName: string;
  fileUrl: string | null;
  fileSize: number;
  mimeType: string;
  label: string | null;
  createdAt: string;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileIcon(mimeType: string): string {
  if (mimeType.startsWith('image/')) return '🖼️';
  if (mimeType === 'application/pdf') return '📄';
  if (mimeType.includes('word') || mimeType.includes('document')) return '📝';
  if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return '📊';
  if (mimeType === 'text/csv') return '📊';
  if (mimeType === 'text/plain') return '📃';
  return '📎';
}

export function AttachmentsSection({
  issueId,
  attachments: initialAttachments,
  isClosedIssue,
}: {
  issueId: string;
  attachments: Attachment[];
  isClosedIssue: boolean;
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachments, setAttachments] = useState<Attachment[]>(initialAttachments);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`/api/issues/${issueId}/attachments`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Upload failed.');
        return;
      }

      setAttachments((prev) => [data.attachment, ...prev]);
      router.refresh();
    } catch {
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      // Reset file input so re-selecting the same file triggers onChange
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  async function handleDelete(attachmentId: string, fileName: string) {
    if (!confirm(`Remove "${fileName}"? This can't be undone.`)) return;

    setError(null);
    setDeleting(attachmentId);

    try {
      const res = await fetch(`/api/issues/${issueId}/attachments/${attachmentId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Delete failed.');
        return;
      }

      setAttachments((prev) => prev.filter((a) => a.id !== attachmentId));
      router.refresh();
    } catch {
      setError('Delete failed. Please try again.');
    } finally {
      setDeleting(null);
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Documents</CardTitle>
          <>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.csv,.jpg,.jpeg,.png,.gif,.webp,.heic,.heif"
              onChange={handleUpload}
              disabled={uploading}
            />
            <Button
              size="sm"
              variant="outline"
              className="text-xs"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? 'Uploading…' : '+ Upload'}
            </Button>
          </>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 mb-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {attachments.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No documents uploaded yet. Upload PDFs, photos, reports, or other files related to this issue.
          </p>
        ) : (
          <div className="space-y-2">
            {attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-border p-3"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span className="text-lg flex-shrink-0">{getFileIcon(attachment.mimeType)}</span>
                  <div className="min-w-0 flex-1">
                    {attachment.fileUrl ? (
                      <a
                        href={attachment.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium hover:underline truncate block"
                      >
                        {attachment.label || attachment.fileName}
                      </a>
                    ) : (
                      <p className="text-sm font-medium truncate">
                        {attachment.label || attachment.fileName}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(attachment.fileSize)}
                      {attachment.label && attachment.label !== attachment.fileName && (
                        <span className="ml-2">{attachment.fileName}</span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {attachment.fileUrl && (
                    <a
                      href={attachment.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      View
                    </a>
                  )}
                  {attachment.fileUrl && (
                    <a
                      href={`${attachment.fileUrl}?download=`}
                      download={attachment.fileName}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      Download
                    </a>
                  )}
                  {(
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 min-h-[44px] min-w-[44px] px-2"
                      onClick={() => handleDelete(attachment.id, attachment.fileName)}
                      disabled={deleting === attachment.id}
                    >
                      {deleting === attachment.id ? 'Removing…' : 'Remove'}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
