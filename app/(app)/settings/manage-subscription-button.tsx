'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Toast } from '@/components/ui/toast';

export function ManageSubscriptionButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleManage() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Could not open billing portal. Please try again.');
        setLoading(false);
        setTimeout(() => setError(null), 4000);
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setError('Could not open billing portal. Please try again.');
      setLoading(false);
      setTimeout(() => setError(null), 4000);
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
      {error && <Toast message={error} type="error" />}
    </div>
  );
}
