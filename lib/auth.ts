import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function requireDbUser() {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const clerkUser = await currentUser();
  if (!clerkUser?.primaryEmailAddress?.emailAddress) {
    throw new Error('Authenticated user is missing an email address');
  }

  const user = await prisma.user.upsert({
    where: { clerkUserId: userId },
    update: {
      email: clerkUser.primaryEmailAddress.emailAddress,
      fullName: [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') || undefined,
    },
    create: {
      clerkUserId: userId,
      email: clerkUser.primaryEmailAddress.emailAddress,
      fullName: [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') || undefined,
    },
  });

  return user;
}
