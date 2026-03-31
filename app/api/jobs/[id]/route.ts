import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { Prisma, IssueStatus } from '@prisma/client';
import { requireDbUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { logTimelineEvent } from '@/lib/timeline';
import { createNotification } from '@/lib/notifications';
import { sendRepairRequestEmail } from '@/lib/resend';
import { sendRepairRequestSms } from '@/lib/twilio';
import { JOB_VALID_TRANSITIONS } from '@/lib/status';

const updateJobSchema = z.object({
  scheduledFor: z.string().datetime().optional(),
  notes: z.string().optional(),
  status: z.enum(['selected', 'scheduled', 'in_progress', 'completed', 'canceled']).optional(),
  cancelReason: z.string().optional(),
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
      // Validate status transitions
      const allowed = JOB_VALID_TRANSITIONS[job.status] || [];
      if (!allowed.includes(body.status)) {
        return NextResponse.json(
          { error: `Cannot transition from "${job.status}" to "${body.status}".` },
          { status: 400 }
        );
      }
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

    // Side effects — non-blocking
    try {
      await logTimelineEvent({
        propertyId: job.issue.propertyId,
        issueId: job.issueId,
        jobId: id,
        actorType: 'user',
        eventType: 'job_updated',
        payload: body,
      });
    } catch (e) {
      console.error('Timeline event failed:', e);
    }

    if (body.status === 'completed') {
      try {
        await createNotification({
          userId: user.id,
          type: 'job_completed',
          title: 'Job completed',
          body: `${job.issue.title || 'A maintenance issue'} was marked completed`,
          issueId: job.issueId,
        });
      } catch (e) {
        console.error('Notification failed:', e);
      }
    }

    // When a job is canceled, notify the contractor and revert the issue
    if (body.status === 'canceled') {
      // Revert issue status so the owner can re-dispatch or pick another contractor
      // Go back to quotes_received if there are other responses, otherwise awaiting_dispatch
      const otherResponses = await prisma.contractorResponse.count({
        where: {
          dispatch: { issueId: job.issueId },
          dispatchId: { not: undefined },
        },
      });
      const revertStatus: IssueStatus = otherResponses > 0
        ? 'quotes_received' as IssueStatus
        : 'awaiting_dispatch' as IssueStatus;

      await prisma.issue.update({
        where: { id: job.issueId },
        data: { status: revertStatus },
      });
      console.log(`[JOB CANCEL] Issue ${job.issueId} reverted to ${revertStatus}`);

      // Close the dispatch with reason
      try {
        await prisma.dispatch.updateMany({
          where: { issueId: job.issueId, contractorId: job.contractor.id, status: { notIn: ['closed', 'failed'] } },
          data: { status: 'closed', closedReason: 'owner_canceled' } as any,
        });
      } catch (e) {
        console.error('Dispatch close on cancel failed:', e);
      }

      // Notify the contractor the job was canceled
      const issueTitle = job.issue.title || 'a maintenance request';
      const cancelMessage = `The homeowner has canceled the job for "${issueTitle}". No further action is needed on your end. We appreciate your time and will reach out if future work comes up.`;
      try {
        if (job.contractor.email) {
          await sendRepairRequestEmail(
            job.contractor.email,
            `Job canceled: ${issueTitle}`,
            `<p>${cancelMessage}</p>`,
          );
          console.log(`[JOB CANCEL] Cancellation email sent to ${job.contractor.email}`);
        }
        if (job.contractor.phone) {
          await sendRepairRequestSms(job.contractor.phone, cancelMessage);
          console.log(`[JOB CANCEL] Cancellation SMS sent to ${job.contractor.phone}`);
        }
      } catch (e) {
        console.error('[JOB CANCEL] Failed to notify contractor:', e);
      }

      // Log specific timeline event
      try {
        await logTimelineEvent({
          propertyId: job.issue.propertyId,
          issueId: job.issueId,
          jobId: id,
          actorType: 'user',
          eventType: 'job_canceled',
          payload: { reason: body.cancelReason || 'No reason provided' },
        });
      } catch (e) {
        console.error('Cancel timeline event failed:', e);
      }
    }

    revalidatePath('/dashboard');
    revalidatePath(`/issues/${job.issueId}`);

    return NextResponse.json({ job: updatedJob });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
