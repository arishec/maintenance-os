import { NextResponse } from 'next/server';
import { requireDbUser } from '@/lib/auth';
import { getStripe } from '@/lib/stripe';

export async function POST() {
  try {
    const user = await requireDbUser();

    if (!user.stripeCustomerId) {
      return NextResponse.json(
        { error: 'No billing account found. You may be on the free plan.' },
        { status: 400 }
      );
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ifbids.com';

    const session = await getStripe().billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${siteUrl}/settings`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'We encountered an error. Please try again.';
    console.error('Stripe portal error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
