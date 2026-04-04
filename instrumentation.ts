import { validateEnv } from '@/lib/env';

export function register() {
  validateEnv();

  if (process.env.NEXT_RUNTIME === 'nodejs') {
    import('./sentry.server.config');
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    import('./sentry.edge.config');
  }
}
