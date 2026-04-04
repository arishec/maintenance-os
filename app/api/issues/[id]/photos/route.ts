import { NextRequest, NextResponse } from 'next/server';
import { requireDbUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { supabaseAdmin } from '@/lib/supabase';
import { analyzePhoto } from '@/lib/ai/analyze-photo';
import { safeErrorMessage } from '@/lib/utils';

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
    return NextResponse.json({ error: safeErrorMessage(error) }, { status: 401 });
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

    // Check photo count limit
    const existingPhotoCount = await prisma.issuePhoto.count({ where: { issueId: id } });
    if (existingPhotoCount >= 10) {
      return NextResponse.json(
        { error: 'You can upload up to 10 photos per issue.' },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'Please select a photo to upload.' },
        { status: 400 }
      );
    }

    // Check file size limit (10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Please choose a photo smaller than 10MB.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    // Sanitize filename: replace spaces and special chars to avoid Supabase "Invalid key" errors
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filePath = `${issue.id}/${Date.now()}-${safeName}`;

    // Content-type fallback: mobile devices (especially iPhone) may send HEIC
    // or have empty/malformed content types
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/heic', 'image/heif'];
    let contentType = file.type || 'image/jpeg';
    // If content type isn't recognized, infer from extension or default to jpeg
    if (!ALLOWED_TYPES.includes(contentType)) {
      const ext = safeName.split('.').pop()?.toLowerCase();
      const extMap: Record<string, string> = {
        jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png',
        gif: 'image/gif', webp: 'image/webp', heic: 'image/heic', heif: 'image/heif',
      };
      contentType = extMap[ext ?? ''] || 'image/jpeg';
    }

    const { error: uploadError } = await supabaseAdmin.storage
      .from('issue-photos')
      .upload(filePath, buffer, { contentType, upsert: false });

    if (uploadError) {
      console.error('[photos/POST] Supabase upload error:', {
        message: uploadError.message,
        name: uploadError.name,
        statusCode: 'statusCode' in uploadError ? (uploadError as { statusCode?: number }).statusCode : undefined,
        filePath,
        contentType,
        fileSize: file.size,
        originalType: file.type,
        fileName: file.name,
      });
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
      } catch (err) {
        console.error(`[analyzePhoto] Failed for photo ${photoId}:`, err);
        // Photo is still saved — AI description just won't be available yet
      }
    }

    return NextResponse.json({ photo }, { status: 201 });
  } catch (error) {
    console.error('[photos/POST] Error:', error);
    return NextResponse.json({ error: safeErrorMessage(error) }, { status: 400 });
  }
}
