'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { getCategoryLabel, getIssueStatusColor, getIssueStatusLabel } from '@/lib/status';

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

function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}

export function HistoryTable({
  issues,
  hasCosts,
  hasCategories,
}: {
  issues: HistoryIssue[];
  hasCosts: boolean;
  hasCategories: boolean;
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
      if (statusFilter === 'completed' && (issue.status !== 'completed' || issue.isSelfResolved)) return false;
      if (statusFilter === 'canceled' && issue.status !== 'canceled') return false;
      if (statusFilter === 'self_resolved' && !issue.isSelfResolved) return false;
      return true;
    });
  }, [issues, dateFrom, dateTo, propertyFilter, statusFilter]);

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
                ` — ${formatCurrency(totalCost)}`}
            </p>
            <button
              type="button"
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

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted/50">
                <tr className="text-muted-foreground">
                  <th className="text-left p-4 font-medium">Date</th>
                  <th className="text-left p-4 font-medium">Property</th>
                  <th className="text-left p-4 font-medium">Issue</th>
                  {hasCategories && <th className="text-left p-4 font-medium">Category</th>}
                  <th className="text-left p-4 font-medium">Contractor</th>
                  {hasCosts && <th className="text-left p-4 font-medium">Cost</th>}
                  <th className="text-left p-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((issue) => (
                  <tr key={issue.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="p-4 text-muted-foreground text-xs">
                      {issue.completedAt ? new Date(issue.completedAt).toLocaleDateString() : '—'}
                    </td>
                    <td className="p-4 text-muted-foreground">{issue.propertyName}</td>
                    <td className="p-4">
                      <Link href={`/issues/${issue.id}`} className="font-medium hover:underline">
                        {issue.title || 'Untitled Issue'}
                      </Link>
                    </td>
                    {hasCategories && (
                      <td className="p-4">
                        {issue.category ? (
                          <Badge className="border-slate-200 bg-slate-50 text-slate-700">
                            {getCategoryLabel(issue.category)}
                          </Badge>
                        ) : '—'}
                      </td>
                    )}
                    <td className="p-4 text-muted-foreground text-sm">{issue.contractorName || '—'}</td>
                    {hasCosts && (
                      <td className="p-4 text-muted-foreground text-sm">
                        {issue.cost ? formatCurrency(issue.cost) : '—'}
                      </td>
                    )}
                    <td className="p-4">
                      {(() => {
                        if (issue.isSelfResolved) {
                          return (
                            <div>
                              <Badge className="bg-blue-50 text-blue-700 border-blue-200">Self-resolved</Badge>
                              {issue.reason && (
                                <p className="text-xs text-muted-foreground mt-1 max-w-[200px] truncate">{issue.reason}</p>
                              )}
                            </div>
                          );
                        }
                        if (issue.status === 'canceled') {
                          return (
                            <div>
                              <Badge className="bg-red-50 text-red-700 border-red-200">Canceled</Badge>
                              {issue.reason && (
                                <p className="text-xs text-muted-foreground mt-1 max-w-[200px] truncate">{issue.reason}</p>
                              )}
                            </div>
                          );
                        }
                        return <Badge className={getIssueStatusColor(issue.status)}>{getIssueStatusLabel(issue.status)}</Badge>;
                      })()}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted-foreground">
                      No records match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
