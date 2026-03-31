import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireDbUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { classifyIssue } from '@/lib/ai/classify-issue';
import { logTimelineEvent } from '@/lib/timeline';
import { generateIssueReference } from '@/lib/tokens';
import { issueCreateLimiter } from '@/lib/rate-limit';
import { safeErrorMessage } from '@/lib/utils';

const issueSchema = z.object({
  propertyId: z.string().uuid(),
  description: z.string().min(2, 'Please describe the issue'),
  locationInProperty: z.string().optional(),
  signals: z.array(z.string()).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const user = await requireDbUser();
    const url = new URL(request.url);
    const limit = Math.min(parseInt(url.searchParams.get('limit') ?? '100', 10) || 100, 200);
    const offset = parseInt(url.searchParams.get('offset') ?? '0', 10) || 0;

    const [issues, total] = await Promise.all([
      prisma.issue.findMany({
        where: { property: { ownerUserId: user.id } },
        include: { property: true, usageMetrics: true },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.issue.count({
        where: { property: { ownerUserId: user.id } },
      }),
    ]);
    return NextResponse.json({ issues, total, limit, offset });
  } catch (error) {
    return NextResponse.json({ error: safeErrorMessage(error) }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 10 issue creations per minute (each triggers AI classification)
    const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
    const { allowed } = issueCreateLimiter.check(ip);
    if (!allowed) {
      return NextResponse.json({ error: 'Too many requests. Please wait a moment.' }, { status: 429 });
    }

    const user = await requireDbUser();
    const body = issueSchema.parse(await request.json());

    // BETA: paywall disabled — all features free during beta
    // if (user.plan === 'free' && user.issueCount >= 3) {
    //   return NextResponse.json(
    //     { error: 'PAYWALL_REQUIRED', message: 'Upgrade to Pro to create more issues.' },
    //     { status: 403 }
    //   );
    // }

    const property = await prisma.property.findFirst({
      where: { id: body.propertyId, ownerUserId: user.id },
    });

    if (!property) {
      return NextResponse.json({ error: 'Property not found.' }, { status: 404 });
    }

    // Create the issue first — this always succeeds
    const issue = await prisma.issue.create({
      data: {
        reference: generateIssueReference(),
        propertyId: property.id,
        reportedByUserId: user.id,
        sourceType: 'owner_app',
        description: body.description,
        locationInProperty: body.locationInProperty,
        status: 'new',
      },
    });

    // Side effects — non-blocking
    try {
      await prisma.user.update({
        where: { id: user.id },
        data: { issueCount: { increment: 1 } },
      });
    } catch (e) {
      console.error('Issue count increment failed:', e);
    }

    try {
      await logTimelineEvent({
        propertyId: property.id,
        issueId: issue.id,
        actorType: 'user',
        actorLabel: user.email,
        eventType: 'issue_created',
        payload: { sourceType: 'owner_app' },
      });
    } catch (e) {
      console.error('Timeline event failed:', e);
    }

    // Try AI classification — if it fails (missing API key, etc), still return the issue
    try {
      // Fetch any photo descriptions that may have been analyzed by now
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

      return NextResponse.json({ issue: classifiedIssue }, { status: 201 });
    } catch (classifyError) {
      // Classification failed but issue was created — return it with a warning
      console.error('AI classification failed:', classifyError);
      return NextResponse.json({
        issue,
        warning: 'Issue created but AI classification failed. You can classify it later.',
      }, { status: 201 });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstIssue = error.issues[0];
      const message = firstIssue?.message || 'Invalid input';
      return NextResponse.json({ error: message }, { status: 400 });
    }
    return NextResponse.json({ error: safeErrorMessage(error) }, { status: 400 });
  }
}
