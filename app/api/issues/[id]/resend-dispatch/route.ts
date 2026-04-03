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

    // Rate limit: max 1 resend per contractor per issue per hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentDispatch = await prisma.dispatch.findFirst({
      where: {
        issueId,
        contractorId: contractor.id,
        sentAt: { gte: oneHourAgo },
      },
      orderBy: { sentAt: 'desc' },
    });
    if (recentDispatch) {
      const minutesAgo = Math.round((Date.now() - new Date(recentDispatch.sentAt!).getTime()) / 60000);
      const waitMinutes = 60 - minutesAgo;
      return NextResponse.json(
        { error: `This contractor was contacted ${minutesAgo} minute${minutesAgo !== 1 ? 's' : ''} ago. Please wait ${waitMinutes} more minute${waitMinutes !== 1 ? 's' : ''} before resending.` },
        { status: 429 }
      );
    }

    // Generate a new reply token for the resend
    const replyToken = generateReplyToken();

    // Build channel-appropriate messages
    const message = dispatch.outboundMessage;
    const propertyLabel = issue.property.nickname || issue.property.addressLine1 || 'a property';
    const contractorFirst = contractor.name?.split(' ')[0] || 'Hi';

    // SMS: short reminder — saves cost and avoids multi-segment messages
    const smsMessage = `Hi ${contractorFirst}, following up on a repair request at ${propertyLabel}: ${issue.title || 'maintenance issue'}. Please reply with your quote or availability. [Ref: ${replyToken}]`;

    // Email: full original message with context
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
      // All DB mutations in one transaction after successful send
      await prisma.$transaction(async (tx) => {
        // Close the old dispatch so the old reply token won't create duplicate responses
        await tx.dispatch.update({
          where: { id: dispatch.id },
          data: { status: 'closed', closedReason: 'resent' } as any,
        });

        // Create a NEW dispatch row for the resend with fresh token
        const newDispatch = await tx.dispatch.create({
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
        }, tx);
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0]?.message || 'Please check your input and try again.' }, { status: 400 });
    }
    const message = error instanceof Error ? error.message : 'We encountered an error. Please try again.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
