'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Camera, ImagePlus, X } from 'lucide-react';
import { LayoutShell } from '@/components/layout-shell';
import { PaywallModal } from '@/components/paywall-modal';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

function formatLabel(value: string): string {
  const special: Record<string, string> = {
    hvac: 'HVAC', immediately: 'Immediately', today: 'Today',
    within_24_hours: 'Within 24 hours', within_2_to_3_days: 'Within 2–3 days',
    within_1_week: 'Within 1 week', general_handyman: 'General Handyman',
    general_contractor: 'General Contractor', appliance_repair: 'Appliance Repair',
    pest_control: 'Pest Control',
  };
  if (special[value.toLowerCase()]) return special[value.toLowerCase()];
  return value.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

const locationOptions = [
  { value: 'kitchen', label: 'Kitchen' },
  { value: 'bathroom', label: 'Bathroom' },
  { value: 'bedroom', label: 'Bedroom' },
  { value: 'living_room', label: 'Living Room' },
  { value: 'basement', label: 'Basement' },
  { value: 'exterior', label: 'Exterior' },
  { value: 'hvac_closet', label: 'HVAC Closet' },
  { value: 'roof', label: 'Roof' },
  { value: 'garage', label: 'Garage' },
  { value: 'other', label: 'Other' },
];

const signalOptions = [
  { value: 'safety', label: 'Safety Risk' },
  { value: 'water', label: 'Water Damage' },
  { value: 'heat', label: 'Heating Issue' },
  { value: 'power', label: 'Power/Electrical' },
];

interface Property {
  id: string;
  nickname?: string;
  addressLine1: string;
  city: string;
}

interface SelectedPhoto {
  id: string;
  file: File;
  preview: string;
}

interface ClassificationResult {
  title: string;
  category: string;
  urgency: string;
  reasoningSummary: string;
  suggestedTimeframe: string;
  recommendedTrade: string;
}

export default function NewIssuePage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [propertiesLoading, setPropertiesLoading] = useState(true);
  const [classification, setClassification] = useState<ClassificationResult | null>(null);
  const [issueId, setIssueId] = useState<string | null>(null);
  const [classifying, setClassifying] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [photoUploadError, setPhotoUploadError] = useState('');

  // Inline photo state
  const [photos, setPhotos] = useState<SelectedPhoto[]>([]);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchProperties() {
      try {
        const res = await fetch('/api/properties');
        if (!res.ok) throw new Error('Failed to fetch properties');
        const data = await res.json();
        setProperties(data.properties || []);
      } catch (err) {
        setError('Failed to load properties');
      } finally {
        setPropertiesLoading(false);
      }
    }
    fetchProperties();
  }, []);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newPhotos: SelectedPhoto[] = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
    }));
    setPhotos((prev) => [...prev, ...newPhotos]);
    // Reset input so same file can be selected again
    e.target.value = '';
  };

  // Track photo previews in a ref so cleanup on unmount always has the latest list
  const photosRef = useRef(photos);
  photosRef.current = photos;
  useEffect(() => {
    return () => {
      photosRef.current.forEach((p) => URL.revokeObjectURL(p.preview));
    };
  }, []);

  const removePhoto = (id: string) => {
    setPhotos((prev) => {
      const photo = prev.find((p) => p.id === id);
      if (photo) URL.revokeObjectURL(photo.preview);
      return prev.filter((p) => p.id !== id);
    });
  };

  async function uploadPhotos(createdIssueId: string): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;
    for (const photo of photos) {
      try {
        const formData = new FormData();
        formData.append('file', photo.file);
        const res = await fetch(`/api/issues/${createdIssueId}/photos`, {
          method: 'POST',
          body: formData,
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          console.error('Photo upload failed:', data.error || res.statusText);
          failed++;
        } else {
          success++;
        }
      } catch (err) {
        console.error('Failed to upload photo:', err);
        failed++;
      }
    }
    return { success, failed };
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);
    setClassifying(true);

    const form = new FormData(e.currentTarget);

    const signals: string[] = [];
    signalOptions.forEach((opt) => {
      if (form.get(`signal_${opt.value}`) === 'on') {
        signals.push(opt.value);
      }
    });

    const body = {
      propertyId: form.get('propertyId') as string,
      description: form.get('description') as string,
      locationInProperty: form.get('locationInProperty') as string,
      signals,
    };

    try {
      const res = await fetch('/api/issues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errData = await res.json();
        if (errData.error === 'PAYWALL_REQUIRED') {
          setShowPaywall(true);
          setLoading(false);
          setClassifying(false);
          return;
        }
        setError(errData.error || 'Failed to create issue.');
        setLoading(false);
        setClassifying(false);
        return;
      }

      const responseData = await res.json();
      const createdIssue = responseData.issue;
      const warning = responseData.warning;
      setIssueId(createdIssue.id);

      // Upload photos if any were selected
      if (photos.length > 0) {
        const { success, failed } = await uploadPhotos(createdIssue.id);
        if (failed > 0) {
          setPhotoUploadError(`${failed} photo${failed !== 1 ? 's' : ''} failed to upload. You can add them later on the issue page.`);
        }
      }

      // If classification failed (warning returned), skip to issue detail
      if (warning) {
        setLoading(false);
        setClassifying(false);
        router.push(`/issues/${createdIssue.id}`);
        return;
      }

      // If issue came back with classification, show it
      if (createdIssue.title && createdIssue.category && createdIssue.urgency && createdIssue.reasoningSummary) {
        setClassification({
          title: createdIssue.title,
          category: createdIssue.category,
          urgency: createdIssue.urgency,
          reasoningSummary: createdIssue.reasoningSummary,
          suggestedTimeframe: createdIssue.suggestedTimeframe || 'Not specified',
          recommendedTrade: createdIssue.recommendedTrade || 'Not specified',
        });
        setLoading(false);
        setClassifying(false);
        return;
      }

      // Fallback — shouldn't normally get here, but redirect to issue page
      setLoading(false);
      setClassifying(false);
      router.push(`/issues/${createdIssue.id}`);
    } catch (err) {
      setError('An error occurred. Please try again.');
      setLoading(false);
      setClassifying(false);
    }
  }

  // Show classification result
  if (classification && issueId) {
    const urgencyColor =
      classification.urgency === 'emergency'
        ? 'bg-red-100 text-red-800'
        : classification.urgency === 'high'
          ? 'bg-orange-100 text-orange-800'
          : 'bg-yellow-100 text-yellow-800';

    return (
      <LayoutShell>
        <div className="mx-auto max-w-2xl space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Issue Classified</CardTitle>
              <CardDescription>AI has analyzed your issue report</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold">{classification.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{classification.reasoningSummary}</p>
              </div>
              <div className="grid gap-4 grid-cols-2">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Category</label>
                  <p className="mt-1 text-sm font-medium">{formatLabel(classification.category)}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Urgency</label>
                  <p className="mt-1">
                    <Badge className={urgencyColor}>{classification.urgency.toUpperCase()}</Badge>
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Timeframe</label>
                  <p className="mt-1 text-sm font-medium">{formatLabel(classification.suggestedTimeframe)}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Trade</label>
                  <p className="mt-1 text-sm font-medium">{formatLabel(classification.recommendedTrade)}</p>
                </div>
              </div>
              {photoUploadError && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                  {photoUploadError}
                </div>
              )}
              <Link href={`/issues/${issueId}`}>
                <Button className="w-full mt-2">Continue to Issue</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </LayoutShell>
    );
  }

  // Classifying spinner
  if (classifying && issueId) {
    return (
      <LayoutShell>
        <div className="mx-auto max-w-2xl">
          <Card>
            <CardContent className="py-12 text-center">
              <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <p className="font-medium">AI is analyzing your issue...</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {photos.length > 0 ? `${photos.length} photo${photos.length !== 1 ? 's' : ''} uploaded. ` : ''}
                This usually takes a few seconds.
              </p>
            </CardContent>
          </Card>
        </div>
      </LayoutShell>
    );
  }

  return (
    <LayoutShell>
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>Report Issue</CardTitle>
          <CardDescription>Describe the problem and we'll classify it for you</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Property *</label>
              {propertiesLoading ? (
                <Input disabled placeholder="Loading properties..." />
              ) : (
                <Select name="propertyId" required defaultValue="">
                  <option value="" disabled>
                    Select property
                  </option>
                  {properties.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nickname || p.addressLine1} - {p.city}
                    </option>
                  ))}
                </Select>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">Description *</label>
              <Textarea
                name="description"
                required
                placeholder="Describe the issue in detail..."
                rows={3}
              />
            </div>

            {/* Photo capture — the key mobile feature */}
            <div>
              <label className="mb-1.5 block text-sm font-medium">Photos</label>
              <p className="mb-2 text-xs text-muted-foreground">Take a photo or choose from your gallery to help diagnose the issue</p>

              {/* Hidden file inputs */}
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handlePhotoSelect}
                className="hidden"
              />
              <input
                ref={galleryInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoSelect}
                className="hidden"
              />

              {/* Photo action buttons */}
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => cameraInputRef.current?.click()}
                >
                  <Camera className="mr-2 h-4 w-4" />
                  Take Photo
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => galleryInputRef.current?.click()}
                >
                  <ImagePlus className="mr-2 h-4 w-4" />
                  Gallery
                </Button>
              </div>

              {/* Photo previews */}
              {photos.length > 0 && (
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {photos.map((photo) => (
                    <div key={photo.id} className="relative">
                      <div className="relative h-24 w-full overflow-hidden rounded-lg bg-muted">
                        <Image
                          src={photo.preview}
                          alt="Photo preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removePhoto(photo.id)}
                        className="absolute -right-1.5 -top-1.5 rounded-full bg-red-500 p-0.5 text-white shadow-sm"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">Location in Property</label>
              <Select name="locationInProperty" defaultValue="">
                <option value="">Not specified</option>
                {locationOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">Signals</label>
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                {signalOptions.map((opt) => (
                  <div key={opt.value} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`signal_${opt.value}`}
                      name={`signal_${opt.value}`}
                      className="h-5 w-5 rounded border-border"
                    />
                    <label htmlFor={`signal_${opt.value}`} className="text-sm">
                      {opt.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <Button type="submit" disabled={loading || propertiesLoading} className="w-full">
              {loading ? 'Submitting...' : `Report Issue${photos.length > 0 ? ` with ${photos.length} Photo${photos.length !== 1 ? 's' : ''}` : ''}`}
            </Button>
          </form>
        </CardContent>
      </Card>
      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        trigger="issue_limit"
      />
    </LayoutShell>
  );
}
