'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Select } from '@/components/ui/select';

interface Contractor {
  id: string;
  name: string;
  companyName?: string | null;
}

interface PropertyDetailClientProps {
  propertyId: string;
  contractorId?: string;
  action?: 'delete' | 'unlink' | 'addContractor' | 'intakeLink';
  availableContractors?: Contractor[];
  hasIntakeLink?: boolean;
}

export function PropertyDetailClient({
  propertyId,
  contractorId,
  action = 'delete',
  availableContractors = [],
  hasIntakeLink = false,
}: PropertyDetailClientProps) {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showUnlinkDialog, setShowUnlinkDialog] = useState(false);
  const [showIntakeLinkDialog, setShowIntakeLinkDialog] = useState(false);
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [intakeLink, setIntakeLink] = useState<string | null>(null);
  const [intakeLinkError, setIntakeLinkError] = useState('');
  const [selectedContractor, setSelectedContractor] = useState<string>('');
  const [addingContractor, setAddingContractor] = useState(false);

  async function handleDelete() {
    setLoading(true);
    try {
      const res = await fetch(`/api/properties/${propertyId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || 'Failed to delete property');
        setLoading(false);
        return;
      }

      router.push('/properties');
      router.refresh();
    } catch (error) {
      alert('An error occurred. Please try again.');
      setLoading(false);
    }
  }

  async function handleUnlink() {
    if (!contractorId) return;

    setLoading(true);
    try {
      const res = await fetch(
        `/api/properties/${propertyId}/contractors/${contractorId}`,
        {
          method: 'DELETE',
        }
      );

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || 'Failed to unlink contractor');
        setLoading(false);
        return;
      }

      router.refresh();
      setShowUnlinkDialog(false);
    } catch (error) {
      alert('An error occurred. Please try again.');
      setLoading(false);
    }
  }

  async function handleAddContractor() {
    if (!selectedContractor) return;

    setAddingContractor(true);
    try {
      const res = await fetch(
        `/api/properties/${propertyId}/contractors`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contractorId: selectedContractor }),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || 'Failed to link contractor');
        setAddingContractor(false);
        return;
      }

      setSelectedContractor('');
      router.refresh();
      setAddingContractor(false);
    } catch (error) {
      alert('An error occurred. Please try again.');
      setAddingContractor(false);
    }
  }

  async function handleGenerateIntakeLink() {
    setLoading(true);
    setIntakeLinkError('');
    try {
      const res = await fetch(
        `/api/properties/${propertyId}/intake-link`,
        {
          method: 'POST',
        }
      );

      if (!res.ok) {
        const data = await res.json();
        setIntakeLinkError(data.error || 'Failed to generate intake link');
        setLoading(false);
        return;
      }

      const data = await res.json();
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      const fullLink = `${baseUrl}/intake/${data.token}`;
      setIntakeLink(fullLink);
      setShowIntakeLinkDialog(true);
      setLoading(false);
      router.refresh();
    } catch (error) {
      setIntakeLinkError('An error occurred. Please try again.');
      setLoading(false);
    }
  }

  async function handleDeactivateIntakeLink() {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/properties/${propertyId}/intake-link`,
        {
          method: 'DELETE',
        }
      );

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || 'Failed to deactivate link');
        setLoading(false);
        return;
      }

      setShowDeactivateDialog(false);
      router.refresh();
    } catch (error) {
      alert('An error occurred. Please try again.');
      setLoading(false);
    }
  }

  function copyToClipboard() {
    if (intakeLink) {
      navigator.clipboard.writeText(intakeLink);
      alert('Link copied to clipboard!');
    }
  }

  if (action === 'delete') {
    return (
      <>
        <Button
          variant="destructive"
          onClick={() => setShowDeleteDialog(true)}
          disabled={loading}
        >
          Delete
        </Button>

        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogTitle>Delete Property</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this property? This action cannot be undone.
            </AlertDialogDescription>
            <div className="flex gap-3 justify-end">
              <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={loading}
                className="bg-red-600 hover:bg-red-700"
              >
                {loading ? 'Deleting...' : 'Delete'}
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }

  if (action === 'unlink') {
    return (
      <>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowUnlinkDialog(true)}
          disabled={loading}
        >
          Remove
        </Button>

        <AlertDialog open={showUnlinkDialog} onOpenChange={setShowUnlinkDialog}>
          <AlertDialogContent>
            <AlertDialogTitle>Unlink Contractor</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this contractor from this property?
            </AlertDialogDescription>
            <div className="flex gap-3 justify-end">
              <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleUnlink}
                disabled={loading}
              >
                {loading ? 'Removing...' : 'Remove'}
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }

  if (action === 'addContractor') {
    return (
      <div className="flex gap-2">
        <Select
          value={selectedContractor}
          onChange={(e) => setSelectedContractor(e.target.value)}
          className="flex-1"
        >
          <option value="" disabled>
            Select a contractor
          </option>
          {availableContractors.map((contractor) => (
            <option key={contractor.id} value={contractor.id}>
              {contractor.name}
            </option>
          ))}
        </Select>
        <Button
          onClick={handleAddContractor}
          disabled={!selectedContractor || addingContractor}
        >
          {addingContractor ? 'Adding...' : 'Add'}
        </Button>
      </div>
    );
  }

  if (action === 'intakeLink') {
    if (hasIntakeLink) {
      return (
        <>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              A tenant intake link is active for this property.
            </p>
            <Button
              variant="destructive"
              onClick={() => setShowDeactivateDialog(true)}
              disabled={loading}
            >
              Deactivate Link
            </Button>
          </div>

          <AlertDialog open={showDeactivateDialog} onOpenChange={setShowDeactivateDialog}>
            <AlertDialogContent>
              <AlertDialogTitle>Deactivate Intake Link</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to deactivate the intake link? Tenants will no longer be able to use it to submit issues.
              </AlertDialogDescription>
              <div className="flex gap-3 justify-end">
                <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeactivateIntakeLink}
                  disabled={loading}
                >
                  {loading ? 'Deactivating...' : 'Deactivate'}
                </AlertDialogAction>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        </>
      );
    }

    return (
      <>
        <div className="space-y-4">
          {intakeLinkError && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {intakeLinkError}
            </div>
          )}
          <p className="text-sm text-muted-foreground">
            No active intake link. Create one to allow tenants to submit issues.
          </p>
          <Button
            onClick={handleGenerateIntakeLink}
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate Link'}
          </Button>
        </div>

        <AlertDialog open={showIntakeLinkDialog} onOpenChange={setShowIntakeLinkDialog}>
          <AlertDialogContent>
            <AlertDialogTitle>Intake Link Created</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-4">
                <p>Share this link with your tenants so they can submit maintenance issues:</p>
                <div className="rounded-lg border border-border bg-muted p-3">
                  <p className="break-all font-mono text-sm">{intakeLink}</p>
                </div>
              </div>
            </AlertDialogDescription>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowIntakeLinkDialog(false)}>
                Close
              </Button>
              <Button onClick={copyToClipboard}>
                Copy Link
              </Button>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }

  return null;
}
