import { NextRequest, NextResponse } from 'next/server';
import { requireDbUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { supabaseAdmin } from '@/lib/supabase';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; attachmentId: string }> }
) {
  try {
    const user = await requireDbUser();
    const { id, attachmentId } = await params;

    const issue = await prisma.issue.findFirst({
      where: { id, property: { ownerUserId: user.id } },
    });

    if (!issue) {
      return NextResponse.json({ error: 'Issue not found.' }, { status: 404 });
    }

    const attachment = await prisma.issueAttachment.findFirst({
      where: { id: attachmentId, issueId: id },
    });

    if (!attachment) {
      return NextResponse.json({ error: 'Attachment not found.' }, { status: 404 });
    }

    // Delete DB record first — if storage delete fails, we just have an orphaned file
    await prisma.issueAttachment.delete({
      where: { id: attachmentId },
    });

    // Fire-and-forget storage cleanup
    supabaseAdmin.storage
      .from('issue-documents')
      .remove([attachment.filePath])
      .then(({ error: deleteError }) => {
        if (deleteError) console.error(`[ATTACHMENT] Storage cleanup failed for ${attachment.filePath}:`, deleteError);
      });

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'We encountered an error. Please try again.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
