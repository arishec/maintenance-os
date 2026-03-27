import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const bullets = [
  'Report an issue with photos',
  'Classify urgency with Claude',
  'Contact contractors by SMS or email',
  'Compare responses in one place',
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-20 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <div className="mb-4 inline-flex rounded-full border border-border bg-white px-3 py-1 text-sm text-muted-foreground">
              Responsive web app starter
            </div>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Handle home and rental repairs without endless back-and-forth.
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
              Report the problem, contact contractors in one step, compare replies, and keep every repair organized by property.
            </p>
            <div className="mt-8 flex gap-3">
              <Link href="/dashboard">
                <Button size="lg">Open app</Button>
              </Link>
              <Link href="/issues">
                <Button size="lg" variant="outline">
                  See issue flow <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="mt-8 space-y-3">
              {bullets.map((bullet) => (
                <div key={bullet} className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="h-4 w-4" />
                  {bullet}
                </div>
              ))}
            </div>
          </div>
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="border-b border-border bg-slate-50 px-6 py-4 font-medium">Quote comparison preview</div>
              <div className="p-6">
                <div className="grid gap-4">
                  {[
                    ['Mike’s Plumbing', '$180', 'Tomorrow', 'Replied'],
                    ['QuickFix', '$140', '3 days', 'Replied'],
                    ['Elite Plumbing', 'Pending', 'Pending', 'Waiting'],
                  ].map(([name, estimate, availability, status]) => (
                    <div key={name} className="grid grid-cols-4 gap-4 rounded-xl border border-border p-4 text-sm">
                      <div className="font-medium">{name}</div>
                      <div>{estimate}</div>
                      <div>{availability}</div>
                      <div>{status}</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
