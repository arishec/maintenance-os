import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireDbUser } from '@/lib/auth';
import { detectMultiIssue } from '@/lib/ai/detect-multi-issue';

const detectSchema = z.object({
  description: z.string().min(1).max(5000),
  locationInProperty: z.string().optional(),
  signals: z.array(z.string()).optional(),
});

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    await requireDbUser();
    const body = detectSchema.parse(await request.json());

    const result = await detectMultiIssue({
      description: body.description,
      locationInProperty: body.locationInProperty,
      signals: body.signals,
    });

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0]?.message || 'Invalid input' }, { status: 400 });
    }
    console.error('[detect-multi] Error:', error);
    // On any failure, return single issue so the flow continues normally
    return NextResponse.json({ issueCount: 1, issues: [] });
  }
}
