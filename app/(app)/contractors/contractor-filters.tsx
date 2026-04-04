'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { LocalTime } from '@/components/local-time';
import { formatPhone } from '@/lib/utils';
import { RestoreButton } from './restore-button';

interface ContractorDisplay {
  id: string;
  name: string;
  companyName: string | null;
  phone: string | null;
  email: string | null;
  trade: string;
  isPreferred: boolean;
  contextParts: string[];
  lastUsedDate: string | null;
  linkedProperties?: { id: string; name: string }[];
}

function tradeLabel(trade: string): string {
  return trade.split('_').join(' ').replace(/\b\w/g, c => c.toUpperCase());
}

export function ContractorList({
  contractors,
  showArchived,
}: {
  contractors: ContractorDisplay[];
  showArchived: boolean;
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

      {/* Contractor cards grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((contractor) => (
          <Link key={contractor.id} href={`/contractors/${contractor.id}`}>
            <Card className="hover:shadow-md transition-all hover:-translate-y-0.5 h-full cursor-pointer">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold leading-tight">{contractor.name}</h3>
                    {contractor.companyName && <p className="text-sm text-muted-foreground">{contractor.companyName}</p>}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className="border-slate-200 bg-slate-50 text-slate-700">{tradeLabel(contractor.trade)}</Badge>
                    {contractor.isPreferred && <span className="text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-1 rounded-full">Preferred</span>}
                  </div>
                  {contractor.contextParts.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      {contractor.contextParts.join(' · ')}
                    </p>
                  )}
                  {contractor.lastUsedDate && (
                    <p className="text-xs text-muted-foreground/70">
                      Last contacted <LocalTime date={new Date(contractor.lastUsedDate)} format="date" />
                    </p>
                  )}
                  {contractor.linkedProperties && contractor.linkedProperties.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Linked to: {contractor.linkedProperties.map(p => p.name).join(', ')}
                    </p>
                  )}
                  <div className="space-y-1 text-sm">
                    {contractor.phone && (
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Phone:</span>
                        <span>{formatPhone(contractor.phone)}</span>
                      </div>
                    )}
                    {contractor.email && (
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Email:</span>
                        <span>{contractor.email}</span>
                      </div>
                    )}
                  </div>
                  {showArchived && (
                    <RestoreButton contractorId={contractor.id} />
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
