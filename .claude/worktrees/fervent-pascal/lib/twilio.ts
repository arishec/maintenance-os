import Twilio from 'twilio';

let _twilio: ReturnType<typeof Twilio> | null = null;

function getTwilioClient() {
  if (!_twilio) {
    const sid = process.env.TWILIO_ACCOUNT_SID;
    const token = process.env.TWILIO_AUTH_TOKEN;
    if (!sid || !token || sid === 'REPLACE_ME' || token === 'REPLACE_ME') {
      throw new Error('Twilio credentials not configured. Set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN in .env');
    }
    _twilio = Twilio(sid, token);
  }
  return _twilio;
}

/**
 * Normalize a phone number to E.164 format (+1XXXXXXXXXX).
 * Handles common US formats: "2155551234", "(215) 555-1234", "12155551234", "+12155551234".
 */
function normalizeToE164(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('1') && digits.length === 11) return `+${digits}`;
  if (digits.length === 10) return `+1${digits}`;
  if (phone.startsWith('+')) return phone;
  return `+${digits}`;
}

export async function sendRepairRequestSms(to: string, body: string) {
  const client = getTwilioClient();
  const normalizedTo = normalizeToE164(to);
  return client.messages.create({
    to: normalizedTo,
    from: process.env.TWILIO_PHONE_NUMBER!,
    body,
  });
}

/**
 * Validate that an incoming request is actually from Twilio.
 * Uses Twilio's built-in signature validation with the auth token.
 */
export function validateTwilioSignature(
  url: string,
  params: Record<string, string>,
  signature: string
): boolean {
  const token = process.env.TWILIO_AUTH_TOKEN;
  if (!token || token === 'REPLACE_ME') {
    console.warn('TWILIO_AUTH_TOKEN not set — skipping signature validation');
    return false;
  }
  return Twilio.validateRequest(token, signature, url, params);
}
