import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateTwilioSignature } from '@/lib/twilio';

export async function POST(request: NextRequest) {
  try {
    // Validate Twilio signature
    const signature = request.headers.get('x-twilio-signature') ?? '';
    const url = request.url;
    const formData = await request.formData();
    const params: Record<string, string> = {};
    formData.forEach((value, key) => {
      params[key] = value.toString();
    });

    if (!validateTwilioSignature(url, params, signature)) {
      console.warn('Twilio status callback: invalid signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
    }

    const messageSid = params.MessageSid;
    const messageStatus = params.MessageStatus;

    if (!messageSid || !messageStatus) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    // Find dispatch by provider message ID
    const dispatch = await prisma.dispatch.findFirst({
      where: { providerMessageId: messageSid },
    });

    if (!dispatch) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    // Update dispatch status based on message status
    // Only set timestamps if not already set (Twilio retries webhooks)
    if (messageStatus === 'delivered') {
      await prisma.dispatch.update({
        where: { id: dispatch.id },
        data: {
          status: 'delivered',
          deliveredAt: dispatch.deliveredAt ?? new Date(),
        },
      });
    } else if (messageStatus === 'failed' || messageStatus === 'undelivered') {
      await prisma.dispatch.update({
        where: { id: dispatch.id },
        data: {
          status: 'failed',
          failedAt: dispatch.failedAt ?? new Date(),
        },
      });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Twilio status callback webhook error:', error);
    return NextResponse.json({ success: true }, { status: 200 });
  }
}
