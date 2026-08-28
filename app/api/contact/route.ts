import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { rateLimit, getClientIp } from '@/lib/rate-limit';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(2),
  message: z.string().min(10),
});

export async function POST(req: NextRequest) {
  const ipLimit = rateLimit(`contact-ip:${getClientIp(req)}`, 5, 60 * 60 * 1000);
  if (!ipLimit.ok) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(ipLimit.retryAfterSeconds) } }
    );
  }

  try {
    const body = await req.json();
    const data = schema.parse(body);

    // Also rate-limit per email address to prevent per-account abuse on shared networks
    const emailLimit = rateLimit(`contact-email:${data.email.toLowerCase()}`, 10, 60 * 60 * 1000);
    if (!emailLimit.ok) {
      return NextResponse.json(
        { error: 'Too many requests from this address. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(emailLimit.retryAfterSeconds) } }
      );
    }

    const thread = await prisma.supportThread.create({
      data: {
        subject: data.subject,
        userEmail: data.email,
        status: 'open',
        messages: {
          create: {
            sender: 'user',
            body: `From: ${data.name}\n\n${data.message}`,
          },
        },
      },
    });

    return NextResponse.json({ success: true, threadId: thread.id });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 });
  }
}
