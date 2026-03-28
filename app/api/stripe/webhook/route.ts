import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import type Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Webhook signature verification failed:', message);
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;

        if (userId && session.subscription) {
          await prisma.user.update({
            where: { id: userId },
            data: {
              plan: 'pro',
              stripeSubscriptionId: session.subscription as string,
            },
          });
          console.log(`User ${userId} upgraded to pro`);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;

        if (userId) {
          const isActive = ['active', 'trialing'].includes(subscription.status);
          await prisma.user.update({
            where: { id: userId },
            data: {
              plan: isActive ? 'pro' : 'free',
              stripeSubscriptionId: subscription.id,
            },
          });
          console.log(`User ${userId} subscription updated: ${subscription.status} -> plan: ${isActive ? 'pro' : 'free'}`);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;

        if (userId) {
          await prisma.user.update({
            where: { id: userId },
            data: {
              plan: 'free',
              stripeSubscriptionId: null,
            },
          });
          console.log(`User ${userId} subscription cancelled, reverted to free`);
        }
        break;
      }

      default:
        // Unhandled event type — that's fine
        break;
    }
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
