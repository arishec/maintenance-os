import { NextRequest, NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';
import { prisma } from '@/lib/prisma';
import { parseContractorReply } from '@/lib/ai/parse-contractor-reply';
import { logTimelineEvent } from '@/lib/timeline';

function validateResendWebhook(rawBody: string, signature: string): boolean {
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  if (!secret || secret === 'REPLACE_ME') {
    console.warn('RESEND_WEBHOOK_SECRET not set — skipping signature validation');
    return false;
  }
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

    // Validate Resend webhook signature
    const signature = request.headers.get('resend-signature') || '';
    if (signature && !validateResendWebhook(rawBody, signature)) {
      console.error('Invalid Resend webhook signature — rejecting');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const body = JSON.parse(rawBody);
    const from = body.from as string | null;
    const text = body.text as string | null;

    if (!from || !text) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    const normalizedIncomingEmail = from.toLowerCase();

    // Find the most recent matching dispatch
    const dispatches = await prisma.dispatch.findMany({
      where: {
        channel: 'email',
        status: {
          in: ['sent', 'delivered'],
        },
      },
      include: {
        contractor: true,
        issue: {
          include: {
            property: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Filter by email match (case-insensitive)
    const matchingDispatch = dispatches.find((dispatch) => {
      if (!dispatch.contractor.email) return false;
      return dispatch.contractor.email.toLowerCase() === normalizedIncomingEmail;
    });

    if (!matchingDispatch) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    const { issue, contractor } = matchingDispatch;

    // Check for idempotency: if response already exists with same raw message
    const existingResponse = await prisma.contractorResponse.findFirst({
      where: {
        dispatchId: matchingDispatch.id,
        rawMessage: text,
      },
    });

    if (existingResponse) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    // Create raw response record
    const contractorResponse = await prisma.contractorResponse.create({
      data: {
        dispatchId: matchingDispatch.id,
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

    // Update contractor response with extracted fields
    if (parsedReply) {
      // Parse availabilityDate if it's a string
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
      // AI parsing failed, mark for review
      await prisma.contractorResponse.update({
        where: { id: contractorResponse.id },
        data: {
          requiresReview: true,
        },
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

    // Update usage metrics
    await prisma.usageMetricsIssueCost.update({
      where: { issueId: issue.id },
      data: {
        aiRequestCount: {
          increment: 1,
        },
      },
    });

    // Check if issue should move to 'quotes_received'
    const allDispatches = await prisma.dispatch.findMany({
      where: { issueId: issue.id },
    });

    const allRepliedOrFailed = allDispatches.every((d) =>
      ['replied', 'failed', 'expired'].includes(d.status)
    );

    if (allRepliedOrFailed) {
      await prisma.issue.update({
        where: { id: issue.id },
        data: {
          status: 'quotes_received',
        },
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
      },
    });

    // Create notification
    await prisma.notification.create({
      data: {
        userId: issue.property.ownerUserId,
        type: 'contractor_replied',
        title: 'Contractor replied',
        body: `${contractor.name} replied to your request for ${issue.title}`,
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Email inbound webhook error:', error);
    return NextResponse.json({ success: true }, { status: 200 });
  }
}
