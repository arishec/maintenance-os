import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { classifyIssue } from '@/lib/ai/classify-issue';
import { logTimelineEvent } from '@/lib/timeline';
import { createNotification } from '@/lib/notifications';
import { generateIssueReference } from '@/lib/tokens';

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
        reference: generateIssueReference(),
        propertyId: intakeLink.property.id,
        sourceType: 'tenant_link',
        reporterName: body.reporterName,
        reporterContact: body.reporterContact,
        description: body.description,
        locationInProperty: body.locationInProperty,
        status: 'new',
      },
    });

    // Log timeline event (do this right after issue creation, before classification)
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

    // Run AI classification — treat as secondary enrichment
    // If this fails, the issue is still created and the submitter gets success
    let classifiedIssue = issue;
    try {
      const classification = await classifyIssue({
        description: body.description,
        locationInProperty: body.locationInProperty,
        signals: body.signals,
      });

      classifiedIssue = await prisma.issue.update({
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
    } catch (classificationError) {
      // Classification failed — issue stays as 'new' with no enrichment
      // This is fine: owner can see and manually classify it
      console.error('Tenant intake classification failed (non-fatal):', classificationError);
    }

    // Always return success to the tenant once the issue is created
    return NextResponse.json(
      {
        success: true,
        message: 'Your issue has been submitted. The property owner has been notified.',
        issue: {
          id: classifiedIssue.id,
          title: classifiedIssue.title || null,
          category: classifiedIssue.category || null,
          urgency: classifiedIssue.urgency || null,
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
