/**
 * Stale dispatch detection — derived state, no new DB status.
 *
 * A dispatch is "stale" when:
 * - status is sent or delivered
 * - no responses exist
 * - createdAt is older than threshold
 */

const DEFAULT_STALE_HOURS = 72;

interface DispatchLike {
  status: string;
  createdAt: Date;
  responses?: Array<unknown>;
}

export function isDispatchStale(
  dispatch: DispatchLike,
  thresholdHours: number = DEFAULT_STALE_HOURS
): boolean {
  if (!['sent', 'delivered'].includes(dispatch.status)) return false;
  if (dispatch.responses && dispatch.responses.length > 0) return false;
  const age = Date.now() - dispatch.createdAt.getTime();
  return age > thresholdHours * 60 * 60 * 1000;
}

export function getStaleAge(dispatch: DispatchLike): { days: number; hours: number } {
  const ageMs = Date.now() - dispatch.createdAt.getTime();
  const totalHours = Math.floor(ageMs / (1000 * 60 * 60));
  return {
    days: Math.floor(totalHours / 24),
    hours: totalHours % 24,
  };
}

export function formatStaleAge(dispatch: DispatchLike): string {
  const { days, hours } = getStaleAge(dispatch);
  if (days > 0) return `${days} day${days === 1 ? '' : 's'}`;
  return `${hours} hour${hours === 1 ? '' : 's'}`;
}
