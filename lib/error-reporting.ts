/**
 * Report an error to Sentry if available.
 * Safe to call even if @sentry/nextjs is not installed.
 */
export function reportError(error: Error): void {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Sentry = require('@sentry/nextjs');
    Sentry.captureException(error);
  } catch {
    // Sentry not installed — silently skip
  }
}
