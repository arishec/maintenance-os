import { getAnthropicClient } from '@/lib/ai/client';
import { contractorReplySchema, type ContractorReplyParse } from '@/types/ai';

/**
 * Strip quoted reply chains from email text.
 * Removes lines starting with ">" and "On ... wrote:" attribution lines,
 * plus common email signatures and forwarded headers.
 */
function stripQuotedReply(text: string): string {
  const lines = text.split('\n');
  const cleaned: string[] = [];

  for (const line of lines) {
    // Stop at "On <date> ... wrote:" or "> " quoted lines
    if (/^>/.test(line.trim())) break;
    if (/^On .+ wrote:$/i.test(line.trim())) break;
    // Stop at common email client quote markers
    if (/^-{3,}\s*Original Message/i.test(line.trim())) break;
    if (/^_{3,}/.test(line.trim())) break;
    cleaned.push(line);
  }

  return cleaned.join('\n').trim();
}

export async function parseContractorReply(input: {
  rawReply: string;
  issueCategory?: string | null;
  contractorTrade?: string | null;
}): Promise<ContractorReplyParse> {
  // Strip quoted reply thread — only parse the contractor's actual new text
  const cleanedReply = stripQuotedReply(input.rawReply) || input.rawReply;

  console.log('[parseContractorReply] Input length:', input.rawReply.length, '→ cleaned:', cleanedReply.length);

  const prompt = `Parse this contractor reply into structured JSON only.
Return keys:
availabilityText, availabilityDate, estimateLow, estimateHigh, flatEstimate, notes, followUpQuestion, confidenceScore, requiresReview.
Use null rather than guessing. For dollar amounts, extract the number only (no $ sign).
If the message is too vague, set requiresReview=true.
Issue category: ${input.issueCategory ?? 'unknown'}
Contractor trade: ${input.contractorTrade ?? 'unknown'}
Raw reply:
${cleanedReply}`;

  const anthropic = getAnthropicClient();
  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 500,
    temperature: 0,
    messages: [{ role: 'user', content: prompt }],
  });

  let text = response.content
    .map((block) => ('text' in block ? block.text : ''))
    .join('')
    .trim();

  console.log('[parseContractorReply] AI raw response:', text.substring(0, 300));

  // Strip markdown code fences if present
  text = text.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '').trim();

  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    console.error('[parseContractorReply] AI returned non-JSON:', text.substring(0, 200));
    throw new Error('AI reply parsing returned invalid JSON');
  }

  const result = contractorReplySchema.safeParse(json);
  if (!result.success) {
    console.error('[parseContractorReply] Schema validation failed:', result.error.issues);
    throw new Error(`AI reply parsing failed validation: ${result.error.issues[0]?.message}`);
  }
  const parsed = result.data;

  // Post-process: enforce confidence and requiresReview based on extraction results
  const hasPrice = parsed.estimateLow != null || parsed.estimateHigh != null || parsed.flatEstimate != null;
  const hasAvailability = parsed.availabilityText != null || parsed.availabilityDate != null;

  if (hasPrice && hasAvailability) {
    // Both key fields extracted — high confidence, no review needed
    parsed.confidenceScore = Math.max(parsed.confidenceScore, 0.85);
    parsed.requiresReview = false;
  } else if (hasPrice) {
    // Price but no availability — decent confidence
    parsed.confidenceScore = Math.max(parsed.confidenceScore, 0.7);
    parsed.requiresReview = false;
  } else if (hasAvailability) {
    // Availability but no price — moderate confidence, may need review
    parsed.confidenceScore = Math.max(parsed.confidenceScore, 0.6);
  }
  // If neither price nor availability, leave AI's confidence and requiresReview as-is

  console.log('[parseContractorReply] Post-processed:', {
    hasPrice,
    hasAvailability,
    confidence: parsed.confidenceScore,
    requiresReview: parsed.requiresReview,
  });

  return parsed;
}
