import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireDbUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendRepairRequestSms } from '@/lib/twilio';
import { sendRepairRequestEmail } from '@/lib/resend';
import { logTimelineEvent } from '@/lib/timeline';
import { generateReplyToken } from '@/lib/tokens';
import { dispatchLimiter } from '@/lib/rate-limit';

const dispatchSchema = z.object({
  contractors: z.array(
    z.object({
      contractorId: z.string().uuid(),
      channel: z.enum(['sms', 'email']),
    })
  ).min(1, 'Select at least one contractor'),
  includePhotos: z.boolean().optional().default(false),
  customMessage: z.string().optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Rate limit: 5 dispatches per minute (each sends real SMS/email)
    const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
    const { allowed } = dispatchLimiter.check(ip);
    if (!allowed) {
      return NextResponse.json({ error: 'Too many requests. Please wait a moment.' }, { status: 429 });
    }

    const user = await requireDbUser();
    const { id: issueId } = await params;
    const body = dispatchSchema.parse(await request.json());

    // BETA: paywall disabled — all features free during beta
    // if (user.plan === 'free') {
    //   return NextResponse.json(
    //     { error: 'PAYWALL_REQUIRED', message: 'Upgrade to Pro to send issues to contractors.' },
    //     { status: 403 }
    //   );
    // }

    // Verify issue exists and user owns it
    const issue = await prisma.issue.findFirst({
      where: { id: issueId, property: { ownerUserId: user.id } },
      include: { property: true, photos: true },
    });

    if (!issue) {
      return NextResponse.json({ error: 'Issue not found.' }, { status: 404 });
    }

    // Validate issue is in appropriate status
    const validStatuses = ['classified', 'awaiting_dispatch', 'awaiting_quotes', 'quotes_received'];
    if (!validStatuses.includes(issue.status)) {
      return NextResponse.json(
        { error: `Issue must be in one of these statuses: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    // Fetch all contractors at once for validation
    const contractors = await prisma.contractor.findMany({
      where: {
        id: { in: body.contractors.map(c => c.contractorId) },
        ownerUserId: user.id,
      },
    });

    if (contractors.length !== body.contractors.length) {
      return NextResponse.json(
        { error: 'One or more contractors not found or do not belong to user.' },
        { status: 404 }
      );
    }

    // Validate each contractor has required contact method
    for (const reqContractor of body.contractors) {
      const contractor = contractors.find(c => c.id === reqContractor.contractorId);
      if (!contractor) continue;

      if (reqContractor.channel === 'sms' && !contractor.phone) {
        return NextResponse.json(
          { error: `Contractor ${contractor.name} does not have a phone number for SMS.` },
          { status: 400 }
        );
      }

      if (reqContractor.channel === 'email' && !contractor.email) {
        return NextResponse.json(
          { error: `Contractor ${contractor.name} does not have an email for email dispatch.` },
          { status: 400 }
        );
      }
    }

    // Build the message
    const propertyDisplay = issue.property.nickname || `${issue.property.addressLine1}, ${issue.property.city}`;
    const baseMessage = body.customMessage
      ? body.customMessage
      : `New repair request for ${propertyDisplay}.\nIssue: ${issue.title}\nDetails: ${issue.description}\nPlease reply with:\n1. Availability\n2. Estimated cost\n3. Any questions`;

    let messageWithPhotos = baseMessage;
    if (body.includePhotos && issue.photos.length > 0) {
      const photoUrls = issue.photos
        .map(p => p.fileUrl)
        .filter((url): url is string => url !== null);
      if (photoUrls.length > 0) {
        messageWithPhotos += `\nPhotos: ${photoUrls.join(', ')}`;
      }
    }

    // Track metrics for usage
    let smsCount = 0;
    let emailCount = 0;
    const dispatchRecords = [];

    // Send to each contractor
    for (const reqContractor of body.contractors) {
      const contractor = contractors.find(c => c.id === reqContractor.contractorId)!;

      // Generate unique reply token for correlation
      const replyToken = generateReplyToken();

      // Create dispatch with queued status and reply token
      const dispatch = await prisma.dispatch.create({
        data: {
          issueId,
          contractorId: contractor.id,
          channel: reqContractor.channel,
          outboundMessage: messageWithPhotos,
          replyToken,
          status: 'queued',
        },
      });

      // Build channel-specific messages with embedded reply token
      const smsMessage = `[Ref: ${replyToken}] ${messageWithPhotos}`;
      const emailSubject = `Repair request [Ref: ${replyToken}] — ${issue.title}`;
      const emailBody = `<div style="font-family: sans-serif; line-height: 1.6;"><p><strong>Reference: ${replyToken}</strong></p>${messageWithPhotos.replace(/\n/g, '<br>')}</div>`;

      let sentSuccessfully = false;
      let providerMessageId: string | null = null;

      // Send based on channel
      try {
        if (reqContractor.channel === 'sms') {
          const response = await sendRepairRequestSms(contractor.phone!, smsMessage);
          providerMessageId = response.sid;
          smsCount++;
          sentSuccessfully = true;
        } else if (reqContractor.channel === 'email') {
          const response = await sendRepairRequestEmail(
            contractor.email!,
            emailSubject,
            emailBody,
            `replies+${replyToken}@ifbids.com`
          );
          if (response.data?.id) {
            providerMessageId = response.data.id;
            emailCount++;
            sentSuccessfully = true;
          }
        }
      } catch (error) {
        // Log the error but continue to next contractor
        // Update dispatch as failed
        await prisma.dispatch.update({
          where: { id: dispatch.id },
          data: {
            status: 'failed',
            failedAt: new Date(),
          },
        });
        dispatchRecords.push({
          ...dispatch,
          status: 'failed',
          failedAt: new Date(),
          contractor,
        });
        continue;
      }

      // Update dispatch as sent
      if (sentSuccessfully) {
        const updatedDispatch = await prisma.dispatch.update({
          where: { id: dispatch.id },
          data: {
            status: 'sent',
            sentAt: new Date(),
            providerMessageId,
          },
          include: { contractor: true },
        });
        dispatchRecords.push(updatedDispatch);
      }
    }

    // Only move to awaiting_quotes if at least one dispatch succeeded
    const successfulDispatches = dispatchRecords.filter(
      (d) => d.status === 'sent'
    );

    if (successfulDispatches.length > 0) {
      await prisma.issue.update({
        where: { id: issueId },
        data: { status: 'awaiting_quotes' },
      });
    } else {
      // All dispatches failed — keep current status so user can retry
      console.error(`All ${dispatchRecords.length} dispatches failed for issue ${issueId}`);
    }

    // Side effects — non-blocking
    try {
      const existingMetrics = await prisma.usageMetricsIssueCost.findUnique({
        where: { issueId },
      });

      const smsCost = smsCount * 0.0079;
      const emailCost = emailCount * 0.001;

      if (existingMetrics) {
        await prisma.usageMetricsIssueCost.update({
          where: { issueId },
          data: {
            outboundSmsCount: { increment: smsCount },
            outboundEmailCount: { increment: emailCount },
            estimatedSmsCost: { increment: smsCost },
            estimatedEmailCost: { increment: emailCost },
            estimatedTotalCost: { increment: smsCost + emailCost },
          },
        });
      } else {
        await prisma.usageMetricsIssueCost.create({
          data: {
            issueId,
            outboundSmsCount: smsCount,
            outboundEmailCount: emailCount,
            estimatedSmsCost: smsCost,
            estimatedEmailCost: emailCost,
            estimatedTotalCost: smsCost + emailCost,
          },
        });
      }
    } catch (e) {
      console.error('Usage metrics update failed:', e);
    }

    try {
      await logTimelineEvent({
        propertyId: issue.propertyId,
        issueId,
        actorType: 'user',
        eventType: 'dispatch_sent',
        payload: {
          contractorCount: dispatchRecords.length,
          smsCount,
          emailCount,
          channels: [...new Set(body.contractors.map(c => c.channel))],
        },
      });
    } catch (e) {
      console.error('Timeline event failed:', e);
    }

    return NextResponse.json({ dispatches: dispatchRecords }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
