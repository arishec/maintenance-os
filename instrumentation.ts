import { validateEnv } from '@/lib/env';

export function register() {
  // Validate environment variables on startup (server-side only)
  validateEnv();
}
