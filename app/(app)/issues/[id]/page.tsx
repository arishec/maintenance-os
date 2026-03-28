import { redirect } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requireDbUser } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';
import { LayoutShell } from '@/components/layout-shell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PhotoUploadButton } from './photo-upload-button';
import { SelectContractorButton } from './select-contractor-button';
import { ClassifyButton } from './classify-button';

function urgencyColor(urgency: string) {
  switch (urgency.toLowerCase()) {
    case 'emergency':
      return 'bg-red-100 text-red-800';
    case 'high':
      return 'bg-orange-100 text-orange-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'low':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

function statusColor(status: string) {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'in_progress':
      return 'bg-blue-100 text-blue-800';
    case 'awaiting_dispatch':
    case 'classified':
      return 'bg-yellow-100 text-yellow-800';
    case 'canceled':
    case 'archived':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export default async function IssuePage({ params }: { params: Promise<{ id: string }> }) {
  let user;
  try {
    user = await requireDbUser();
  } catch {
    redirect('/sign-in');
  }

  const { id } = await params;
  const issue = await prisma.issue.findUnique({
    where: { id },
    include: {
      property: true,
      photos: { orderBy: { sortOrder: 'asc' } },
      dispatches: {
        include: { contractor: true, responses: true },
        orderBy: { createdAt: 'desc' },
      },
      jobs: { include: { contractor: true } },
    },
  });

  if (!issue || issue.property.ownerUserId !== user.id) {
    redirect('/issues');
  }

  // Generate signed URLs for photos (handles private buckets)
  const photosWithUrls = await Promise.all(
    (issue.photos || []).map(async (photo) => {
      if (photo.filePath) {
        const { data } = await supabaseAdmin.storage
          .from('issue-photos')
          .createSignedUrl(photo.filePath, 60 * 60); // 1 hour
        return { ...photo, signedUrl: data?.signedUrl || photo.fileUrl };
      }
      return { ...photo, signedUrl: photo.fileUrl };
    })
  );

  const statusLabels: Record<string, string> = {
    new: 'New',
    classified: 'Classified',
    awaiting_dispatch: 'Awaiting Dispatch',
    awaiting_quotes: 'Awaiting Quotes',
    quotes_received: 'Quotes Received',
    contractor_selected: 'Contractor Selected',
    scheduled: 'Scheduled',
    in_progress: 'In Progress',
    completed: 'Completed',
    canceled: 'Canceled',
    archived: 'Archived',
  };
  const displayStatus = statusLabels[issue.status] || issue.status;

  return (
    <LayoutShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl font-bold">{issue.title || 'Untitled Issue'}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {issue.property.nickname || issue.property.addressLine1}
            </p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <Badge className={statusColor(issue.status)}>{displayStatus}</Badge>
            {issue.urgency && <Badge className={urgencyColor(issue.urgency)}>{issue.urgency}</Badge>}
          </div>
        </div>

        {/* AI Classification Section */}
        {(issue.category || issue.reasoningSummary) ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">AI Classification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {issue.reasoningSummary && (
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Reasoning</label>
                  <p className="mt-1 text-sm">{issue.reasoningSummary}</p>
                </div>
              )}
              <div className="grid gap-4 sm:grid-cols-2">
                {issue.category && (
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Category</label>
                    <p className="mt-1 text-sm font-medium">{issue.category}</p>
                  </div>
                )}
                {issue.suggestedTimeframe && (
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Timeframe</label>
                    <p className="mt-1 text-sm font-medium">{issue.suggestedTimeframe}</p>
                  </div>
                )}
                {issue.recommendedTrade && (
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">
                      Recommended Trade
                    </label>
                    <p className="mt-1 text-sm font-medium">{issue.recommendedTrade}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">AI Classification</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-3 text-sm text-muted-foreground">
                This issue hasn&apos;t been classified yet. Tap below to run AI analysis.
              </p>
              <ClassifyButton issueId={issue.id} />
            </CardContent>
          </Card>
        )}

        {/* Description */}
        {issue.description && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{issue.description}</p>
              {issue.locationInProperty && (
                <div className="mt-3">
                  <label className="text-xs font-medium text-muted-foreground">Location</label>
                  <p className="mt-1 text-sm capitalize">
                    {issue.locationInProperty.replace(/_/g, ' ')}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Photos Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Photos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {photosWithUrls.length > 0 && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {photosWithUrls.map((photo) => (
                  <div key={photo.id} className="relative h-32 sm:h-48 w-full overflow-hidden rounded-xl bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.signedUrl || ''}
                      alt="Issue photo"
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
            {photosWithUrls.length === 0 && (
              <p className="text-sm text-muted-foreground">No photos yet. Add some to help document the issue.</p>
            )}
            <PhotoUploadButton issueId={issue.id} />
          </CardContent>
        </Card>

        {/* Dispatches Section */}
        {issue.dispatches && issue.dispatches.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contractor Contacts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {issue.dispatches.map((dispatch) => (
                  <div key={dispatch.id} className="flex items-center justify-between gap-3 rounded-lg border border-border p-3">
                    <div className="min-w-0 flex-1">
                      <div className="font-medium truncate">{dispatch.contractor.name}</div>
                      {dispatch.contractor.companyName && (
                        <div className="text-xs text-muted-foreground truncate">
                          {dispatch.contractor.companyName}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge className="capitalize text-xs">
                        {dispatch.status === 'sent'
                          ? 'Sent'
                          : dispatch.status === 'delivered'
                            ? 'Delivered'
                            : dispatch.status === 'replied'
                              ? 'Replied'
                              : dispatch.status === 'failed'
                                ? 'Failed'
                                : dispatch.status === 'expired'
                                  ? 'Expired'
                                  : 'Queued'}
                      </Badge>
                      {dispatch.responses && dispatch.responses.length > 0 && (
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {dispatch.responses.length} response{dispatch.responses.length !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Responses/Quotes Section */}
        {issue.dispatches &&
          issue.dispatches.some((d) => d.responses && d.responses.length > 0) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quote Responses</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {issue.dispatches.map((dispatch) =>
                  dispatch.responses && dispatch.responses.length > 0
                    ? dispatch.responses.map((response) => (
                        <div
                          key={response.id}
                          className="rounded-xl border border-border p-4 space-y-3"
                        >
                          {/* Header: name + select button */}
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold text-base">{dispatch.contractor.name}</h4>
                              {dispatch.contractor.companyName && (
                                <p className="text-sm text-muted-foreground">{dispatch.contractor.companyName}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              {response.receivedAt && (
                                <span className="text-xs text-muted-foreground">
                                  {new Date(response.receivedAt).toLocaleDateString()} at{' '}
                                  {new Date(response.receivedAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                                </span>
                              )}
                              {issue.status === 'quotes_received' && (
                                <SelectContractorButton
                                  issueId={issue.id}
                                  responseId={response.id}
                                  contractorId={dispatch.contractorId}
                                />
                              )}
                            </div>
                          </div>

                          {/* Price */}
                          {(response.flatEstimate || response.estimateLow || response.estimateHigh) && (
                            <div className="flex items-baseline gap-1">
                              <span className="text-2xl font-bold">
                                {response.flatEstimate
                                  ? `$${Number(response.flatEstimate).toLocaleString()}`
                                  : response.estimateLow && response.estimateHigh
                                    ? `$${Number(response.estimateLow).toLocaleString()} – $${Number(response.estimateHigh).toLocaleString()}`
                                    : response.estimateLow
                                      ? `From $${Number(response.estimateLow).toLocaleString()}`
                                      : `Up to $${Number(response.estimateHigh).toLocaleString()}`}
                              </span>
                            </div>
                          )}

                          {/* Availability */}
                          {(response.availabilityText || response.availabilityDate) && (
                            <div className="flex items-center gap-2 text-sm">
                              <span className="font-medium text-muted-foreground">Available:</span>
                              <span>
                                {response.availabilityText || new Date(response.availabilityDate!).toLocaleDateString()}
                              </span>
                            </div>
                          )}

                          {/* Follow-up question */}
                          {response.followUpQuestion && (
                            <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
                              <p className="text-sm font-medium text-amber-800">Contractor question:</p>
                              <p className="text-sm text-amber-900 mt-1">{response.followUpQuestion}</p>
                            </div>
                          )}

                          {/* Notes */}
                          {response.notes && (
                            <p className="text-sm text-muted-foreground">{response.notes}</p>
                          )}

                          {/* Reply actions */}
                          <div className="flex items-center gap-2 pt-1">
                            {dispatch.contractor.email && (
                              <a
                                href={`mailto:${dispatch.contractor.email}?subject=Re: ${issue.title || 'Maintenance request'}`}
                                className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 hover:underline"
                              >
                                Reply by email
                              </a>
                            )}
                            {dispatch.contractor.phone && (
                              <a
                                href={`sms:${dispatch.contractor.phone}`}
                                className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 hover:underline"
                              >
                                Reply by text
                              </a>
                            )}
                          </div>

                          {/* Confidence indicator */}
                          {response.requiresReview && (
                            <p className="text-xs text-amber-600">This response needs manual review</p>
                          )}
                        </div>
                      ))
                    : null
                )}
              </CardContent>
            </Card>
          )}

        {/* Jobs Section */}
        {issue.jobs && issue.jobs.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Job</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {issue.jobs.map((job) => (
                <div key={job.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{job.contractor.name}</div>
                    <Badge className={statusColor(job.status)}>{job.status}</Badge>
                  </div>
                  {job.selectedEstimate && (
                    <p className="text-sm">
                      <span className="font-medium">Estimate:</span> ${String(job.selectedEstimate)}
                    </p>
                  )}
                  {job.notes && (
                    <p className="text-sm text-muted-foreground">{job.notes}</p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 sm:flex-row">
          {(issue.status === 'classified' || issue.status === 'awaiting_dispatch') && (
            <Link href={`/issues/${issue.id}/dispatch`} className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto">Contact Contractors</Button>
            </Link>
          )}
          {issue.status !== 'completed' && issue.status !== 'canceled' && (
            <Link href={`/issues/${issue.id}/edit`} className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto">Edit</Button>
            </Link>
          )}
        </div>
      </div>
    </LayoutShell>
  );
}
