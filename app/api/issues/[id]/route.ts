import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireDbUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { logTimelineEvent } from '@/lib/timeline';

const updateIssueSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  locationInProperty: z.string().optional(),
  category: z.enum([
    'plumbing',
    'electrical',
    'hvac',
    'roofing',
    'appliance',
    'structural',
    'pest',
    'cleaning',
    'exterior',
    'general_handyman',
    'unknown',
  ]).optional(),
  subcategory: z.string().optional(),
  urgency: z.enum(['emergency', 'high', 'medium', 'low']).optional(),
  status: z.enum([
    'new',
    'classified',
    'awaiting_dispatch',
    'awaiting_quotes',
    'quotes_received',
    'active_job',
    'completed',
    'canceled',
    'archived',
  ]).optional(),
  recommendedTrade: z.enum([
    'plumbing',
    'electrical',
    'hvac',
    'roofing',
    'appliance_repair',
    'handyman',
    'pest_control',
    'landscaping',
    'cleaning',
    'restoration',
    'general_contractor',
    'other',
  ]).optional(),
  suggestedTimeframe: z.enum([
    'immediately',
    'today',
    'within_24_hours',
    'within_2_to_3_days',
    'within_1_week',
  ]).optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireDbUser();
    const { id } = await params;

    const issue = await prisma.issue.findFirst({
      where: { id, property: { ownerUserId: user.id } },
      include: {
        property: true,
        photos: true,
        dispatches: {
          include: {
            contractor: true,
            responses: true,
          },
        },
        jobs: {
          include: {
            contractor: true,
            selectedResponse: true,
          },
        },
        usageMetrics: true,
      },
    });

    if (!issue) {
      return NextResponse.json({ error: 'Issue not found.' }, { status: 404 });
    }

    return NextResponse.json({ issue });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'We encountered an error. Please try again.';
    return NextResponse.json({ error: message }, { status: 401 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireDbUser();
    const { id } = await params;
    const body = updateIssueSchema.parse(await request.json());

    const issue = await prisma.issue.findFirst({
      where: { id, property: { ownerUserId: user.id } },
    });

    if (!issue) {
      return NextResponse.json({ error: 'Issue not found.' }, { status: 404 });
    }

    // Block arbitrary status changes via PATCH — only allow cancel from non-terminal states
    if (body.status && body.status !== issue.status) {
      const allowedPatchTransitions: Record<string, string[]> = {
        new: ['canceled'],
        classified: ['canceled'],
        awaiting_dispatch: ['canceled'],
        awaiting_quotes: ['canceled'],
        quotes_received: ['canceled'],
        active_job: ['canceled'],
      };
      const allowed = allowedPatchTransitions[issue.status] ?? [];
      if (!allowed.includes(body.status)) {
        return NextResponse.json(
          { error: 'This action isn\'t available right now.' },
          { status: 400 }
        );
      }
    }

    const updatedIssue = await prisma.issue.update({
      where: { id },
      data: body,
      include: {
        property: true,
        photos: true,
        dispatches: {
          include: {
            contractor: true,
            responses: true,
          },
        },
        jobs: {
          include: {
            contractor: true,
            selectedResponse: true,
          },
        },
        usageMetrics: true,
      },
    });

    // When canceling: close all open dispatches so late replies don't resurrect the issue
    if (body.status === 'canceled') {
      await prisma.dispatch.updateMany({
        where: {
          issueId: id,
          status: { in: ['queued', 'sent', 'delivered', 'replied'] },
        },
        data: { status: 'closed', closedReason: 'issue_canceled' } as any,
      });
      // Also cancel any active jobs
      await prisma.job.updateMany({
        where: {
          issueId: id,
          status: { in: ['selected', 'scheduled', 'in_progress'] },
        },
        data: { status: 'canceled' },
      });
    }

    await logTimelineEvent({
      propertyId: updatedIssue.propertyId,
      issueId: updatedIssue.id,
      actorType: 'user',
      eventType: 'issue_updated',
      payload: body,
    });

    return NextResponse.json({ issue: updatedIssue });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'We encountered an error. Please try again.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
