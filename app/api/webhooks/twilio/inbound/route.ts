import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { parseContractorReply } from '@/lib/ai/parse-contractor-reply';
import { logTimelineEvent } from '@/lib/timeline';
import { validateTwilioSignature } from '@/lib/twilio';

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
      const candidateDispatches = await prisma.dispatch.findMany({
        where: {
          channel: 'sms',
          status: { in: ['sent', 'delivered'] },
        },
        include: {
          contractor: true,
          issue: { include: { property: true } },
        },
        orderBy: { createdAt: 'desc' },
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

    return getTwiMLResponse();
  } catch (error) {
    console.error('Twilio inbound webhook error:', error);
    return getTwiMLResponse();
  }
}
