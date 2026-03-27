import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireDbUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { logTimelineEvent } from '@/lib/timeline';

const selectContractorSchema = z.object({
  contractorId: z.string().uuid(),
  responseId: z.string().uuid().optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireDbUser();
    const { id: issueId } = await params;
    const body = selectContractorSchema.parse(await request.json());

    // Verify issue exists and user owns it (through property)
    const issue = await prisma.issue.findFirst({
      where: { id: issueId, property: { ownerUserId: user.id } },
      include: { property: true },
    });

    if (!issue) {
      return NextResponse.json({ error: 'Issue not found.' }, { status: 404 });
    }

    // Verify the contractor was dispatched for this issue
    const dispatch = await prisma.dispatch.findFirst({
      where: {
        issueId,
        contractorId: body.contractorId,
      },
      include: { contractor: true, responses: true },
    });

    if (!dispatch) {
      return NextResponse.json(
        { error: 'Contractor was not dispatched for this issue.' },
        { status: 400 }
      );
    }

    // Guard: prevent creating multiple active jobs for the same issue
    const existingActiveJob = await prisma.job.findFirst({
      where: {
        issueId,
        status: { notIn: ['canceled'] },
      },
    });

    if (existingActiveJob) {
      return NextResponse.json(
        { error: 'This issue already has an active job. Cancel it first before selecting a new contractor.' },
        { status: 409 }
      );
    }

    let selectedResponse = null;
    let selectedEstimate = null;

    // If responseId provided, validate it belongs to a dispatch for this issue
    if (body.responseId) {
      selectedResponse = await prisma.contractorResponse.findFirst({
        where: {
          id: body.responseId,
          dispatch: { issueId },
        },
      });

      if (!selectedResponse) {
        return NextResponse.json(
          { error: 'Response does not belong to a dispatch for this issue.' },
          { status: 400 }
        );
      }

      // Set selectedEstimate from response
      selectedEstimate = selectedResponse.flatEstimate || selectedResponse.estimateLow || null;
    }

    // Create Job record
    const job = await prisma.job.create({
      data: {
        issueId,
        contractorId: body.contractorId,
        selectedResponseId: body.responseId || null,
        selectedEstimate,
        status: 'contractor_selected',
      },
      include: {
        contractor: true,
        selectedResponse: true,
      },
    });

    // Update issue status
    await prisma.issue.update({
      where: { id: issueId },
      data: { status: 'contractor_selected' },
    });

    // Log timeline event
    await logTimelineEvent({
      propertyId: issue.propertyId,
      issueId,
      jobId: job.id,
      actorType: 'user',
      eventType: 'contractor_selected',
      payload: {
        contractorName: dispatch.contractor.name,
        selectedEstimate: selectedEstimate?.toString() || null,
      },
    });

    return NextResponse.json({ job }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
