import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { parseContractorReply } from '@/lib/ai/parse-contractor-reply';
import { logTimelineEvent } from '@/lib/timeline';
import { validateTwilioSignature } from '@/lib/twilio';

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

    if (!from || !body) {
      return getTwiMLResponse();
    }

    const normalizedIncomingPhone = normalizePhone(from);

    // Find the most recent matching dispatch
    const dispatches = await prisma.dispatch.findMany({
      where: {
        channel: 'sms',
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

    // Filter in JS by normalized phone match
    const matchingDispatch = dispatches.find((dispatch) => {
      if (!dispatch.contractor.phone) return false;
      const normalizedContractorPhone = normalizePhone(dispatch.contractor.phone);
      return normalizedContractorPhone === normalizedIncomingPhone;
    });

    if (!matchingDispatch) {
      return getTwiMLResponse();
    }

    const { issue, contractor } = matchingDispatch;

    // Check for idempotency: if response already exists with same raw message
    const existingResponse = await prisma.contractorResponse.findFirst({
      where: {
        dispatchId: matchingDispatch.id,
        rawMessage: body,
      },
    });

    if (existingResponse) {
      return getTwiMLResponse();
    }

    // Create raw response record
    const contractorResponse = await prisma.contractorResponse.create({
      data: {
        dispatchId: matchingDispatch.id,
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
        inboundSmsCount: {
          increment: 1,
        },
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
        channel: 'sms',
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

    return getTwiMLResponse();
  } catch (error) {
    console.error('Twilio inbound webhook error:', error);
    return getTwiMLResponse();
  }
}
