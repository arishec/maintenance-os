'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import { ClipboardList, Clock, HardHat, House, LayoutDashboard, Menu, Plus, Settings, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NotificationsBell } from '@/components/notifications-bell';

const nav = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/properties', label: 'Properties', icon: House },
  { href: '/issues', label: 'Issues', icon: ClipboardList },
  { href: '/contractors', label: 'Contractors', icon: HardHat },
  { href: '/history', label: 'History', icon: Clock },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-white px-4 py-3 lg:hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="rounded-lg p-1.5 hover:bg-muted"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
          <span className="text-lg font-semibold">Maintenance OS</span>
        </div>
        <div className="flex items-center gap-2">
          <NotificationsBell dropDirection="down" />
          <Link href="/issues/new">
            <Button size="sm">
              <Plus className="mr-1 h-4 w-4" />
              Report
            </Button>
          </Link>
        </div>
      </div>

      {/* Mobile slide-out menu overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Drawer */}
          <div className="fixed inset-y-0 left-0 w-72 bg-white p-4 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold">Maintenance OS</div>
                <div className="text-xs text-muted-foreground">Homeowner + landlord workflow</div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg p-1.5 hover:bg-muted"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <Link href="/issues/new" onClick={() => setMobileMenuOpen(false)}>
              <Button className="mb-4 w-full" size="default">
                <Plus className="mr-2 h-4 w-4" />
                Report Issue
              </Button>
            </Link>

            <nav className="space-y-1">
              {nav.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.href}
                    href={item.href as never}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                      isActive ? 'bg-primary/10 font-medium text-primary' : 'hover:bg-muted'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-6 border-t border-border pt-4 px-2 flex items-center justify-between gap-2">
              <NotificationsBell />
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      )}

      {/* Desktop layout with sidebar */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-4 lg:grid-cols-[220px_minmax(0,1fr)] lg:px-8 lg:py-6">
        {/* Desktop sidebar - hidden on mobile */}
        <aside className="hidden lg:flex flex-col rounded-2xl border border-border bg-white p-4 shadow-sm">
          <div className="mb-4 px-2">
            <div className="text-lg font-semibold">Maintenance OS</div>
            <div className="text-xs text-muted-foreground">Homeowner + landlord workflow</div>
          </div>
          <Link href="/issues/new">
            <Button className="mb-4 w-full" size="default">
              <Plus className="mr-2 h-4 w-4" />
              Report Issue
            </Button>
          </Link>
          <nav className="flex-1 space-y-1">
            {nav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href as never}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors ${
                    isActive ? 'bg-primary/10 font-medium text-primary' : 'hover:bg-muted'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-4 border-t border-border pt-4 px-2 flex items-center justify-between gap-2">
            <NotificationsBell />
            <UserButton afterSignOutUrl="/" />
          </div>
        </aside>

        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
