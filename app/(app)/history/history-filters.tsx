'use client';

import { useState, useMemo } from 'react';
import { Download, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

interface HistoryIssue {
  id: string;
  title: string | null;
  status: string;
  completedAt: string | null;
  category: string | null;
  propertyName: string;
  propertyId: string;
  contractorName: string;
  cost: number | null;
  isSelfResolved: boolean;
  reason: string | null;
}

export function HistoryFilters({
  issues,
  children,
}: {
  issues: HistoryIssue[];
  children: (filtered: HistoryIssue[]) => React.ReactNode;
}) {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [propertyFilter, setPropertyFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Get unique properties
  const properties = useMemo(() => {
    const map = new Map<string, string>();
    issues.forEach((i) => map.set(i.propertyId, i.propertyName));
    return Array.from(map.entries());
  }, [issues]);

  const filtered = useMemo(() => {
    return issues.filter((issue) => {
      if (dateFrom && issue.completedAt && issue.completedAt < dateFrom) return false;
      if (dateTo && issue.completedAt && issue.completedAt > dateTo + 'T23:59:59') return false;
      if (propertyFilter && issue.propertyId !== propertyFilter) return false;
      if (statusFilter === 'completed' && issue.status !== 'completed') return false;
      if (statusFilter === 'canceled' && issue.status !== 'canceled') return false;
      if (statusFilter === 'self_resolved' && !issue.isSelfResolved) return false;
      return true;
    });
  }, [issues, dateFrom, dateTo, propertyFilter, statusFilter]);

  // Calculate total cost of filtered items
  const totalCost = useMemo(() => {
    return filtered.reduce((sum, i) => sum + (i.cost || 0), 0);
  }, [filtered]);

  function exportCSV() {
    const headers = ['Date', 'Property', 'Issue', 'Category', 'Contractor', 'Cost', 'Status', 'Notes'];
    const rows = filtered.map((i) => [
      i.completedAt ? new Date(i.completedAt).toLocaleDateString() : '',
      i.propertyName,
      i.title || 'Untitled',
      i.category || '',
      i.contractorName || '',
      i.cost ? i.cost.toFixed(2) : '',
      i.isSelfResolved ? 'Self-resolved' : i.status === 'canceled' ? 'Canceled' : 'Completed',
      i.reason || '',
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `maintenance-history-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const hasFilters = dateFrom || dateTo || propertyFilter || statusFilter !== 'all';

  return (
    <div>
      {/* Filter bar */}
      <div className="mb-4 space-y-3">
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-0">
            <label className="block text-xs font-medium text-muted-foreground mb-1">From</label>
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-auto text-sm"
            />
          </div>
          <div className="min-w-0">
            <label className="block text-xs font-medium text-muted-foreground mb-1">To</label>
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-auto text-sm"
            />
          </div>
          {properties.length > 1 && (
            <div className="min-w-0">
              <label className="block text-xs font-medium text-muted-foreground mb-1">Property</label>
              <Select value={propertyFilter} onChange={(e) => setPropertyFilter(e.target.value)} className="text-sm">
                <option value="">All Properties</option>
                {properties.map(([id, name]) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </Select>
            </div>
          )}
          <div className="min-w-0">
            <label className="block text-xs font-medium text-muted-foreground mb-1">Status</label>
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="text-sm">
              <option value="all">All</option>
              <option value="completed">Completed</option>
              <option value="canceled">Canceled</option>
              <option value="self_resolved">Self-Resolved</option>
            </Select>
          </div>
          <Button variant="outline" size="sm" onClick={exportCSV} className="h-9">
            <Download className="mr-1.5 h-3.5 w-3.5" />
            Export CSV
          </Button>
        </div>
        {hasFilters && (
          <div className="flex items-center gap-3">
            <p className="text-xs text-muted-foreground">
              Showing {filtered.length} of {issues.length} records
              {totalCost > 0 &&
                ` — $${totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            </p>
            <button
              onClick={() => {
                setDateFrom('');
                setDateTo('');
                setPropertyFilter('');
                setStatusFilter('all');
              }}
              className="text-xs text-primary hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
      {children(filtered)}
    </div>
  );
}
