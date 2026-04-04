import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ISSUE_STATUS_LABELS,
  ISSUE_NEXT_ACTION,
  CATEGORY_LABELS,
  URGENCY_LABELS,
  getIssueStatusColor,
  getUrgencyColor,
} from '@/lib/status';

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
  const statusLabel = ISSUE_STATUS_LABELS[props.status] || props.status;
  const nextAction = ISSUE_NEXT_ACTION[props.status] || null;

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
            <Badge className={getUrgencyColor(props.urgency)}>
              {URGENCY_LABELS[props.urgency] || props.urgency}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground line-clamp-2">{props.description}</p>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge className={getIssueStatusColor(props.status)}>
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
