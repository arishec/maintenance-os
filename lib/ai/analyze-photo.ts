import { getAnthropicClient } from '@/lib/ai/client';

/**
 * Uses Claude's vision capability to analyze a maintenance issue photo.
 * Returns a concise description of what's visible — damage type, severity,
 * affected area, and any relevant details a contractor would want to know.
 */
export async function analyzePhoto(photoUrl: string): Promise<string> {
  const anthropic = getAnthropicClient();

  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 300,
    temperature: 0,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'url', url: photoUrl },
          },
          {
            type: 'text',
            text: `You are analyzing a photo submitted for a home/property maintenance issue.
Describe what you see in 1-3 sentences. Focus on:
- What the problem or area appears to be (e.g. water damage, cracked drywall, leaking pipe)
- Severity or extent of the issue if visible
- Location details visible in the photo (e.g. under sink, ceiling corner, exterior wall)
Be factual and concise. Do NOT speculate about causes unless obvious. Do NOT give repair advice.`,
          },
        ],
      },
    ],
  });

  const text = response.content
    .map((block) => ('text' in block ? block.text : ''))
    .join('')
    .trim();

  return text || 'Unable to analyze photo.';
}
