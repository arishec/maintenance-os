'use client';

import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import { ClipboardList, Clock, HardHat, House, LayoutDashboard, Menu, Plus, Settings, X, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NotificationsBell } from '@/components/notifications-bell';

const nav: Array<{
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
}> = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/properties', label: 'Properties', icon: House },
  { href: '/issues', label: 'Issues', icon: ClipboardList },
  { href: '/contractors', label: 'Contractors', icon: HardHat },
  { href: '/history', label: 'History', icon: Clock },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function LayoutShell({ children }: { children: ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const marketingLinks = [
    { href: '/features', label: 'Features' },
    { href: '/how-it-works', label: 'How It Works' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/guides', label: 'Guides' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top nav bar — marketing links (visible on all screen sizes) */}
      <div className="border-b border-border bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 lg:px-8">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-lg font-semibold hover:opacity-80 transition-opacity">
              Maintenance OS
            </Link>
            <nav className="hidden md:flex items-center gap-5">
              {marketingLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>

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
                    href={item.href}
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

            <div className="mt-4 border-t border-border pt-4">
              <div className="px-1 mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Explore
              </div>
              {marketingLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="mt-4 border-t border-border pt-4 px-2 flex items-center justify-between gap-2">
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
                  href={item.href}
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
