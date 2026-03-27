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

export async function sendRepairRequestSms(to: string, body: string) {
  const client = getTwilioClient();
  return client.messages.create({
    to,
    from: process.env.TWILIO_PHONE_NUMBER!,
    body,
  });
}
