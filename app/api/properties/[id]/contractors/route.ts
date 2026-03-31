import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireDbUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const linkContractorSchema = z.object({
  contractorId: z.string().min(1),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireDbUser();
    const { id } = await params;
    const property = await prisma.property.findUnique({
      where: { id },
    });

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    if (property.ownerUserId !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const propertyContractors = await prisma.propertyContractor.findMany({
      where: { propertyId: id },
      include: { contractor: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ contractors: propertyContractors });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'We encountered an error. Please try again.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireDbUser();
    const { id } = await params;
    const body = linkContractorSchema.parse(await request.json());

    const property = await prisma.property.findUnique({
      where: { id },
    });

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    if (property.ownerUserId !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const contractor = await prisma.contractor.findUnique({
      where: { id: body.contractorId },
    });

    if (!contractor) {
      return NextResponse.json(
        { error: 'Contractor not found' },
        { status: 404 }
      );
    }

    if (contractor.ownerUserId !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const link = await prisma.propertyContractor.create({
      data: {
        propertyId: id,
        contractorId: body.contractorId,
      },
      include: { contractor: true },
    });

    return NextResponse.json({ propertyContractor: link }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'We encountered an error. Please try again.';
    const status = message.includes('Unique constraint failed') ? 409 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
