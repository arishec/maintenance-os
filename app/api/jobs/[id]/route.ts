import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { Prisma, IssueStatus } from '@prisma/client';
import { requireDbUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { logTimelineEvent } from '@/lib/timeline';
import { createNotification } from '@/lib/notifications';

const updateJobSchema = z.object({
  scheduledFor: z.string().datetime().optional(),
  notes: z.string().optional(),
  status: z.enum(['selected', 'scheduled', 'in_progress', 'completed', 'canceled']).optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireDbUser();
    const { id } = await params;

    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        issue: {
          include: { property: true },
        },
        contractor: true,
        selectedResponse: true,
        timelineEvents: true,
      },
    });

    if (!job || job.issue.property.ownerUserId !== user.id) {
      return NextResponse.json({ error: 'Not found.' }, { status: 404 });
    }

    return NextResponse.json({ job });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireDbUser();
    const { id } = await params;
    const body = updateJobSchema.parse(await request.json());

    const job = await prisma.job.findUnique({
      where: { id },
      include: { issue: { include: { property: true } }, contractor: true, selectedResponse: true },
    });

    if (!job || job.issue.property.ownerUserId !== user.id) {
      return NextResponse.json({ error: 'Not found.' }, { status: 404 });
    }

    const updateData: Prisma.JobUpdateInput = {};
    if (body.scheduledFor !== undefined) {
      updateData.scheduledFor = new Date(body.scheduledFor);
    }
    if (body.notes !== undefined) {
      updateData.notes = body.notes;
    }
    if (body.status !== undefined) {
      updateData.status = body.status;
    }

    const updatedJob = await prisma.job.update({
      where: { id },
      data: updateData,
      include: {
        issue: {
          include: { property: true },
        },
        contractor: true,
        selectedResponse: true,
        timelineEvents: true,
      },
    });

    // Sync issue status when job status changes
    // Issue only has: active_job, completed, canceled
    // Job carries the granular state (selected, scheduled, in_progress)
    if (body.status) {
      const jobToIssueStatusMap: Record<string, IssueStatus> = {
        completed: 'completed' as IssueStatus,
        canceled: 'canceled' as IssueStatus,
      };

      const newIssueStatus = jobToIssueStatusMap[body.status];
      if (newIssueStatus) {
        await prisma.issue.update({
          where: { id: job.issueId },
          data: {
            status: newIssueStatus,
            ...(body.status === 'completed' ? { completedAt: new Date() } : {}),
          },
        });
      }
      // selected/scheduled/in_progress all keep issue at active_job (already set on selection)
    }

    await logTimelineEvent({
      propertyId: job.issue.propertyId,
      issueId: job.issueId,
      jobId: id,
      actorType: 'user',
      eventType: 'job_updated',
      payload: body,
    });

    // Create notification for job completion
    if (body.status === 'completed') {
      await createNotification({
        userId: user.id,
        type: 'job_completed',
        title: 'Job completed',
        body: `${job.issue.title || 'A maintenance issue'} was marked completed`,
        issueId: job.issueId,
      });
    }

    return NextResponse.json({ job: updatedJob });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
