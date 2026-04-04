import { prisma } from '@/lib/prisma';
import { sendRepairRequestEmail } from '@/lib/resend';
import { escapeHtml } from '@/lib/utils';

type TransactionClient = Parameters<Parameters<typeof prisma.$transaction>[0]>[0];

export async function createNotification(input: {
  userId: string;
  type: string;
  title: string;
  body: string;
  issueId?: string;
}, tx?: TransactionClient) {
  const db = tx || prisma;
  return db.notification.create({
    data: input,
  });
}

/** Format a number as currency with commas, e.g. 3000 → "3,000" */
function fmtPrice(amount: number | string | null | undefined): string {
  if (amount == null) return '—';
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return String(amount);
  return num.toLocaleString('en-US');
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
  contractorName?: string;
  quote?: string | null;
  availability?: string | null;
  question?: string | null;
  notificationType?: string;
}) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: input.userId },
      select: { email: true, fullName: true },
    });

    if (!user?.email) {
      console.warn('[sendOwnerNotificationEmail] No email for user', input.userId);
      return;
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ifbids.com';
    const issueUrl = `${siteUrl}/issues/${input.issueId}`;

    // Determine heading and subject based on notification type
    let emailHeading = 'New quote received';
    let emailSubject = `New quote for: ${input.issueTitle}`;

    if (input.notificationType === 'contractor_confirmed') {
      emailHeading = 'Contractor confirmed the job';
      emailSubject = `Contractor confirmed: ${input.issueTitle}`;
    } else if (input.notificationType === 'contractor_declined') {
      emailHeading = 'Contractor declined the job';
      emailSubject = `Contractor declined: ${input.issueTitle}`;
    } else if (input.notificationType === 'contractor_replied') {
      emailHeading = 'New quote received';
      emailSubject = `New quote for: ${input.issueTitle}`;
    }

    // Build structured email body if we have structured data, otherwise fall back to notifBody
    let bodyHtml: string;
    if (input.contractorName && input.quote) {
      const lines: string[] = [];
      lines.push(`<strong>${escapeHtml(input.contractorName)}</strong> quoted <strong>$${fmtPrice(input.quote)}</strong> for ${escapeHtml(input.issueTitle)}`);
      if (input.availability) {
        lines.push(`<strong>Available:</strong> ${escapeHtml(input.availability)}`);
      }
      if (input.question) {
        lines.push(`<strong>They asked:</strong> "${escapeHtml(input.question)}"`);
      }
      bodyHtml = lines.map(l => `<p style="color: #333; font-size: 15px; line-height: 1.5; margin: 0 0 8px;">${l}</p>`).join('\n          ');
    } else {
      bodyHtml = `<p style="color: #333; font-size: 15px; line-height: 1.5; margin: 0 0 16px;">${escapeHtml(input.notifBody)}</p>`;
    }

    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto;">
        <h2 style="color: #1a1a1a; font-size: 18px; margin-bottom: 12px;">${emailHeading}</h2>
        ${bodyHtml}
        <div style="margin-top: 16px;">
          <a href="${encodeURI(issueUrl)}" style="display: inline-block; background: #2563eb; color: #fff; padding: 10px 24px; border-radius: 6px; text-decoration: none; font-size: 14px; font-weight: 500;">
            View Issue
          </a>
        </div>
        <p style="color: #999; font-size: 12px; margin-top: 24px;">
          Maintenance OS — ${siteUrl}
        </p>
      </div>
    `.trim();

    await sendRepairRequestEmail(
      user.email,
      emailSubject,
      html
    );

  } catch (error) {
    console.error('[sendOwnerNotificationEmail] Failed:', error);
    // Don't throw — notification email failure shouldn't break the webhook
  }
}
