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
  actualCost: z.number().positive().optional(),
  cancelReason: z.string().optional(),
  selfResolved: z.boolean().optional(),
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
    const message = error instanceof Error ? error.message : 'We encountered an error. Please try again.';
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
    if (body.actualCost !== undefined) {
      updateData.actualCost = new Prisma.Decimal(body.actualCost);
    }
    if (body.status !== undefined) {
      // Validate status transitions
      const allowed = JOB_VALID_TRANSITIONS[job.status] || [];
      if (!allowed.includes(body.status)) {
        return NextResponse.json(
          { error: 'This action isn\'t available right now.' },
          { status: 400 }
        );
      }
      updateData.status = body.status;

      // Set startedAt when job transitions to in_progress
      if (body.status === 'in_progress') {
        updateData.startedAt = new Date();
      }
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
    // Skip generic job_updated for cancel/complete — they have their own specific timeline events below
    if (body.status !== 'canceled' && body.status !== 'completed') {
      try {
        const eventType = body.status === 'scheduled' ? 'job_scheduled'
          : body.status === 'in_progress' ? 'job_started'
          : 'job_updated';
        await logTimelineEvent({
          propertyId: job.issue.propertyId,
          issueId: job.issueId,
          jobId: id,
          actorType: 'user',
          eventType,
          payload: body,
        });
      } catch (e) {
        console.error('Timeline event failed:', e);
      }
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

    // When a job is canceled, notify the contractor and revert (or close) the issue
    if (body.status === 'canceled') {
      if (body.selfResolved) {
        // Owner fixed it themselves — close the issue as completed
        await prisma.issue.update({
          where: { id: job.issueId },
          data: { status: 'completed' as IssueStatus, completedAt: new Date() },
        });
        console.info(`[JOB CANCEL] Issue ${job.issueId} closed as completed (self-resolved)`);
      } else {
        // Revert issue status so the owner can re-dispatch or pick another contractor.
        // Only count responses from OTHER contractors whose dispatches are still usable
        // (not closed as 'not_selected', 'resent', 'issue_canceled', etc.)
        const otherResponses = await prisma.contractorResponse.count({
          where: {
            dispatch: {
              issueId: job.issueId,
              contractorId: { not: job.contractorId },
              status: { in: ['sent', 'delivered', 'replied'] },
            },
          },
        });
        // Also check for dispatches still waiting for replies
        const pendingDispatches = await prisma.dispatch.count({
          where: {
            issueId: job.issueId,
            status: { in: ['sent', 'delivered', 'queued'] },
          },
        });
        const revertStatus: IssueStatus = otherResponses > 0
          ? 'quotes_received' as IssueStatus
          : pendingDispatches > 0
            ? 'awaiting_quotes' as IssueStatus
            : 'awaiting_dispatch' as IssueStatus;

        await prisma.issue.update({
          where: { id: job.issueId },
          data: { status: revertStatus },
        });
        console.info(`[JOB CANCEL] Issue ${job.issueId} reverted to ${revertStatus}`);
      }

      // Close the canceled contractor's dispatch
      try {
        await prisma.dispatch.updateMany({
          where: { issueId: job.issueId, contractorId: job.contractor.id, status: { notIn: ['closed', 'failed'] } },
          data: { status: 'closed', closedReason: 'owner_canceled' },
        });
      } catch (e) {
        console.error('Dispatch close on cancel failed:', e);
      }

      // Reopen dispatches that were closed as 'not_selected' when this contractor was chosen,
      // so the owner can pick from existing quotes again
      if (!body.selfResolved) {
        try {
          await prisma.dispatch.updateMany({
            where: {
              issueId: job.issueId,
              status: 'closed',
              closedReason: 'not_selected',
            },
            data: { status: 'replied' },
          });
        } catch (e) {
          console.error('Dispatch reopen on cancel failed:', e);
        }
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
          console.info(`[JOB CANCEL] Cancellation email sent to ${job.contractor.email}`);
        }
        if (job.contractor.phone) {
          await sendRepairRequestSms(job.contractor.phone, cancelMessage);
          console.info(`[JOB CANCEL] Cancellation SMS sent to ${job.contractor.phone}`);
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
          payload: {
            reason: body.cancelReason || 'No reason provided',
            selfResolved: body.selfResolved || false,
          },
        });
      } catch (e) {
        console.error('Cancel timeline event failed:', e);
      }
    }

    revalidatePath('/dashboard');
    revalidatePath(`/issues/${job.issueId}`);

    return NextResponse.json({ job: updatedJob });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'We encountered an error. Please try again.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
