import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { classifyIssue } from '@/lib/ai/classify-issue';
import { logTimelineEvent } from '@/lib/timeline';
import { createNotification } from '@/lib/notifications';

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

const submitIssueSchema = z.object({
  reporterName: z.string().optional(),
  reporterContact: z.string().optional(),
  description: z.string().min(5),
  locationInProperty: z.string().optional(),
  urgencyHint: z.enum(['emergency', 'urgent', 'normal', 'not_sure']).optional(),
  signals: z.array(z.string()).optional(),
});

type SubmitIssueInput = z.infer<typeof submitIssueSchema>;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const tokenHash = hashToken(token);

    const intakeLink = await prisma.propertyIntakeLink.findFirst({
      where: { tokenHash, isActive: true },
      include: { property: true },
    });

    if (!intakeLink) {
      return NextResponse.json({ valid: false }, { status: 200 });
    }

    return NextResponse.json({
      valid: true,
      propertyNickname: intakeLink.property.nickname,
      property: {
        id: intakeLink.property.id,
        nickname: intakeLink.property.nickname,
        addressLine1: intakeLink.property.addressLine1,
        city: intakeLink.property.city,
        state: intakeLink.property.state,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const tokenHash = hashToken(token);

    const intakeLink = await prisma.propertyIntakeLink.findFirst({
      where: { tokenHash, isActive: true },
      include: { property: true },
    });

    if (!intakeLink) {
      return NextResponse.json(
        { error: 'Invalid or inactive intake link.' },
        { status: 401 }
      );
    }

    const body = submitIssueSchema.parse(await request.json());

    // Create the issue
    const issue = await prisma.issue.create({
      data: {
        propertyId: intakeLink.property.id,
        sourceType: 'tenant_link',
        reporterName: body.reporterName,
        reporterContact: body.reporterContact,
        description: body.description,
        locationInProperty: body.locationInProperty,
        status: 'new',
      },
    });

    // Run AI classification
    const classification = await classifyIssue({
      description: body.description,
      locationInProperty: body.locationInProperty,
      signals: body.signals,
    });

    // Update issue with classification results
    const classifiedIssue = await prisma.issue.update({
      where: { id: issue.id },
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
          create: {
            aiRequestCount: 1,
          },
        },
      },
    });

    // Log timeline event
    await logTimelineEvent({
      propertyId: intakeLink.property.id,
      issueId: issue.id,
      actorType: 'tenant',
      actorLabel: body.reporterName,
      eventType: 'issue_submitted_by_tenant',
      payload: {
        reporterName: body.reporterName,
        reporterContact: body.reporterContact,
      },
    });

    // Create notification for property owner
    const descriptionPreview = body.description.substring(0, 100);
    await createNotification({
      userId: intakeLink.property.ownerUserId,
      type: 'tenant_issue_submitted',
      title: 'New tenant issue',
      body: `Tenant reported: ${descriptionPreview}${body.description.length > 100 ? '...' : ''}`,
    });

    // Return sanitized issue (don't expose owner data)
    return NextResponse.json(
      {
        issue: {
          id: classifiedIssue.id,
          title: classifiedIssue.title,
          category: classifiedIssue.category,
          urgency: classifiedIssue.urgency,
          status: classifiedIssue.status,
          createdAt: classifiedIssue.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
