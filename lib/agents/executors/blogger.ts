import { prisma } from '@/lib/db';
import { callAI, parseAIJson } from '@/lib/ai-provider';
import { getAgent } from '../registry';

const TOPICS = [
  'How AI is changing book publishing in 2026',
  '5 mistakes first-time authors make with their book cover',
  'The complete guide to self-publishing in India',
  'Why your book description matters more than your cover',
  'How to write a memoir that sells',
  'EPUB vs PDF: which format should your book be in?',
  'Marketing your book on a zero budget',
  'How to price your book for maximum sales',
  'The 7-day publishing miracle: from manuscript to bestseller',
  'Hindi vs English publishing in India: which market is bigger?',
];

export async function runBlogger(jobType: string, payload: any, bookId: string | null) {
  return writeBlogPost(payload);
}

async function writeBlogPost(payload: any) {
  const agentDef = getAgent('BLOGGER')!;

  const topic = payload.topic && payload.topic !== 'auto-pick'
    ? payload.topic
    : TOPICS[Math.floor(Math.random() * TOPICS.length)];

  const result = await callAI({
    messages: [
      { role: 'system', content: agentDef.systemPrompt },
      { role: 'user', content: `Write a blog post on: "${topic}". Return JSON only.` },
    ],
    temperature: 0.7,
    maxTokens: 4000,
  });

  const parsed = parseAIJson<any>(result.text);

  if (parsed) {
    // Make slug URL-safe
    const slug = parsed.slug || parsed.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Check if already exists
    const existing = await prisma.blogPost.findUnique({ where: { slug } });
    if (!existing) {
      await prisma.blogPost.create({
        data: {
          slug,
          title: parsed.title,
          excerpt: parsed.excerpt,
          content: parsed.content,
          category: parsed.category || 'Writing Tips',
          // AI may return tags as an array; the column is a String
          tags: Array.isArray(parsed.tags) ? JSON.stringify(parsed.tags) : (parsed.tags || ''),
          publishedAt: new Date(),
          authorBot: 'BLOGGER',
        },
      });
    }
  }

  return { blog: parsed, costINR: result.costINR };
}
