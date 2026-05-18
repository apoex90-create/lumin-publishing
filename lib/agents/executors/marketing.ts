import { prisma } from '@/lib/db';
import { callAI, parseAIJson } from '@/lib/ai-provider';
import { getAgent } from '../registry';

export async function runMarketing(jobType: string, payload: any, bookId: string | null) {
  return generateMarketing(payload, bookId);
}

async function generateMarketing(payload: any, bookId: string | null) {
  const agentDef = getAgent('MARKETING')!;

  const result = await callAI({
    messages: [
      { role: 'system', content: agentDef.systemPrompt },
      { role: 'user', content: `Create marketing for:\nTitle: ${payload.title}\nGenre: ${payload.genre}\nDescription: ${payload.description}` },
    ],
    temperature: 0.8,
  });

  const parsed = parseAIJson<any>(result.text);

  if (parsed && bookId) {
    await prisma.book.update({
      where: { id: bookId },
      data: {
        marketingCopy: parsed.blurb,
        socialPosts: JSON.stringify(parsed.socialPosts),
      },
    });
  }

  return { marketing: parsed, costINR: result.costINR };
}
