import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import type Stripe from 'stripe';

/**
 * Resolve the user associated with a Stripe subscription.
 * Tries metadata first, then falls back to stripeSubscriptionId, then stripeCustomerId.
 */
async function resolveUserForSubscription(subscription: Stripe.Subscription) {
  // 1. Try subscription metadata
  const metadataUserId = subscription.metadata?.userId;
  if (metadataUserId) {
    const user = await prisma.user.findUnique({
      where: { id: metadataUserId },
    });
    if (user) return user;
  }

  // 2. Fallback: find by stripeSubscriptionId
  const bySubscription = await prisma.user.findFirst({
    where: { stripeSubscriptionId: subscription.id },
  });
  if (bySubscription) return bySubscription;

  // 3. Fallback: find by stripeCustomerId
  const customerId =
    typeof subscription.customer === 'string'
      ? subscription.customer
      : (subscription.customer as Stripe.Customer)?.id;

  if (customerId) {
    const byCustomer = await prisma.user.findFirst({
      where: { stripeCustomerId: customerId },
    });
    if (byCustomer) return byCustomer;
  }

  return null;
}

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
          const customerId =
            typeof session.customer === 'string'
              ? session.customer
              : (session.customer as Stripe.Customer)?.id;

          await prisma.user.update({
            where: { id: userId },
            data: {
              plan: 'pro',
              stripeSubscriptionId: session.subscription as string,
              ...(customerId ? { stripeCustomerId: customerId } : {}),
            },
          });
          console.log(`User ${userId} upgraded to pro`);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const user = await resolveUserForSubscription(subscription);

        if (user) {
          const isActive = ['active', 'trialing'].includes(subscription.status);
          await prisma.user.update({
            where: { id: user.id },
            data: {
              plan: isActive ? 'pro' : 'free',
              stripeSubscriptionId: subscription.id,
            },
          });
          console.log(`User ${user.id} subscription updated: ${subscription.status} -> plan: ${isActive ? 'pro' : 'free'}`);
        } else {
          console.error(`Could not resolve user for subscription ${subscription.id}`);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const user = await resolveUserForSubscription(subscription);

        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              plan: 'free',
              stripeSubscriptionId: null,
            },
          });
          console.log(`User ${user.id} subscription cancelled, reverted to free`);
        } else {
          console.error(`Could not resolve user for deleted subscription ${subscription.id}`);
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
