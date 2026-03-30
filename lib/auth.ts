import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { sendNewSignupAlert } from '@/lib/signup-alert';

export async function requireDbUser() {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const clerkUser = await currentUser();
  if (!clerkUser?.primaryEmailAddress?.emailAddress) {
    throw new Error('Authenticated user is missing an email address');
  }

  const email = clerkUser.primaryEmailAddress.emailAddress;
  const fullName = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') || undefined;

  // Check if this is a new user before upserting
  const existing = await prisma.user.findUnique({ where: { clerkUserId: userId } });
  const isNewUser = !existing;

  const user = await prisma.user.upsert({
    where: { clerkUserId: userId },
    update: { email, fullName },
    create: { clerkUserId: userId, email, fullName },
  });

  // Send signup alert in background (don't block the request)
  if (isNewUser) {
    sendNewSignupAlert(email, fullName).catch(() => {});
  }

  return user;
}

export async function requireDbUserOrRedirect() {
  try {
    return await requireDbUser();
  } catch {
    redirect('/sign-in');
  }
}

// ─── API Route Helpers ──────────────────────────────────────

/**
 * Get the authenticated user for an API route.
 * Returns { user } on success, or { error: NextResponse } on failure.
 * Usage: const { user, error } = await requireApiUser(); if (error) return error;
 */
export async function requireApiUser(): Promise<
  { user: Awaited<ReturnType<typeof requireDbUser>>; error?: never } |
  { user?: never; error: NextResponse }
> {
  try {
    const user = await requireDbUser();
    return { user };
  } catch {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }
}

/**
 * Verify the authenticated user owns a specific issue (via property chain).
 * Returns the issue with property included, or null if not found / not owned.
 */
export async function requireIssueOwnership(issueId: string, userId: string) {
  const issue = await prisma.issue.findFirst({
    where: {
      id: issueId,
      property: { ownerUserId: userId },
    },
    include: { property: true },
  });
  return issue;
}

/**
 * Verify the authenticated user owns a specific property.
 * Returns the property or null if not found / not owned.
 */
export async function requirePropertyOwnership(propertyId: string, userId: string) {
  return prisma.property.findFirst({
    where: { id: propertyId, ownerUserId: userId },
  });
}

/**
 * Verify the authenticated user owns a specific contractor.
 * Returns the contractor or null if not found / not owned.
 */
export async function requireContractorOwnership(contractorId: string, userId: string) {
  return prisma.contractor.findFirst({
    where: { id: contractorId, ownerUserId: userId, isArchived: false },
  });
}

/**
 * Verify the authenticated user owns a specific job (via issue → property chain).
 * Returns the job with issue+property included, or null.
 */
export async function requireJobOwnership(jobId: string, userId: string) {
  return prisma.job.findFirst({
    where: {
      id: jobId,
      issue: { property: { ownerUserId: userId } },
    },
    include: {
      issue: { include: { property: true } },
      contractor: true,
    },
  });
}

// ─── Standardized API Error Responses ───────────────────────

export function apiError(message: string, status: number = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function apiNotFound(entity = 'Resource') {
  return NextResponse.json({ error: `${entity} not found` }, { status: 404 });
}

export function apiSuccess<T>(data: T, status: number = 200) {
  return NextResponse.json(data, { status });
}
