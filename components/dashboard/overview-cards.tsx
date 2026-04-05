import Link from 'next/link';
import type { OverviewCounts } from '@/lib/dashboard';
import { AlertCircle, MessageSquareText, Wrench, CheckCircle2, Building2 } from 'lucide-react';

const cards = [
  {
    key: 'openIssues' as const,
    label: 'Open Issues',
    activeLabel: (n: number) => n > 0 ? `${n} open issue${n !== 1 ? 's' : ''}` : 'No open issues',
    subLabel: (counts?: any) => {
      if (!counts?.openIssuesByStatus) return null;
      const s = counts.openIssuesByStatus;
      const parts = [];
      if (s.new > 0) parts.push(`${s.new} new`);
      if (s.classifiedOrReady > 0) parts.push(`${s.classifiedOrReady} ready`);
      if (s.awaitingQuotes > 0) parts.push(`${s.awaitingQuotes} awaiting`);
      if (s.quotesReceived > 0) parts.push(`${s.quotesReceived} quoted`);
      if (s.activeJob > 0) parts.push(`${s.activeJob} active`);
      return parts.length > 0 ? parts.join(' · ') : null;
    },
    icon: AlertCircle,
    color: 'text-red-600',
    activeColor: 'border-red-200 bg-red-50/50',
    href: '/issues?view=open',
  },
  {
    key: 'quotesReady' as const,
    label: 'Quotes Ready',
    activeLabel: (n: number) => n > 0 ? `${n} quote${n !== 1 ? 's' : ''} to review` : 'No quotes to review',
    icon: MessageSquareText,
    color: 'text-amber-600',
    activeColor: 'border-amber-200 bg-amber-50/50',
    href: '/issues?view=quotes_received',
  },
  {
    key: 'activeJobs' as const,
    label: 'Active Jobs',
    activeLabel: (n: number) => n > 0 ? `${n} job${n !== 1 ? 's' : ''} in progress` : 'No active jobs',
    icon: Wrench,
    color: 'text-blue-600',
    activeColor: 'border-blue-200 bg-blue-50/50',
    href: '/issues?view=active_jobs',
  },
  {
    key: 'completedThisMonth' as const,
    label: 'Completed',
    activeLabel: (n: number) => n > 0 ? `${n} completed this month` : 'None this month',
    icon: CheckCircle2,
    color: 'text-emerald-600',
    activeColor: 'border-emerald-200 bg-emerald-50/50',
    href: '/history',
  },
  {
    key: 'properties' as const,
    label: 'Properties',
    activeLabel: (n: number) => `${n} propert${n !== 1 ? 'ies' : 'y'}`,
    icon: Building2,
    color: 'text-violet-600',
    activeColor: '',
    href: '/properties',
  },
];

export function OverviewCards({ counts }: { counts: OverviewCounts }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {cards.map(({ key, activeLabel, subLabel, icon: Icon, color, activeColor, href }) => {
        const value = counts[key];
        const isActive = value > 0 && key !== 'properties';
        const breakdown = subLabel ? subLabel(counts) : null;
        return (
          <Link
            key={key}
            href={href}
            className={`rounded-xl border p-4 transition-all hover:shadow-md hover:-translate-y-0.5 ${
              isActive ? activeColor : 'border-border bg-white'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Icon className={`h-4 w-4 ${color}`} />
              <span className="text-2xl font-semibold">{value}</span>
            </div>
            <p className="text-xs text-muted-foreground">{activeLabel(value)}</p>
            {breakdown && (
              <p className="text-xs text-muted-foreground/70 mt-1.5">{breakdown}</p>
            )}
          </Link>
        );
      })}
    </div>
  );
}
