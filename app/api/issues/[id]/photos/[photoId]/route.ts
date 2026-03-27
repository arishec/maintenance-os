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

    const { error: deleteError } = await supabaseAdmin.storage
      .from('issue-photos')
      .remove([photo.filePath]);

    if (deleteError) {
      return NextResponse.json(
        { error: `Failed to delete file from storage: ${deleteError.message}` },
        { status: 400 }
      );
    }

    await prisma.issuePhoto.delete({
      where: { id: photoId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
