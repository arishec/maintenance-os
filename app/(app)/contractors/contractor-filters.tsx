'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface Contractor {
  id: string;
  name: string;
  companyName: string | null;
  phone: string | null;
  email: string | null;
  trade: string;
  isPreferred: boolean;
}

function tradeLabel(trade: string): string {
  return trade.split('_').join(' ').replace(/\b\w/g, c => c.toUpperCase());
}

export function ContractorFilters({
  contractors,
  children,
}: {
  contractors: Contractor[];
  children: (filtered: Contractor[]) => React.ReactNode;
}) {
  const [search, setSearch] = useState('');
  const [tradeFilter, setTradeFilter] = useState<string | null>(null);
  const [preferredOnly, setPreferredOnly] = useState(false);

  // Get unique trades
  const trades = Array.from(new Set(contractors.map(c => c.trade))).sort();

  const filtered = contractors.filter(c => {
    if (preferredOnly && !c.isPreferred) return false;
    if (tradeFilter && c.trade !== tradeFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      const match =
        c.name.toLowerCase().includes(q) ||
        (c.companyName?.toLowerCase().includes(q)) ||
        (c.phone?.includes(q)) ||
        (c.email?.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  return (
    <div>
      {/* Search and filters */}
      <div className="mb-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, company, phone, or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => { setTradeFilter(null); setPreferredOnly(false); setSearch(''); }}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              !tradeFilter && !preferredOnly
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-white hover:bg-muted border-border text-muted-foreground'
            }`}
          >
            All ({contractors.length})
          </button>
          <button
            onClick={() => setPreferredOnly(!preferredOnly)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              preferredOnly
                ? 'bg-amber-100 text-amber-800 border-amber-300'
                : 'bg-white hover:bg-muted border-border text-muted-foreground'
            }`}
          >
            Preferred
          </button>
          {trades.map(trade => (
            <button
              key={trade}
              onClick={() => setTradeFilter(tradeFilter === trade ? null : trade)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                tradeFilter === trade
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-white hover:bg-muted border-border text-muted-foreground'
              }`}
            >
              {tradeLabel(trade)}
            </button>
          ))}
        </div>
      </div>

      {/* Filtered count */}
      {(search || tradeFilter || preferredOnly) && (
        <p className="text-xs text-muted-foreground mb-3">
          Showing {filtered.length} of {contractors.length} contractor{contractors.length !== 1 ? 's' : ''}
        </p>
      )}

      {children(filtered)}
    </div>
  );
}
