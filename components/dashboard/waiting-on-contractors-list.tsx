import Link from 'next/link';
import type { WaitingItem } from '@/lib/dashboard';
import { Hourglass } from 'lucide-react';

function timeSince(date: Date): string {
  const hours = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60));
  if (hours < 1) return 'just now';
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function WaitingOnContractorsList({ items }: { items: WaitingItem[] }) {
  if (items.length === 0) return null;

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <Link
          key={item.issueId}
          href={`/issues/${item.issueId}`}
          className="flex items-center gap-3 rounded-xl border border-border bg-white p-4 transition-colors hover:bg-muted/50"
        >
          <Hourglass className="h-4 w-4 text-amber-500 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium truncate">{item.issueTitle}</p>
            <p className="text-xs text-muted-foreground">{item.propertyName}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xs text-muted-foreground">
              {item.contractorsContacted} contacted
            </p>
            <p className="text-xs text-muted-foreground">
              Sent {timeSince(item.oldestDispatchAt)}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
