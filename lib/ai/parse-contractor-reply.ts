import { anthropic } from '@/lib/ai/client';
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

  const response = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 500,
    temperature: 0,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content
    .map((block) => ('text' in block ? block.text : ''))
    .join('')
    .trim();

  const parsed = contractorReplySchema.parse(JSON.parse(text));
  return parsed;
}
