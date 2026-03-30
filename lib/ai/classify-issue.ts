import { getAnthropicClient } from '@/lib/ai/client';
import { issueClassificationSchema, type IssueClassification } from '@/types/ai';

export async function classifyIssue(input: {
  description: string;
  locationInProperty?: string | null;
  signals?: string[];
  photoDescriptions?: string[];
}): Promise<IssueClassification> {
  const photoContext = input.photoDescriptions?.length
    ? `\nPhoto analysis (AI-generated from uploaded photos):\n${input.photoDescriptions.map((d, i) => `  Photo ${i + 1}: ${d}`).join('\n')}`
    : '';

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

Prefer caution over guessing. Use the photo descriptions (if provided) together with the text description to make a more accurate classification.
Issue description: ${input.description}
Location: ${input.locationInProperty ?? 'unknown'}
Signals: ${(input.signals ?? []).join(', ') || 'none provided'}${photoContext}`;

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

  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    console.error('[classifyIssue] AI returned non-JSON:', text.substring(0, 200));
    throw new Error('AI classification returned invalid JSON');
  }

  const parsed = issueClassificationSchema.safeParse(json);
  if (!parsed.success) {
    console.error('[classifyIssue] AI response failed schema validation:', parsed.error.issues);
    throw new Error(`AI classification failed schema validation: ${parsed.error.issues[0]?.message}`);
  }
  return parsed.data;
}
