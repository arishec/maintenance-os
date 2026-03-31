import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireDbUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { logTimelineEvent } from '@/lib/timeline';
import { isIssueTransitionAllowed } from '@/lib/status';
import { sendRepairRequestEmail } from '@/lib/resend';
import { sendRepairRequestSms } from '@/lib/twilio';
import { safeErrorMessage } from '@/lib/utils';

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
    return NextResponse.json({ error: safeErrorMessage(error) }, { status: 401 });
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

    // Use centralized transition map for status changes via PATCH
    if (body.status && body.status !== issue.status) {
      if (!isIssueTransitionAllowed(issue.status, body.status)) {
        return NextResponse.json(
          { error: 'This action isn\'t available right now.' },
          { status: 400 }
        );
      }
    }

    // Collect active jobs BEFORE the transaction so we can notify contractors after
    let activeJobsToNotify: Array<{ contractor: { name: string; email: string | null; phone: string | null }; issue: { title: string | null } }> = [];
    if (body.status === 'canceled') {
      activeJobsToNotify = await prisma.job.findMany({
        where: {
          issueId: id,
          status: { in: ['selected', 'scheduled', 'in_progress'] },
        },
        include: { contractor: true, issue: { select: { title: true } } },
      });
    }

    // All DB mutations in one transaction
    const updatedIssue = await prisma.$transaction(async (tx) => {
      const updated = await tx.issue.update({
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

      if (body.status === 'canceled') {
        await tx.dispatch.updateMany({
          where: {
            issueId: id,
            status: { in: ['queued', 'sent', 'delivered', 'replied', 'accepted'] },
          },
          data: { status: 'closed', closedReason: 'issue_canceled' } as any,
        });
        await tx.job.updateMany({
          where: {
            issueId: id,
            status: { in: ['selected', 'scheduled', 'in_progress'] },
          },
          data: { status: 'canceled' },
        });
      }

      await logTimelineEvent({
        propertyId: updated.propertyId,
        issueId: updated.id,
        actorType: 'user',
        eventType: 'issue_updated',
        payload: body,
      }, tx);

      return updated;
    });

    // External notifications AFTER transaction commits (non-blocking)
    if (body.status === 'canceled' && activeJobsToNotify.length > 0) {
      for (const activeJob of activeJobsToNotify) {
        const issueTitle = activeJob.issue.title || 'a maintenance request';
        const cancelMessage = `The property owner has canceled this maintenance request (${issueTitle}). No further action is needed on your end. We appreciate your time.`;

        if (activeJob.contractor.email) {
          sendRepairRequestEmail(
            activeJob.contractor.email,
            `Canceled: ${issueTitle}`,
            `<p>${cancelMessage}</p>`,
          ).catch((err) => console.error('[ISSUE CANCEL] Email failed:', err));
        }
        if (activeJob.contractor.phone) {
          sendRepairRequestSms(activeJob.contractor.phone, cancelMessage)
            .catch((err) => console.error('[ISSUE CANCEL] SMS failed:', err));
        }
      }
    }

    return NextResponse.json({ issue: updatedIssue });
  } catch (error) {
    return NextResponse.json({ error: safeErrorMessage(error) }, { status: 400 });
  }
}
