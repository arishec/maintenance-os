import Link from 'next/link';
import type { WaitingItem } from '@/lib/dashboard';
import { Hourglass } from 'lucide-react';

function waitingLabel(date: Date): { text: string; urgency: 'calm' | 'warming' | 'hot' } {
  const hours = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60));
  if (hours < 1) return { text: 'Sent just now', urgency: 'calm' };
  if (hours < 24) return { text: `Waiting ${hours}h`, urgency: 'calm' };
  const days = Math.floor(hours / 24);
  if (days <= 1) return { text: 'Waiting 1 day', urgency: 'calm' };
  if (days <= 2) return { text: `Waiting ${days} days`, urgency: 'warming' };
  return { text: `Waiting ${days} days`, urgency: 'hot' };
}

const urgencyColors = {
  calm: 'text-muted-foreground',
  warming: 'text-amber-600 font-medium',
  hot: 'text-red-600 font-medium',
};

export function WaitingOnContractorsList({ items }: { items: WaitingItem[] }) {
  if (items.length === 0) return null;

  return (
    <div className="space-y-2">
      {items.map((item) => {
        const { text, urgency } = waitingLabel(item.oldestDispatchAt);
        return (
          <Link
            key={item.issueId}
            href={`/issues/${item.issueId}`}
            className="flex items-center gap-3 rounded-xl border border-border bg-white p-4 transition-colors hover:bg-muted/50"
          >
            <Hourglass className={`h-4 w-4 shrink-0 ${urgency === 'hot' ? 'text-red-500' : urgency === 'warming' ? 'text-amber-500' : 'text-muted-foreground'}`} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{item.issueTitle}</p>
              <p className="text-xs text-muted-foreground">{item.propertyName}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs text-muted-foreground">
                {item.contractorsContacted} contacted
              </p>
              <p className={`text-xs ${urgencyColors[urgency]}`}>
                {text}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
