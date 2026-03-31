import { NextRequest, NextResponse } from 'next/server';
import { requireDbUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * Internal debug endpoint: GET /api/internal/lookup?ref=ISS-XXXXXX or ?ref=MNT-XXXXXX
 *
 * Looks up an issue by its reference, or a dispatch by its replyToken,
 * and returns the full chain: issue → dispatches → responses → notifications.
 *
 * Protected by:
 * 1. Authenticated session (requireDbUser)
 * 2. Admin email allowlist
 * 3. x-admin-secret header
 */

const ADMIN_EMAILS = [
  'ashechtman@gmail.com',
];

export async function GET(request: NextRequest) {
  try {
    const user = await requireDbUser();

    // 1. Allowlist check — only approved emails
    if (!ADMIN_EMAILS.includes(user.email)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 2. Secret header check
    if (request.headers.get('x-admin-secret') !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const ref = request.nextUrl.searchParams.get('ref')?.trim().toUpperCase();
    if (!ref) {
      return NextResponse.json(
        { error: 'MISSING_REFERENCE', message: 'Missing ?ref= parameter. Use ISS-XXXXXX or MNT-XXXXXX' },
        { status: 400 }
      );
    }

    // Audit log
    console.log('ADMIN_LOOKUP', {
      ref,
      user: user.email,
      timestamp: new Date().toISOString(),
    });

    // Route based on prefix
    if (ref.startsWith('ISS-')) {
      return await lookupByIssueReference(ref);
    } else if (ref.startsWith('MNT-')) {
      return await lookupByDispatchToken(ref);
    } else {
      return NextResponse.json(
        { error: 'INVALID_REFERENCE', message: 'Reference must start with ISS- or MNT-' },
        { status: 400 }
      );
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'We encountered an error. Please try again.';
    return NextResponse.json({ error: message }, { status: 401 });
  }
}

/** Build a summary object from an issue with its relations */
function buildIssueSummary(issue: {
  status: string;
  dispatches: Array<{
    responses: Array<Record<string, unknown>>;
    contractor: { name: string; companyName?: string | null } | null;
  }>;
  jobs: Array<{ status: string; scheduledFor?: Date | null; contractor: { name: string } | null }>;
}) {
  const totalDispatches = issue.dispatches.length;
  const totalResponses = issue.dispatches.reduce((sum, d) => sum + d.responses.length, 0);
  const latestJob = issue.jobs[0] ?? null;

  // Find selected contractor (from job if exists, otherwise from dispatches with responses)
  let selectedContractor: string | null = null;
  if (latestJob?.contractor) {
    selectedContractor = latestJob.contractor.name;
  }

  return {
    status: issue.status,
    contractorsContacted: totalDispatches,
    responses: totalResponses,
    selectedContractor,
    jobStatus: latestJob?.status ?? null,
    scheduledFor: latestJob?.scheduledFor ?? null,
  };
}

async function lookupByIssueReference(reference: string) {
  const issue = await prisma.issue.findUnique({
    where: { reference },
    include: {
      property: { select: { id: true, nickname: true, addressLine1: true, city: true, state: true } },
      dispatches: {
        include: {
          contractor: { select: { id: true, name: true, companyName: true, email: true, phone: true } },
          responses: true,
        },
        orderBy: { createdAt: 'desc' },
      },
      jobs: {
        include: {
          contractor: { select: { id: true, name: true, companyName: true } },
        },
        orderBy: { createdAt: 'desc' },
      },
      notifications: { orderBy: { createdAt: 'desc' }, take: 20 },
      timelineEvents: { orderBy: { createdAt: 'desc' }, take: 30 },
      photos: { select: { id: true, fileUrl: true, createdAt: true } },
    },
  });

  if (!issue) {
    return NextResponse.json(
      { error: 'NOT_FOUND', message: `No issue found for ${reference}` },
      { status: 404 }
    );
  }

  return NextResponse.json({
    type: 'issue',
    reference,
    summary: buildIssueSummary(issue),
    data: issue,
  });
}

async function lookupByDispatchToken(replyToken: string) {
  const dispatch = await prisma.dispatch.findUnique({
    where: { replyToken },
    include: {
      contractor: { select: { id: true, name: true, companyName: true, email: true, phone: true } },
      responses: true,
      issue: {
        include: {
          property: { select: { id: true, nickname: true, addressLine1: true, city: true, state: true } },
          dispatches: {
            include: {
              contractor: { select: { id: true, name: true, companyName: true } },
              responses: true,
            },
          },
          jobs: {
            include: {
              contractor: { select: { id: true, name: true, companyName: true } },
            },
          },
          notifications: { orderBy: { createdAt: 'desc' }, take: 20 },
          timelineEvents: { orderBy: { createdAt: 'desc' }, take: 30 },
        },
      },
    },
  });

  if (!dispatch) {
    return NextResponse.json(
      { error: 'NOT_FOUND', message: `No dispatch found for ${replyToken}` },
      { status: 404 }
    );
  }

  return NextResponse.json({
    type: 'dispatch',
    reference: replyToken,
    summary: buildIssueSummary(dispatch.issue),
    data: {
      dispatch,
      issue: dispatch.issue,
    },
  });
}
