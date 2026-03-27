import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
          <div className="flex gap-2">
            <Badge>{props.category}</Badge>
            <Badge>{props.urgency}</Badge>
            <Badge>{props.status}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{props.description}</p>
      </CardContent>
    </Card>
  );
}
