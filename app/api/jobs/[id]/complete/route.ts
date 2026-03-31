import { NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';
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
  if (!allowed.includes('completed')) {
    return apiError('This job can\'t be completed right now.', 400);
  }

  // Parse optional cost/notes from body
  let actualCost: number | null = null;
  let completionNotes: string | null = null;
  try {
    const body = await request.json();
    if (body.actualCost != null && body.actualCost !== '') {
      const costStr = String(body.actualCost).trim();
      // Reject values that aren't purely numeric (parseFloat("100abc") silently returns 100)
      if (!/^\d+(\.\d+)?$/.test(costStr)) {
        return apiError('Please enter a valid cost (numbers only, e.g. 250 or 250.50).', 400);
      }
      actualCost = parseFloat(costStr);
    }
    if (body.completionNotes && typeof body.completionNotes === 'string') {
      completionNotes = body.completionNotes.trim() || null;
    }
  } catch {
    // No body or invalid JSON — cost is optional
  }

  const now = new Date();

  const updatedJob = await prisma.job.update({
    where: { id },
    data: {
      status: 'completed',
      completedAt: now,
      ...(actualCost != null ? { actualCost } : {}),
      ...(completionNotes ? { completionNotes } : {}),
    },
    include: { contractor: true, selectedResponse: true },
  });

  await prisma.issue.update({
    where: { id: job.issueId },
    data: { status: 'completed', completedAt: now },
  });

  await logTimelineEvent({
    propertyId: job.issue.propertyId,
    issueId: job.issueId,
    jobId: id,
    actorType: 'user',
    eventType: 'job_completed',
    payload: {
      completedAt: now.toISOString(),
      ...(actualCost != null ? { actualCost } : {}),
      ...(completionNotes ? { completionNotes } : {}),
    },
  });

  // Bust dashboard cache so status changes appear immediately
  revalidatePath('/dashboard');
  revalidatePath(`/issues/${job.issueId}`);

  return apiSuccess({ job: updatedJob });
}
