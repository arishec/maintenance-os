import { NextResponse } from 'next/server';
import { requireDbUser } from '@/lib/auth';
import { getStripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
    const user = await requireDbUser();

    // Guard: don't let already-Pro users create duplicate checkout sessions
    if (user.plan === 'pro') {
      return NextResponse.json(
        { error: 'ALREADY_PRO', message: 'You already have an active Pro plan.' },
        { status: 400 }
      );
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ifbids.com';

    // If user already has a Stripe customer ID, reuse it
    let customerId = user.stripeCustomerId;

    if (!customerId) {
      const customer = await getStripe().customers.create({
        email: user.email,
        metadata: { userId: user.id },
      });
      customerId = customer.id;

      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId },
      });
    }

    const session = await getStripe().checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [
        {
          price: process.env.STRIPE_PRO_PRICE_ID!,
          quantity: 1,
        },
      ],
      success_url: `${siteUrl}/dashboard?upgraded=true`,
      cancel_url: `${siteUrl}/pricing`,
      subscription_data: {
        metadata: { userId: user.id },
      },
      metadata: { userId: user.id },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'We encountered an error. Please try again.';
    console.error('Stripe checkout error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
