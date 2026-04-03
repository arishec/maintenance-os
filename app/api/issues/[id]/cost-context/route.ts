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

    // Get the current issue to verify ownership and get category/propertyId
    const issue = await prisma.issue.findFirst({
      where: { id, property: { ownerUserId: user.id } },
      select: { category: true, propertyId: true },
    });

    if (!issue) {
      return NextResponse.json({ error: 'Issue not found.' }, { status: 404 });
    }

    if (!issue.category) {
      // No category, can't provide cost context
      return NextResponse.json({ costContext: null });
    }

    // Query completed jobs for issues with the same category owned by the same property
    const historicalJobs = await prisma.job.findMany({
      where: {
        issue: {
          propertyId: issue.propertyId,
          category: issue.category,
          status: 'completed',
        },
        status: 'completed',
        actualCost: { not: null },
      },
      select: { actualCost: true },
    });

    if (historicalJobs.length === 0) {
      // No historical data
      return NextResponse.json({ costContext: null });
    }

    // Calculate statistics
    const costs = historicalJobs
      .map((j) => Number(j.actualCost))
      .sort((a, b) => a - b);

    const minCost = costs[0];
    const maxCost = costs[costs.length - 1];
    const avgCost = Math.round(costs.reduce((sum, c) => sum + c, 0) / costs.length);
    const count = costs.length;

    return NextResponse.json({
      costContext: {
        minCost,
        maxCost,
        avgCost,
        count,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: safeErrorMessage(error) }, { status: 401 });
  }
}
