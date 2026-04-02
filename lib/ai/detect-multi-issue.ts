import { getAnthropicClient } from '@/lib/ai/client';
import { z } from 'zod';

const singleIssueSchema = z.object({
  description: z.string(),
  suggestedLocation: z.string().nullable(),
  suggestedSignals: z.array(z.string()),
});

const detectResultSchema = z.object({
  issueCount: z.number(),
  issues: z.array(singleIssueSchema),
});

export type DetectedIssue = z.infer<typeof singleIssueSchema>;
export type DetectMultiIssueResult = z.infer<typeof detectResultSchema>;

/**
 * Detect if a user's description contains multiple distinct maintenance issues.
 * Returns the count and a breakdown of each issue with suggested location/signals.
 */
export async function detectMultiIssue(input: {
  description: string;
  locationInProperty?: string;
  signals?: string[];
}): Promise<DetectMultiIssueResult> {
  const anthropic = getAnthropicClient();

  const prompt = `A property owner submitted a maintenance request. Determine if the description contains ONE issue or MULTIPLE distinct issues that need separate contractors or separate tracking.

Examples of MULTIPLE issues:
- "toilet leak and heat broken" → 2 issues (plumbing + HVAC)
- "kitchen faucet dripping, bedroom window cracked, garage door won't open" → 3 issues
- "AC not working and there's a wasp nest outside" → 2 issues (HVAC + pest)

Examples of SINGLE issues (do NOT split these):
- "water leaking from ceiling causing stain on wall" → 1 issue (one root cause)
- "furnace making noise and blowing cold air" → 1 issue (same system)
- "bathroom sink clogged and toilet running" → could be 1 plumbing issue if same bathroom

Description: "${input.description}"
${input.locationInProperty ? `Location provided: ${input.locationInProperty}` : ''}
${input.signals?.length ? `Signals checked: ${input.signals.join(', ')}` : ''}

Return JSON with:
- issueCount: number of distinct issues (1 if single issue)
- issues: array of objects, each with:
  - description: the portion of the original description for this issue (use the owner's words, don't rewrite)
  - suggestedLocation: one of [kitchen, bathroom, bedroom, living_room, basement, exterior, hvac_closet, roof, garage, other] or null if unclear
  - suggestedSignals: array of applicable signals from [safety, water, heat, power], empty array if none apply`;

  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 600,
    temperature: 0,
    system: 'You are a JSON-only API. Return ONLY a valid JSON object with no surrounding text, markdown, or explanation.',
    messages: [
      { role: 'user', content: prompt },
      { role: 'assistant', content: '{' },
    ],
  });

  let text = '{' + response.content
    .map((block) => ('text' in block ? block.text : ''))
    .join('')
    .trim();

  // Strip markdown code fences if present
  text = text.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '').trim();

  // Extract JSON object if there's trailing text
  const lastBrace = text.lastIndexOf('}');
  if (lastBrace !== -1 && lastBrace < text.length - 1) {
    text = text.substring(0, lastBrace + 1);
  }

  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    console.error('[detectMultiIssue] AI returned non-JSON:', text.substring(0, 200));
    // Fallback: treat as single issue
    return {
      issueCount: 1,
      issues: [{ description: input.description, suggestedLocation: input.locationInProperty || null, suggestedSignals: input.signals || [] }],
    };
  }

  const result = detectResultSchema.safeParse(json);
  if (!result.success) {
    console.error('[detectMultiIssue] Schema validation failed:', result.error.issues);
    return {
      issueCount: 1,
      issues: [{ description: input.description, suggestedLocation: input.locationInProperty || null, suggestedSignals: input.signals || [] }],
    };
  }

  return result.data;
}
