import { Resend } from 'resend';

let _resend: Resend | null = null;

function getResendClient() {
  if (!_resend) {
    const key = process.env.RESEND_API_KEY;
    if (!key || key === 'REPLACE_ME' || key === 're_REPLACE_ME') {
      throw new Error('Resend API key not configured. Set RESEND_API_KEY in .env');
    }
    _resend = new Resend(key);
  }
  return _resend;
}

export async function sendRepairRequestEmail(to: string, subject: string, html: string, replyTo?: string) {
  const client = getResendClient();
  return client.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to,
    subject,
    html,
    ...(replyTo ? { reply_to: replyTo } : {}),
  });
}

/** Fetch a received (inbound) email's full content by ID */
export async function getReceivedEmail(emailId: string) {
  const client = getResendClient();
  return (client.emails as any).receiving.get(emailId);
}
