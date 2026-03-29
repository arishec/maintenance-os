import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireDbUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendRepairRequestSms } from '@/lib/twilio';
import { sendRepairRequestEmail } from '@/lib/resend';
import { logTimelineEvent } from '@/lib/timeline';
import { generateReplyToken } from '@/lib/tokens';

const resendSchema = z.object({
  dispatchId: z.string().uuid(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireDbUser();
    const { id: issueId } = await params;
    const body = resendSchema.parse(await request.json());

    // Verify issue + dispatch belong to user
    const dispatch = await prisma.dispatch.findFirst({
      where: {
        id: body.dispatchId,
        issueId,
        issue: { property: { ownerUserId: user.id } },
      },
      include: {
        contractor: true,
        issue: { include: { property: true, photos: true } },
      },
    });

    if (!dispatch) {
      return NextResponse.json({ error: 'Dispatch not found.' }, { status: 404 });
    }

    const contractor = dispatch.contractor;
    const issue = dispatch.issue;

    // Generate a new reply token for the resend
    const replyToken = generateReplyToken();

    // Build message (reuse original outbound message)
    const message = dispatch.outboundMessage;

    const smsMessage = `[Ref: ${replyToken}] ${message}`;
    const emailSubject = `Reminder: Repair request [Ref: ${replyToken}] — ${issue.title}`;
    const emailBody = `<div style="font-family: sans-serif; line-height: 1.6;"><p><strong>Reference: ${replyToken}</strong></p><p>This is a follow-up on a previous request.</p><hr style="border:none;border-top:1px solid #eee;margin:12px 0;">${message.replace(/\n/g, '<br>')}</div>`;

    let sentSuccessfully = false;
    let providerMessageId: string | null = null;

    try {
      if (dispatch.channel === 'sms') {
        if (!contractor.phone) {
          return NextResponse.json({ error: 'Contractor has no phone number.' }, { status: 400 });
        }
        const response = await sendRepairRequestSms(contractor.phone, smsMessage);
        providerMessageId = response.sid;
        sentSuccessfully = true;
      } else {
        if (!contractor.email) {
          return NextResponse.json({ error: 'Contractor has no email.' }, { status: 400 });
        }
        const response = await sendRepairRequestEmail(
          contractor.email,
          emailSubject,
          emailBody,
          `replies+${replyToken}@ifbids.com`
        );
        if (response.data?.id) {
          providerMessageId = response.data.id;
          sentSuccessfully = true;
        }
      }
    } catch (sendError) {
      console.error('Resend failed:', sendError);
      return NextResponse.json({ error: 'Failed to resend. Please try again.' }, { status: 500 });
    }

    if (sentSuccessfully) {
      // Create a NEW dispatch row for the resend — preserves the original token
      // so late replies to the first message still match correctly.
      const newDispatch = await prisma.dispatch.create({
        data: {
          issueId,
          contractorId: contractor.id,
          channel: dispatch.channel,
          replyToken,
          outboundMessage: message,
          status: 'sent',
          sentAt: new Date(),
          providerMessageId,
        },
      });

      // Timeline
      try {
        await logTimelineEvent({
          propertyId: issue.propertyId,
          issueId,
          actorType: 'user',
          eventType: 'dispatch_resent',
          payload: {
            contractorName: contractor.name,
            channel: dispatch.channel,
            originalDispatchId: dispatch.id,
            newDispatchId: newDispatch.id,
          },
        });
      } catch (e) {
        console.error('Timeline event failed:', e);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0]?.message || 'Invalid input' }, { status: 400 });
    }
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
