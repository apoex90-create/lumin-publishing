import { prisma } from '@/lib/db';
import { callAI, parseAIJson } from '@/lib/ai-provider';
import { getAgent } from '../registry';
import { enqueueJob } from '../queue';

export async function runOrchestrator(jobType: string, payload: any, bookId: string | null) {
  if (jobType === 'orchestrate_book') return orchestrateBook(payload, bookId);
  if (jobType === 'orchestrate_daily') return orchestrateDaily();
  if (jobType === 'route_event') return routeEvent(payload);
  throw new Error(`Unknown orchestrator job: ${jobType}`);
}

// Look at one book and decide what's next
async function orchestrateBook(payload: any, bookId: string | null) {
  if (!bookId) throw new Error('Book ID required');

  const book = await prisma.book.findUnique({ where: { id: bookId }, include: { author: true } });
  if (!book) throw new Error('Book not found');

  // Rule-based first (cheaper than AI). Use AI for edge cases.
  const decisions: string[] = [];

  switch (book.status) {
    case 'SUBMITTED':
      // Move to review automatically
      await prisma.book.update({ where: { id: bookId }, data: { status: 'IN_REVIEW' } });
      // Send welcome email
      await enqueueJob({
        agentType: 'MAILER',
        jobType: 'send_status_update',
        bookId,
        payload: { template: 'book_submitted', userId: book.authorId },
      });
      // Chain the next pipeline step immediately — without this the book
      // sits in IN_REVIEW until the next daily sweep (up to 23 hours)
      await enqueueJob({
        agentType: 'ORCHESTRATOR',
        jobType: 'orchestrate_book',
        bookId,
        payload: {},
        priority: 3,
      });
      decisions.push('Moved to IN_REVIEW + sent confirmation email');
      break;

    case 'IN_REVIEW':
      // Trigger editor
      await enqueueJob({
        agentType: 'EDITOR',
        jobType: 'edit_manuscript',
        bookId,
        payload: { manuscriptUrl: book.manuscriptUrl },
        priority: 3,
      });
      await prisma.book.update({ where: { id: bookId }, data: { status: 'IN_EDITING' } });
      decisions.push('Dispatched to EDITOR');
      break;

    case 'IN_EDITING':
      // Editor will complete and orchestrator picks up next cycle
      decisions.push('Waiting for EDITOR to complete');
      break;

    case 'COVER_DESIGN':
      await enqueueJob({
        agentType: 'DESIGNER',
        jobType: 'generate_cover_variants',
        bookId,
        payload: { title: book.title, genre: book.genre, description: book.description },
      });
      decisions.push('Dispatched to DESIGNER');
      break;

    case 'FORMATTING':
      await enqueueJob({
        agentType: 'FORMATTER',
        jobType: 'format_epub',
        bookId,
        payload: {},
      });
      decisions.push('Dispatched to FORMATTER');
      break;

    case 'PUBLISHED':
      // Trigger marketing campaign once
      await enqueueJob({
        agentType: 'MARKETING',
        jobType: 'generate_marketing',
        bookId,
        payload: { title: book.title, genre: book.genre, description: book.description },
      });
      await enqueueJob({
        agentType: 'MAILER',
        jobType: 'send_status_update',
        bookId,
        payload: { template: 'book_published', userId: book.authorId },
      });
      decisions.push('Triggered MARKETING + congrats email');
      break;
  }

  return { decisions, costINR: 0 };
}

// Run hourly/daily checks across the platform
async function orchestrateDaily() {
  const actions: string[] = [];

  // Find all books needing attention
  const activeBooks = await prisma.book.findMany({
    where: { status: { in: ['SUBMITTED', 'IN_REVIEW', 'IN_EDITING', 'COVER_DESIGN', 'FORMATTING'] } },
  });

  for (const book of activeBooks) {
    await enqueueJob({
      agentType: 'ORCHESTRATOR',
      jobType: 'orchestrate_book',
      bookId: book.id,
      payload: {},
      priority: 4,
    });
  }
  actions.push(`Queued orchestration for ${activeBooks.length} active books`);

  // Trigger daily blog post
  await enqueueJob({
    agentType: 'BLOGGER',
    jobType: 'write_blog_post',
    payload: { topic: 'auto-pick' },
    priority: 6,
  });
  actions.push('Queued daily blog post');

  // Trigger maintenance health check
  await enqueueJob({
    agentType: 'MAINTENANCE',
    jobType: 'health_check',
    payload: {},
    priority: 8,
  });
  actions.push('Queued maintenance check');

  return { actions, costINR: 0 };
}

// External events route through here
async function routeEvent(payload: { event: string; data: any }) {
  const { event, data } = payload;
  const actions: string[] = [];

  if (event === 'user_signup') {
    await enqueueJob({
      agentType: 'MAILER',
      jobType: 'send_welcome',
      payload: { userId: data.userId },
    });
    actions.push('Sent welcome email');
  }

  if (event === 'sale_recorded') {
    // Don't auto-process — accounts agent will batch payouts weekly
    actions.push('Sale logged, payout will batch Friday');
  }

  if (event === 'support_inquiry') {
    await enqueueJob({
      agentType: 'SUPPORT',
      jobType: 'answer_inquiry',
      payload: { threadId: data.threadId, message: data.message },
      priority: 2,
    });
    actions.push('Routed to SUPPORT');
  }

  return { actions, costINR: 0 };
}
