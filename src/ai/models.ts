// Kept separate from claudeGenerator.ts so the Anthropic SDK is only downloaded when AI is actually used.
export const AI_MODELS = [
  { id: 'claude-opus-5-5', label: 'Claude Opus 5.5 (best quality)' },
  { id: 'claude-sonnet-5-5', label: 'Claude Sonnet 5.5 (balanced)' },
  { id: 'claude-haiku-5-5', label: 'Claude Haiku 5.5 (cheapest, fastest)' },
] as const
export type AiModelId = (typeof AI_MODELS)[number]['id']
