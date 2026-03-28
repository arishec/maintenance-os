import { getAnthropicClient } from '@/lib/ai/client';
import { issueClassificationSchema, type IssueClassification } from '@/types/ai';

export async function classifyIssue(input: {
  description: string;
  locationInProperty?: string | null;
  signals?: string[];
}): Promise<IssueClassification> {
  const prompt = `You are classifying a home maintenance issue.
Return JSON only with keys:
- title
- category
- urgency
- reasoningSummary
- suggestedTimeframe
- recommendedTrade
- confidenceScore

Allowed category values:
plumbing, electrical, hvac, roofing, appliance, structural, pest, cleaning, exterior, general_handyman, unknown

Allowed urgency values:
emergency, high, medium, low

Allowed suggestedTimeframe values:
immediately, today, within_24_hours, within_2_to_3_days, within_1_week

Allowed recommendedTrade values:
plumbing, electrical, hvac, roofing, appliance_repair, handyman, pest_control, landscaping, cleaning, restoration, general_contractor, other

Prefer caution over guessing.
Issue description: ${input.description}
Location: ${input.locationInProperty ?? 'unknown'}
Signals: ${(input.signals ?? []).join(', ') || 'none provided'}`;

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

  const parsed = issueClassificationSchema.parse(JSON.parse(text));
  return parsed;
}
