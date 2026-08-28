// Universal AI provider — works with Anthropic Claude, OpenAI GPT, and any
// OpenAI-compatible endpoint (Groq, OpenRouter, Google AI Studio, Together,
// self-hosted Ollama/vLLM, etc.)
//
// Switch by setting AI_PROVIDER in .env:
//   "anthropic" — Anthropic Claude (ANTHROPIC_API_KEY)
//   "openai"    — OpenAI (OPENAI_API_KEY)
//   "custom"    — any OpenAI-compatible API:
//                   AI_BASE_URL  e.g. https://api.groq.com/openai/v1
//                   AI_API_KEY   the provider's key (free tiers work)
//                   AI_MODEL     e.g. llama-3.3-70b-versatile

export type AIProvider = 'anthropic' | 'openai' | 'custom';

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AICallOptions {
  messages: AIMessage[];
  temperature?: number;
  maxTokens?: number;
  model?: string;
}

export interface AIResponse {
  text: string;
  costINR: number;  // Estimated cost in INR for tracking
  tokensUsed: number;
}

const PROVIDER = (process.env.AI_PROVIDER || 'anthropic') as AIProvider;

// Rough cost estimates (₹ per 1K tokens) - update these to current pricing
const COSTS = {
  anthropic: { input: 0.25, output: 1.25 },   // Claude Sonnet
  openai: { input: 0.20, output: 0.80 },      // GPT-4o
};

export async function callAI(opts: AICallOptions): Promise<AIResponse> {
  if (PROVIDER === 'anthropic') return callAnthropic(opts);
  if (PROVIDER === 'custom') return callOpenAICompatible(opts);
  return callOpenAI(opts);
}

// Any OpenAI-compatible endpoint: Groq, OpenRouter, Google AI Studio,
// Together, DeepInfra, or a self-hosted Ollama/vLLM server.
// Cost is reported as 0 — free tiers / self-hosted have no per-token bill.
async function callOpenAICompatible(opts: AICallOptions): Promise<AIResponse> {
  const baseUrl = (process.env.AI_BASE_URL || '').replace(/\/$/, '');
  const apiKey = process.env.AI_API_KEY;
  if (!baseUrl) return mockResponse(opts);

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Ollama and some local servers accept requests without a key
      ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
    },
    body: JSON.stringify({
      model: opts.model || process.env.AI_MODEL || 'llama-3.3-70b-versatile',
      messages: opts.messages,
      temperature: opts.temperature ?? 0.7,
      max_tokens: opts.maxTokens || 4096,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`AI provider error (${baseUrl}): ${err}`);
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content || '';
  const tokensUsed = data.usage?.total_tokens || 0;

  return { text, tokensUsed, costINR: 0 };
}

async function callAnthropic(opts: AICallOptions): Promise<AIResponse> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    // Graceful fallback — return mock response in dev so app still works
    return mockResponse(opts);
  }

  const systemMsg = opts.messages.find(m => m.role === 'system');
  const otherMsgs = opts.messages.filter(m => m.role !== 'system');

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: opts.model || 'claude-sonnet-4-20250514',
      max_tokens: opts.maxTokens || 4096,
      temperature: opts.temperature ?? 0.7,
      system: systemMsg?.content,
      messages: otherMsgs,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Anthropic API error: ${err}`);
  }

  const data = await res.json();
  const text = data.content?.[0]?.text || '';
  const tokensUsed = (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0);
  const costINR = (data.usage?.input_tokens / 1000) * COSTS.anthropic.input
                + (data.usage?.output_tokens / 1000) * COSTS.anthropic.output;

  return { text, tokensUsed, costINR };
}

async function callOpenAI(opts: AICallOptions): Promise<AIResponse> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return mockResponse(opts);

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: opts.model || 'gpt-4o',
      messages: opts.messages,
      temperature: opts.temperature ?? 0.7,
      max_tokens: opts.maxTokens || 4096,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI API error: ${err}`);
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content || '';
  const tokensUsed = data.usage?.total_tokens || 0;
  const costINR = (data.usage?.prompt_tokens / 1000) * COSTS.openai.input
                + (data.usage?.completion_tokens / 1000) * COSTS.openai.output;

  return { text, tokensUsed, costINR };
}

// Mock response when no API key — lets you develop without spending money
function mockResponse(opts: AICallOptions): AIResponse {
  const lastUserMsg = [...opts.messages].reverse().find(m => m.role === 'user')?.content || '';
  return {
    text: `[MOCK RESPONSE — no API key configured]\n\nYou asked: ${lastUserMsg.slice(0, 100)}...\n\nIn production, this would be a real AI-generated response. Set ANTHROPIC_API_KEY or OPENAI_API_KEY in .env to enable real AI.`,
    tokensUsed: 0,
    costINR: 0,
  };
}

// Helper: parse JSON safely from AI output
export function parseAIJson<T = any>(text: string): T | null {
  try {
    // Strip markdown code fences if present
    const cleaned = text.replace(/^```(?:json)?\n?|\n?```$/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}
