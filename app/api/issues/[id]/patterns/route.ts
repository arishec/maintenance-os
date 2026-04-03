import { NextRequest, NextResponse } from 'next/server';
import { requireDbUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { safeErrorMessage } from '@/lib/utils';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireDbUser();
    const { id } = await params;

    // Get the current issue to verify ownership and get propertyId/category
    const issue = await prisma.issue.findFirst({
      where: { id, property: { ownerUserId: user.id } },
      select: { propertyId: true, category: true, createdAt: true },
    });

    if (!issue) {
      return NextResponse.json({ error: 'Issue not found.' }, { status: 404 });
    }

    if (!issue.category) {
      // No category, can't detect patterns
      return NextResponse.json({ pattern: null });
    }

    // Look back 12 months from the current issue's creation date
    const oneYearAgo = new Date(issue.createdAt.getTime() - 365 * 24 * 60 * 60 * 1000);

    // Count similar issues in the last 12 months (excluding the current issue)
    const similarIssuesCount = await prisma.issue.count({
      where: {
        propertyId: issue.propertyId,
        category: issue.category,
        id: { not: id },
        createdAt: { gte: oneYearAgo },
      },
    });

    // If there are at least 2 other similar issues (making this the 3rd+)
    if (similarIssuesCount < 2) {
      return NextResponse.json({ pattern: null });
    }

    // Get dates of previous similar issues (excluding current)
    const previousIssues = await prisma.issue.findMany({
      where: {
        propertyId: issue.propertyId,
        category: issue.category,
        id: { not: id },
        createdAt: { gte: oneYearAgo },
      },
      select: { createdAt: true },
      orderBy: { createdAt: 'desc' },
    });

    const issueDates = previousIssues.map((i) => i.createdAt.toISOString());

    return NextResponse.json({
      pattern: {
        totalCount: similarIssuesCount + 1, // +1 for current issue
        previousIssueDates: issueDates,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: safeErrorMessage(error) }, { status: 401 });
  }
}
