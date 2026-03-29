import { prisma } from '@/lib/prisma';
import { sendRepairRequestEmail } from '@/lib/resend';

export async function createNotification(input: {
  userId: string;
  type: string;
  title: string;
  body: string;
  issueId?: string;
}) {
  return prisma.notification.create({
    data: input,
  });
}

/**
 * Send an email notification to the property owner when a contractor replies.
 * Non-blocking — logs errors but doesn't throw so webhooks always return 200.
 */
export async function sendOwnerNotificationEmail(input: {
  userId: string;
  issueId: string;
  issueTitle: string;
  notifBody: string;
}) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: input.userId },
      select: { email: true, fullName: true },
    });

    if (!user?.email) {
      console.log('[sendOwnerNotificationEmail] No email for user', input.userId);
      return;
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ifbids.com';
    const issueUrl = `${siteUrl}/issues/${input.issueId}`;

    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto;">
        <h2 style="color: #1a1a1a; font-size: 18px; margin-bottom: 8px;">New quote received</h2>
        <p style="color: #333; font-size: 15px; line-height: 1.5; margin: 0 0 16px;">
          ${input.notifBody}
        </p>
        <a href="${issueUrl}" style="display: inline-block; background: #2563eb; color: #fff; padding: 10px 24px; border-radius: 6px; text-decoration: none; font-size: 14px; font-weight: 500;">
          View Issue
        </a>
        <p style="color: #999; font-size: 12px; margin-top: 24px;">
          Maintenance OS — ${siteUrl}
        </p>
      </div>
    `.trim();

    await sendRepairRequestEmail(
      user.email,
      `New quote for: ${input.issueTitle}`,
      html
    );

    console.log('[sendOwnerNotificationEmail] Sent to', user.email);
  } catch (error) {
    console.error('[sendOwnerNotificationEmail] Failed:', error);
    // Don't throw — notification email failure shouldn't break the webhook
  }
}
