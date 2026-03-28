import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const STATUS_LABELS: Record<string, string> = {
  new: 'New',
  classified: 'Classified',
  awaiting_dispatch: 'Awaiting Dispatch',
  awaiting_quotes: 'Awaiting Quotes',
  quotes_received: 'Quotes Received',
  contractor_selected: 'Contractor Selected',
  scheduled: 'Scheduled',
  in_progress: 'In Progress',
  completed: 'Completed',
  canceled: 'Canceled',
  archived: 'Archived',
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

export function IssueSummaryCard(props: {
  title: string;
  property: string;
  status: string;
  urgency: string;
  category: string;
  description: string;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>{props.title}</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">{props.property}</p>
          </div>
          <div className="flex gap-2 flex-wrap justify-end">
            <Badge className="border-slate-200 bg-slate-50 text-slate-700">
              {CATEGORY_LABELS[props.category] || props.category}
            </Badge>
            <Badge className={urgencyColor(props.urgency)}>
              {URGENCY_LABELS[props.urgency] || props.urgency}
            </Badge>
            <Badge className="border-slate-200 bg-slate-50 text-slate-700">
              {STATUS_LABELS[props.status] || props.status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{props.description}</p>
      </CardContent>
    </Card>
  );
}
