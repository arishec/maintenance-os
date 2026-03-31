import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { parseContractorReply } from '@/lib/ai/parse-contractor-reply';
import { parseJobConfirmation } from '@/lib/ai/parse-job-confirmation';
import { logTimelineEvent } from '@/lib/timeline';
import { validateTwilioSignature, sendRepairRequestSms } from '@/lib/twilio';
import { sendOwnerNotificationEmail } from '@/lib/notifications';

const REPLY_TOKEN_PATTERN = /MNT-[A-Z0-9]{6}/;

function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, '');
}

function getTwiMLResponse(): Response {
  return new Response('<Response/>', {
    status: 200,
    headers: { 'Content-Type': 'text/xml' },
  });
}

export async function POST(request: NextRequest) {
  try {
    // Parse form data from Twilio
    const formData = await request.formData();

    // Validate Twilio signature to prevent spoofed requests
    const twilioSignature = request.headers.get('x-twilio-signature') || '';
    const url = request.url;
    const params: Record<string, string> = {};
    formData.forEach((value, key) => {
      params[key] = value.toString();
    });

    if (!validateTwilioSignature(url, params, twilioSignature)) {
      console.error('Invalid Twilio signature — rejecting webhook');
      return getTwiMLResponse();
    }

    const from = formData.get('From') as string | null;
    const body = formData.get('Body') as string | null;
    const messageSid = formData.get('MessageSid') as string | null;

    if (!from || !body) {
      return getTwiMLResponse();
    }

    // Idempotency: check by Twilio MessageSid first (catches webhook retries)
    if (messageSid) {
      const existingByProviderId = await prisma.contractorResponse.findUnique({
        where: { providerInboundId: messageSid },
      });
      if (existingByProviderId) {
        return getTwiMLResponse();
      }
    }

    const normalizedIncomingPhone = normalizePhone(from);

    // --- DETERMINISTIC REPLY CORRELATION ---

    // Step 1: Try token-based matching first
    const tokenMatch = body.match(REPLY_TOKEN_PATTERN);
    let matchingDispatch = null;

    if (tokenMatch) {
      const token = tokenMatch[0];
      matchingDispatch = await prisma.dispatch.findUnique({
        where: { replyToken: token },
        include: {
          contractor: true,
          issue: { include: { property: true } },
        },
      });
    }

    // Step 2: If no token match, fall back to phone-based lookup
    if (!matchingDispatch) {
      // Limit to recent dispatches (last 30 days) to avoid loading entire history
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const candidateDispatches = await prisma.dispatch.findMany({
        where: {
          channel: 'sms',
          status: { in: ['sent', 'delivered', 'accepted'] },
          createdAt: { gte: thirtyDaysAgo },
        },
        include: {
          contractor: true,
          issue: { include: { property: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 500,
      });

      const phoneCandidates = candidateDispatches.filter((dispatch) => {
        if (!dispatch.contractor.phone) return false;
        return normalizePhone(dispatch.contractor.phone) === normalizedIncomingPhone;
      });

      if (phoneCandidates.length === 1) {
        // Exactly one candidate — safe to use
        matchingDispatch = phoneCandidates[0];
      } else if (phoneCandidates.length > 1) {
        // AMBIGUOUS — do NOT guess. Store as unresolved.
        await prisma.unresolvedInboundMessage.create({
          data: {
            provider: 'twilio',
            sender: from,
            rawBody: body,
            matchedToken: tokenMatch?.[0] || null,
          },
        });
        console.warn(`Ambiguous SMS reply from ${from} — ${phoneCandidates.length} active dispatches, storing as unresolved`);
        return getTwiMLResponse();
      }
    }

    if (!matchingDispatch) {
      // No match at all — store as unresolved
      await prisma.unresolvedInboundMessage.create({
        data: {
          provider: 'twilio',
          sender: from,
          rawBody: body,
        },
      });
      return getTwiMLResponse();
    }

    const { issue, contractor } = matchingDispatch;
    const isJobConfirmation = matchingDispatch.status === 'accepted';

    // Fallback idempotency: check by dispatch + raw message text
    const existingResponse = await prisma.contractorResponse.findFirst({
      where: {
        dispatchId: matchingDispatch.id,
        rawMessage: body,
      },
    });

    if (existingResponse) {
      return getTwiMLResponse();
    }

    // ─── CASE A: Contractor replied to "you've been selected" SMS ───
    if (isJobConfirmation) {
      // Store as contractor message
      await prisma.contractorMessage.create({
        data: {
          issueId: issue.id,
          contractorId: contractor.id,
          direction: 'inbound',
          channel: 'sms',
          messageBody: body,
          sendStatus: 'delivered',
        },
      });

      // Parse the reply with AI to determine if confirmed, declined, or question
      let confirmation: Awaited<ReturnType<typeof parseJobConfirmation>>;
      try {
        confirmation = await parseJobConfirmation(body);
      } catch (err) {
        console.error('Failed to parse job confirmation:', err);
        confirmation = { status: 'unclear', summary: 'Contractor replied but parsing failed.' };
      }

      // Find active job
      const activeJob = await prisma.job.findFirst({
        where: {
          issueId: issue.id,
          contractorId: contractor.id,
          status: { not: 'canceled' },
        },
      });

      // Update job based on contractor's response
      if (activeJob) {
        if (confirmation.status === 'confirmed') {
          // If AI extracted a scheduled date, convert to Date object
          const scheduledFor = confirmation.scheduledDate
            ? new Date(confirmation.scheduledDate + 'T09:00:00')
            : null;

          await prisma.job.update({
            where: { id: activeJob.id },
            data: {
              status: 'scheduled',
              ...(scheduledFor ? { scheduledFor } : {}),
              notes: activeJob.notes
                ? `${activeJob.notes}\n\nContractor confirmed: ${confirmation.summary}${confirmation.schedulingInfo ? ` (${confirmation.schedulingInfo})` : ''}`
                : `Contractor confirmed: ${confirmation.summary}${confirmation.schedulingInfo ? ` (${confirmation.schedulingInfo})` : ''}`,
            },
          });
          console.log(`[TWILIO WEBHOOK] Job ${activeJob.id} confirmed${scheduledFor ? ` — scheduled for ${scheduledFor.toISOString()}` : ' — no date extracted'}`);
        } else if (confirmation.status === 'declined') {
          await prisma.job.update({
            where: { id: activeJob.id },
            data: {
              status: 'canceled',
              notes: activeJob.notes
                ? `${activeJob.notes}\n\nContractor declined: ${confirmation.declineReason || confirmation.summary}`
                : `Contractor declined: ${confirmation.declineReason || confirmation.summary}`,
            },
          });
          // Revert issue status so owner can pick another contractor
          await prisma.issue.update({
            where: { id: issue.id },
            data: { status: 'quotes_received' },
          });
        } else {
          await prisma.job.update({
            where: { id: activeJob.id },
            data: {
              notes: activeJob.notes
                ? `${activeJob.notes}\n\nContractor replied: ${confirmation.summary}`
                : `Contractor replied: ${confirmation.summary}`,
            },
          });
        }
      }

      // Determine notification type and message
      const eventType = confirmation.status === 'confirmed'
        ? 'contractor_confirmed'
        : confirmation.status === 'declined'
          ? 'contractor_declined'
          : 'contractor_replied';

      const notifTitle = confirmation.status === 'confirmed'
        ? 'Contractor confirmed'
        : confirmation.status === 'declined'
          ? 'Contractor declined'
          : 'Contractor replied';

      const notifBody = confirmation.status === 'confirmed'
        ? `${contractor.name} confirmed the job for ${issue.title || 'your maintenance request'}.${confirmation.schedulingInfo ? ` Available: ${confirmation.schedulingInfo}` : ''}`
        : confirmation.status === 'declined'
          ? `${contractor.name} can't do the job for ${issue.title || 'your maintenance request'}.${confirmation.declineReason ? ` Reason: ${confirmation.declineReason}` : ''} You can select another contractor.`
          : `${contractor.name} replied about ${issue.title || 'your maintenance request'}: "${body.substring(0, 100)}${body.length > 100 ? '...' : ''}"`;

      // Log timeline
      await logTimelineEvent({
        propertyId: issue.propertyId,
        issueId: issue.id,
        jobId: activeJob?.id,
        actorType: 'contractor',
        actorLabel: contractor.name,
        eventType,
        payload: {
          contractorName: contractor.name,
          channel: 'sms',
          confirmationStatus: confirmation.status,
          summary: confirmation.summary,
          schedulingInfo: confirmation.schedulingInfo,
          declineReason: confirmation.declineReason,
        },
      });

      // Create notification
      try {
        await prisma.notification.create({
          data: {
            userId: issue.property.ownerUserId,
            type: eventType,
            title: notifTitle,
            body: notifBody,
            issueId: issue.id,
          },
        });
      } catch (notifErr) {
        console.error('[TWILIO WEBHOOK] Failed to create notification (job confirmation):', notifErr);
      }

      // Email the owner
      await sendOwnerNotificationEmail({
        userId: issue.property.ownerUserId,
        issueId: issue.id,
        issueTitle: issue.title ?? 'Untitled issue',
        notifBody,
        contractorName: contractor.name,
        quote: null,
        availability: confirmation.schedulingInfo || null,
        question: confirmation.followUpQuestion || null,
        notificationType: eventType,
      });

      return getTwiMLResponse();
    }

    // ─── CASE B: Standard contractor quote reply ───

    // Check if the job has already been awarded — late reply
    const jobAlreadyAwarded = ['active_job', 'completed', 'canceled'].includes(issue.status);

    if (jobAlreadyAwarded) {
      // Still store the quote for records
      await prisma.contractorResponse.create({
        data: {
          dispatchId: matchingDispatch.id,
          providerInboundId: messageSid,
          rawMessage: body,
          receivedAt: new Date(),
        },
      });

      // Auto-reply via SMS
      try {
        if (contractor.phone) {
          await sendRepairRequestSms(
            contractor.phone,
            `Hi ${contractor.name}, thanks for your reply about "${issue.title || 'maintenance request'}". This job has already been awarded to another contractor. We appreciate your time and will keep you in mind for future work.`
          );
          console.log('[TWILIO WEBHOOK] Late reply auto-response sent to:', contractor.name);
        }
      } catch (autoReplyErr) {
        console.error('[TWILIO WEBHOOK] Failed to send late reply auto-response:', autoReplyErr);
      }

      await logTimelineEvent({
        propertyId: issue.propertyId,
        issueId: issue.id,
        actorType: 'contractor',
        eventType: 'contractor_replied',
        payload: {
          contractorName: contractor.name,
          note: 'Late reply — job already awarded',
        },
      });

      return getTwiMLResponse();
    }

    // Create raw response record with provider ID for future dedup
    const contractorResponse = await prisma.contractorResponse.create({
      data: {
        dispatchId: matchingDispatch.id,
        providerInboundId: messageSid,
        rawMessage: body,
        receivedAt: new Date(),
      },
    });

    // Parse with AI
    let parsedReply: Awaited<ReturnType<typeof parseContractorReply>> | null = null;
    let parseError = false;

    try {
      parsedReply = await parseContractorReply({
        rawReply: body,
        issueCategory: issue.category ?? undefined,
        contractorTrade: contractor.trade,
      });
    } catch (error) {
      parseError = true;
      console.error('Error parsing contractor reply:', error);
    }

    // Update contractor response with extracted fields
    if (parsedReply) {
      let availabilityDateObj: Date | null = null;
      if (parsedReply.availabilityDate) {
        try {
          availabilityDateObj = new Date(parsedReply.availabilityDate);
        } catch {
          // Invalid date, leave as null
        }
      }

      await prisma.contractorResponse.update({
        where: { id: contractorResponse.id },
        data: {
          availabilityText: parsedReply.availabilityText,
          availabilityDate: availabilityDateObj,
          estimateLow: parsedReply.estimateLow || null,
          estimateHigh: parsedReply.estimateHigh || null,
          flatEstimate: parsedReply.flatEstimate || null,
          notes: parsedReply.notes,
          followUpQuestion: parsedReply.followUpQuestion,
          extractionConfidence: parsedReply.confidenceScore,
          requiresReview: parsedReply.requiresReview,
        },
      });
    } else if (parseError) {
      await prisma.contractorResponse.update({
        where: { id: contractorResponse.id },
        data: { requiresReview: true },
      });
    }

    // Update dispatch status
    await prisma.dispatch.update({
      where: { id: matchingDispatch.id },
      data: {
        status: 'replied',
        replyReceivedAt: new Date(),
      },
    });

    // Defensive usage metrics — never let this break reply processing
    try {
      await prisma.usageMetricsIssueCost.upsert({
        where: { issueId: issue.id },
        create: {
          issueId: issue.id,
          inboundSmsCount: 1,
          aiRequestCount: 1,
        },
        update: {
          inboundSmsCount: { increment: 1 },
          aiRequestCount: { increment: 1 },
        },
      });
    } catch (metricsError) {
      console.error('Failed to update usage metrics (non-fatal):', metricsError);
    }

    // Advance issue to 'quotes_received' on first valid reply
    if (issue.status === 'awaiting_quotes') {
      await prisma.issue.update({
        where: { id: issue.id },
        data: { status: 'quotes_received' },
      });
    }

    // Log timeline event
    await logTimelineEvent({
      propertyId: issue.propertyId,
      issueId: issue.id,
      actorType: 'contractor',
      actorLabel: contractor.name,
      eventType: 'contractor_replied',
      payload: {
        contractorName: contractor.name,
        channel: 'sms',
        replyToken: matchingDispatch.replyToken,
      },
    });

    // Create notification with parsed details when available
    const fmtNum = (n: number) => n.toLocaleString('en-US');
    let notifBody = `${contractor.name} replied to your request for ${issue.title}`;
    if (parsedReply?.flatEstimate) {
      notifBody = `${contractor.name} quoted $${fmtNum(parsedReply.flatEstimate)} for ${issue.title}`;
    } else if (parsedReply?.estimateLow && parsedReply?.estimateHigh) {
      notifBody = `${contractor.name} quoted $${fmtNum(parsedReply.estimateLow)}–$${fmtNum(parsedReply.estimateHigh)} for ${issue.title}`;
    }
    if (parsedReply?.availabilityText) {
      notifBody += `, available ${parsedReply.availabilityText}`;
    }
    if (parsedReply?.followUpQuestion) {
      notifBody += ` — they asked: "${parsedReply.followUpQuestion}"`;
    }

    try {
      await prisma.notification.create({
        data: {
          userId: issue.property.ownerUserId,
          type: 'contractor_replied',
          title: 'New quote received',
          body: notifBody,
          issueId: issue.id,
        },
      });
    } catch (notifErr) {
      console.error('[TWILIO WEBHOOK] Failed to create notification (quote reply):', notifErr);
    }

    // Build quote string for structured email
    let quoteStr: string | null = null;
    if (parsedReply?.flatEstimate) {
      quoteStr = String(parsedReply.flatEstimate);
    } else if (parsedReply?.estimateLow && parsedReply?.estimateHigh) {
      quoteStr = `${parsedReply.estimateLow}–${parsedReply.estimateHigh}`;
    }

    // Send email notification to property owner (non-blocking)
    await sendOwnerNotificationEmail({
      userId: issue.property.ownerUserId,
      issueId: issue.id,
      issueTitle: issue.title ?? 'Untitled issue',
      notifBody,
      contractorName: contractor.name,
      quote: quoteStr,
      availability: parsedReply?.availabilityText || null,
      question: parsedReply?.followUpQuestion || null,
    });

    return getTwiMLResponse();
  } catch (error) {
    console.error('[TWILIO WEBHOOK] CRITICAL - webhook processing failed, data may be lost:', error);
    return getTwiMLResponse();
  }
}
