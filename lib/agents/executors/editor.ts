import { prisma } from '@/lib/db';
import { callAI, parseAIJson } from '@/lib/ai-provider';
import { getAgent } from '../registry';
import { enqueueJob } from '../queue';

export async function runEditor(jobType: string, payload: any, bookId: string | null) {
  if (jobType === 'edit_manuscript') return editManuscript(payload, bookId);
  if (jobType === 'analyze_quality') return analyzeQuality(payload, bookId);
  throw new Error(`Unknown editor job: ${jobType}`);
}

async function editManuscript(payload: any, bookId: string | null) {
  if (!bookId) throw new Error('Book ID required');
  const book = await prisma.book.findUnique({ where: { id: bookId } });
  if (!book) throw new Error('Book not found');

  const agentDef = getAgent('EDITOR')!;

  // In production, you'd fetch the manuscript from storage.
  // For now, we work with the description as a sample.
  const manuscriptSample = `Title: ${book.title}\nDescription: ${book.description}\n\n[Full manuscript would be here]`;

  const result = await callAI({
    messages: [
      { role: 'system', content: agentDef.systemPrompt },
      { role: 'user', content: `Please edit this manuscript and return JSON.\n\n${manuscriptSample}` },
    ],
    temperature: 0.3,
  });

  const parsed = parseAIJson<{ editedText: string; notes: string[]; qualityScore: number; readyToPublish: boolean }>(result.text);

  if (parsed) {
    await prisma.book.update({
      where: { id: bookId },
      data: {
        editorNotes: parsed.notes.join('\n'),
        editedManuscriptUrl: '/uploads/edited/' + bookId + '.docx', // placeholder
        status: parsed.readyToPublish ? 'COVER_DESIGN' : 'IN_EDITING',
      },
    });

    // Move book forward
    await enqueueJob({
      agentType: 'ORCHESTRATOR',
      jobType: 'orchestrate_book',
      bookId,
      payload: {},
    });
  }

  return { editedNotes: parsed?.notes, qualityScore: parsed?.qualityScore, costINR: result.costINR };
}

async function analyzeQuality(payload: any, bookId: string | null) {
  if (!bookId) throw new Error('Book ID required');
  const book = await prisma.book.findUnique({ where: { id: bookId } });
  if (!book) throw new Error('Book not found');

  const result = await callAI({
    messages: [
      { role: 'system', content: 'You are a literary quality analyzer. Rate this book 0-100 and explain.' },
      { role: 'user', content: `Title: ${book.title}\nGenre: ${book.genre}\nDescription: ${book.description}` },
    ],
  });

  return { analysis: result.text, costINR: result.costINR };
}
