import { Resend } from 'resend';
import { getReceivedEmail } from '@/lib/resend';

const ADMIN_EMAIL = 'ashechtman@icloud.com';

interface SupportEmailData {
  emailId: string;
  from: string;
  to: string[] | null;
  subject: string | null;
}

/** Escape HTML special characters to prevent injection */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function forwardSupportEmail(data: SupportEmailData) {
  const key = process.env.RESEND_API_KEY;
  const fromAddress = process.env.RESEND_FROM_EMAIL;
  if (!key || !fromAddress || key === 'REPLACE_ME') return;

  // Fetch the full email body from Resend
  let bodyText = '(Could not retrieve email body)';
  try {
    const { data: emailContent } = await getReceivedEmail(data.emailId);
    bodyText = emailContent?.text || emailContent?.html?.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() || bodyText;
  } catch {
    // Continue with fallback body
  }

  const toAddress = data.to?.join(', ') || 'unknown';
  const resend = new Resend(key);

  await resend.emails.send({
    from: fromAddress,
    to: ADMIN_EMAIL,
    subject: `[${toAddress}] ${data.subject || 'No subject'}`,
    replyTo: data.from,
    html: `
      <div style="font-family: sans-serif; max-width: 600px;">
        <div style="background: #f3f4f6; padding: 12px 16px; border-radius: 8px; margin-bottom: 16px; font-size: 13px; color: #666;">
          <strong>From:</strong> ${escapeHtml(data.from)}<br/>
          <strong>To:</strong> ${escapeHtml(toAddress)}<br/>
          <strong>Subject:</strong> ${escapeHtml(data.subject || 'No subject')}
        </div>
        <div style="white-space: pre-wrap; font-size: 14px; color: #333;">
${escapeHtml(bodyText)}
        </div>
        <hr style="margin: 24px 0; border: none; border-top: 1px solid #eee;" />
        <p style="color: #999; font-size: 11px;">
          Forwarded from Maintenance OS. Reply directly to respond to the sender.
        </p>
      </div>
    `,
  });
}
