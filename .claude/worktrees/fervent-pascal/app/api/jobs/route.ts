import { NextRequest, NextResponse } from 'next/server';
import { requireDbUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const user = await requireDbUser();

    const jobs = await prisma.job.findMany({
      where: {
        issue: {
          property: {
            ownerUserId: user.id,
          },
        },
      },
      include: {
        issue: {
          include: {
            property: true,
          },
        },
        contractor: true,
        selectedResponse: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ jobs });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'We encountered an error. Please try again.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
