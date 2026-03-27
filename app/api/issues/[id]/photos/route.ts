import { NextRequest, NextResponse } from 'next/server';
import { requireDbUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireDbUser();
    const { id } = await params;

    const issue = await prisma.issue.findFirst({
      where: { id, property: { ownerUserId: user.id } },
    });

    if (!issue) {
      return NextResponse.json({ error: 'Issue not found.' }, { status: 404 });
    }

    const photos = await prisma.issuePhoto.findMany({
      where: { issueId: id },
      orderBy: { sortOrder: 'asc' },
    });

    return NextResponse.json({ photos });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 401 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireDbUser();
    const { id } = await params;

    const issue = await prisma.issue.findFirst({
      where: { id, property: { ownerUserId: user.id } },
    });

    if (!issue) {
      return NextResponse.json({ error: 'Issue not found.' }, { status: 404 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = `${issue.id}/${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from('issue-photos')
      .upload(filePath, buffer, { contentType: file.type, upsert: false });

    if (uploadError) {
      return NextResponse.json(
        { error: `Upload failed: ${uploadError.message}` },
        { status: 400 }
      );
    }

    // Try public URL first; if bucket is private, use a signed URL
    const { data: urlData } = supabaseAdmin.storage
      .from('issue-photos')
      .getPublicUrl(filePath);

    let fileUrl = urlData.publicUrl;

    // Verify the public URL works; if not, generate a long-lived signed URL
    try {
      const testRes = await fetch(fileUrl, { method: 'HEAD' });
      if (!testRes.ok) {
        const { data: signedData } = await supabaseAdmin.storage
          .from('issue-photos')
          .createSignedUrl(filePath, 60 * 60 * 24 * 365); // 1 year
        if (signedData?.signedUrl) {
          fileUrl = signedData.signedUrl;
        }
      }
    } catch {
      // If HEAD check fails, try signed URL
      const { data: signedData } = await supabaseAdmin.storage
        .from('issue-photos')
        .createSignedUrl(filePath, 60 * 60 * 24 * 365);
      if (signedData?.signedUrl) {
        fileUrl = signedData.signedUrl;
      }
    }

    const photo = await prisma.issuePhoto.create({
      data: {
        issueId: id,
        filePath,
        fileUrl,
      },
    });

    return NextResponse.json({ photo }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
