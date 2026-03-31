import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireDbUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { logTimelineEvent } from '@/lib/timeline';
import { sendRepairRequestEmail } from '@/lib/resend';
import { sendRepairRequestSms } from '@/lib/twilio';

const replySchema = z.object({
  message: z.string().min(1, 'Message is required').max(2000),
  channel: z.enum(['email', 'sms']),
  contractorId: z.string().uuid('contractorId is required'),
  contractorResponseId: z.string().uuid().optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireDbUser();
    const { id: issueId } = await params;
    const body = replySchema.parse(await request.json());

    // Verify issue exists and user owns it
    const issue = await prisma.issue.findFirst({
      where: { id: issueId, property: { ownerUserId: user.id } },
      include: {
        property: true,
        dispatches: {
          where: { status: { in: ['sent', 'delivered', 'replied', 'accepted'] } },
          include: { contractor: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!issue) {
      return NextResponse.json({ error: 'Issue not found.' }, { status: 404 });
    }

    // Find the dispatch for the specified contractor — no silent fallback
    const activeDispatch = issue.dispatches.find((d) => d.contractorId === body.contractorId);

    if (!activeDispatch) {
      return NextResponse.json(
        { error: 'No active dispatch found for this contractor on this issue.' },
        { status: 400 }
      );
    }

    const contractor = activeDispatch.contractor;
    if (!contractor) {
      return NextResponse.json({ error: 'Contractor not found for this dispatch.' }, { status: 400 });
    }

    // Build professional message with greeting + sign-off
    const contractorFirst = contractor.name.split(' ')[0];
    const ownerFirst = user.fullName?.split(' ')[0] || 'The Owner';

    // Send via the selected channel
    try {
      if (body.channel === 'email') {
        if (!contractor.email) {
          return NextResponse.json({ error: 'Contractor has no email address.' }, { status: 400 });
        }

        const replyTo = `replies+${activeDispatch.replyToken}@ifbids.com`;
        await sendRepairRequestEmail(
          contractor.email,
          `Re: ${issue.title || 'Maintenance request'}`,
          `<div style="font-family: sans-serif; font-size: 14px; line-height: 1.6;">
            <p>Hi ${contractorFirst},</p>
            <p>${body.message.replace(/\n/g, '<br>')}</p>
            <p>Thanks,<br>${ownerFirst}</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 16px 0;">
            <p style="color: #888; font-size: 12px;">
              Sent via Maintenance OS regarding: ${issue.title || 'Maintenance request'}<br>
              Property: ${issue.property.nickname || issue.property.addressLine1}
            </p>
          </div>`,
          replyTo
        );
      } else {
        if (!contractor.phone) {
          return NextResponse.json({ error: 'Contractor has no phone number.' }, { status: 400 });
        }

        await sendRepairRequestSms(
          contractor.phone,
          `Hi ${contractorFirst},\n\n${body.message}\n\nThanks,\n${ownerFirst}\n\nRe: ${issue.title || 'Maintenance request'}`
        );
      }
    } catch (sendError) {
      console.error('Failed to send reply:', sendError);
      return NextResponse.json({ error: 'Failed to send message. Please try again.' }, { status: 500 });
    }

    // Create ContractorMessage record (durable history of outbound reply)
    try {
      await prisma.contractorMessage.create({
        data: {
          issueId,
          contractorId: contractor.id,
          contractorResponseId: body.contractorResponseId ?? null,
          direction: 'outbound',
          channel: body.channel,
          messageBody: body.message,
          sendStatus: 'sent',
        },
      });
    } catch (e) {
      console.error('Failed to create ContractorMessage record:', e);
      // Don't fail the request — message was already sent
    }

    // Log timeline event (non-blocking)
    try {
      await logTimelineEvent({
        propertyId: issue.propertyId,
        issueId,
        actorType: 'user',
        eventType: 'owner_reply_sent',
        payload: {
          channel: body.channel,
          contractorName: contractor.name,
          contractorId: contractor.id,
          contractorResponseId: body.contractorResponseId ?? null,
          messagePreview: body.message.substring(0, 100),
        },
      });
    } catch (e) {
      console.error('Timeline event failed:', e);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0]?.message || 'Please check your input and try again.' }, { status: 400 });
    }
    const message = error instanceof Error ? error.message : 'We encountered an error. Please try again.';
    console.error('Reply to contractor error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
