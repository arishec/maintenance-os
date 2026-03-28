import { getAnthropicClient } from '@/lib/ai/client';
import { contractorReplySchema, type ContractorReplyParse } from '@/types/ai';

export async function parseContractorReply(input: {
  rawReply: string;
  issueCategory?: string | null;
  contractorTrade?: string | null;
}): Promise<ContractorReplyParse> {
  const prompt = `Parse this contractor reply into structured JSON only.
Return keys:
availabilityText, availabilityDate, estimateLow, estimateHigh, flatEstimate, notes, followUpQuestion, confidenceScore, requiresReview.
Use null rather than guessing.
If the message is too vague, set requiresReview=true.
Issue category: ${input.issueCategory ?? 'unknown'}
Contractor trade: ${input.contractorTrade ?? 'unknown'}
Raw reply: ${input.rawReply}`;

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

  // Strip markdown code fences if present
  text = text.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '').trim();

  const parsed = contractorReplySchema.parse(JSON.parse(text));
  return parsed;
}
