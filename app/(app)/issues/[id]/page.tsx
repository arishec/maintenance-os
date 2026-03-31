import { redirect } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requireDbUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';
import { supabaseAdmin } from '@/lib/supabase';
import { LayoutShell } from '@/components/layout-shell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { isDispatchStale, formatStaleAge } from '@/lib/dispatch-helpers';
import { PhotoUploadButton } from './photo-upload-button';
import { SelectContractorButton } from './select-contractor-button';
import { ClassifyButton } from './classify-button';
import { JobLifecyclePanel } from './job-lifecycle-panel';
import { RawMessageToggle } from './raw-message-toggle';
import { ReplyToContractorButton } from './reply-to-contractor-button';
import { ManualQuoteButton } from './manual-quote-button';
import { ResendDispatchButton } from './resend-dispatch-button';
import { LocalTime } from '@/components/local-time';

import {
  ISSUE_STATUS_LABELS,
  getIssueStatusColor,
  getUrgencyColor,
  getDispatchStatusLabel,
  getDispatchStatusColor,
  formatLabel,
} from '@/lib/status';

/** Human-readable timeline event descriptions */
function formatTimelineEvent(eventType: string, payload: Record<string, unknown> | null): string {
  const p = payload || {};
  switch (eventType) {
    case 'issue_created':
      return 'Issue reported';
    case 'issue_classified':
      return `AI classified as ${p.category || 'unknown'} — ${p.urgency || ''} urgency`;
    case 'dispatch_sent': {
      const count = p.contractorCount as number || 1;
      return `Sent to ${count} contractor${count !== 1 ? 's' : ''}`;
    }
    case 'contractor_replied':
      return `${p.contractorName || 'Contractor'} replied`;
    case 'owner_reply_sent':
      return `You replied to ${p.contractorName || 'contractor'} via ${p.channel === 'sms' ? 'SMS' : 'Email'}`;
    case 'contractor_selected':
      return `Selected ${p.contractorName || 'contractor'} for the job`;
    case 'contractor_confirmed':
      return `${p.contractorName || 'Contractor'} confirmed the job${p.schedulingInfo ? ` — ${p.schedulingInfo}` : ''}`;
    case 'contractor_declined':
      return `${p.contractorName || 'Contractor'} declined the job${p.declineReason ? ` — ${p.declineReason}` : ''}`;
    case 'job_scheduled':
      return 'Job scheduled';
    case 'job_started':
      return 'Job started';
    case 'job_completed':
      return 'Job marked complete';
    case 'manual_quote_added':
      return `Manually added quote from ${p.contractorName || 'contractor'}${p.flatEstimate ? ` — $${p.flatEstimate}` : ''}`;
    case 'dispatch_resent':
      return `Resent request to ${p.contractorName || 'contractor'}`;
    case 'issue_submitted_by_tenant':
      return 'Submitted by tenant';
    default:
      return eventType.replace(/_/g, ' ');
  }
}

/** Light cleanup for contractor follow-up questions: capitalize, add punctuation */
function tidyQuestion(raw: string): string {
  let q = raw.trim();
  // Capitalize first letter
  q = q.charAt(0).toUpperCase() + q.slice(1);
  // Add question mark if missing punctuation at end
  if (!/[.?!]$/.test(q)) q += '?';
  return q;
}

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
      timelineEvents: {
        orderBy: { createdAt: 'desc' },
        take: 20,
      },
    },
  });

  if (!issue || issue.property.ownerUserId !== user.id) {
    redirect('/issues');
  }

  // Photos use public URLs — no signed URL generation needed
  const photosWithUrls = (issue.photos || []).map((photo) => {
    // For existing photos with old signed URLs, build the public URL from filePath
    let publicUrl = photo.fileUrl;
    if (photo.filePath) {
      const { data } = supabaseAdmin.storage
        .from('issue-photos')
        .getPublicUrl(photo.filePath);
      publicUrl = data.publicUrl;
    }
    return { ...photo, signedUrl: publicUrl };
  });

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
            {issue.urgency && <Badge className={getUrgencyColor(issue.urgency)}>{formatLabel(issue.urgency)}</Badge>}
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
            <div className="rounded-lg border-2 border-green-300 bg-green-50 p-4 flex items-center justify-between shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-green-800">
                    {totalResponses} contractor quote{totalResponses !== 1 ? 's' : ''} received
                  </p>
                  <p className="text-xs text-green-700 mt-0.5">Review the quotes below and select a contractor to get started.</p>
                </div>
              </div>
              <a href="#quotes" className="text-sm font-medium text-green-700 hover:text-green-900 hover:underline flex-shrink-0 ml-4">
                View quotes ↓
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
                Completed on <LocalTime date={issue.completedAt} format="date" />
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
              actualCost: (activeJob as Record<string, unknown>).actualCost ? String((activeJob as Record<string, unknown>).actualCost) : null,
              completionNotes: (activeJob as Record<string, unknown>).completionNotes as string | null ?? null,
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
                  <div key={photo.id} className="space-y-1">
                    <div className="relative h-32 sm:h-48 w-full overflow-hidden rounded-xl bg-muted">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photo.signedUrl || ''}
                        alt="Issue photo"
                        className="h-full w-full object-cover"
                      />
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
            {photosWithUrls.length === 0 && (
              <p className="text-sm text-muted-foreground">No photos yet. Add some to help document the issue.</p>
            )}
            <PhotoUploadButton issueId={issue.id} />
          </CardContent>
        </Card>

        {/* Dispatches Section */}
        {/* Stale dispatch nudge banners */}
        {issue.dispatches?.filter((d) =>
          isDispatchStale({ status: d.status, createdAt: d.createdAt, responses: d.responses ?? [] })
        ).map((staleDispatch) => (
          <div key={`stale-${staleDispatch.id}`} className="rounded-xl border border-amber-300 bg-amber-50 p-4 flex items-start gap-3">
            <span className="text-amber-600 text-lg mt-0.5">⏳</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-900">
                No response from {staleDispatch.contractor.name} in {formatStaleAge({ status: staleDispatch.status, createdAt: staleDispatch.createdAt, responses: staleDispatch.responses ?? [] })}
              </p>
              <p className="text-xs text-amber-700 mt-1">
                Would you like to resend the request or try another contractor?
              </p>
              <div className="flex gap-2 mt-3">
                <ResendDispatchButton
                  issueId={issue.id}
                  dispatchId={staleDispatch.id}
                  contractorName={staleDispatch.contractor.name}
                />
                <Link href="/contractors">
                  <Button size="sm" variant="outline">Try another contractor</Button>
                </Link>
              </div>
            </div>
          </div>
        ))}

        {issue.dispatches && issue.dispatches.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Contractor Contacts</CardTitle>
                {issue.status !== 'completed' && issue.status !== 'canceled' && (
                  <Link href={`/issues/${issue.id}/dispatch`}>
                    <Button size="sm" variant="outline" className="text-xs">
                      + Add More
                    </Button>
                  </Link>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Deduplicate dispatches by contractor — show only the most recent per contractor */}
                {Array.from(
                  issue.dispatches.reduce((map, dispatch) => {
                    const existing = map.get(dispatch.contractorId);
                    if (!existing || new Date(dispatch.createdAt) > new Date(existing.createdAt)) {
                      map.set(dispatch.contractorId, dispatch);
                    }
                    return map;
                  }, new Map<string, typeof issue.dispatches[0]>()).values()
                ).map((dispatch) => {
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
                        {(dispatch.status === 'sent' || dispatch.status === 'delivered' || dispatch.status === 'failed') && !dispatch.responses?.length && (
                          <ResendDispatchButton
                            issueId={issue.id}
                            dispatchId={dispatch.id}
                            contractorName={dispatch.contractor.name}
                          />
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
                            <LocalTime date={response.receivedAt} />
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
                          {response.availabilityText || <LocalTime date={response.availabilityDate!} format="date" />}
                        </span>
                      </div>
                    )}

                    {/* Conversation thread: question + reply */}
                    {(response.followUpQuestion || response.outboundMessages?.[0]) && (
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Conversation</p>

                        {/* Follow-up question */}
                        {response.followUpQuestion && (
                          <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
                            <p className="text-sm font-medium text-amber-800">Contractor question:</p>
                            <p className="text-sm text-amber-900 mt-1">{tidyQuestion(response.followUpQuestion)}</p>
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
                                Sent via {reply.channel === 'sms' ? 'SMS' : 'Email'} · <LocalTime date={reply.createdAt} />
                              </p>
                            </div>
                          );
                        })()}
                      </div>
                    )}

                    {/* Notes */}
                    {response.notes && (
                      <p className="text-sm text-muted-foreground">{response.notes}</p>
                    )}

                    {/* Raw message toggle */}
                    {response.rawMessage && (
                      <RawMessageToggle rawMessage={response.rawMessage} />
                    )}

                    {/* Only show review warning when parsing truly failed (no quote or availability extracted) */}
                    {response.requiresReview && !response.flatEstimate && !response.estimateLow && !response.availabilityText && (
                      <p className="text-xs text-amber-600">Could not fully parse this response — please review the raw message</p>
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
                          <Badge className="bg-green-100 text-green-800">You selected this contractor</Badge>
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
                          hasExistingReply={!!(response.outboundMessages && response.outboundMessages.length > 0)}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        {/* Manual Quote + Actions */}
        <div className="flex flex-wrap gap-2">
          {issue.status !== 'completed' && issue.status !== 'canceled' && (
            <ManualQuoteButton issueId={issue.id} />
          )}
          {(issue.status === 'classified' || issue.status === 'awaiting_dispatch') && (
            <Link href={`/issues/${issue.id}/dispatch`}>
              <Button size="sm">Contact Contractors</Button>
            </Link>
          )}
          {issue.status !== 'completed' && issue.status !== 'canceled' && (
            <Link href={`/issues/${issue.id}/edit`}>
              <Button size="sm" variant="outline">Edit</Button>
            </Link>
          )}
        </div>

        {/* Activity Timeline */}
        {issue.timelineEvents && issue.timelineEvents.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {issue.timelineEvents.map((event) => {
                  const payload = event.eventPayloadJson as Record<string, unknown> | null;
                  return (
                    <div key={event.id} className="flex gap-3 text-sm">
                      <div className="flex-shrink-0 w-1.5 rounded-full bg-muted mt-1.5 self-stretch" />
                      <div className="min-w-0 flex-1">
                        <p className="text-foreground">{formatTimelineEvent(event.eventType, payload)}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          <LocalTime date={event.createdAt} />
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </LayoutShell>
  );
}
