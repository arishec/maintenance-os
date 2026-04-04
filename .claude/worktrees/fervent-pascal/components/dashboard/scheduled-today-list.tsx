import Link from 'next/link';
import type { ScheduledTodayItem } from '@/lib/dashboard';
import { Wrench } from 'lucide-react';

export function ScheduledTodayList({ items }: { items: ScheduledTodayItem[] }) {
  if (items.length === 0) return null;

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <Link
          key={item.jobId}
          href={`/issues/${item.issueId}`}
          className="flex items-center gap-3 rounded-xl border border-border bg-white p-4 transition-colors hover:bg-muted/50"
        >
          <Wrench className="h-4 w-4 text-blue-600 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium truncate">{item.issueTitle}</p>
            <p className="text-xs text-muted-foreground">
              {item.contractorName}
              {item.companyName ? ` · ${item.companyName}` : ''} · {item.propertyName}
            </p>
          </div>
          <span className="text-xs text-muted-foreground shrink-0">
            {item.scheduledFor.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
          </span>
        </Link>
      ))}
    </div>
  );
}
