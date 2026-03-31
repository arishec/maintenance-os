import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createHmac, timingSafeEqual } from 'crypto';
import { prisma } from '@/lib/prisma';
import { parseContractorReply } from '@/lib/ai/parse-contractor-reply';
import { parseJobConfirmation } from '@/lib/ai/parse-job-confirmation';
import { logTimelineEvent } from '@/lib/timeline';
import { getReceivedEmail, sendRepairRequestEmail } from '@/lib/resend';
import { sendOwnerNotificationEmail } from '@/lib/notifications';
import { forwardSupportEmail } from '@/lib/support-forward';

const REPLY_TOKEN_PATTERN = /MNT-[A-Z0-9]{6}/;

/**
 * Resend uses Svix for webhook delivery. The signing secret starts with "whsec_"
 * and the signature headers are svix-id, svix-timestamp, svix-signature.
 * See: https://resend.com/docs/dashboard/webhooks/verify-webhooks
 */
function validateResendWebhook(
  rawBody: string,
  svixId: string | null,
  svixTimestamp: string | null,
  svixSignature: string | null
): boolean {
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  if (!secret || secret === 'REPLACE_ME') {
    console.warn('RESEND_WEBHOOK_SECRET not set — rejecting webhook (configure secret in env)');
    return false;
  }
  if (!svixId || !svixTimestamp || !svixSignature) {
    console.error('Missing svix headers');
    return false;
  }

  // Svix secrets are base64-encoded after the "whsec_" prefix
  const secretBytes = Buffer.from(
    secret.startsWith('whsec_') ? secret.slice(6) : secret,
    'base64'
  );

  // The signed content is "{msg_id}.{timestamp}.{body}"
  const signedContent = `${svixId}.${svixTimestamp}.${rawBody}`;
  const expectedSignature = createHmac('sha256', secretBytes)
    .update(signedContent)
    .digest('base64');

  // Check timestamp tolerance FIRST (5 minutes) — reject stale requests early
  const ts = parseInt(svixTimestamp, 10);
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - ts) > 300) {
    console.error('Svix timestamp too old or too far in the future');
    return false;
  }

  // svix-signature header can contain multiple signatures separated by spaces
  // Each is prefixed with "v1,"
  const passedSignatures = svixSignature.split(' ');
  for (const sig of passedSignatures) {
    const sigValue = sig.startsWith('v1,') ? sig.slice(3) : sig;
    try {
      if (
        timingSafeEqual(
          Buffer.from(sigValue),
          Buffer.from(expectedSignature)
        )
      ) {
        return true;
      }
    } catch {
      // Length mismatch — continue to next signature
    }
  }

  return false;
}

export async function POST(request: NextRequest) {
  try {
    // Read raw body for signature validation, then parse
    const rawBody = await request.text();

    // Validate Resend/Svix webhook signature — always required
    const svixId = request.headers.get('svix-id');
    const svixTimestamp = request.headers.get('svix-timestamp');
    const svixSignature = request.headers.get('svix-signature');
    if (!validateResendWebhook(rawBody, svixId, svixTimestamp, svixSignature)) {
      console.error('Invalid Resend webhook signature — rejecting');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event = JSON.parse(rawBody);

    // Only process inbound email events
    if (event.type !== 'email.received') {
      // Return 200 for other event types (email.sent, email.delivered, etc.)
      return NextResponse.json({ success: true }, { status: 200 });
    }

    const eventData = event.data;
    const emailId = eventData.email_id as string;
    const from = eventData.from as string | null;
    const toArray = eventData.to as string[] | null;
    const subject = eventData.subject as string | null;

    if (!emailId || !from) {
      console.warn('email.received event missing email_id or from');
      return NextResponse.json({ success: true }, { status: 200 });
    }

    // Check if this is a support/feedback email — forward to admin, don't process as contractor reply
    const supportAddresses = ['support@ifbids.com', 'feedback@ifbids.com'];
    const isSupport = toArray?.some(addr => supportAddresses.includes(addr.toLowerCase()));
    if (isSupport) {
      forwardSupportEmail({ emailId, from, to: toArray, subject }).catch((err) =>
        console.error('Failed to forward support email:', err)
      );
      return NextResponse.json({ success: true }, { status: 200 });
    }

    // Idempotency: check by Resend email ID first (catches webhook retries)
    const existingByProviderId = await prisma.contractorResponse.findUnique({
      where: { providerInboundId: emailId },
    });
    if (existingByProviderId) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    // Fetch the full email content (body, headers) from Resend API
    // Webhooks only include metadata — body must be fetched separately
    let emailText: string | null = null;
    let emailHtml: string | null = null;

    try {
      const { data: emailContent } = await getReceivedEmail(emailId);
      emailText = emailContent?.text || null;
      emailHtml = emailContent?.html || null;
    } catch (fetchError) {
      console.error('Failed to fetch received email content:', fetchError);
      // Store as unresolved since we can't process without the body
      await prisma.unresolvedInboundMessage.create({
        data: {
          provider: 'resend',
          sender: from,
          subject: subject || null,
          rawBody: `[Failed to fetch email body for email_id: ${emailId}]`,
        },
      });
      return NextResponse.json({ success: true }, { status: 200 });
    }

    // Use plain text if available, otherwise strip HTML
    const text = emailText || (emailHtml ? emailHtml.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() : null);

    if (!text) {
      console.warn(`email.received ${emailId} — no text or html body`);
      return NextResponse.json({ success: true }, { status: 200 });
    }

    // Build the to address string from the array
    const toStr = toArray ? toArray.join(', ') : '';

    // Extract sender email from "Name <email>" format
    const emailMatch = from.match(/<([^>]+)>/);
    const normalizedIncomingEmail = (emailMatch ? emailMatch[1] : from).toLowerCase();

    // --- DETERMINISTIC REPLY CORRELATION ---

    // Step 1: Try token-based matching from to address, subject, or body
    // Tokenized reply-to: replies+MNT-XXXXXX@ifbids.com
    const searchText = `${toStr} ${subject || ''} ${text}`;
    const tokenMatch = searchText.match(REPLY_TOKEN_PATTERN);
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

    // Step 2: If no token match, fall back to email-based lookup
    if (!matchingDispatch) {
      const candidateDispatches = await prisma.dispatch.findMany({
        where: {
          channel: 'email',
          status: { in: ['sent', 'delivered', 'accepted'] },
          contractor: { email: normalizedIncomingEmail },
        },
        include: {
          contractor: true,
          issue: { include: { property: true } },
        },
        orderBy: { createdAt: 'desc' },
      });

      // Group by owner to detect cross-tenant ambiguity
      const ownerIds = new Set(candidateDispatches.map(d => d.issue.property.ownerUserId));
      const emailCandidates = ownerIds.size <= 1
        ? candidateDispatches
        : []; // Multiple owners — treat as ambiguous, don't guess

      if (emailCandidates.length === 1) {
        matchingDispatch = emailCandidates[0];
      } else if (emailCandidates.length > 1) {
        // AMBIGUOUS — do NOT guess
        await prisma.unresolvedInboundMessage.create({
          data: {
            provider: 'resend',
            sender: from,
            subject: subject || null,
            rawBody: text,
            matchedToken: tokenMatch?.[0] || null,
          },
        });
        console.warn(`Ambiguous email reply from ${from} — ${emailCandidates.length} active dispatches, storing as unresolved`);
        return NextResponse.json({ success: true }, { status: 200 });
      }
    }

    if (!matchingDispatch) {
      await prisma.unresolvedInboundMessage.create({
        data: {
          provider: 'resend',
          sender: from,
          subject: subject || null,
          rawBody: text,
        },
      });
      return NextResponse.json({ success: true }, { status: 200 });
    }

    const { issue, contractor } = matchingDispatch;
    const isJobConfirmation = matchingDispatch.status === 'accepted';

    // Idempotency check by content
    const existingResponse = await prisma.contractorResponse.findFirst({
      where: {
        dispatchId: matchingDispatch.id,
        rawMessage: text,
      },
    });

    if (existingResponse) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    // ─── CASE A: Contractor replied to "you've been selected" email ───
    // This is a job confirmation/decline, NOT a new quote. Use AI to parse intent.
    if (isJobConfirmation) {
      // Store the message as a ContractorMessage
      await prisma.contractorMessage.create({
        data: {
          issueId: issue.id,
          contractorId: contractor.id,
          direction: 'inbound',
          channel: 'email',
          messageBody: text,
          sendStatus: 'delivered',
        },
      });

      // Parse the reply with AI to determine if confirmed, declined, or question
      let confirmation: Awaited<ReturnType<typeof parseJobConfirmation>>;
      try {
        confirmation = await parseJobConfirmation(text);
      } catch (err) {
        console.error('Failed to parse job confirmation:', err);
        confirmation = { status: 'unclear', summary: 'Contractor replied but parsing failed.' };
      }

      // Find the active job for this issue and contractor
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
          console.log(`[EMAIL WEBHOOK] Job ${activeJob.id} confirmed${scheduledFor ? ` — scheduled for ${scheduledFor.toISOString()}` : ' — no date extracted'}`);
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
          // Revert issue — check if there are other quotes to review
          const otherResponseCount = await prisma.contractorResponse.count({
            where: {
              dispatch: { issueId: issue.id, contractorId: { not: contractor.id } },
            },
          });
          await prisma.issue.update({
            where: { id: issue.id },
            data: { status: otherResponseCount > 0 ? 'quotes_received' : 'awaiting_dispatch' },
          });
          console.log(`[EMAIL WEBHOOK] Contractor declined — issue reverted to ${otherResponseCount > 0 ? 'quotes_received' : 'awaiting_dispatch'}`);
        } else {
          // question or unclear — keep current status but add notes
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

      // Determine notification type and message based on status
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
          : `${contractor.name} replied about ${issue.title || 'your maintenance request'}: "${text.substring(0, 100)}${text.length > 100 ? '...' : ''}"`;

      // Log timeline event
      await logTimelineEvent({
        propertyId: issue.propertyId,
        issueId: issue.id,
        jobId: activeJob?.id,
        actorType: 'contractor',
        actorLabel: contractor.name,
        eventType,
        payload: {
          contractorName: contractor.name,
          channel: 'email',
          confirmationStatus: confirmation.status,
          summary: confirmation.summary,
          schedulingInfo: confirmation.schedulingInfo,
          declineReason: confirmation.declineReason,
        },
      });

      // Create notification for property owner
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
        console.error('[EMAIL WEBHOOK] Failed to create notification (job confirmation):', notifErr);
      }

      // Send email to property owner
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

      revalidatePath('/dashboard');
      revalidatePath(`/issues/${issue.id}`);

      return NextResponse.json({ success: true }, { status: 200 });
    }

    // ─── CASE B: Standard contractor quote reply ───

    // Check if the job has already been awarded — late reply
    const jobAlreadyAwarded = ['active_job', 'completed', 'canceled'].includes(issue.status);

    if (jobAlreadyAwarded) {
      // Still store the quote for records
      await prisma.contractorResponse.create({
        data: {
          dispatchId: matchingDispatch.id,
          providerInboundId: emailId,
          rawMessage: text,
          receivedAt: new Date(),
        },
      });

      // Auto-reply to let them know
      try {
        if (contractor.email) {
          await sendRepairRequestEmail(
            contractor.email,
            `Update: ${issue.title || 'Maintenance request'}`,
            `<div style="font-family: sans-serif; font-size: 14px; line-height: 1.6;">
              <p>Hi ${contractor.name},</p>
              <p>Thanks for getting back to us about <strong>${issue.title || 'this maintenance request'}</strong>. This job has already been awarded to another contractor.</p>
              <p>We appreciate your time and will keep you in mind for future work.</p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 16px 0;">
              <p style="color: #888; font-size: 12px;">Sent via Maintenance OS</p>
            </div>`
          );
          console.log('[EMAIL WEBHOOK] Late reply auto-response sent to:', contractor.name, contractor.email);
        }
      } catch (autoReplyErr) {
        console.error('[EMAIL WEBHOOK] Failed to send late reply auto-response:', autoReplyErr);
      }

      // Log it in timeline
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

      return NextResponse.json({ success: true }, { status: 200 });
    }

    // Create raw response record with provider ID for future dedup
    const contractorResponse = await prisma.contractorResponse.create({
      data: {
        dispatchId: matchingDispatch.id,
        providerInboundId: emailId,
        rawMessage: text,
        receivedAt: new Date(),
      },
    });

    // Parse with AI
    let parsedReply: Awaited<ReturnType<typeof parseContractorReply>> | null = null;
    let parseError = false;

    try {
      parsedReply = await parseContractorReply({
        rawReply: text,
        issueCategory: issue.category ?? undefined,
        contractorTrade: contractor.trade,
      });
    } catch (error) {
      parseError = true;
      console.error('Error parsing contractor reply:', error);
    }

    if (parsedReply) {
      let availabilityDateObj: Date | null = null;
      if (parsedReply.availabilityDate) {
        try {
          availabilityDateObj = new Date(parsedReply.availabilityDate);
        } catch {
          // Invalid date
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
          aiRequestCount: 1,
        },
        update: {
          aiRequestCount: { increment: 1 },
        },
      });
    } catch (metricsError) {
      console.error('Failed to update usage metrics (non-fatal):', metricsError);
    }

    // Advance issue to 'quotes_received' on first valid reply
    // Don't wait for all dispatches — user should see progress immediately
    // Cover both awaiting_dispatch and awaiting_quotes (edge cases where dispatch didn't update status)
    if (['awaiting_dispatch', 'awaiting_quotes', 'classified'].includes(issue.status)) {
      await prisma.issue.update({
        where: { id: issue.id },
        data: { status: 'quotes_received' },
      });
      console.log(`[EMAIL WEBHOOK] Issue ${issue.id} advanced to quotes_received (was ${issue.status})`);
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
        channel: 'email',
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
      console.error('[EMAIL WEBHOOK] Failed to create notification (quote reply):', notifErr);
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

    // Bust dashboard cache so the new quote appears immediately
    revalidatePath('/dashboard');
    revalidatePath(`/issues/${issue.id}`);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('[EMAIL WEBHOOK] CRITICAL - webhook processing failed, data may be lost:', error);
    return NextResponse.json({ success: true }, { status: 200 });
  }
}
