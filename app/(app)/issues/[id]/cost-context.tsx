'use client';

import { useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { Toast } from '@/components/ui/toast';

interface CostContextProps {
  issueId: string;
  category: string | null;
  currentQuotePrice?: number | null;
}

interface CostContextData {
  minCost: number;
  maxCost: number;
  avgCost: number;
  count: number;
}

export function CostContext({ issueId, category, currentQuotePrice }: CostContextProps) {
  const [costData, setCostData] = useState<CostContextData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCostContext = async () => {
      try {
        const response = await fetch(`/api/issues/${issueId}/cost-context`);
        if (response.ok) {
          const data = await response.json();
          setCostData(data.costContext);
        }
      } catch (error) {
        console.error('Failed to fetch cost context:', error);
        setError('Failed to load cost context');
      } finally {
        setLoading(false);
      }
    };

    fetchCostContext();
  }, [issueId]);

  if (error) {
    return <Toast message={error} type="error" />;
  }

  if (loading || !costData || !category) {
    return null;
  }

  const isAboveAverage = currentQuotePrice && currentQuotePrice > costData.avgCost * 1.5;

  return (
    <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-4">
      <p className="text-sm text-blue-800">
        Based on {costData.count} previous {category.replace(/_/g, ' ')} repair
        {costData.count !== 1 ? 's' : ''}, typical cost: <span className="font-semibold">${costData.minCost.toLocaleString()}–${costData.maxCost.toLocaleString()}</span> (avg ${costData.avgCost.toLocaleString()})
      </p>
      {isAboveAverage && (
        <div className="mt-2 flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">
            This quote is significantly above your typical range
          </p>
        </div>
      )}
    </div>
  );
}
