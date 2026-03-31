import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requireDbUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { logTimelineEvent } from '@/lib/timeline';
import { JOB_VALID_TRANSITIONS } from '@/lib/status';

const scheduleJobSchema = z.object({
  scheduledFor: z.string().datetime(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireDbUser();
    const { id } = await params;
    const body = scheduleJobSchema.parse(await request.json());

    const job = await prisma.job.findUnique({
      where: { id },
      include: { issue: { include: { property: true } }, contractor: true, selectedResponse: true },
    });

    if (!job || job.issue.property.ownerUserId !== user.id) {
      return NextResponse.json({ error: 'Not found.' }, { status: 404 });
    }

    // Enforce valid transitions — only selected/scheduled can move to scheduled
    const allowed = JOB_VALID_TRANSITIONS[job.status] || [];
    if (!allowed.includes('scheduled') && job.status !== 'scheduled') {
      return NextResponse.json(
        { error: 'This job can\'t be scheduled right now.' },
        { status: 400 }
      );
    }

    const scheduledDate = new Date(body.scheduledFor);

    const updatedJob = await prisma.$transaction(async (tx) => {
      const updated = await tx.job.update({
        where: { id },
        data: {
          status: 'scheduled',
          scheduledFor: scheduledDate,
        },
        include: {
          contractor: true,
          selectedResponse: true,
        },
      });

      await tx.issue.update({
        where: { id: job.issueId },
        data: { status: 'active_job' },
      });

      await logTimelineEvent({
        propertyId: job.issue.propertyId,
        issueId: job.issueId,
        jobId: id,
        actorType: 'user',
        eventType: 'job_scheduled',
        payload: {
          scheduledFor: scheduledDate.toISOString(),
        },
      }, tx);

      return updated;
    });

    revalidatePath('/dashboard');
    revalidatePath(`/issues/${job.issueId}`);

    return NextResponse.json({ job: updatedJob }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'We encountered an error. Please try again.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
