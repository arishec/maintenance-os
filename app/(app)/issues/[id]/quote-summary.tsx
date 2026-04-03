'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface QuoteSummaryProps {
  issueId: string;
  quoteCount: number;
}

export function QuoteSummary({ issueId, quoteCount }: QuoteSummaryProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Only render if there are 2+ quotes
  if (quoteCount < 2) {
    return null;
  }

  const fetchSummary = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/issues/${issueId}/quote-summary`);
      if (!response.ok) {
        throw new Error('Failed to fetch quote summary');
      }
      const data = await response.json();
      setSummary(data.summary || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch summary');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [issueId]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-lg">✨</span>
            AI Quote Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error || !summary) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-lg">✨</span>
            AI Quote Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {error ? 'Could not generate summary' : 'No comparison available'}
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={fetchSummary}
            >
              Try again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-blue-200 bg-blue-50/40">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-lg">✨</span>
            AI Quote Comparison
          </CardTitle>
          <Button
            size="sm"
            variant="ghost"
            onClick={fetchSummary}
            className="text-xs h-auto px-2 py-1"
          >
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-foreground leading-relaxed">{summary}</p>
      </CardContent>
    </Card>
  );
}
