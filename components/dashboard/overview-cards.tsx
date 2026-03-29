import type { OverviewCounts } from '@/lib/dashboard';
import { AlertCircle, MessageSquareText, Wrench, CheckCircle2, Building2 } from 'lucide-react';

const cards = [
  { key: 'openIssues' as const, label: 'Open Issues', icon: AlertCircle, color: 'text-red-600' },
  { key: 'quotesReady' as const, label: 'Quotes Ready', icon: MessageSquareText, color: 'text-amber-600' },
  { key: 'activeJobs' as const, label: 'Active Jobs', icon: Wrench, color: 'text-blue-600' },
  { key: 'completedThisMonth' as const, label: 'Completed This Month', icon: CheckCircle2, color: 'text-emerald-600' },
  { key: 'properties' as const, label: 'Properties', icon: Building2, color: 'text-violet-600' },
];

export function OverviewCards({ counts }: { counts: OverviewCounts }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {cards.map(({ key, label, icon: Icon, color }) => (
        <div key={key} className="rounded-xl border border-border bg-white p-4">
          <div className="flex items-center gap-2 mb-1">
            <Icon className={`h-4 w-4 ${color}`} />
            <span className="text-xs text-muted-foreground">{label}</span>
          </div>
          <p className="text-2xl font-semibold">{counts[key]}</p>
        </div>
      ))}
    </div>
  );
}
