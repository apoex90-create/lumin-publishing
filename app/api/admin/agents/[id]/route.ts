import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { z } from 'zod';

const updateAgentSchema = z.object({
  status: z.enum(['ACTIVE', 'PAUSED', 'ERROR', 'DISABLED']),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const me = await getCurrentUser();
  if (!me || me.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 });
  }

  const { id } = await params;

  try {
    const body = await req.json();
    const { status } = updateAgentSchema.parse(body);

    const updated = await prisma.agent.update({ where: { id }, data: { status } });
    return NextResponse.json({ agent: updated });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 });
    }
    console.error('Admin update agent error:', err);
    return NextResponse.json({ error: 'Failed to update agent' }, { status: 500 });
  }
}
