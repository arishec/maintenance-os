'use client';

import Link from 'next/link';
import type { AttentionItem } from '@/lib/dashboard';
import { AlertTriangle, MessageSquare, Calendar, Clock, DollarSign, CheckCircle2, Home } from 'lucide-react';

const urgencyStyles = {
  high: 'border-l-red-500 bg-red-50/50',
  medium: 'border-l-amber-500 bg-amber-50/50',
  low: 'border-l-blue-500 bg-blue-50/50',
};

function getIcon(reason: string) {
  if (reason.includes('question')) return <MessageSquare className="h-4 w-4 text-amber-600" />;
  if (reason.includes('Waiting') || reason.includes('replied')) return <Clock className="h-4 w-4 text-red-600" />;
  if (reason.includes('date') || reason.includes('Schedule') || reason.includes('scheduled') || reason.includes('arriving')) return <Calendar className="h-4 w-4 text-amber-600" />;
  if (reason.includes('cost') || reason.includes('paid')) return <DollarSign className="h-4 w-4 text-blue-600" />;
  if (reason.includes('quote') || reason.includes('review')) return <AlertTriangle className="h-4 w-4 text-red-600" />;
  if (reason.includes('progress')) return <Clock className="h-4 w-4 text-blue-600" />;
  return <AlertTriangle className="h-4 w-4 text-red-600" />;
}

function timePressure(date: Date): string {
  const hours = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60));
  if (hours < 1) return 'Just now';
  if (hours < 24) return `No update for ${hours} hour${hours !== 1 ? 's' : ''}`;
  const days = Math.floor(hours / 24);
  return `No update for ${days} day${days !== 1 ? 's' : ''}`;
}

function groupByProperty(items: AttentionItem[]): Map<string, AttentionItem[]> {
  const groups = new Map<string, AttentionItem[]>();
  for (const item of items) {
    const key = item.propertyName || 'Other';
    const list = groups.get(key) || [];
    list.push(item);
    groups.set(key, list);
  }
  return groups;
}

export function NeedsAttentionList({ items }: { items: AttentionItem[] }) {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50/50 p-6 flex items-center gap-3">
        <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
        <div>
          <p className="text-sm font-medium text-green-900">You're all caught up</p>
          <p className="text-xs text-green-700 mt-0.5">No issues need your attention right now.</p>
        </div>
      </div>
    );
  }

  const grouped = groupByProperty(items);
  const hasMultipleProperties = grouped.size > 1;

  // If only one property, skip the grouping headers
  if (!hasMultipleProperties) {
    return (
      <div className="space-y-2">
        {items.map((item) => (
          <AttentionCard key={`${item.issueId}-${item.reason}`} item={item} showProperty={false} />
        ))}
      </div>
    );
  }

  // Multiple properties — group with headers
  return (
    <div className="space-y-4">
      {Array.from(grouped.entries()).map(([propertyName, propertyItems]) => (
        <div key={propertyName}>
          <div className="flex items-center gap-2 mb-2">
            <Home className="h-3.5 w-3.5 text-muted-foreground" />
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {propertyName}
            </h3>
            <span className="text-xs text-muted-foreground">
              ({propertyItems.length})
            </span>
          </div>
          <div className="space-y-2">
            {propertyItems.map((item) => (
              <AttentionCard key={`${item.issueId}-${item.reason}`} item={item} showProperty={false} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function AttentionCard({ item, showProperty }: { item: AttentionItem; showProperty: boolean }) {
  return (
    <Link
      href={item.actionHref}
      className={`block rounded-xl border-l-4 border border-border p-4 transition-colors hover:bg-muted/50 ${urgencyStyles[item.urgency]}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="mt-0.5 shrink-0">{getIcon(item.reason)}</div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{item.issueTitle}</p>
            {showProperty && item.propertyName && (
              <p className="text-xs text-muted-foreground">{item.propertyName}</p>
            )}
            <p className="text-xs font-medium mt-1" style={{ color: item.urgency === 'high' ? '#dc2626' : item.urgency === 'medium' ? '#d97706' : '#2563eb' }}>
              {item.reason}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">{timePressure(item.timestamp)}</p>
          </div>
        </div>
        <span className="shrink-0 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
          {item.actionLabel} →
        </span>
      </div>
    </Link>
  );
}
