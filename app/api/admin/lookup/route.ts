import { NextRequest, NextResponse } from 'next/server';
import { requireDbUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * Internal debug endpoint: GET /api/admin/lookup?ref=ISS-XXXXXX or ?ref=MNT-XXXXXX
 *
 * Looks up an issue by its reference, or a dispatch by its replyToken,
 * and returns the full chain: issue → dispatches → responses → notifications.
 *
 * Protected: only the account owner can query their own data.
 * This is NOT a public admin panel — it's a developer debugging tool.
 */

const ADMIN_EMAILS = [
  'ashechtman@gmail.com',
];

export async function GET(request: NextRequest) {
  try {
    const user = await requireDbUser();

    // Allowlist check — only approved emails can use this
    if (!ADMIN_EMAILS.includes(user.email)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const ref = request.nextUrl.searchParams.get('ref')?.trim().toUpperCase();
    if (!ref) {
      return NextResponse.json(
        { error: 'Missing ?ref= parameter. Use ISS-XXXXXX or MNT-XXXXXX' },
        { status: 400 }
      );
    }

    // Route based on prefix
    if (ref.startsWith('ISS-')) {
      return await lookupByIssueReference(ref);
    } else if (ref.startsWith('MNT-')) {
      return await lookupByDispatchToken(ref);
    } else {
      // Try both — could be a bare UUID or partial match
      return NextResponse.json(
        { error: 'Unknown reference format. Expected ISS-XXXXXX or MNT-XXXXXX' },
        { status: 400 }
      );
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 401 });
  }
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
    return NextResponse.json({ error: `No issue found for reference: ${reference}` }, { status: 404 });
  }

  return NextResponse.json({
    lookup: 'issue_reference',
    ref: reference,
    issue,
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
    return NextResponse.json({ error: `No dispatch found for token: ${replyToken}` }, { status: 404 });
  }

  return NextResponse.json({
    lookup: 'dispatch_token',
    ref: replyToken,
    dispatch,
    issue: dispatch.issue,
  });
}
