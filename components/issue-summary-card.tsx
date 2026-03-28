import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const STATUS_LABELS: Record<string, string> = {
  new: 'New',
  classified: 'Classified',
  awaiting_dispatch: 'Awaiting dispatch',
  awaiting_quotes: 'Awaiting quotes',
  quotes_received: 'Quotes received',
  active_job: 'Active job',
  completed: 'Completed',
  canceled: 'Canceled',
  archived: 'Archived',
};

const NEXT_ACTION: Record<string, string> = {
  new: 'Classify this issue to get started',
  classified: 'Send to contractors for quotes',
  awaiting_dispatch: 'Send to contractors for quotes',
  awaiting_quotes: 'Waiting for contractor responses',
  quotes_received: 'Review quotes and select a contractor',
  active_job: 'Track scheduling and progress',
  completed: 'Job complete',
};

const CATEGORY_LABELS: Record<string, string> = {
  plumbing: 'Plumbing',
  electrical: 'Electrical',
  hvac: 'HVAC',
  roofing: 'Roofing',
  appliance: 'Appliance',
  structural: 'Structural',
  pest: 'Pest',
  cleaning: 'Cleaning',
  exterior: 'Exterior',
  general_handyman: 'General Handyman',
  unknown: 'Unknown',
};

const URGENCY_LABELS: Record<string, string> = {
  emergency: 'Emergency',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

function urgencyColor(urgency: string) {
  switch (urgency) {
    case 'emergency': return 'bg-red-100 text-red-800 border-red-200';
    case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'low': return 'bg-green-100 text-green-800 border-green-200';
    default: return '';
  }
}

function statusColor(status: string) {
  switch (status) {
    case 'quotes_received': return 'bg-green-100 text-green-800 border-green-200';
    case 'awaiting_quotes': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'active_job': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'completed': return 'bg-green-100 text-green-800 border-green-200';
    case 'canceled':
    case 'archived': return 'bg-gray-100 text-gray-600 border-gray-200';
    default: return 'border-slate-200 bg-slate-50 text-slate-700';
  }
}

export function IssueSummaryCard(props: {
  title: string;
  property: string;
  status: string;
  urgency: string;
  category: string;
  description: string;
  dispatchCount?: number;
  replyCount?: number;
}) {
  const hasReplies = (props.replyCount ?? 0) > 0;
  const statusLabel = STATUS_LABELS[props.status] || props.status;
  const nextAction = NEXT_ACTION[props.status] || null;

  // Build status detail
  let statusDetail: string | null = null;
  if (props.status === 'quotes_received' && hasReplies) {
    statusDetail = `${props.replyCount} response${props.replyCount !== 1 ? 's' : ''} received`;
  } else if (props.status === 'awaiting_quotes' && (props.dispatchCount ?? 0) > 0) {
    statusDetail = `${props.dispatchCount} contacted`;
  }

  return (
    <Card className="transition-all hover:shadow-md hover:-translate-y-0.5">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <CardTitle className="text-base">{props.title}</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">{props.property}</p>
          </div>
          <div className="flex gap-2 flex-wrap justify-end flex-shrink-0">
            <Badge className="border-slate-200 bg-slate-50 text-slate-700">
              {CATEGORY_LABELS[props.category] || props.category}
            </Badge>
            <Badge className={urgencyColor(props.urgency)}>
              {URGENCY_LABELS[props.urgency] || props.urgency}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground line-clamp-2">{props.description}</p>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge className={statusColor(props.status)}>
            {statusLabel}
          </Badge>
          {statusDetail && (
            <span className="text-xs text-muted-foreground">{statusDetail}</span>
          )}
          {hasReplies && props.status !== 'quotes_received' && (
            <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs">
              New reply
            </Badge>
          )}
        </div>
        {nextAction && (
          <p className="text-xs text-muted-foreground/80 italic">{nextAction}</p>
        )}
      </CardContent>
    </Card>
  );
}
