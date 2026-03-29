'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function ManageSubscriptionButton() {
  const [loading, setLoading] = useState(false);

  async function handleManage() {
    setLoading(true);
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' });
      const data = await res.json();

      if (!res.ok) {
        console.error('Portal error:', data.error);
        setLoading(false);
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Failed to open billing portal:', error);
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-between">
      <p className="text-xs text-muted-foreground">
        Manage your subscription, update payment method, or cancel
      </p>
      <Button
        variant="outline"
        size="sm"
        onClick={handleManage}
        disabled={loading}
      >
        {loading ? 'Opening...' : 'Manage Subscription'}
      </Button>
    </div>
  );
}
