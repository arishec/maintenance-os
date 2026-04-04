import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { classifyIssue } from '@/lib/ai/classify-issue';
import { logTimelineEvent } from '@/lib/timeline';
import { createNotification } from '@/lib/notifications';
import { generateIssueReference } from '@/lib/tokens';
import { issueCreateLimiter } from '@/lib/rate-limit';

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

const submitIssueSchema = z.object({
  reporterName: z.string().max(200).optional().transform((v) => v?.trim() || undefined),
  reporterContact: z.string().max(200).optional().transform((v) => v?.trim() || undefined),
  description: z.string().min(5).max(5000).transform((v) => v.trim()),
  locationInProperty: z.string().max(200).optional().transform((v) => v?.trim() || undefined),
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
    return NextResponse.json({ error: 'We encountered an error. Please try again.' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    // Rate limit: 10 submissions per minute per IP
    const forwardedFor = request.headers.get('x-forwarded-for') ?? '';
    const ip = forwardedFor.split(',')[0]?.trim() || 'unknown';
    const { allowed } = issueCreateLimiter.check(ip);
    if (!allowed) {
      return NextResponse.json({ error: 'Too many submissions. Please wait a moment.' }, { status: 429 });
    }

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

    let body: SubmitIssueInput;
    try {
      body = submitIssueSchema.parse(await request.json());
    } catch (err) {
      if (err instanceof z.ZodError) {
        return NextResponse.json(
          { error: 'Invalid input. Please check your submission and try again.' },
          { status: 400 }
        );
      }
      throw err;
    }

    // Create issue + timeline + notification in a transaction
    const issue = await prisma.$transaction(async (tx) => {
      const newIssue = await tx.issue.create({
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

      // Log timeline event
      await logTimelineEvent({
        propertyId: intakeLink.property.id,
        issueId: newIssue.id,
        actorType: 'tenant',
        actorLabel: body.reporterName,
        eventType: 'issue_submitted_by_tenant',
        payload: {
          reporterName: body.reporterName,
          reporterContact: body.reporterContact,
        },
      }, tx);

      // Create notification for property owner
      const descriptionPreview = body.description.substring(0, 100);
      await createNotification({
        userId: intakeLink.property.ownerUserId,
        type: 'tenant_issue_submitted',
        title: 'New tenant issue',
        body: `Tenant reported: ${descriptionPreview}${body.description.length > 100 ? '...' : ''}`,
      }, tx);

      return newIssue;
    });

    // Run AI classification — treat as secondary enrichment
    // If this fails, the issue is still created and the submitter gets success
    let classifiedIssue = issue;
    try {
      const issuePhotos = await prisma.issuePhoto.findMany({
        where: { issueId: issue.id },
        select: { aiDescription: true },
      });
      const photoDescriptions = issuePhotos
        .map((p) => p.aiDescription)
        .filter((d): d is string => d !== null && d.length > 0);

      const classification = await classifyIssue({
        description: body.description,
        locationInProperty: body.locationInProperty,
        signals: body.signals,
        photoDescriptions,
      });

      // Only update if issue is still in 'new' status (race guard)
      const updated = await prisma.issue.updateMany({
        where: { id: issue.id, status: 'new' },
        data: {
          title: classification.title,
          category: classification.category,
          urgency: classification.urgency,
          reasoningSummary: classification.reasoningSummary,
          suggestedTimeframe: classification.suggestedTimeframe,
          recommendedTrade: classification.recommendedTrade,
          aiConfidence: classification.confidenceScore,
          status: 'classified',
        },
      });

      if (updated.count > 0) {
        classifiedIssue = await prisma.issue.findUniqueOrThrow({
          where: { id: issue.id },
        });
      }
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
    return NextResponse.json({ error: 'We encountered an error. Please try again.' }, { status: 400 });
  }
}
