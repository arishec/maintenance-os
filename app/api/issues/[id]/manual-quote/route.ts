import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { IssueStatus } from '@prisma/client';
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
}).refine(
  (data) => {
    if (data.estimateLow && data.estimateHigh) {
      return data.estimateHigh >= data.estimateLow;
    }
    return true;
  },
  { message: 'High estimate must be greater than or equal to low estimate.' }
);

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

    // Build raw message summary
    const parts: string[] = [];
    if (body.flatEstimate) parts.push(`Quote: $${body.flatEstimate}`);
    if (body.estimateLow && body.estimateHigh) parts.push(`Range: $${body.estimateLow}-$${body.estimateHigh}`);
    if (body.availabilityText) parts.push(`Available: ${body.availabilityText}`);
    if (body.notes) parts.push(body.notes);
    if (body.followUpQuestion) parts.push(`Question: ${body.followUpQuestion}`);

    // All DB writes in one transaction
    const { response, dispatch } = await prisma.$transaction(async (tx) => {
      // Find or create a dispatch record for this contractor+issue
      let disp = await tx.dispatch.findFirst({
        where: {
          issueId,
          contractorId: body.contractorId,
          status: { in: ['sent', 'delivered', 'replied'] }
        },
        orderBy: { createdAt: 'desc' },
      });

      if (!disp) {
        disp = await tx.dispatch.create({
          data: {
            issueId,
            contractorId: body.contractorId,
            channel: 'email',
            outboundMessage: 'Manual quote entry — no message sent',
            status: 'replied',
          },
        });
      }

      // Dedupe: if a manual quote already exists on this dispatch, return it instead of creating a duplicate
      const existingManualResponse = await tx.contractorResponse.findFirst({
        where: {
          dispatchId: disp.id,
          rawMessage: { startsWith: '[Manual entry]' },
        },
        orderBy: { receivedAt: 'desc' },
      });
      if (existingManualResponse) {
        return { response: existingManualResponse, dispatch: disp };
      }

      const resp = await tx.contractorResponse.create({
        data: {
          dispatchId: disp.id,
          rawMessage: `[Manual entry] ${parts.join(' | ')}`,
          flatEstimate: body.flatEstimate ?? null,
          estimateLow: body.estimateLow ?? null,
          estimateHigh: body.estimateHigh ?? null,
          availabilityText: body.availabilityText ?? null,
          notes: body.notes ?? null,
          followUpQuestion: body.followUpQuestion ?? null,
          extractionConfidence: 1.0,
          requiresReview: false,
          receivedAt: new Date(),
        },
      });

      await tx.dispatch.update({
        where: { id: disp.id },
        data: { status: 'replied', replyReceivedAt: new Date() },
      });

      // Race-safe: only advance status if still in pre-quote states
      await tx.issue.updateMany({
        where: {
          id: issueId,
          status: { in: [IssueStatus.awaiting_quotes, IssueStatus.awaiting_dispatch, IssueStatus.classified, IssueStatus.new] },
        },
        data: { status: 'quotes_received' },
      });

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
      }, tx);

      return { response: resp, dispatch: disp };
    });

    return NextResponse.json({ response, dispatch }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0]?.message || 'Please check your input and try again.' }, { status: 400 });
    }
    const message = error instanceof Error ? error.message : 'We encountered an error. Please try again.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
