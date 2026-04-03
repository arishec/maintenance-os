import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireDbUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { safeErrorMessage } from '@/lib/utils';

/** Validate and normalize phone number
 * - Strips non-digit characters (except leading +)
 * - Requires at least 10 digits after stripping
 * - Returns normalized format or throws
 */
function validateAndNormalizePhone(phone: string | null | undefined): string | undefined {
  if (!phone) return undefined;

  const trimmed = phone.trim();
  if (!trimmed) return undefined;

  // Strip non-digits, but preserve leading + for international numbers
  const hasLeadingPlus = trimmed.startsWith('+');
  const digits = trimmed.replace(/\D/g, '');

  if (digits.length < 10) {
    throw new Error('Please enter a valid phone number.');
  }

  // Normalize to +1XXXXXXXXXX for 10-digit US numbers
  if (digits.length === 10) return `+1${digits}`;
  // Normalize to +XXXXXXXXXXX for 11-digit numbers starting with 1
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
  // International numbers must have had a leading +
  if (hasLeadingPlus) return `+${digits}`;
  // Unrecognized format without leading +
  throw new Error('Please enter a valid phone number.');
}

const updateContractorSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  companyName: z.string().max(200).optional(),
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
  phone: z.string().max(30).optional(),
  email: z.string().email().max(254).optional(),
  notes: z.string().max(2000).optional(),
  isPreferred: z.boolean().optional(),
  preferredChannel: z.enum(['sms', 'email']).nullable().optional(),
  isArchived: z.boolean().optional(),
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
    return NextResponse.json({ error: safeErrorMessage(error) }, { status: 400 });
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

    // Validate and normalize contact info
    if (body.email) body.email = body.email.toLowerCase().trim();
    if (body.phone) {
      const normalized = validateAndNormalizePhone(body.phone);
      if (normalized) body.phone = normalized;
    }

    // Check for duplicate email/phone (excluding the current contractor)
    if (body.email || body.phone) {
      const existing = await prisma.contractor.findFirst({
        where: {
          id: { not: id },
          ownerUserId: user.id,
          isArchived: false,
          OR: [
            ...(body.email ? [{ email: body.email }] : []),
            ...(body.phone ? [{ phone: body.phone }] : []),
          ],
        },
      });
      if (existing) {
        return NextResponse.json(
          { error: `Another contractor already uses this ${existing.email === body.email ? 'email address' : 'phone number'}.` },
          { status: 409 }
        );
      }
    }

    const updated = await prisma.contractor.update({
      where: { id },
      data: body,
    });

    return NextResponse.json({ contractor: updated });
  } catch (error) {
    return NextResponse.json({ error: safeErrorMessage(error) }, { status: 400 });
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

    // Block archiving if contractor has active jobs
    const activeJobCount = await prisma.job.count({
      where: {
        contractorId: id,
        status: { notIn: ['completed', 'canceled'] },
      },
    });
    if (activeJobCount > 0) {
      return NextResponse.json(
        { error: `Please complete or cancel ${activeJobCount === 1 ? 'the active job' : 'all active jobs'} before removing this contractor.` },
        { status: 400 }
      );
    }

    const archived = await prisma.contractor.update({
      where: { id },
      data: { isArchived: true },
    });

    return NextResponse.json({ contractor: archived });
  } catch (error) {
    return NextResponse.json({ error: safeErrorMessage(error) }, { status: 400 });
  }
}
