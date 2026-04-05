'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { ActivityItem } from '@/lib/dashboard';

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const eventDots: Record<string, string> = {
  contractor_replied: 'bg-green-500',
  owner_reply_sent: 'bg-blue-500',
  contractor_selected: 'bg-purple-500',
  job_completed: 'bg-emerald-600',
  job_scheduled: 'bg-amber-500',
  dispatch_sent: 'bg-sky-500',
  issue_created: 'bg-gray-400',
};

const PREVIEW_COUNT = 3;

export function RecentActivityList({ items }: { items: ActivityItem[] }) {
  const [expanded, setExpanded] = useState(false);

  if (items.length === 0) return null;

  const visible = expanded ? items : items.slice(0, PREVIEW_COUNT);
  const hasMore = items.length > PREVIEW_COUNT;

  return (
    <div className="space-y-1">
      {visible.map((item) => {
        const desc = item.count > 1
          ? `${item.description} (${item.count}x)`
          : item.description;

        const inner = (
          <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-muted/50">
            <span className={`h-2 w-2 rounded-full shrink-0 ${eventDots[item.eventType] || 'bg-gray-300'}`} />
            <div className="min-w-0 flex-1">
              <p className="text-sm truncate">
                <span className="font-medium">{desc}</span>
                {item.issueTitle && (
                  <span className="text-muted-foreground"> · {item.issueTitle}</span>
                )}
              </p>
            </div>
            <span className="text-xs text-muted-foreground shrink-0">{timeAgo(item.timestamp)}</span>
          </div>
        );

        if (item.issueId) {
          return <Link key={item.id} href={`/issues/${item.issueId}`}>{inner}</Link>;
        }
        return <div key={item.id}>{inner}</div>;
      })}
      {hasMore && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="w-full text-center text-xs text-muted-foreground/70 hover:text-muted-foreground py-1.5 transition-colors"
        >
          {expanded ? 'Show less' : `Show ${items.length - PREVIEW_COUNT} more`}
        </button>
      )}
    </div>
  );
}
