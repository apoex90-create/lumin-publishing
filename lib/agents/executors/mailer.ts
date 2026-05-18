import { prisma } from '@/lib/db';
import { callAI, parseAIJson } from '@/lib/ai-provider';
import { getAgent } from '../registry';

export async function runMailer(jobType: string, payload: any, bookId: string | null) {
  if (jobType === 'send_welcome') return sendEmail('welcome', payload, bookId);
  if (jobType === 'send_status_update') return sendEmail(payload.template, payload, bookId);
  if (jobType === 'send_newsletter') return sendEmail('newsletter', payload, bookId);
  if (jobType === 'send_custom') return sendCustomEmail(payload);
  throw new Error(`Unknown mailer job: ${jobType}`);
}

async function sendEmail(template: string, payload: any, bookId: string | null) {
  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  if (!user) throw new Error('User not found');

  const book = bookId ? await prisma.book.findUnique({ where: { id: bookId } }) : null;

  const agentDef = getAgent('MAILER')!;

  const context = `
Template: ${template}
Recipient: ${user.fullName} (${user.email})
${book ? `Book: ${book.title} (status: ${book.status})` : ''}
  `.trim();

  const result = await callAI({
    messages: [
      { role: 'system', content: agentDef.systemPrompt },
      { role: 'user', content: `Compose this email and return JSON.\n\n${context}` },
    ],
    temperature: 0.6,
  });

  const parsed = parseAIJson<any>(result.text);

  if (parsed) {
    const emailLog = await prisma.emailLog.create({
      data: {
        userId: user.id,
        toEmail: user.email,
        subject: parsed.subject,
        body: parsed.bodyHtml || parsed.bodyText,
        template,
        status: 'queued',
      },
    });

    // ACTUAL SENDING happens via SendGrid/Resend/etc.
    // For now, simulate success
    await prisma.emailLog.update({
      where: { id: emailLog.id },
      data: { status: 'sent', sentAt: new Date() },
    });

    // In production: await sendgrid.send({ to, subject, html: bodyHtml });
  }

  return { sent: true, subject: parsed?.subject, costINR: result.costINR };
}

async function sendCustomEmail(payload: { to: string; subject: string; body: string; template?: string }) {
  await prisma.emailLog.create({
    data: {
      toEmail: payload.to,
      subject: payload.subject,
      body: payload.body,
      template: payload.template || 'custom',
      status: 'sent',
      sentAt: new Date(),
    },
  });
  return { sent: true, costINR: 0 };
}
