import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { z } from 'zod';

const schema = z.object({
  payoutMethod: z.enum(['UPI', 'BANK']),
  payoutUpi: z.string().optional().nullable(),
  payoutBankName: z.string().optional().nullable(),
  payoutBankAccount: z.string().optional().nullable(),
  payoutBankIfsc: z.string().optional().nullable(),
  payoutPanNumber: z.string().optional().nullable(),
});

export async function PATCH(req: NextRequest) {
  const me = await getCurrentUser();
  if (!me) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });

  try {
    const body = await req.json();
    const data = schema.parse(body);

    await prisma.user.update({
      where: { id: me.id },
      data: {
        payoutMethod: data.payoutMethod,
        payoutUpi: data.payoutMethod === 'UPI' ? (data.payoutUpi || null) : null,
        payoutBankName: data.payoutMethod === 'BANK' ? (data.payoutBankName || null) : null,
        payoutBankAccount: data.payoutMethod === 'BANK' ? (data.payoutBankAccount || null) : null,
        payoutBankIfsc: data.payoutMethod === 'BANK' ? (data.payoutBankIfsc || null) : null,
        payoutPanNumber: data.payoutPanNumber || null,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
