import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    // Parse form data from Twilio
    const formData = await request.formData();
    const messageSid = formData.get('MessageSid') as string | null;
    const messageStatus = formData.get('MessageStatus') as string | null;

    if (!messageSid || !messageStatus) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    // Find dispatch by provider message ID
    const dispatch = await prisma.dispatch.findUnique({
      where: { providerMessageId: messageSid },
    });

    if (!dispatch) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    // Update dispatch status based on message status
    if (messageStatus === 'delivered') {
      await prisma.dispatch.update({
        where: { id: dispatch.id },
        data: {
          status: 'delivered',
          deliveredAt: new Date(),
        },
      });
    } else if (messageStatus === 'failed' || messageStatus === 'undelivered') {
      await prisma.dispatch.update({
        where: { id: dispatch.id },
        data: {
          status: 'failed',
          failedAt: new Date(),
        },
      });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Twilio status callback webhook error:', error);
    return NextResponse.json({ success: true }, { status: 200 });
  }
}
