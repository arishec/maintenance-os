'use client';

import { useEffect, useState } from 'react';

/**
 * Renders a date/time string in the user's local timezone.
 * Uses useEffect to avoid hydration mismatch between server (UTC)
 * and client (local timezone).
 */
export function LocalTime({ date, format = 'datetime' }: { date: string | Date; format?: 'date' | 'time' | 'datetime' }) {
  const [formatted, setFormatted] = useState<string>('');

  useEffect(() => {
    if (!date) {
      setFormatted('—');
      return;
    }
    const d = new Date(date);
    if (isNaN(d.getTime())) {
      setFormatted('—');
      return;
    }

    if (format === 'date') {
      setFormatted(d.toLocaleDateString());
    } else if (format === 'time') {
      setFormatted(d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }));
    } else {
      setFormatted(`${d.toLocaleDateString()} at ${d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`);
    }
  }, [date, format]);

  // Render empty on server, formatted on client — avoids hydration mismatch
  return <>{formatted}</>;
}
