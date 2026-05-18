import { prisma } from '@/lib/db';
import { callAI, parseAIJson } from '@/lib/ai-provider';
import { getAgent } from '../registry';

export async function runSupport(jobType: string, payload: any, bookId: string | null) {
  return answerInquiry(payload);
}

async function answerInquiry(payload: { threadId: string; message: string }) {
  const agentDef = getAgent('SUPPORT')!;

  const thread = await prisma.supportThread.findUnique({
    where: { id: payload.threadId },
    include: { messages: { orderBy: { createdAt: 'asc' } } },
  });

  if (!thread) throw new Error('Thread not found');

  // Build conversation history
  const history = thread.messages.map(m => ({
    role: m.sender === 'user' ? 'user' as const : 'assistant' as const,
    content: m.body,
  }));

  const result = await callAI({
    messages: [
      { role: 'system', content: agentDef.systemPrompt },
      ...history,
    ],
    temperature: 0.5,
  });

  const parsed = parseAIJson<{ reply: string; escalate: boolean; tags: string[] }>(result.text);

  if (parsed) {
    await prisma.supportMessage.create({
      data: {
        threadId: thread.id,
        sender: 'agent',
        body: parsed.reply,
      },
    });

    if (parsed.escalate) {
      await prisma.supportThread.update({
        where: { id: thread.id },
        data: { status: 'escalated' },
      });
    } else {
      await prisma.supportThread.update({
        where: { id: thread.id },
        data: { status: 'resolved', updatedAt: new Date() },
      });
    }
  }

  return { reply: parsed?.reply, escalated: parsed?.escalate, costINR: result.costINR };
}
