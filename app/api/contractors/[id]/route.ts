import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireDbUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const updateContractorSchema = z.object({
  name: z.string().min(1).optional(),
  companyName: z.string().optional(),
  trade: z.enum([
    'plumbing',
    'electrical',
    'hvac',
    'roofing',
    'appliance_repair',
    'handyman',
    'pest_control',
    'landscaping',
    'cleaning',
    'restoration',
    'general_contractor',
    'other',
  ]).optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  notes: z.string().optional(),
  isPreferred: z.boolean().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireDbUser();
    const { id } = await params;
    const contractor = await prisma.contractor.findUnique({
      where: { id },
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

    return NextResponse.json({ contractor });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireDbUser();
    const { id } = await params;
    const contractor = await prisma.contractor.findUnique({
      where: { id },
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

    const body = updateContractorSchema.parse(await request.json());
    const updated = await prisma.contractor.update({
      where: { id },
      data: body,
    });

    return NextResponse.json({ contractor: updated });
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
    const contractor = await prisma.contractor.findUnique({
      where: { id },
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

    const archived = await prisma.contractor.update({
      where: { id },
      data: { isArchived: true },
    });

    return NextResponse.json({ contractor: archived });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
