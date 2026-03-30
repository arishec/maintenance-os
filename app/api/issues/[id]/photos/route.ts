import { NextRequest, NextResponse } from 'next/server';
import { requireDbUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { supabaseAdmin } from '@/lib/supabase';
import { analyzePhoto } from '@/lib/ai/analyze-photo';

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

    // Bucket is public — use permanent public URL (no expiring tokens)
    const { data: urlData } = supabaseAdmin.storage
      .from('issue-photos')
      .getPublicUrl(filePath);

    const fileUrl = urlData.publicUrl;

    const photo = await prisma.issuePhoto.create({
      data: {
        issueId: id,
        filePath,
        fileUrl,
      },
    });

    // Run AI vision analysis in the background — don't block the upload response
    if (fileUrl) {
      analyzePhoto(fileUrl)
        .then(async (description) => {
          await prisma.issuePhoto.update({
            where: { id: photo.id },
            data: { aiDescription: description },
          });
          console.log(`[analyzePhoto] Photo ${photo.id}: ${description.substring(0, 80)}...`);
        })
        .catch((err) => {
          console.error(`[analyzePhoto] Failed for photo ${photo.id}:`, err);
        });
    }

    return NextResponse.json({ photo }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
