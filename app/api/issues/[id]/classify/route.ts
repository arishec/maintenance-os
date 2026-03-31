import { NextRequest, NextResponse } from 'next/server';
import { requireDbUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { classifyIssue } from '@/lib/ai/classify-issue';
import { logTimelineEvent } from '@/lib/timeline';
import { safeErrorMessage } from '@/lib/utils';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireDbUser();
    const { id } = await params;

    const issue = await prisma.issue.findFirst({
      where: { id, property: { ownerUserId: user.id } },
      include: { photos: true },
    });

    if (!issue) {
      return NextResponse.json({ error: 'Issue not found.' }, { status: 404 });
    }

    // Block reclassification from regressing issues that are already in dispatch/job flow
    const noReclassifyStatuses = ['active_job', 'completed', 'canceled', 'archived'];
    if (noReclassifyStatuses.includes(issue.status)) {
      return NextResponse.json(
        { error: 'This issue can\'t be reclassified at this stage.' },
        { status: 400 }
      );
    }

    // Gather AI photo descriptions if available
    const photoDescriptions = issue.photos
      .map((p) => p.aiDescription)
      .filter((d): d is string => d !== null && d.length > 0);

    const classification = await classifyIssue({
      description: issue.description,
      locationInProperty: issue.locationInProperty,
      photoDescriptions,
    });

    const updatedIssue = await prisma.issue.update({
      where: { id },
      data: {
        title: classification.title,
        category: classification.category,
        urgency: classification.urgency,
        reasoningSummary: classification.reasoningSummary,
        suggestedTimeframe: classification.suggestedTimeframe,
        recommendedTrade: classification.recommendedTrade,
        aiConfidence: classification.confidenceScore,
        status: 'classified',
        usageMetrics: {
          upsert: {
            create: { aiRequestCount: 1 },
            update: { aiRequestCount: { increment: 1 } },
          },
        },
      },
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
      actorType: 'system',
      eventType: 'issue_classified',
      payload: {
        category: classification.category,
        urgency: classification.urgency,
        confidenceScore: classification.confidenceScore,
      },
    });

    return NextResponse.json({ issue: updatedIssue });
  } catch (error) {
    return NextResponse.json({ error: safeErrorMessage(error) }, { status: 400 });
  }
}
