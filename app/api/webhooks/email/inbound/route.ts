import { NextRequest, NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';
import { prisma } from '@/lib/prisma';
import { parseContractorReply } from '@/lib/ai/parse-contractor-reply';
import { logTimelineEvent } from '@/lib/timeline';
import { getReceivedEmail } from '@/lib/resend';
import { sendOwnerNotificationEmail } from '@/lib/notifications';

const REPLY_TOKEN_PATTERN = /MNT-[A-Z0-9]{6}/;

function validateResendWebhook(rawBody: string, signature: string): boolean {
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  if (!secret || secret === 'REPLACE_ME') {
    console.warn('RESEND_WEBHOOK_SECRET not set — rejecting webhook (configure secret in env)');
    return false;
  }
  if (!signature) return false;
  const expectedSignature = createHmac('sha256', secret)
    .update(rawBody)
    .digest('base64');
  try {
    return timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Read raw body for signature validation, then parse
    const rawBody = await request.text();

    // Validate Resend webhook signature — always required
    const signature = request.headers.get('resend-signature') || '';
    if (!validateResendWebhook(rawBody, signature)) {
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
          status: { in: ['sent', 'delivered'] },
        },
        include: {
          contractor: true,
          issue: { include: { property: true } },
        },
        orderBy: { createdAt: 'desc' },
      });

      const emailCandidates = candidateDispatches.filter((dispatch) => {
        if (!dispatch.contractor.email) return false;
        return dispatch.contractor.email.toLowerCase() === normalizedIncomingEmail;
      });

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
        channel: 'email',
        replyToken: matchingDispatch.replyToken,
      },
    });

    // Create notification with parsed details when available
    let notifBody = `${contractor.name} replied to your request for ${issue.title}`;
    if (parsedReply?.flatEstimate) {
      notifBody = `${contractor.name} quoted $${parsedReply.flatEstimate} for ${issue.title}`;
    } else if (parsedReply?.estimateLow && parsedReply?.estimateHigh) {
      notifBody = `${contractor.name} quoted $${parsedReply.estimateLow}–$${parsedReply.estimateHigh} for ${issue.title}`;
    }
    if (parsedReply?.followUpQuestion) {
      notifBody += ` — they asked: "${parsedReply.followUpQuestion}"`;
    }

    await prisma.notification.create({
      data: {
        userId: issue.property.ownerUserId,
        type: 'contractor_replied',
        title: 'New quote received',
        body: notifBody,
        issueId: issue.id,
      },
    });

    // Send email notification to property owner (non-blocking)
    await sendOwnerNotificationEmail({
      userId: issue.property.ownerUserId,
      issueId: issue.id,
      issueTitle: issue.title ?? 'Untitled issue',
      notifBody,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Email inbound webhook error:', error);
    return NextResponse.json({ success: true }, { status: 200 });
  }
}
