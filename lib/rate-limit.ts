/**
 * Simple in-memory rate limiter for API routes.
 *
 * Works per-serverless-instance (not globally shared), which is fine for
 * beta traffic. For production scale, swap to Upstash Redis or similar.
 *
 * Usage:
 *   const limiter = createRateLimiter({ windowMs: 60_000, max: 20 });
 *   // In route handler:
 *   const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
 *   const { allowed, remaining } = limiter.check(ip);
 *   if (!allowed) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

interface RateLimiterOptions {
  /** Time window in milliseconds (default: 60 seconds) */
  windowMs?: number;
  /** Max requests per window (default: 30) */
  max?: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

export function createRateLimiter(options: RateLimiterOptions = {}) {
  const windowMs = options.windowMs ?? 60_000;
  const max = options.max ?? 30;
  const store = new Map<string, RateLimitEntry>();

  // Periodic cleanup to prevent memory growth (every 5 minutes)
  let lastCleanup = Date.now();

  function cleanup() {
    const now = Date.now();
    if (now - lastCleanup < 300_000) return; // Only clean up every 5 min
    lastCleanup = now;
    for (const [key, entry] of store) {
      if (entry.resetAt <= now) store.delete(key);
    }
  }

  return {
    check(key: string): RateLimitResult {
      cleanup();
      const now = Date.now();
      const entry = store.get(key);

      if (!entry || entry.resetAt <= now) {
        // New window
        store.set(key, { count: 1, resetAt: now + windowMs });
        return { allowed: true, remaining: max - 1, resetAt: now + windowMs };
      }

      entry.count++;
      const allowed = entry.count <= max;
      return {
        allowed,
        remaining: Math.max(0, max - entry.count),
        resetAt: entry.resetAt,
      };
    },
  };
}

// Pre-built limiters for common use cases
/** General API: 30 requests per minute per IP */
export const apiLimiter = createRateLimiter({ windowMs: 60_000, max: 30 });

/** Issue creation: 10 per minute per IP (each triggers AI classification) */
export const issueCreateLimiter = createRateLimiter({ windowMs: 60_000, max: 10 });

/** Dispatch: 5 per minute per IP (each sends SMS/email) */
export const dispatchLimiter = createRateLimiter({ windowMs: 60_000, max: 5 });
