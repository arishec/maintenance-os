import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
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

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET not configured');
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
  }

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : error instanceof Error ? error.message : 'We encountered an error. Please try again.';
    console.error('Webhook signature verification failed:', message);
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
  }

  // Idempotency: prevent duplicate processing on webhook retries
  try {
    await prisma.stripeEvent.create({
      data: { eventId: event.id, type: event.type },
    });
  } catch {
    // Unique constraint violation means we already processed this event
    return NextResponse.json({ received: true, deduplicated: true });
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

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId =
          typeof invoice.customer === 'string'
            ? invoice.customer
            : (invoice.customer as Stripe.Customer)?.id;

        if (customerId) {
          const user = await prisma.user.findFirst({
            where: { stripeCustomerId: customerId },
          });
          if (user) {
            console.warn(`Payment failed for user ${user.id}`);
            try {
              const { createNotification } = await import('@/lib/notifications');
              await createNotification({
                userId: user.id,
                type: 'payment_failed',
                title: 'Payment failed',
                body: 'Your Pro subscription payment failed. Please update your payment method to keep your Pro features.',
              });
            } catch (e) {
              console.error('Failed to create payment notification:', e);
            }
          }
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
