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

    const job = await prisma.job.findUnique({
      where: { id },
      include: { issue: { include: { property: true } }, contractor: true, selectedResponse: true },
    });

    if (!job || job.issue.property.ownerUserId !== user.id) {
      return NextResponse.json({ error: 'Not found.' }, { status: 404 });
    }

    // Parse optional cost/notes from body
    let actualCost: number | null = null;
    let completionNotes: string | null = null;
    try {
      const body = await request.json();
      if (body.actualCost != null && body.actualCost !== '') {
        actualCost = parseFloat(body.actualCost);
        if (isNaN(actualCost)) actualCost = null;
      }
      if (body.completionNotes && typeof body.completionNotes === 'string') {
        completionNotes = body.completionNotes.trim() || null;
      }
    } catch {
      // No body or invalid JSON — that's fine, cost is optional
    }

    const now = new Date();

    // Update job
    const updatedJob = await prisma.job.update({
      where: { id },
      data: {
        status: 'completed',
        completedAt: now,
        ...(actualCost != null ? { actualCost } : {}),
        ...(completionNotes ? { completionNotes } : {}),
      },
      include: {
        contractor: true,
        selectedResponse: true,
      },
    });

    // Update issue
    await prisma.issue.update({
      where: { id: job.issueId },
      data: {
        status: 'completed',
        completedAt: now,
      },
    });

    // Log timeline event
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

    return NextResponse.json({ job: updatedJob }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
