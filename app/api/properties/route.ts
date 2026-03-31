import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireDbUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { logTimelineEvent } from '@/lib/timeline';

const propertySchema = z.object({
  nickname: z.string().min(1).max(100).optional(),
  addressLine1: z.string().min(1).max(200),
  addressLine2: z.string().max(200).optional(),
  city: z.string().min(1).max(100),
  state: z.string().min(1).max(50),
  postalCode: z.string().min(1).max(20),
  propertyType: z.enum(['single_family', 'condo', 'apartment', 'townhouse', 'duplex', 'other']),
});

export async function GET() {
  try {
    const user = await requireDbUser();
    const properties = await prisma.property.findMany({
      where: { ownerUserId: user.id },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ properties });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'We encountered an error. Please try again.';
    return NextResponse.json({ error: message }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireDbUser();
    const body = propertySchema.parse(await request.json());
    const property = await prisma.property.create({
      data: { ...body, ownerUserId: user.id },
    });
    await logTimelineEvent({
      propertyId: property.id,
      actorType: 'user',
      actorLabel: user.email,
      eventType: 'property_created',
      payload: { nickname: property.nickname, address: property.addressLine1 },
    });
    return NextResponse.json({ property }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'We encountered an error. Please try again.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
