import { NextRequest } from 'next/server';
import { requireApiUser, requireJobOwnership, apiError, apiNotFound, apiSuccess } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { logTimelineEvent } from '@/lib/timeline';
import { JOB_VALID_TRANSITIONS } from '@/lib/status';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, error } = await requireApiUser();
  if (error) return error;

  const { id } = await params;
  const job = await requireJobOwnership(id, user.id);
  if (!job) return apiNotFound('Job');

  // Enforce valid transitions
  const allowed = JOB_VALID_TRANSITIONS[job.status] || [];
  if (!allowed.includes('in_progress')) {
    return apiError(`Cannot start a job with status "${job.status}"`, 400);
  }

  const now = new Date();

  const updatedJob = await prisma.job.update({
    where: { id },
    data: { status: 'in_progress', startedAt: now },
    include: { contractor: true, selectedResponse: true },
  });

  await prisma.issue.update({
    where: { id: job.issueId },
    data: { status: 'active_job' },
  });

  await logTimelineEvent({
    propertyId: job.issue.propertyId,
    issueId: job.issueId,
    jobId: id,
    actorType: 'user',
    eventType: 'job_started',
    payload: { startedAt: now.toISOString() },
  });

  return apiSuccess({ job: updatedJob });
}
