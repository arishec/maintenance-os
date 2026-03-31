import { getAnthropicClient } from '@/lib/ai/client';

export interface JobConfirmationResult {
  status: 'confirmed' | 'declined' | 'question' | 'unclear';
  summary: string; // 1-sentence human-readable summary
  schedulingInfo?: string; // e.g. "Tuesday at 2pm"
  declineReason?: string; // why they're declining
  followUpQuestion?: string; // question they asked
}

/**
 * Parse a contractor's reply to a "you've been selected" notification.
 * Determines if they're confirming, declining, asking a question, or unclear.
 */
export async function parseJobConfirmation(rawReply: string): Promise<JobConfirmationResult> {
  const anthropic = getAnthropicClient();

  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 300,
    temperature: 0,
    messages: [
      {
        role: 'user',
        content: `A contractor was notified they were selected for a home repair job. They replied with this message:

"${rawReply}"

Analyze their reply and return JSON with these fields:
- status: "confirmed" if they accept/agree/will do the job, "declined" if they refuse/can't do it, "question" if they're asking a question before committing, "unclear" if you can't tell
- summary: One plain sentence describing what the contractor said
- schedulingInfo: If they mention when they can come (e.g. "Tuesday at 2pm"), include it. Otherwise omit.
- declineReason: If they declined, briefly explain why. Otherwise omit.
- followUpQuestion: If they asked a question, include it. Otherwise omit.

Return ONLY valid JSON, no markdown.`,
      },
    ],
  });

  const text = response.content
    .map((block) => ('text' in block ? block.text : ''))
    .join('')
    .trim();

  try {
    // Strip markdown code blocks if present
    const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
    const parsed = JSON.parse(cleaned);
    return {
      status: ['confirmed', 'declined', 'question', 'unclear'].includes(parsed.status) ? parsed.status : 'unclear',
      summary: parsed.summary || 'Contractor replied to job selection.',
      schedulingInfo: parsed.schedulingInfo || undefined,
      declineReason: parsed.declineReason || undefined,
      followUpQuestion: parsed.followUpQuestion || undefined,
    };
  } catch {
    return {
      status: 'unclear',
      summary: 'Contractor replied but the response could not be parsed.',
    };
  }
}
