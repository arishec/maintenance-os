// This webhook route is intentionally empty.
// The active Stripe webhook handler lives at /api/stripe/webhook/route.ts
// This file exists only to avoid a stale import. Do not use this route.
export async function POST() {
  return new Response('Use /api/stripe/webhook instead', { status: 404 });
}
