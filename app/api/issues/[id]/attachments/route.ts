import { NextRequest, NextResponse } from 'next/server';
import { requireDbUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { supabaseAdmin } from '@/lib/supabase';
import { safeErrorMessage } from '@/lib/utils';

export const dynamic = 'force-dynamic';

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB
const MAX_ATTACHMENTS_PER_ISSUE = 20;

// Allowed MIME types and their extensions
const ALLOWED_TYPES: Record<string, string[]> = {
  'application/pdf': ['pdf'],
  'application/msword': ['doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['docx'],
  'application/vnd.ms-excel': ['xls'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['xlsx'],
  'text/plain': ['txt'],
  'text/csv': ['csv'],
  'image/jpeg': ['jpg', 'jpeg'],
  'image/png': ['png'],
  'image/gif': ['gif'],
  'image/webp': ['webp'],
  'image/heic': ['heic'],
  'image/heif': ['heif'],
};

const ALLOWED_EXTENSIONS = Object.values(ALLOWED_TYPES).flat();

function inferMimeType(fileName: string, providedType: string): string {
  if (ALLOWED_TYPES[providedType]) return providedType;
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  for (const [mime, exts] of Object.entries(ALLOWED_TYPES)) {
    if (exts.includes(ext)) return mime;
  }
  return 'application/octet-stream';
}

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

    const attachments = await prisma.issueAttachment.findMany({
      where: { issueId: id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ attachments });
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

    // Check attachment limit
    const existingCount = await prisma.issueAttachment.count({ where: { issueId: id } });
    if (existingCount >= MAX_ATTACHMENTS_PER_ISSUE) {
      return NextResponse.json(
        { error: `You can upload up to ${MAX_ATTACHMENTS_PER_ISSUE} documents per issue.` },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const label = (formData.get('label') as string)?.trim() || null;

    if (!file) {
      return NextResponse.json({ error: 'Please select a file to upload.' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File is too large. Maximum size is 25MB.' },
        { status: 400 }
      );
    }

    // Validate file type
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return NextResponse.json(
        { error: `File type ".${ext}" is not supported. Allowed: PDF, Word, Excel, images, text files.` },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filePath = `${issue.id}/${Date.now()}-${safeName}`;
    const contentType = inferMimeType(safeName, file.type);

    const { error: uploadError } = await supabaseAdmin.storage
      .from('issue-documents')
      .upload(filePath, buffer, { contentType, upsert: false });

    if (uploadError) {
      console.error('[attachments/POST] Supabase upload error:', {
        message: uploadError.message,
        filePath,
        contentType,
        fileSize: file.size,
        fileName: file.name,
      });
      return NextResponse.json(
        { error: `Upload failed: ${uploadError.message}` },
        { status: 400 }
      );
    }

    const { data: urlData } = supabaseAdmin.storage
      .from('issue-documents')
      .getPublicUrl(filePath);

    const attachment = await prisma.issueAttachment.create({
      data: {
        issueId: id,
        fileName: file.name,
        filePath,
        fileUrl: urlData.publicUrl,
        fileSize: file.size,
        mimeType: contentType,
        label,
      },
    });

    return NextResponse.json({ attachment }, { status: 201 });
  } catch (error) {
    console.error('[attachments/POST] Error:', error);
    return NextResponse.json({ error: safeErrorMessage(error) }, { status: 400 });
  }
}
