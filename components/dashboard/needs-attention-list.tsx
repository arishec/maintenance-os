import Link from 'next/link';
import type { AttentionItem } from '@/lib/dashboard';
import { AlertTriangle, MessageSquare, Calendar, Clock, DollarSign } from 'lucide-react';

const urgencyStyles = {
  high: 'border-l-red-500 bg-red-50/50',
  medium: 'border-l-amber-500 bg-amber-50/50',
  low: 'border-l-blue-500 bg-blue-50/50',
};

function getIcon(reason: string) {
  if (reason.includes('question')) return <MessageSquare className="h-4 w-4 text-amber-600" />;
  if (reason.includes('No response')) return <Clock className="h-4 w-4 text-red-600" />;
  if (reason.includes('scheduling') || reason.includes('Schedule')) return <Calendar className="h-4 w-4 text-amber-600" />;
  if (reason.includes('cost')) return <DollarSign className="h-4 w-4 text-blue-600" />;
  return <AlertTriangle className="h-4 w-4 text-red-600" />;
}

export function NeedsAttentionList({ items }: { items: AttentionItem[] }) {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-white p-6 text-center">
        <p className="text-sm text-muted-foreground">Nothing needs your attention right now.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <Link
          key={`${item.issueId}-${item.reason}`}
          href={item.actionHref}
          className={`block rounded-xl border-l-4 border border-border p-4 transition-colors hover:bg-muted/50 ${urgencyStyles[item.urgency]}`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0">
              <div className="mt-0.5 shrink-0">{getIcon(item.reason)}</div>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{item.issueTitle}</p>
                <p className="text-xs text-muted-foreground">{item.propertyName}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.reason}</p>
              </div>
            </div>
            <span className="shrink-0 text-xs font-medium text-primary">{item.actionLabel} →</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
