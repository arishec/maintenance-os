import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireDbUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { logTimelineEvent } from '@/lib/timeline';

const manualQuoteSchema = z.object({
  contractorId: z.string().uuid(),
  flatEstimate: z.number().positive().optional(),
  estimateLow: z.number().positive().optional(),
  estimateHigh: z.number().positive().optional(),
  availabilityText: z.string().optional(),
  notes: z.string().optional(),
  followUpQuestion: z.string().optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireDbUser();
    const { id: issueId } = await params;
    const body = manualQuoteSchema.parse(await request.json());

    // Must have at least a price or availability
    if (!body.flatEstimate && !body.estimateLow && !body.availabilityText && !body.notes) {
      return NextResponse.json(
        { error: 'Please provide at least a price, availability, or notes.' },
        { status: 400 }
      );
    }

    // Verify issue exists and user owns it
    const issue = await prisma.issue.findFirst({
      where: { id: issueId, property: { ownerUserId: user.id } },
      include: { property: true },
    });

    if (!issue) {
      return NextResponse.json({ error: 'Issue not found.' }, { status: 404 });
    }

    // Verify contractor belongs to user
    const contractor = await prisma.contractor.findFirst({
      where: { id: body.contractorId, ownerUserId: user.id },
    });

    if (!contractor) {
      return NextResponse.json({ error: 'Contractor not found.' }, { status: 404 });
    }

    // Find or create a dispatch record for this contractor+issue
    // (manual quotes still need a dispatch parent for the data model)
    // Only reuse active dispatches; avoid attaching to closed/accepted/failed ones
    let dispatch = await prisma.dispatch.findFirst({
      where: {
        issueId,
        contractorId: body.contractorId,
        status: { in: ['sent', 'delivered', 'replied'] }
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!dispatch) {
      // Create a synthetic dispatch for manual entry
      dispatch = await prisma.dispatch.create({
        data: {
          issueId,
          contractorId: body.contractorId,
          channel: 'email', // default — doesn't matter for manual
          outboundMessage: 'Manual quote entry — no message sent',
          status: 'replied', // skip straight to replied
        },
      });
    }

    // Build raw message summary
    const parts: string[] = [];
    if (body.flatEstimate) parts.push(`Quote: $${body.flatEstimate}`);
    if (body.estimateLow && body.estimateHigh) parts.push(`Range: $${body.estimateLow}-$${body.estimateHigh}`);
    if (body.availabilityText) parts.push(`Available: ${body.availabilityText}`);
    if (body.notes) parts.push(body.notes);
    if (body.followUpQuestion) parts.push(`Question: ${body.followUpQuestion}`);

    // Create the contractor response
    const response = await prisma.contractorResponse.create({
      data: {
        dispatchId: dispatch.id,
        rawMessage: `[Manual entry] ${parts.join(' | ')}`,
        flatEstimate: body.flatEstimate ?? null,
        estimateLow: body.estimateLow ?? null,
        estimateHigh: body.estimateHigh ?? null,
        availabilityText: body.availabilityText ?? null,
        notes: body.notes ?? null,
        followUpQuestion: body.followUpQuestion ?? null,
        extractionConfidence: 1.0, // manual = full confidence
        requiresReview: false,
        receivedAt: new Date(),
      },
    });

    // Update dispatch status to replied
    await prisma.dispatch.update({
      where: { id: dispatch.id },
      data: { status: 'replied', replyReceivedAt: new Date() },
    });

    // Update issue status to quotes_received if appropriate
    const shouldUpdateStatus = ['awaiting_quotes', 'awaiting_dispatch', 'classified', 'new'].includes(issue.status);
    if (shouldUpdateStatus) {
      await prisma.issue.update({
        where: { id: issueId },
        data: { status: 'quotes_received' },
      });
    }

    // Timeline event
    try {
      await logTimelineEvent({
        propertyId: issue.propertyId,
        issueId,
        actorType: 'user',
        eventType: 'manual_quote_added',
        payload: {
          contractorName: contractor.name,
          flatEstimate: body.flatEstimate ?? null,
          availabilityText: body.availabilityText ?? null,
        },
      });
    } catch (e) {
      console.error('Timeline event failed:', e);
    }

    return NextResponse.json({ response, dispatch }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0]?.message || 'Please check your input and try again.' }, { status: 400 });
    }
    const message = error instanceof Error ? error.message : 'We encountered an error. Please try again.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
