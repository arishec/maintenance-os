import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { requireDbUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { logTimelineEvent } from '@/lib/timeline';

function generateToken(): string {
  return crypto.randomUUID();
}

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export async function POST(
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

    // Generate new token and hash it
    const token = generateToken();
    const tokenHash = hashToken(token);

    const intakeLink = await prisma.$transaction(async (tx) => {
      // Deactivate existing active link if it exists
      await tx.propertyIntakeLink.updateMany({
        where: { propertyId: id, isActive: true },
        data: {
          isActive: false,
          rotatedAt: new Date(),
        },
      });

      // Store the hashed token
      const link = await tx.propertyIntakeLink.create({
        data: {
          propertyId: id,
          tokenHash,
        },
      });

      await logTimelineEvent({
        propertyId: id,
        actorType: 'user',
        actorLabel: user.email,
        eventType: 'intake_link_created',
        payload: {
          linkId: link.id,
        },
      }, tx);

      return link;
    });

    // Return the raw token (not the hash)
    return NextResponse.json(
      {
        token,
        linkId: intakeLink.id,
        createdAt: intakeLink.createdAt,
      },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'We encountered an error. Please try again.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

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

    const activeLink = await prisma.propertyIntakeLink.findFirst({
      where: { propertyId: id, isActive: true },
    });

    return NextResponse.json({
      hasActiveLink: activeLink ? true : false,
      createdAt: activeLink?.createdAt,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'We encountered an error. Please try again.';
    return NextResponse.json({ error: message }, { status: 401 });
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

    const activeLink = await prisma.propertyIntakeLink.findFirst({
      where: { propertyId: id, isActive: true },
    });

    if (activeLink) {
      await prisma.propertyIntakeLink.update({
        where: { id: activeLink.id },
        data: { isActive: false },
      });

      // Log timeline event
      await logTimelineEvent({
        propertyId: id,
        actorType: 'user',
        actorLabel: user.email,
        eventType: 'intake_link_deactivated',
        payload: {
          linkId: activeLink.id,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'We encountered an error. Please try again.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
