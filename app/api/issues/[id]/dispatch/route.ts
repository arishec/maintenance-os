import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireDbUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendRepairRequestSms } from '@/lib/twilio';
import { sendRepairRequestEmail } from '@/lib/resend';
import { logTimelineEvent } from '@/lib/timeline';
import { generateReplyToken } from '@/lib/tokens';
import { dispatchLimiter } from '@/lib/rate-limit';
import { escapeHtml, safeErrorMessage } from '@/lib/utils';

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
        { error: 'This issue isn\'t ready to send to contractors right now.' },
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

    // Check for duplicate dispatches — skip contractors already contacted for this issue
    const existingDispatches = await prisma.dispatch.findMany({
      where: {
        issueId,
        contractorId: { in: body.contractors.map(c => c.contractorId) },
        status: { notIn: ['failed', 'expired'] },
      },
      select: { contractorId: true, contractor: { select: { name: true } } },
    });
    const alreadyContactedIds = new Set(existingDispatches.map(d => d.contractorId));
    const skippedCount = alreadyContactedIds.size;
    if (alreadyContactedIds.size > 0) {
      const names = existingDispatches.map(d => d.contractor.name).join(', ');
      console.warn(`[DISPATCH] Skipping already-contacted contractors: ${names}`);
      // Filter them out instead of erroring — let the rest go through
      body.contractors = body.contractors.filter(c => !alreadyContactedIds.has(c.contractorId));
      if (body.contractors.length === 0) {
        return NextResponse.json(
          { error: `All selected contractors have already been contacted for this issue.` },
          { status: 400 }
        );
      }
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

    // Build the message — always include issue details and reply prompts
    const propertyDisplay = issue.property.nickname || `${issue.property.addressLine1}, ${issue.property.city}`;
    const baseMessage = `New repair request for ${propertyDisplay}.\nIssue: ${issue.title}\nDetails: ${issue.description}${body.customMessage ? `\n\nNote from property manager: ${body.customMessage}` : ''}\n\nPlease reply with:\n1. Availability\n2. Estimated cost\n3. Any questions`;

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
      // SMS: use base message without photo URLs to avoid exceeding SMS segment limits (~1600 chars max)
      const smsBody = `[Ref: ${replyToken}] ${baseMessage}`;
      const smsMessage = smsBody.length > 1500 ? smsBody.slice(0, 1497) + '...' : smsBody;
      const emailSubject = `Repair request [Ref: ${replyToken}] — ${issue.title}`;

      // Build HTML email with embedded photo images + AI descriptions
      let photoHtml = '';
      if (body.includePhotos && issue.photos.length > 0) {
        const photosWithData = issue.photos.filter(
          (p): p is typeof p & { fileUrl: string } => p.fileUrl !== null
        );
        if (photosWithData.length > 0) {
          photoHtml = `
            <p style="margin-top: 16px; font-weight: 600; color: #333;">Photos:</p>
            ${photosWithData.map(p => `<div style="margin: 8px 0;"><a href="${p.fileUrl}" target="_blank"><img src="${p.fileUrl}" alt="Issue photo" style="max-width: 100%; max-height: 400px; border-radius: 8px; display: block;" /></a>${(p as any).aiDescription ? `<p style="margin: 4px 0 12px; font-size: 13px; color: #666; font-style: italic;">AI analysis: ${(p as any).aiDescription}</p>` : ''}</div>`).join('\n')}
          `;
        }
      }
      const emailBody = `<div style="font-family: sans-serif; line-height: 1.6;"><p><strong>Reference: ${replyToken}</strong></p>${escapeHtml(baseMessage).replace(/\n/g, '<br>')}${photoHtml}<hr style="border:none;border-top:1px solid #eee;margin:16px 0;"><p style="color: #888; font-size: 12px;">Sent via Maintenance OS</p></div>`;

      let sentSuccessfully = false;
      let providerMessageId: string | null = null;

      // Send based on channel
      console.log(`[DISPATCH] Sending via ${reqContractor.channel} to ${contractor.name} (${reqContractor.channel === 'email' ? contractor.email : contractor.phone})`);
      try {
        if (reqContractor.channel === 'sms') {
          const response = await sendRepairRequestSms(contractor.phone!, smsMessage);
          console.log('[DISPATCH] SMS response:', JSON.stringify({ sid: response.sid }));
          if (response.sid) {
            providerMessageId = response.sid;
            smsCount++;
            sentSuccessfully = true;
          } else {
            console.error('[DISPATCH] SMS send failed for contractor:', contractor.name, 'No message SID returned');
          }
        } else if (reqContractor.channel === 'email') {
          const response = await sendRepairRequestEmail(
            contractor.email!,
            emailSubject,
            emailBody,
            `replies+${replyToken}@ifbids.com`
          );
          console.log('[DISPATCH] Email response:', JSON.stringify({ data: response.data, error: response.error }));
          if (response.data?.id) {
            providerMessageId = response.data.id;
            emailCount++;
            sentSuccessfully = true;
          } else {
            console.error('[DISPATCH] Email send failed for contractor:', contractor.name, response.error || 'No message ID returned');
          }
        }
      } catch (error) {
        console.error('[DISPATCH] Send threw exception:', error);
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
      // Race-safe: only advance to awaiting_quotes if status hasn't moved past
      await prisma.issue.updateMany({
        where: { id: issueId, status: { in: ['classified', 'awaiting_dispatch', 'awaiting_quotes'] as any } },
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

    // Build response message with accurate counts
    const sentCount = dispatchRecords.filter(d => d.status === 'sent').length;
    let message = `Request sent to ${sentCount} contractor${sentCount !== 1 ? 's' : ''}`;
    if (skippedCount > 0) {
      message += `. ${skippedCount} contractor${skippedCount !== 1 ? 's were' : ' was'} already contacted and skipped.`;
    }

    return NextResponse.json({
      dispatches: dispatchRecords,
      message
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: safeErrorMessage(error) }, { status: 400 });
  }
}
