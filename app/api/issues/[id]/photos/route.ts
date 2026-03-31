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
    // Sanitize filename: replace spaces and special chars to avoid Supabase "Invalid key" errors
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filePath = `${issue.id}/${Date.now()}-${safeName}`;

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

    // Run AI vision analysis — await it so it completes in serverless
    // but don't let it block the response if it takes too long
    if (fileUrl) {
      const photoId = photo.id;
      try {
        const description = await Promise.race([
          analyzePhoto(fileUrl),
          new Promise<string>((_, reject) => setTimeout(() => reject(new Error('timeout')), 8000)),
        ]);
        await prisma.issuePhoto.update({
          where: { id: photoId },
          data: { aiDescription: description },
        });
        console.log(`[analyzePhoto] Photo ${photoId}: ${description.substring(0, 80)}...`);
      } catch (err) {
        console.error(`[analyzePhoto] Failed for photo ${photoId}:`, err);
        // Photo is still saved — AI description just won't be available yet
      }
    }

    return NextResponse.json({ photo }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[photos/POST] Error:', message, error);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
