import { NextRequest, NextResponse } from 'next/server';
import { requireDbUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { supabaseAdmin } from '@/lib/supabase';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; photoId: string }> }
) {
  try {
    const user = await requireDbUser();
    const { id, photoId } = await params;

    const issue = await prisma.issue.findFirst({
      where: { id, property: { ownerUserId: user.id } },
    });

    if (!issue) {
      return NextResponse.json({ error: 'Issue not found.' }, { status: 404 });
    }

    const photo = await prisma.issuePhoto.findFirst({
      where: { id: photoId, issueId: id },
    });

    if (!photo) {
      return NextResponse.json({ error: 'Photo not found.' }, { status: 404 });
    }

    // Delete DB record first — if storage delete fails, we just have an orphaned file
    // (better than an orphaned DB record pointing to nothing)
    await prisma.issuePhoto.delete({
      where: { id: photoId },
    });

    // Fire-and-forget storage cleanup
    supabaseAdmin.storage
      .from('issue-photos')
      .remove([photo.filePath])
      .then(({ error: deleteError }) => {
        if (deleteError) console.error(`[PHOTO] Storage cleanup failed for ${photo.filePath}:`, deleteError);
      });

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'We encountered an error. Please try again.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
