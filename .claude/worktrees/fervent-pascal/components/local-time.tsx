'use client';

/**
 * Renders a date/time string in the user's local timezone.
 * Use this instead of toLocaleString() in server components,
 * which would render in UTC (server timezone).
 */
export function LocalTime({ date, format = 'datetime' }: { date: string | Date; format?: 'date' | 'time' | 'datetime' }) {
  if (!date) return <>—</>;
  const d = new Date(date);
  if (isNaN(d.getTime())) return <>—</>;

  if (format === 'date') {
    return <>{d.toLocaleDateString()}</>;
  }
  if (format === 'time') {
    return <>{d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</>;
  }
  return <>{d.toLocaleDateString()} at {d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</>;
}
