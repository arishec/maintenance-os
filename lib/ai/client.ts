import Anthropic from '@anthropic-ai/sdk';

let _anthropic: Anthropic | null = null;

export function getAnthropicClient(): Anthropic {
  if (!_anthropic) {
    const key = process.env.ANTHROPIC_API_KEY;
    if (!key || key === 'REPLACE_ME' || key === 'sk-ant-REPLACE_ME') {
      throw new Error('Anthropic API key not configured. Set ANTHROPIC_API_KEY in .env');
    }
    _anthropic = new Anthropic({ apiKey: key });
  }
  return _anthropic;
}

// Keep backward-compatible export (lazy getter)
export const anthropic = new Proxy({} as Anthropic, {
  get(_, prop) {
    return (getAnthropicClient() as unknown as Record<string, unknown>)[prop as string];
  },
});
