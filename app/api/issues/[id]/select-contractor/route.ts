import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requireDbUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { logTimelineEvent } from '@/lib/timeline';
import { createNotification } from '@/lib/notifications';
import { sendRepairRequestEmail } from '@/lib/resend';
import { sendRepairRequestSms } from '@/lib/twilio';

const selectContractorSchema = z.object({
  responseId: z.string().uuid(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireDbUser();
    const { id: issueId } = await params;
    const body = selectContractorSchema.parse(await request.json());

    // 1. Verify issue exists, user owns it, and it's in the right state
    const issue = await prisma.issue.findFirst({
      where: { id: issueId, property: { ownerUserId: user.id } },
      include: { property: true },
    });

    if (!issue) {
      return NextResponse.json({ error: 'Issue not found.' }, { status: 404 });
    }

    if (issue.status !== 'quotes_received') {
      return NextResponse.json(
        { error: 'Issue must be in quotes_received status to select a contractor.' },
        { status: 400 }
      );
    }

    // 2. Verify the response exists and belongs to this issue
    const selectedResponse = await prisma.contractorResponse.findFirst({
      where: {
        id: body.responseId,
        dispatch: { issueId },
      },
      include: {
        dispatch: { include: { contractor: true } },
      },
    });

    if (!selectedResponse) {
      return NextResponse.json(
        { error: 'Response not found for this issue.' },
        { status: 400 }
      );
    }

    const contractorId = selectedResponse.dispatch.contractorId;
    const contractor = selectedResponse.dispatch.contractor;

    // 3. Guard: no existing active job (completed/canceled are fine — only block truly in-progress ones)
    const existingActiveJob = await prisma.job.findFirst({
      where: {
        issueId,
        status: { in: ['selected', 'scheduled', 'in_progress'] },
      },
    });

    if (existingActiveJob) {
      return NextResponse.json(
        { error: 'CONTRACTOR_ALREADY_SELECTED' },
        { status: 409 }
      );
    }

    // 4. Determine agreed price from response
    const agreedPrice = selectedResponse.flatEstimate
      || selectedResponse.estimateLow
      || null;

    // 5. Perform all writes atomically via transaction
    const job = await prisma.$transaction(async (tx) => {
      // Create job
      const newJob = await tx.job.create({
        data: {
          issueId,
          contractorId,
          selectedResponseId: body.responseId,
          selectedEstimate: agreedPrice,
          status: 'selected',
        },
        include: { contractor: true, selectedResponse: true },
      });

      // Update issue status
      await tx.issue.update({
        where: { id: issueId },
        data: { status: 'active_job' },
      });

      // Update dispatch for selected contractor → accepted
      await tx.dispatch.updateMany({
        where: { issueId, contractorId },
        data: { status: 'accepted' },
      });

      // Close all other open dispatches
      await tx.dispatch.updateMany({
        where: {
          issueId,
          contractorId: { not: contractorId },
          status: { in: ['sent', 'delivered', 'replied'] },
        },
        data: { status: 'closed', closedReason: 'not_selected' } as any,
      });

      return newJob;
    });

    // 6. Log timeline event
    await logTimelineEvent({
      propertyId: issue.propertyId,
      issueId,
      jobId: job.id,
      actorType: 'user',
      eventType: 'contractor_selected',
      payload: {
        contractorName: contractor.name,
        agreedPrice: agreedPrice?.toString() || null,
        availability: selectedResponse.availabilityText || null,
      },
    });

    // 7. Create notification for owner
    const priceStr = agreedPrice ? `$${Number(agreedPrice).toLocaleString()}` : '';
    await createNotification({
      userId: user.id,
      type: 'contractor_selected',
      title: 'Contractor selected',
      body: `You selected ${contractor.name}${priceStr ? ` (${priceStr})` : ''} for ${issue.title || 'a maintenance issue'}`,
      issueId,
    });

    // 8. Notify the contractor they got the job
    const propertyAddress = issue.property.addressLine1
      ? `${issue.property.addressLine1}${issue.property.city ? `, ${issue.property.city}` : ''}`
      : issue.property.nickname || 'the property';

    const confirmationMsg = [
      `Hi ${contractor.name}, you've been selected for a job: ${issue.title || 'Maintenance request'}.`,
      `Location: ${propertyAddress}.`,
      priceStr ? `Estimated price: ${priceStr}.` : '',
      `Reply to confirm your availability or ask any questions.`,
    ].filter(Boolean).join('\n');

    try {
      const dispatch = selectedResponse.dispatch;
      const replyToken = dispatch.replyToken;
      const tokenizedReplyTo = replyToken
        ? `replies+${replyToken}@ifbids.com`
        : undefined;

      if (dispatch.channel === 'sms' && contractor.phone) {
        const smsResult = await sendRepairRequestSms(contractor.phone, confirmationMsg);
        console.log('[SELECT] SMS sent to contractor:', contractor.name, 'SID:', smsResult?.sid || 'none');
      } else if (contractor.email) {
        const selectionSubject = replyToken
          ? `You've been selected [Ref: ${replyToken}] — ${issue.title || 'Maintenance request'}`
          : `You've been selected: ${issue.title || 'Maintenance request'}`;
        const emailResult = await sendRepairRequestEmail(
          contractor.email,
          selectionSubject,
          `<div style="font-family: sans-serif; font-size: 14px; line-height: 1.6;">
            ${replyToken ? `<p><strong>Reference: ${replyToken}</strong></p>` : ''}
            <p>Hi ${contractor.name},</p>
            <p>You've been selected for a job: <strong>${issue.title || 'Maintenance request'}</strong>.</p>
            <p><strong>Location:</strong> ${propertyAddress}</p>
            ${priceStr ? `<p><strong>Agreed quote:</strong> ${priceStr}</p>` : ''}
            <p>Reply to this email to confirm your availability or ask any questions.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 16px 0;">
            <p style="color: #888; font-size: 12px;">Sent via Maintenance OS</p>
          </div>`,
          tokenizedReplyTo
        );
        if (emailResult.error) {
          console.error('[SELECT] Email FAILED to contractor:', contractor.name, contractor.email, emailResult.error);
        } else {
          console.log('[SELECT] Email sent to contractor:', contractor.name, contractor.email, 'ID:', emailResult.data?.id);
        }
      } else {
        console.warn('[SELECT] No contact method for contractor:', contractor.name, '— no phone or email');
      }
    } catch (notifyErr) {
      console.error('[SELECT] CRITICAL — Failed to notify contractor of selection:', notifyErr);
    }

    // 9. Notify non-selected contractors who replied that the job has been awarded
    try {
      const otherDispatches = await prisma.dispatch.findMany({
        where: {
          issueId,
          contractorId: { not: contractorId },
          status: 'closed',
          responses: { some: {} }, // only those who actually replied
        },
        include: { contractor: true },
      });

      for (const otherDispatch of otherDispatches) {
        const otherContractor = otherDispatch.contractor;
        const courtesySubject = `Update: ${issue.title || 'Maintenance request'}`;
        const courtesyHtml = `<div style="font-family: sans-serif; font-size: 14px; line-height: 1.6;">
            <p>Hi ${otherContractor.name},</p>
            <p>Thanks for sending your quote for <strong>${issue.title || 'a maintenance request'}</strong>. The homeowner has decided to go with another contractor for this job.</p>
            <p>We appreciate your time and will keep you in mind for future work.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 16px 0;">
            <p style="color: #888; font-size: 12px;">Sent via Maintenance OS</p>
          </div>`;

        try {
          if (otherDispatch.channel === 'sms' && otherContractor.phone) {
            await sendRepairRequestSms(
              otherContractor.phone,
              `Hi ${otherContractor.name}, thanks for your quote on "${issue.title || 'maintenance request'}". The homeowner went with another contractor for this job. We'll keep you in mind for future work.`
            );
            console.log('[SELECT] Courtesy SMS sent to:', otherContractor.name);
          } else if (otherContractor.email) {
            await sendRepairRequestEmail(otherContractor.email, courtesySubject, courtesyHtml);
            console.log('[SELECT] Courtesy email sent to:', otherContractor.name, otherContractor.email);
          }
        } catch (courtesyErr) {
          console.error('[SELECT] Failed to send courtesy notice to:', otherContractor.name, courtesyErr);
        }
      }
    } catch (courtesyErr) {
      console.error('[SELECT] Failed to fetch/notify non-selected contractors:', courtesyErr);
    }

    revalidatePath('/dashboard');
    revalidatePath(`/issues/${issueId}`);

    return NextResponse.json({ job }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0]?.message || 'Invalid input' }, { status: 400 });
    }
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
