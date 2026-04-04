import { getAnthropicClient } from '@/lib/ai/client';

export interface JobConfirmationResult {
  status: 'confirmed' | 'declined' | 'question' | 'unclear';
  summary: string; // 1-sentence human-readable summary
  schedulingInfo?: string; // e.g. "Tuesday at 2pm"
  scheduledDate?: string; // ISO 8601 date string, e.g. "2026-03-31"
  declineReason?: string; // why they're declining
  followUpQuestion?: string; // question they asked
}

/**
 * Parse a contractor's reply to a "you've been selected" notification.
 * Determines if they're confirming, declining, asking a question, or unclear.
 */
export async function parseJobConfirmation(rawReply: string): Promise<JobConfirmationResult> {
  const anthropic = getAnthropicClient();
  const now = new Date();
  const todayStr = [now.getFullYear(), String(now.getMonth() + 1).padStart(2, '0'), String(now.getDate()).padStart(2, '0')].join('-');
  const dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'long' });

  const prompt = `A contractor was notified they were selected for a home repair job. They replied with this message:

"${rawReply}"

Today is ${dayOfWeek}, ${todayStr}.

Analyze their reply and return JSON with these fields:
- status: "confirmed" if they accept/agree/will do the job, "declined" if they refuse/can't do it, "question" if they're asking a question before committing, "unclear" if you can't tell
- summary: One plain sentence describing what the contractor said
- schedulingInfo: If they mention when they can come (e.g. "Tuesday at 2pm"), include the human-readable text. Otherwise omit.
- scheduledDate: If they mention a specific day or date (e.g. "Monday", "next Tuesday", "March 31"), convert it to an ISO date string like "2026-03-31" based on today's date. If they say a day of the week, pick the NEXT occurrence of that day. If no date/day is mentioned, omit this field.
- declineReason: If they declined, briefly explain why. Otherwise omit.
- followUpQuestion: If they asked a question, include it. Otherwise omit.`;

  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 400,
    temperature: 0,
    system: 'You are a JSON-only API. Return ONLY a valid JSON object with no surrounding text, markdown, or explanation.',
    messages: [
      { role: 'user', content: prompt },
      { role: 'assistant', content: '{' },
    ],
  });

  const text = '{' + response.content
    .map((block) => ('text' in block ? block.text : ''))
    .join('')
    .trim();

  try {
    // Strip markdown code blocks if present
    const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
    const parsed = JSON.parse(cleaned);
    // Validate scheduledDate is a real date if provided
    let scheduledDate: string | undefined;
    if (parsed.scheduledDate) {
      const d = new Date(parsed.scheduledDate);
      if (!isNaN(d.getTime())) {
        scheduledDate = d.toISOString().split('T')[0]; // normalize to YYYY-MM-DD
      }
    }

    return {
      status: ['confirmed', 'declined', 'question', 'unclear'].includes(parsed.status) ? parsed.status : 'unclear',
      summary: parsed.summary || 'Contractor replied to job selection.',
      schedulingInfo: parsed.schedulingInfo || undefined,
      scheduledDate,
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
