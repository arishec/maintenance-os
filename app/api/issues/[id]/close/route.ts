import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireDbUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { logTimelineEvent } from '@/lib/timeline';
import { isIssueTransitionAllowed } from '@/lib/status';

const closeSchema = z.object({
  reason: z.string().max(1000).optional(),
  selfResolved: z.boolean().optional(),
});

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireDbUser();
    const { id: issueId } = await params;
    const body = closeSchema.parse(await request.json());

    // Verify issue belongs to user
    const issue = await prisma.issue.findFirst({
      where: { id: issueId, property: { ownerUserId: user.id } },
      select: { id: true, status: true, propertyId: true },
    });

    if (!issue) {
      return NextResponse.json({ error: 'Issue not found.' }, { status: 404 });
    }

    // Block closing an issue that has an active job — user must cancel the job first
    if (issue.status === 'active_job') {
      return NextResponse.json(
        { error: 'This issue has an active job. Cancel the job first using the job panel, then close the issue.' },
        { status: 400 }
      );
    }

    const targetStatus = body.selfResolved ? 'completed' : 'canceled';

    if (!isIssueTransitionAllowed(issue.status, targetStatus)) {
      return NextResponse.json(
        { error: `Cannot close an issue with status "${issue.status}".` },
        { status: 400 }
      );
    }

    // Update issue status
    await prisma.issue.update({
      where: { id: issueId },
      data: {
        status: targetStatus,
        ...(body.selfResolved ? { completedAt: new Date() } : {}),
      },
    });

    // Close any pending dispatches
    await prisma.dispatch.updateMany({
      where: {
        issueId,
        status: { in: ['sent', 'delivered', 'queued'] },
      },
      data: { status: 'closed', closedReason: 'issue_closed' },
    });

    // Log timeline event
    await logTimelineEvent({
      propertyId: issue.propertyId,
      issueId,
      actorType: 'user',
      eventType: body.selfResolved ? 'issue_resolved' : 'issue_canceled',
      payload: {
        selfResolved: body.selfResolved || false,
        reason: body.reason || null,
        previousStatus: issue.status,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0]?.message || 'Invalid input' }, { status: 400 });
    }
    console.error('[close-issue] Error:', error);
    return NextResponse.json({ error: 'Failed to close issue.' }, { status: 500 });
  }
}
