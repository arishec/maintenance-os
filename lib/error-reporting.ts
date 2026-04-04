import * as Sentry from '@sentry/nextjs';

/**
 * Report an error to Sentry.
 * Safe to call even if Sentry DSN is not configured — Sentry will no-op.
 */
export function reportError(error: Error): void {
  Sentry.captureException(error);
}
