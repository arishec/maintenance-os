'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/** Silently refreshes the dashboard every 30 seconds so new quotes / status changes show up without a manual reload. */
export function AutoRefresh({ intervalMs = 30_000 }: { intervalMs?: number }) {
  const router = useRouter();

  useEffect(() => {
    const id = setInterval(() => {
      router.refresh();
    }, intervalMs);
    return () => clearInterval(id);
  }, [router, intervalMs]);

  return null; // renders nothing — just runs the timer
}
