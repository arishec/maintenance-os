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
          take: 1,
        },
      },
    });

    if (!issue) {
      return NextResponse.json({ error: 'Issue not found.' }, { status: 404 });
    }

    // Find the active dispatch (prefer accepted, then most recent)
    const activeDispatch = issue.dispatches[0];
    if (!activeDispatch) {
      return NextResponse.json(
        { error: 'No active contractor dispatch found for this issue.' },
        { status: 400 }
      );
    }

    const contractor = activeDispatch.contractor;
    if (!contractor) {
      return NextResponse.json({ error: 'Contractor not found for this dispatch.' }, { status: 400 });
    }

    // Send via the selected channel
    try {
      if (body.channel === 'email') {
        if (!contractor.email) {
          return NextResponse.json({ error: 'Contractor has no email address.' }, { status: 400 });
        }

        const replyTo = process.env.RESEND_FROM_EMAIL || undefined;
        await sendRepairRequestEmail(
          contractor.email,
          `Re: ${issue.title || 'Maintenance request'}`,
          `<div style="font-family: sans-serif; font-size: 14px; line-height: 1.6;">
            <p>${body.message.replace(/\n/g, '<br>')}</p>
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
          `Re: ${issue.title || 'Maintenance request'}\n\n${body.message}`
        );
      }
    } catch (sendError) {
      console.error('Failed to send reply:', sendError);
      return NextResponse.json({ error: 'Failed to send message. Please try again.' }, { status: 500 });
    }

    // Log timeline event (non-blocking — don't fail the request)
    try {
      await logTimelineEvent({
        propertyId: issue.propertyId,
        issueId,
        actorType: 'user',
        eventType: 'owner_reply_sent',
        payload: {
          channel: body.channel,
          contractorName: contractor.name,
          messagePreview: body.message.substring(0, 100),
        },
      });
    } catch (e) {
      console.error('Timeline event failed:', e);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0]?.message || 'Invalid input' }, { status: 400 });
    }
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Reply to contractor error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
