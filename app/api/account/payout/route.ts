import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { encryptPII } from '@/lib/crypto';
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

    const encrypt = (value: string | null | undefined) => (value ? encryptPII(value) : null);

    await prisma.user.update({
      where: { id: me.id },
      data: {
        payoutMethod: data.payoutMethod,
        payoutUpi: data.payoutMethod === 'UPI' ? encrypt(data.payoutUpi) : null,
        payoutBankName: data.payoutMethod === 'BANK' ? encrypt(data.payoutBankName) : null,
        payoutBankAccount: data.payoutMethod === 'BANK' ? encrypt(data.payoutBankAccount) : null,
        payoutBankIfsc: data.payoutMethod === 'BANK' ? encrypt(data.payoutBankIfsc) : null,
        payoutPanNumber: encrypt(data.payoutPanNumber),
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
