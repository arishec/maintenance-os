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
  const fromEmail = process.env.RESEND_FROM_EMAIL;
  if (!fromEmail) {
    throw new Error('RESEND_FROM_EMAIL not configured. Set it in .env');
  }
  return client.emails.send({
    from: fromEmail,
    to,
    subject,
    html,
    ...(replyTo ? { reply_to: replyTo } : {}),
  });
}

/** Fetch a received (inbound) email's full content by ID via REST API */
export async function getReceivedEmail(emailId: string): Promise<{
  data: { id: string; to: string[]; from: string; subject: string; html: string | null; text: string | null; headers: Record<string, string> } | null;
  error: { message: string; name?: string } | null;
}> {
  const key = process.env.RESEND_API_KEY;
  if (!key || key === 'REPLACE_ME' || key === 're_REPLACE_ME') {
    throw new Error('Resend API key not configured');
  }

  const response = await fetch(`https://api.resend.com/emails/receiving/${emailId}`, {
    headers: { Authorization: `Bearer ${key}` },
  });

  if (!response.ok) {
    const errorText = await response.text();
    return { data: null, error: { message: `Resend API ${response.status}: ${errorText}` } };
  }

  const data = await response.json();
  return { data, error: null };
}
