import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const ADMIN_EMAIL = process.env.CONTACT_ADMIN_EMAIL || 'ashechtman@icloud.com';

function escapeHtml(str: string) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Simple in-memory rate limiter (3 messages per 10 minutes per IP)
// Note: this is per-instance only. For real production traffic, swap to Upstash Redis.
const store = new Map<string, { count: number; resetAt: number }>();
const contactLimiter = {
  check(key: string) {
    const now = Date.now();
    // Clean stale entries inline (no setInterval needed)
    for (const [k, entry] of store) {
      if (now > entry.resetAt) store.delete(k);
    }
    const entry = store.get(key);
    if (!entry || now > entry.resetAt) {
      store.set(key, { count: 1, resetAt: now + 10 * 60 * 1000 });
      return { allowed: true };
    }
    if (entry.count >= 3) return { allowed: false };
    entry.count++;
    return { allowed: true };
  },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Trim and normalize inputs
    const name = typeof body?.name === 'string' ? body.name.trim() : '';
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
    const message = typeof body?.message === 'string' ? body.message.trim() : '';

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    // Length limits
    if (name.length > 120) {
      return NextResponse.json({ error: 'Name is too long.' }, { status: 400 });
    }
    if (email.length > 320) {
      return NextResponse.json({ error: 'Email is too long.' }, { status: 400 });
    }
    if (message.length > 5000) {
      return NextResponse.json({ error: 'Message is too long (max 5000 characters).' }, { status: 400 });
    }

    // Basic email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    // Rate limit by IP — parse first IP from x-forwarded-for
    const forwardedFor = request.headers.get('x-forwarded-for') ?? '';
    const ip = forwardedFor.split(',')[0]?.trim() || 'unknown';
    const { allowed } = contactLimiter.check(ip);
    if (!allowed) {
      return NextResponse.json({ error: 'Too many messages. Please wait a few minutes.' }, { status: 429 });
    }

    const key = process.env.RESEND_API_KEY;
    const from = process.env.RESEND_FROM_EMAIL;
    if (!key || !from || !ADMIN_EMAIL || key === 'REPLACE_ME') {
      console.error('Contact form email config missing');
      return NextResponse.json({ error: 'Unable to send message right now.' }, { status: 500 });
    }

    const resend = new Resend(key);
    const result = await resend.emails.send({
      from,
      to: ADMIN_EMAIL,
      replyTo: email,
      subject: `Contact form: ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px;">
          <h2 style="margin-bottom: 8px;">New contact form message</h2>
          <div style="background: #f3f4f6; padding: 12px 16px; border-radius: 8px; margin-bottom: 16px; font-size: 13px; color: #666;">
            <strong>Name:</strong> ${escapeHtml(name)}<br/>
            <strong>Email:</strong> ${escapeHtml(email)}<br/>
            <strong>Time:</strong> ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })}
          </div>
          <div style="white-space: pre-wrap; font-size: 14px; color: #333;">${escapeHtml(message)}</div>
          <hr style="margin: 24px 0; border: none; border-top: 1px solid #eee;" />
          <p style="color: #999; font-size: 11px;">
            Reply to this email to respond directly to ${escapeHtml(name)} at ${escapeHtml(email)}.
          </p>
        </div>
      `,
    });

    // Verify Resend actually sent the email
    if ('error' in result && result.error) {
      console.error('Resend send failed:', result.error);
      return NextResponse.json({ error: 'Unable to send message right now.' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', {
      message: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json({ error: 'Unable to send message right now.' }, { status: 500 });
  }
}
