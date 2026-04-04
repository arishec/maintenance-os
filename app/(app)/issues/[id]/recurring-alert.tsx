'use client';

import { useEffect, useState } from 'react';
import { Toast } from '@/components/ui/toast';

interface RecurringAlertProps {
  issueId: string;
  category: string | null;
  propertyName: string;
}

interface PatternData {
  totalCount: number;
  previousIssueDates: string[];
}

export function RecurringAlert({ issueId, category, propertyName }: RecurringAlertProps) {
  const [patternData, setPatternData] = useState<PatternData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatterns = async () => {
      try {
        const response = await fetch(`/api/issues/${issueId}/patterns`);
        if (response.ok) {
          const data = await response.json();
          setPatternData(data.pattern);
        }
      } catch (error) {
        console.error('Failed to fetch pattern data:', error);
        setError('Failed to load pattern data');
      } finally {
        setLoading(false);
      }
    };

    fetchPatterns();
  }, [issueId]);

  if (error) {
    return <Toast message={error} type="error" />;
  }

  if (loading || !patternData || !category) {
    return null;
  }

  const categoryLabel = category.replace(/_/g, ' ');

  return (
    <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 flex items-start gap-3">
      <span className="text-amber-600 text-lg font-semibold flex-shrink-0">!</span>
      <div className="flex-1">
        <p className="text-sm font-semibold text-amber-900">
          This is the {patternData.totalCount === 3 ? '3rd' : `${patternData.totalCount}th`} {categoryLabel} issue at {propertyName} this year.
        </p>
        <p className="text-xs text-amber-700 mt-1">
          Consider scheduling a professional inspection to address the root cause.
        </p>
      </div>
    </div>
  );
}
