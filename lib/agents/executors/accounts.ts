import { prisma } from '@/lib/db';
import { enqueueJob } from '../queue';

// CRITICAL: All money actions go through an approval first
export async function runAccounts(jobType: string, payload: any, bookId: string | null) {
  if (jobType === 'propose_payout') return proposePayout(payload);
  if (jobType === 'process_purchase') return processPurchase(payload);
  if (jobType === 'flag_refund') return flagRefund(payload);
  if (jobType === 'monthly_report') return monthlyReport();
  if (jobType === 'execute_approved_payout') return executePayout(payload);
  throw new Error(`Unknown accounts job: ${jobType}`);
}

// Calculate weekly payouts and create approval requests
async function proposePayout(payload: any) {
  const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const sales = await prisma.sale.findMany({
    where: { createdAt: { gte: cutoff } },
    include: { book: { include: { author: true } } },
  });

  // Group by author
  const byAuthor = new Map<string, { user: any; total: number; sales: any[] }>();
  for (const sale of sales) {
    const author = sale.book.author;
    if (!byAuthor.has(author.id)) {
      byAuthor.set(author.id, { user: author, total: 0, sales: [] });
    }
    const entry = byAuthor.get(author.id)!;
    entry.total += sale.amount * 0.75; // 75% royalty
    entry.sales.push(sale);
  }

  const proposals: any[] = [];

  for (const [authorId, entry] of byAuthor) {
    if (entry.total < 1000) continue; // Skip tiny payouts (< ₹1,000)

    // Create approval request
    const approval = await prisma.approval.create({
      data: {
        type: 'payout',
        title: `Weekly Royalty Payout: ${entry.user.fullName}`,
        description: `${entry.sales.length} sales totaling ₹${entry.total.toFixed(2)} (75% royalty)`,
        amount: entry.total,
        currency: 'INR',
        requesterAgent: 'ACCOUNTS',
        status: 'PENDING',
        metadata: JSON.stringify({ authorId, salesCount: entry.sales.length }),
      },
    });

    proposals.push({ approvalId: approval.id, author: entry.user.fullName, amount: entry.total });
  }

  return { proposals, costINR: 0 };
}

// Execute payout after admin approves
async function executePayout(payload: { approvalId: string }) {
  const approval = await prisma.approval.findUnique({ where: { id: payload.approvalId } });
  if (!approval || approval.status !== 'APPROVED') {
    throw new Error('Approval not granted');
  }

  const metadata = JSON.parse(approval.metadata || '{}');

  // Create the transaction record
  await prisma.transaction.create({
    data: {
      userId: metadata.authorId,
      type: 'royalty_payout',
      amount: -(approval.amount || 0),
      currency: approval.currency || 'INR',
      status: 'completed',
      reference: `Approval ${approval.id}`,
      approvalId: approval.id,
    },
  });

  // In production: call Razorpay/Stripe payout API here
  // await razorpay.payouts.create({ ... });

  return { executed: true, costINR: 0 };
}

async function processPurchase(payload: { userId: string; amount: number; planTier: string; bookId?: string }) {
  // Plan purchases don't need approval (incoming money)
  await prisma.transaction.create({
    data: {
      userId: payload.userId,
      type: 'plan_purchase',
      amount: payload.amount,
      currency: 'INR',
      status: 'completed',
      reference: `Plan: ${payload.planTier}`,
    },
  });
  return { processed: true, costINR: 0 };
}

async function flagRefund(payload: { userId: string; amount: number; reason: string }) {
  const approval = await prisma.approval.create({
    data: {
      type: 'refund',
      title: 'Refund Request',
      description: payload.reason,
      amount: payload.amount,
      currency: 'INR',
      requesterAgent: 'ACCOUNTS',
      status: 'PENDING',
      metadata: JSON.stringify({ userId: payload.userId }),
    },
  });

  return { approvalId: approval.id, costINR: 0 };
}

async function monthlyReport() {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [sales, expenses] = await Promise.all([
    prisma.sale.aggregate({ where: { createdAt: { gte: startOfMonth } }, _sum: { amount: true }, _count: true }),
    prisma.transaction.aggregate({
      where: { createdAt: { gte: startOfMonth }, type: { in: ['ai_cost', 'infrastructure_cost'] } },
      _sum: { amount: true },
    }),
  ]);

  const revenue = sales._sum.amount || 0;
  const cost = Math.abs(expenses._sum.amount || 0);
  const platformCut = revenue * 0.25;
  const profit = platformCut - cost;

  return {
    revenue, salesCount: sales._count, cost, platformCut, profit,
    costINR: 0,
  };
}
