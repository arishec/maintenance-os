import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireDbUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/** Validate and normalize phone number
 * - Strips non-digit characters (except leading +)
 * - Requires at least 10 digits after stripping
 * - Returns normalized format or throws
 */
function validateAndNormalizePhone(phone: string | null | undefined): string | null {
  if (!phone) return null;

  const trimmed = phone.trim();
  if (!trimmed) return null;

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
  // For international numbers or other formats, prepend + if not present
  return hasLeadingPlus ? `+${digits}` : `+${digits}`;
}

const contractorSchema = z.object({
  name: z.string().min(1).max(200),
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
  ]),
  phone: z.string().max(30).optional(),
  email: z.string().email().max(254).optional(),
  notes: z.string().max(2000).optional(),
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
    const message = error instanceof Error ? error.message : 'We encountered an error. Please try again.';
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

    // Validate and normalize contact info
    if (body.email) body.email = body.email.toLowerCase().trim();
    if (body.phone) {
      body.phone = validateAndNormalizePhone(body.phone);
    }

    // Check for obvious duplicates (same owner, same email or phone)
    if (body.email || body.phone) {
      const existing = await prisma.contractor.findFirst({
        where: {
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
          { error: `A contractor with this ${existing.email === body.email ? 'email' : 'phone'} already exists: ${existing.name}` },
          { status: 409 }
        );
      }
    }

    const contractor = await prisma.contractor.create({
      data: { ...body, ownerUserId: user.id },
    });
    return NextResponse.json({ contractor }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'We encountered an error. Please try again.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
