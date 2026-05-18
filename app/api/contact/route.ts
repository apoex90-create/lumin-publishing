import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(2),
  message: z.string().min(10),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

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
