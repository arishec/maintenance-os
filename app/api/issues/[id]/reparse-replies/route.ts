import { NextRequest, NextResponse } from 'next/server';
import { requireDbUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { parseContractorReply } from '@/lib/ai/parse-contractor-reply';

/**
 * POST /api/issues/[id]/reparse-replies
 * Re-run AI parsing on all contractor responses for this issue.
 * Useful for retrying after fixing API key or parsing logic.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireDbUser();
    const { id: issueId } = await params;

    // Get the issue and its dispatches with responses
    const issue = await prisma.issue.findFirst({
      where: { id: issueId, property: { ownerUserId: user.id } },
      include: {
        dispatches: {
          include: {
            contractor: true,
            responses: true,
          },
        },
      },
    });

    if (!issue) {
      return NextResponse.json({ error: 'Issue not found' }, { status: 404 });
    }

    const results: Array<{ responseId: string; success: boolean; error?: string; parsed?: Record<string, unknown> }> = [];

    for (const dispatch of issue.dispatches) {
      for (const response of dispatch.responses) {
        if (!response.rawMessage) continue;

        try {
          const parsed = await parseContractorReply({
            rawReply: response.rawMessage,
            issueCategory: issue.category ?? undefined,
            contractorTrade: dispatch.contractor.trade,
          });

          let availabilityDateObj: Date | null = null;
          if (parsed.availabilityDate) {
            try {
              availabilityDateObj = new Date(parsed.availabilityDate);
            } catch {
              // Invalid date
            }
          }

          await prisma.contractorResponse.update({
            where: { id: response.id },
            data: {
              availabilityText: parsed.availabilityText,
              availabilityDate: availabilityDateObj,
              estimateLow: parsed.estimateLow || null,
              estimateHigh: parsed.estimateHigh || null,
              flatEstimate: parsed.flatEstimate || null,
              notes: parsed.notes,
              followUpQuestion: parsed.followUpQuestion,
              extractionConfidence: parsed.confidenceScore,
              requiresReview: parsed.requiresReview,
            },
          });

          results.push({ responseId: response.id, success: true, parsed: parsed as unknown as Record<string, unknown> });
        } catch (error) {
          results.push({
            responseId: response.id,
            success: false,
            error: error instanceof Error ? error.message : String(error),
          });
        }
      }
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Error reparsing replies:', error);
    return NextResponse.json(
      { error: 'We encountered an error. Please try again.' },
      { status: 500 }
    );
  }
}
