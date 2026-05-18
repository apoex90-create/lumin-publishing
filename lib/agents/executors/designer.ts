import { prisma } from '@/lib/db';
import { callAI, parseAIJson } from '@/lib/ai-provider';
import { getAgent } from '../registry';
import { enqueueJob } from '../queue';

export async function runDesigner(jobType: string, payload: any, bookId: string | null) {
  if (jobType === 'generate_cover_variants' || jobType === 'generate_cover') {
    return generateCoverVariants(payload, bookId);
  }
  throw new Error(`Unknown designer job: ${jobType}`);
}

async function generateCoverVariants(payload: any, bookId: string | null) {
  const agentDef = getAgent('DESIGNER')!;

  const result = await callAI({
    messages: [
      { role: 'system', content: agentDef.systemPrompt },
      { role: 'user', content: `Generate cover prompts for:\nTitle: ${payload.title}\nGenre: ${payload.genre}\nDescription: ${payload.description}` },
    ],
    temperature: 0.8,
  });

  const parsed = parseAIJson<{ prompts: any[]; recommendedStyle: string }>(result.text);

  if (parsed && bookId) {
    // In production, you'd call Stability AI / Replicate / DALL-E here with each prompt
    // For now, we store the prompts and use placeholder URLs
    const variants = (parsed.prompts || []).map((p, i) => ({
      style: p.style,
      prompt: p.prompt,
      url: `https://placehold.co/600x900/1f1547/d4a017?text=${encodeURIComponent(payload.title)}`,
    }));

    await prisma.book.update({
      where: { id: bookId },
      data: {
        coverVariants: JSON.stringify(variants),
        coverUrl: variants[0]?.url,
        status: 'FORMATTING',
      },
    });

    // Continue pipeline
    await enqueueJob({
      agentType: 'ORCHESTRATOR',
      jobType: 'orchestrate_book',
      bookId,
      payload: {},
    });
  }

  return { variants: parsed?.prompts, costINR: result.costINR };
}
