import { Resend } from 'resend';

const ADMIN_EMAIL = 'ashechtman@icloud.com';

export async function sendNewSignupAlert(userEmail: string, userName?: string) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!key || !from || key === 'REPLACE_ME') return;

  try {
    const resend = new Resend(key);
    await resend.emails.send({
      from,
      to: ADMIN_EMAIL,
      subject: `New signup: ${userName || userEmail}`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px;">
          <h2 style="margin-bottom: 8px;">New user signed up</h2>
          <p><strong>Name:</strong> ${userName || 'Not provided'}</p>
          <p><strong>Email:</strong> ${userEmail}</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })}</p>
          <hr style="margin: 16px 0; border: none; border-top: 1px solid #eee;" />
          <p style="color: #888; font-size: 12px;">Maintenance OS — Beta</p>
        </div>
      `,
    });
  } catch (err) {
    console.error('Failed to send signup alert:', err);
  }
}
