import { NextRequest, NextResponse } from 'next/server';
import { requireDbUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getAnthropicClient } from '@/lib/ai/client';
import { safeErrorMessage } from '@/lib/utils';

export const dynamic = 'force-dynamic';

// Supported MIME types for extraction
const EXTRACTABLE_TYPES = {
  'application/pdf': true,
  'image/jpeg': true,
  'image/png': true,
  'image/webp': true,
  'image/gif': true,
};

interface ExtractionResult {
  totalAmount: number | null;
  vendorName: string | null;
  date: string | null;
  description: string | null;
}

/**
 * Fetch file content from Supabase and convert to base64
 */
async function fetchFileAsBase64(fileUrl: string): Promise<string> {
  const response = await fetch(fileUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch file: ${response.statusText}`);
  }
  const buffer = await response.arrayBuffer();
  return Buffer.from(buffer).toString('base64');
}

/**
 * Extract invoice/receipt data using Claude vision
 */
async function extractDocumentData(fileUrl: string, mimeType: string): Promise<ExtractionResult> {
  const anthropic = getAnthropicClient();

  // For images, use vision API directly with URL
  if (mimeType.startsWith('image/')) {
    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 500,
      temperature: 0,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'url', url: fileUrl },
            },
            {
              type: 'text',
              text: `You are extracting information from an invoice, receipt, or similar financial document.
Extract and return ONLY a valid JSON object with these fields:
- totalAmount: The total cost or amount due (as a number, no currency symbol)
- vendorName: The business/vendor name
- date: The date of the invoice/receipt (ISO format YYYY-MM-DD or null if not found)
- description: A brief description of what was purchased/service provided

Return ONLY valid JSON, no markdown, no explanation.
If a field cannot be found, use null for that field.

Example: {"totalAmount": 450.50, "vendorName": "ABC Plumbing", "date": "2024-01-15", "description": "Pipe repair and valve replacement"}`,
            },
          ],
        },
      ],
    });

    const text = response.content
      .map((block) => ('text' in block ? block.text : ''))
      .join('')
      .trim();

    try {
      return JSON.parse(text) as ExtractionResult;
    } catch {
      console.error('[extractDocumentData] Failed to parse image extraction:', text);
      throw new Error('Failed to parse extracted data');
    }
  }

  // For PDFs, fetch as base64 and use document content type
  if (mimeType === 'application/pdf') {
    const base64Content = await fetchFileAsBase64(fileUrl);

    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 500,
      temperature: 0,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'document',
              source: {
                type: 'base64',
                media_type: 'application/pdf',
                data: base64Content,
              },
            },
            {
              type: 'text',
              text: `You are extracting information from an invoice, receipt, or similar financial document.
Extract and return ONLY a valid JSON object with these fields:
- totalAmount: The total cost or amount due (as a number, no currency symbol)
- vendorName: The business/vendor name
- date: The date of the invoice/receipt (ISO format YYYY-MM-DD or null if not found)
- description: A brief description of what was purchased/service provided

Return ONLY valid JSON, no markdown, no explanation.
If a field cannot be found, use null for that field.

Example: {"totalAmount": 450.50, "vendorName": "ABC Plumbing", "date": "2024-01-15", "description": "Pipe repair and valve replacement"}`,
            },
          ],
        },
      ],
    });

    const text = response.content
      .map((block) => ('text' in block ? block.text : ''))
      .join('')
      .trim();

    try {
      return JSON.parse(text) as ExtractionResult;
    } catch {
      console.error('[extractDocumentData] Failed to parse PDF extraction:', text);
      throw new Error('Failed to parse extracted data');
    }
  }

  throw new Error(`Unsupported file type: ${mimeType}`);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireDbUser();
    const { id: issueId } = await params;
    const { attachmentId } = await request.json();

    if (!attachmentId) {
      return NextResponse.json({ error: 'Attachment ID is required.' }, { status: 400 });
    }

    // Verify issue access
    const issue = await prisma.issue.findFirst({
      where: { id: issueId, property: { ownerUserId: user.id } },
    });

    if (!issue) {
      return NextResponse.json({ error: 'Issue not found.' }, { status: 404 });
    }

    // Fetch attachment
    const attachment = await prisma.issueAttachment.findUnique({
      where: { id: attachmentId },
    });

    if (!attachment || attachment.issueId !== issueId) {
      return NextResponse.json({ error: 'Attachment not found.' }, { status: 404 });
    }

    if (!attachment.fileUrl) {
      return NextResponse.json({ error: 'File URL not available.' }, { status: 400 });
    }

    // Check if MIME type is extractable
    if (!EXTRACTABLE_TYPES[attachment.mimeType as keyof typeof EXTRACTABLE_TYPES]) {
      return NextResponse.json(
        { error: `File type ${attachment.mimeType} is not supported for extraction. Supported: PDF, images.` },
        { status: 400 }
      );
    }

    // Extract data using Claude
    const extractedData = await extractDocumentData(attachment.fileUrl, attachment.mimeType);

    return NextResponse.json({ data: extractedData });
  } catch (error) {
    console.error('[extract-document] Error:', error);
    return NextResponse.json({ error: safeErrorMessage(error) }, { status: 400 });
  }
}
