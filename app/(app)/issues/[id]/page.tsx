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
import { JobLifecyclePanel } from './job-lifecycle-panel';
import { RawMessageToggle } from './raw-message-toggle';
import { ReplyToContractorButton } from './reply-to-contractor-button';

import {
  ISSUE_STATUS_LABELS,
  getIssueStatusColor,
  getUrgencyColor,
  getDispatchStatusLabel,
  getDispatchStatusColor,
  formatLabel,
} from '@/lib/status';

const ACTIVE_JOB_STATUSES = ['active_job'];

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
        include: {
          contractor: true,
          responses: {
            include: {
              outboundMessages: {
                where: { direction: 'outbound' },
                orderBy: { createdAt: 'desc' },
                take: 1,
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
      jobs: {
        include: { contractor: true, selectedResponse: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!issue || issue.property.ownerUserId !== user.id) {
    redirect('/issues');
  }

  // Generate signed URLs for photos
  const photosWithUrls = await Promise.all(
    (issue.photos || []).map(async (photo) => {
      if (photo.filePath) {
        const { data } = await supabaseAdmin.storage
          .from('issue-photos')
          .createSignedUrl(photo.filePath, 60 * 60);
        return { ...photo, signedUrl: data?.signedUrl || photo.fileUrl };
      }
      return { ...photo, signedUrl: photo.fileUrl };
    })
  );

  const displayStatus = ISSUE_STATUS_LABELS[issue.status] || issue.status;
  const isActiveJob = ACTIVE_JOB_STATUSES.includes(issue.status);
  const activeJob = issue.jobs?.find((j) => j.status !== 'canceled');
  const hasResponses = issue.dispatches?.some((d) => d.responses?.length > 0);

  // Flatten and sort responses by lowest price
  const allResponses = issue.dispatches
    .flatMap((dispatch) =>
      (dispatch.responses || []).map((response) => ({ dispatch, response }))
    )
    .sort((a, b) => {
      const priceA = Number(a.response.flatEstimate || a.response.estimateLow || a.response.estimateHigh) || Infinity;
      const priceB = Number(b.response.flatEstimate || b.response.estimateLow || b.response.estimateHigh) || Infinity;
      return priceA - priceB;
    });

  return (
    <LayoutShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl font-bold">{issue.title || 'Untitled Issue'}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {issue.property.nickname || issue.property.addressLine1}
              {issue.reference && <span className="ml-2 text-xs text-muted-foreground/60 font-mono">{issue.reference}</span>}
            </p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <Badge className={getIssueStatusColor(issue.status)}>{displayStatus}</Badge>
            {issue.urgency && <Badge className={getUrgencyColor(issue.urgency)}>{issue.urgency}</Badge>}
          </div>
        </div>

        {/* Status Banners */}
        {(issue.status === 'classified' || issue.status === 'awaiting_dispatch') && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-800">
                Send this issue to contractors to get quotes
              </p>
              <p className="text-xs text-blue-700 mt-0.5">Select contractors from your list and they&apos;ll receive your request via SMS or email.</p>
            </div>
            <Link href={`/issues/${issue.id}/dispatch`} className="flex-shrink-0 ml-4">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">Contact Contractors</Button>
            </Link>
          </div>
        )}

        {issue.status === 'quotes_received' && hasResponses && (() => {
          const totalResponses = allResponses.length;
          return (
            <div className="rounded-lg border border-green-200 bg-green-50 p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-green-800">
                  You have {totalResponses} contractor response{totalResponses !== 1 ? 's' : ''} ready to review
                </p>
                <p className="text-xs text-green-700 mt-0.5">Review the quotes below and select a contractor to get started.</p>
              </div>
              <a href="#quotes" className="text-sm font-medium text-green-700 hover:text-green-900 hover:underline flex-shrink-0">
                View quotes
              </a>
            </div>
          );
        })()}

        {isActiveJob && activeJob && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <p className="text-sm font-semibold text-blue-800">
              {activeJob.contractor.name} has been selected for this job
            </p>
            <p className="text-xs text-blue-700 mt-0.5">
              {activeJob.selectedEstimate
                ? `Agreed price: $${Number(activeJob.selectedEstimate).toLocaleString()}`
                : 'Track scheduling and progress below.'}
            </p>
          </div>
        )}

        {issue.status === 'completed' && (
          <div className="rounded-lg border border-green-200 bg-green-50 p-4">
            <p className="text-sm font-semibold text-green-800">This repair is complete</p>
            {issue.completedAt && (
              <p className="text-xs text-green-700 mt-0.5">
                Completed on {new Date(issue.completedAt).toLocaleDateString()}
              </p>
            )}
          </div>
        )}

        {/* Job Lifecycle Panel */}
        {activeJob && (
          <JobLifecyclePanel
            job={{
              id: activeJob.id,
              status: activeJob.status,
              contractorName: activeJob.contractor.name,
              companyName: activeJob.contractor.companyName,
              agreedPrice: activeJob.selectedEstimate ? String(activeJob.selectedEstimate) : null,
              scheduledFor: activeJob.scheduledFor ? activeJob.scheduledFor.toISOString() : null,
              startedAt: activeJob.startedAt ? activeJob.startedAt.toISOString() : null,
              completedAt: activeJob.completedAt ? activeJob.completedAt.toISOString() : null,
              notes: activeJob.notes,
            }}
          />
        )}

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
                    <p className="mt-1 text-sm font-medium">{formatLabel(issue.category)}</p>
                  </div>
                )}
                {issue.suggestedTimeframe && (
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Timeframe</label>
                    <p className="mt-1 text-sm font-medium">{formatLabel(issue.suggestedTimeframe)}</p>
                  </div>
                )}
                {issue.recommendedTrade && (
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">
                      Recommended Trade
                    </label>
                    <p className="mt-1 text-sm font-medium">{formatLabel(issue.recommendedTrade)}</p>
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
                {issue.dispatches.map((dispatch) => {
                  const dispatchLabel = getDispatchStatusLabel(dispatch.status);
                  const dispatchColor = getDispatchStatusColor(dispatch.status);

                  return (
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
                        <Badge className={`text-xs ${dispatchColor}`}>
                          {dispatchLabel}
                        </Badge>
                        <Badge className="text-xs bg-muted text-muted-foreground capitalize">
                          {dispatch.channel}
                        </Badge>
                        {dispatch.responses && dispatch.responses.length > 0 && (
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {dispatch.responses.length} response{dispatch.responses.length !== 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Responses/Quotes Section */}
        {allResponses.length > 0 && (
          <Card id="quotes">
            <CardHeader>
              <CardTitle className="text-lg">Quote Responses</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {allResponses.map(({ dispatch, response }) => {
                // Determine if this response was selected
                const isSelected = activeJob?.selectedResponse?.id === response.id;
                const isNotSelected = activeJob && !isSelected;

                return (
                  <div
                    key={response.id}
                    className={`rounded-xl border p-4 space-y-3 ${
                      isSelected
                        ? 'border-green-300 bg-green-50'
                        : isNotSelected
                          ? 'border-gray-200 bg-gray-50/50 opacity-60'
                          : 'border-border'
                    }`}
                  >
                    {/* Header: name + badges + select button */}
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-base">{dispatch.contractor.name}</h4>
                          {isSelected && (
                            <Badge className="bg-green-100 text-green-800 text-xs">Selected</Badge>
                          )}
                          {isNotSelected && (
                            <Badge className="bg-gray-100 text-gray-500 text-xs">Not selected</Badge>
                          )}
                        </div>
                        {dispatch.contractor.companyName && (
                          <p className="text-sm text-muted-foreground">{dispatch.contractor.companyName}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="text-xs bg-muted text-muted-foreground capitalize">
                          {dispatch.channel === 'sms' ? 'SMS' : 'Email'}
                        </Badge>
                        {response.receivedAt && (
                          <span className="text-xs text-muted-foreground">
                            {new Date(response.receivedAt).toLocaleDateString()} at{' '}
                            {new Date(response.receivedAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Price */}
                    {(response.flatEstimate || response.estimateLow || response.estimateHigh) && (
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-medium text-muted-foreground">Quote:</span>
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

                    {/* Outbound reply */}
                    {response.outboundMessages?.[0] && (() => {
                      const reply = response.outboundMessages[0];
                      return (
                        <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
                          <p className="text-sm font-medium text-blue-800">Your reply:</p>
                          <p className="text-sm text-blue-900 mt-1">{reply.messageBody}</p>
                          <p className="text-xs text-blue-600 mt-2">
                            Sent via {reply.channel === 'sms' ? 'SMS' : 'Email'} · {new Date(reply.createdAt).toLocaleDateString()} at{' '}
                            {new Date(reply.createdAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                          </p>
                        </div>
                      );
                    })()}

                    {/* Notes */}
                    {response.notes && (
                      <p className="text-sm text-muted-foreground">{response.notes}</p>
                    )}

                    {/* Raw message toggle */}
                    {response.rawMessage && (
                      <RawMessageToggle rawMessage={response.rawMessage} />
                    )}

                    {/* Confidence indicator */}
                    {response.requiresReview && (
                      <p className="text-xs text-amber-600">This response needs manual review</p>
                    )}

                    {/* Actions */}
                    {!isNotSelected && (
                      <div className="flex items-center gap-2 pt-1">
                        {issue.status === 'quotes_received' && (
                          <SelectContractorButton
                            issueId={issue.id}
                            responseId={response.id}
                            contractorId={dispatch.contractorId}
                            contractorName={dispatch.contractor.name}
                            companyName={dispatch.contractor.companyName}
                            price={response.flatEstimate ? String(response.flatEstimate) : response.estimateLow ? String(response.estimateLow) : null}
                            availability={response.availabilityText || null}
                          />
                        )}
                        {isSelected && (
                          <Badge className="bg-green-100 text-green-800">Selected</Badge>
                        )}
                        <ReplyToContractorButton
                          issueId={issue.id}
                          contractorId={dispatch.contractorId}
                          contractorResponseId={response.id}
                          contractorName={dispatch.contractor.name}
                          contractorEmail={dispatch.contractor.email}
                          contractorPhone={dispatch.contractor.phone}
                          dispatchChannel={dispatch.channel}
                          issueTitle={issue.title || 'Maintenance request'}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
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
