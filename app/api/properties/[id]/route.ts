import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireDbUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { logTimelineEvent } from '@/lib/timeline';

const updatePropertySchema = z.object({
  nickname: z.string().min(1).optional(),
  addressLine1: z.string().min(1).optional(),
  addressLine2: z.string().optional(),
  city: z.string().min(1).optional(),
  state: z.string().min(1).optional(),
  postalCode: z.string().min(1).optional(),
  propertyType: z.enum(['single_family', 'condo', 'apartment', 'townhouse', 'duplex', 'other']).optional(),
});

type UpdatePropertyInput = z.infer<typeof updatePropertySchema>;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireDbUser();
    const { id } = await params;
    const property = await prisma.property.findFirst({
      where: { id, ownerUserId: user.id },
    });

    if (!property) {
      return NextResponse.json({ error: 'Property not found.' }, { status: 404 });
    }

    return NextResponse.json({ property });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 401 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireDbUser();
    const { id } = await params;
    const property = await prisma.property.findFirst({
      where: { id, ownerUserId: user.id },
    });

    if (!property) {
      return NextResponse.json({ error: 'Property not found.' }, { status: 404 });
    }

    const body = updatePropertySchema.parse(await request.json());
    const updated = await prisma.property.update({
      where: { id },
      data: body,
    });

    await logTimelineEvent({
      propertyId: id,
      actorType: 'user',
      actorLabel: user.email,
      eventType: 'property_updated',
      payload: Object.keys(body).length > 0 ? body : undefined,
    });

    return NextResponse.json({ property: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireDbUser();
    const { id } = await params;
    const property = await prisma.property.findFirst({
      where: { id, ownerUserId: user.id },
    });

    if (!property) {
      return NextResponse.json({ error: 'Property not found.' }, { status: 404 });
    }

    // Block deletion if property has active issues
    const activeIssueCount = await prisma.issue.count({
      where: {
        propertyId: id,
        status: { notIn: ['completed', 'canceled', 'archived'] },
      },
    });
    if (activeIssueCount > 0) {
      return NextResponse.json(
        { error: `Cannot delete property with ${activeIssueCount} active issue${activeIssueCount !== 1 ? 's' : ''}. Resolve or cancel them first.` },
        { status: 400 }
      );
    }

    await logTimelineEvent({
      propertyId: id,
      actorType: 'user',
      actorLabel: user.email,
      eventType: 'property_deleted',
      payload: { nickname: property.nickname, address: property.addressLine1 },
    });

    await prisma.property.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
