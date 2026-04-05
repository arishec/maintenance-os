import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireDbUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const markAsReadSchema = z.object({
  notificationIds: z.array(z.string()).max(100),
});

export async function GET(request: NextRequest) {
  try {
    const user = await requireDbUser();

    const searchParams = request.nextUrl.searchParams;
    const unreadOnly = searchParams.get('unreadOnly') === 'true';
    const countOnly = searchParams.get('countOnly') === 'true';

    // Lightweight count-only mode for polling (no data transfer)
    // Exclude notifications for completed/canceled/archived issues
    if (countOnly) {
      const count = await prisma.notification.count({
        where: {
          userId: user.id,
          readAt: null,
          OR: [
            { issueId: null }, // non-issue notifications always count
            { issue: { status: { notIn: ['completed', 'canceled', 'archived'] } } },
          ],
        },
      });
      return NextResponse.json({ count });
    }

    const notifications = await prisma.notification.findMany({
      where: {
        userId: user.id,
        ...(unreadOnly && { readAt: null }),
        OR: [
          { issueId: null }, // non-issue notifications always show
          { issue: { status: { notIn: ['completed', 'canceled', 'archived'] } } },
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json({ notifications });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'We encountered an error. Please try again.';
    return NextResponse.json({ error: message }, { status: 401 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await requireDbUser();
    const body = markAsReadSchema.parse(await request.json());

    const updated = await prisma.notification.updateMany({
      where: {
        id: { in: body.notificationIds },
        userId: user.id,
      },
      data: {
        readAt: new Date(),
      },
    });

    return NextResponse.json({
      count: updated.count,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'We encountered an error. Please try again.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
