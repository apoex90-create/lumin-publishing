import { prisma } from '@/lib/db';
import { enqueueJob } from '../queue';

export async function runFormatter(jobType: string, payload: any, bookId: string | null) {
  if (jobType === 'format_epub' || jobType === 'format_pdf') {
    return formatBook(payload, bookId);
  }
  throw new Error(`Unknown formatter job: ${jobType}`);
}

async function formatBook(payload: any, bookId: string | null) {
  if (!bookId) throw new Error('Book ID required');

  // In production: use Pandoc, epub-gen, or similar
  // For now: mark as formatted and move to published
  await prisma.book.update({
    where: { id: bookId },
    data: {
      status: 'PUBLISHED',
      publishedAt: new Date(),
    },
  });

  // Trigger orchestrator to handle post-publish actions (marketing, email)
  await enqueueJob({
    agentType: 'ORCHESTRATOR',
    jobType: 'orchestrate_book',
    bookId,
    payload: {},
  });

  return { formatted: true, costINR: 0 };
}
