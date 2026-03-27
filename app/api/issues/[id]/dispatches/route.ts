import { NextRequest, NextResponse } from 'next/server';
import { requireDbUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireDbUser();
    const { id: issueId } = await params;

    // Verify issue exists and user owns it
    const issue = await prisma.issue.findFirst({
      where: { id: issueId, property: { ownerUserId: user.id } },
    });

    if (!issue) {
      return NextResponse.json({ error: 'Issue not found.' }, { status: 404 });
    }

    // Fetch all dispatches for this issue with contractor and response data
    const dispatches = await prisma.dispatch.findMany({
      where: { issueId },
      include: {
        contractor: true,
        responses: {
          orderBy: { receivedAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ dispatches });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
