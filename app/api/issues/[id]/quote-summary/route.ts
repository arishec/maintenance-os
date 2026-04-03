import { NextRequest, NextResponse } from 'next/server';
import { requireDbUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getAnthropicClient } from '@/lib/ai/client';
import { safeErrorMessage } from '@/lib/utils';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireDbUser();
    const { id } = await params;

    // Fetch the issue with all dispatches and contractor responses
    const issue = await prisma.issue.findFirst({
      where: { id, property: { ownerUserId: user.id } },
      include: {
        dispatches: {
          include: {
            contractor: true,
            responses: {
              orderBy: { receivedAt: 'asc' },
            },
          },
        },
      },
    });

    if (!issue) {
      return NextResponse.json({ error: 'Issue not found.' }, { status: 404 });
    }

    // Collect all responses with pricing info, including contractor and dispatch metadata
    const quotesWithMetadata = issue.dispatches
      .flatMap((dispatch) =>
        (dispatch.responses || [])
          .filter((response) =>
            response.flatEstimate || response.estimateLow || response.estimateHigh
          )
          .map((response) => ({
            contractor: dispatch.contractor,
            response,
            dispatch,
          }))
      );

    // Need at least 2 quotes to generate a comparison
    if (quotesWithMetadata.length < 2) {
      return NextResponse.json(
        { summary: null, message: 'Not enough quotes to compare' },
        { status: 200 }
      );
    }

    // Build the context for Claude
    const quotesContext = quotesWithMetadata
      .map((item, index) => {
        const contractor = item.contractor;
        const response = item.response;
        const dispatch = item.dispatch;

        // Calculate response time
        const dispatchSent = dispatch.sentAt || dispatch.createdAt;
        const responseTime = response.receivedAt
          ? Math.round((new Date(response.receivedAt).getTime() - new Date(dispatchSent).getTime()) / (1000 * 60))
          : null;

        // Format price
        let priceStr = '';
        if (response.flatEstimate) {
          priceStr = `$${Number(response.flatEstimate).toLocaleString()}`;
        } else if (response.estimateLow && response.estimateHigh) {
          priceStr = `$${Number(response.estimateLow).toLocaleString()} – $${Number(response.estimateHigh).toLocaleString()}`;
        } else if (response.estimateLow) {
          priceStr = `From $${Number(response.estimateLow).toLocaleString()}`;
        } else if (response.estimateHigh) {
          priceStr = `Up to $${Number(response.estimateHigh).toLocaleString()}`;
        }

        const availability = response.availabilityText ||
          (response.availabilityDate ? `${new Date(response.availabilityDate).toLocaleDateString()}` : 'Not specified');

        return `
Contractor ${index + 1}: ${contractor.name}${contractor.companyName ? ` (${contractor.companyName})` : ''}
- Price: ${priceStr}
- Availability: ${availability}
- Response time: ${responseTime ? `${responseTime} minutes` : 'Unknown'}${response.notes ? `\n- Notes: ${response.notes}` : ''}`;
      })
      .join('\n');

    const prompt = `You are analyzing contractor quotes for a home maintenance issue. Generate a brief, actionable comparison summary (2-4 sentences max) that helps the homeowner make a decision.

Here are the quotes received:
${quotesContext}

Provide a concise summary that tells the homeowner:
1. Who is the most cost-effective option
2. Who has the best availability/fastest response
3. A clear recommendation with reasoning

Keep it conversational and practical. Focus on helping them choose.`;

    const anthropic = getAnthropicClient();
    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 300,
      temperature: 0,
      messages: [
        { role: 'user', content: prompt },
      ],
    });

    const summary = response.content
      .map((block) => ('text' in block ? block.text : ''))
      .join('')
      .trim();

    return NextResponse.json({ summary });
  } catch (error) {
    console.error('[quote-summary] Error:', error);
    return NextResponse.json(
      { error: safeErrorMessage(error) },
      { status: 500 }
    );
  }
}
