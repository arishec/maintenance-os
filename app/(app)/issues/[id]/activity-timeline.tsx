'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TimelineEvent {
  id: string;
  eventType: string;
  eventPayloadJson: unknown;
  createdAt: string | Date;
}

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
    case 'job_canceled':
      if (p.selfResolved) {
        return `Issue resolved by owner${p.reason && p.reason !== 'No reason provided' ? ` — ${p.reason}` : ''}`;
      }
      return `Job canceled${p.reason && p.reason !== 'No reason provided' ? ` — ${p.reason}` : ''}`;
    case 'job_completed':
      return 'Job marked complete';
    case 'manual_quote_added':
      return `Manually added quote from ${p.contractorName || 'contractor'}${p.flatEstimate ? ` — $${p.flatEstimate}` : ''}`;
    case 'dispatch_resent':
      return `Resent request to ${p.contractorName || 'contractor'}`;
    case 'issue_submitted_by_tenant':
      return 'Submitted by tenant';
    case 'issue_archived':
      return 'Issue archived';
    default:
      return eventType.replace(/_/g, ' ');
  }
}

function LocalTime({ date }: { date: string | Date }) {
  const d = new Date(date);
  return (
    <time dateTime={d.toISOString()} suppressHydrationWarning>
      {d.toLocaleString()}
    </time>
  );
}

export function ActivityTimeline({ events }: { events: TimelineEvent[] }) {
  const [expanded, setExpanded] = useState(false);

  if (!events || events.length === 0) return null;

  return (
    <Card>
      <CardHeader
        className="cursor-pointer select-none"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            Activity
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({events.length}{events.length === 20 ? '+' : ''})
            </span>
          </CardTitle>
          <svg
            className={`h-4 w-4 text-muted-foreground transition-transform ${expanded ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </CardHeader>
      {expanded && (
        <CardContent>
          <div className="space-y-3">
            {events.map((event) => {
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
      )}
    </Card>
  );
}
