import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { approveJob, rejectApproval, enqueueJob } from '@/lib/agents/queue';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const me = await getCurrentUser();
  if (!me || me.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 });
  }

  const { id } = await params;
  const { action, reason } = await req.json();

  const approval = await prisma.approval.findUnique({ where: { id } });
  if (!approval) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  if (action === 'approve') {
    await approveJob(id, me.id);

    // For payouts: enqueue the execution job
    if (approval.type === 'payout') {
      await enqueueJob({
        agentType: 'ACCOUNTS',
        jobType: 'execute_approved_payout',
        payload: { approvalId: id },
      });
    }
  } else if (action === 'reject') {
    await rejectApproval(id, me.id, reason || 'No reason provided');
  }

  return NextResponse.json({ success: true });
}
