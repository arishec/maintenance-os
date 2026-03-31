import { NextRequest, NextResponse } from 'next/server';
import { requireDbUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { logTimelineEvent } from '@/lib/timeline';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireDbUser();
    const { id } = await params;

    const issue = await prisma.issue.findFirst({
      where: { id, property: { ownerUserId: user.id } },
    });

    if (!issue) {
      return NextResponse.json({ error: 'Issue not found.' }, { status: 404 });
    }

    if (issue.status === 'active_job') {
      return NextResponse.json(
        { error: 'Please complete or cancel the active job before archiving this issue.' },
        { status: 400 }
      );
    }

    // Close any open dispatches so late replies don't resurrect the issue
    await prisma.dispatch.updateMany({
      where: {
        issueId: id,
        status: { in: ['queued', 'sent', 'delivered', 'replied'] },
      },
      data: { status: 'closed', closedReason: 'issue_archived' } as any,
    });

    const updatedIssue = await prisma.issue.update({
      where: { id },
      data: { status: 'archived' },
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

    await logTimelineEvent({
      propertyId: updatedIssue.propertyId,
      issueId: updatedIssue.id,
      actorType: 'user',
      eventType: 'issue_archived',
    });

    return NextResponse.json({ issue: updatedIssue });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'We encountered an error. Please try again.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
