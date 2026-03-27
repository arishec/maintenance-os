import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireDbUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const contractorSchema = z.object({
  name: z.string().min(1),
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
  ]),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  notes: z.string().optional(),
  isPreferred: z.boolean().optional(),
});

export async function GET() {
  try {
    const user = await requireDbUser();
    const contractors = await prisma.contractor.findMany({
      where: { ownerUserId: user.id, isArchived: false },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ contractors });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireDbUser();
    const body = contractorSchema.parse(await request.json());
    if (!body.phone && !body.email) {
      return NextResponse.json({ error: 'Either phone or email is required.' }, { status: 400 });
    }
    const contractor = await prisma.contractor.create({
      data: { ...body, ownerUserId: user.id },
    });
    return NextResponse.json({ contractor }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
