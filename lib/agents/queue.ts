// Job queue manager - the core dispatcher of the agent system
import { prisma } from '@/lib/db';
import { AGENTS } from './registry';

export interface EnqueueOptions {
  agentType: string;
  jobType: string;
  payload: any;
  bookId?: string;
  priority?: number;
  scheduledAt?: Date;
  requiresApproval?: boolean;
  approvalDetails?: {
    title: string;
    description: string;
    amount?: number;
    currency?: string;
  };
}

// Enqueue a job for an agent
export async function enqueueJob(opts: EnqueueOptions) {
  const agent = await prisma.agent.findUnique({ where: { type: opts.agentType as any } });
  if (!agent) throw new Error(`Agent not found: ${opts.agentType}`);
  if (agent.status !== 'ACTIVE') {
    await logAgent(agent.id, 'warn', `Job ${opts.jobType} blocked - agent is ${agent.status}`);
    throw new Error(`Agent ${opts.agentType} is not active (${agent.status})`);
  }

  let approvalId: string | undefined;
  if (opts.requiresApproval && opts.approvalDetails) {
    const approval = await prisma.approval.create({
      data: {
        type: opts.jobType,
        title: opts.approvalDetails.title,
        description: opts.approvalDetails.description,
        amount: opts.approvalDetails.amount,
        currency: opts.approvalDetails.currency,
        requesterAgent: opts.agentType,
        status: 'PENDING',
      },
    });
    approvalId = approval.id;
  }

  const job = await prisma.job.create({
    data: {
      agentId: agent.id,
      bookId: opts.bookId,
      type: opts.jobType,
      status: opts.requiresApproval ? 'AWAITING_APPROVAL' : 'QUEUED',
      priority: opts.priority || 5,
      payload: JSON.stringify(opts.payload),
      scheduledAt: opts.scheduledAt || new Date(),
      approvalId,
    },
  });

  await logAgent(agent.id, 'info', `Job enqueued: ${opts.jobType}`, { jobId: job.id });
  return job;
}

// Process the next job in the queue
export async function processNextJob() {
  // Find oldest queued job that's due to run
  const job = await prisma.job.findFirst({
    where: {
      status: 'QUEUED',
      scheduledAt: { lte: new Date() },
    },
    orderBy: [{ priority: 'asc' }, { scheduledAt: 'asc' }],
    include: { agent: true },
  });

  if (!job) return null;
  if (job.agent.status !== 'ACTIVE') return null;

  // Mark as running
  await prisma.job.update({
    where: { id: job.id },
    data: { status: 'RUNNING', startedAt: new Date(), attempts: { increment: 1 } },
  });

  try {
    const payload = JSON.parse(job.payload);
    const result = await executeJob(job.agent.type, job.type, payload, job.bookId);

    await prisma.job.update({
      where: { id: job.id },
      data: {
        status: 'COMPLETED',
        result: JSON.stringify(result),
        completedAt: new Date(),
      },
    });

    await prisma.agent.update({
      where: { id: job.agentId },
      data: {
        totalRuns: { increment: 1 },
        lastRunAt: new Date(),
        totalCostINR: { increment: result.costINR || 0 },
      },
    });

    await logAgent(job.agentId, 'info', `Job completed: ${job.type}`, { jobId: job.id });
    return { job, result };
  } catch (error: any) {
    await prisma.job.update({
      where: { id: job.id },
      data: {
        status: job.attempts >= 3 ? 'FAILED' : 'QUEUED', // retry up to 3 times
        errorMsg: error.message,
        scheduledAt: new Date(Date.now() + 60000), // retry in 1 min
      },
    });

    await prisma.agent.update({
      where: { id: job.agentId },
      data: { totalErrors: { increment: 1 } },
    });

    await logAgent(job.agentId, 'error', `Job failed: ${job.type} - ${error.message}`, { jobId: job.id });
    return { job, error: error.message };
  }
}

// Routes job to the right executor
async function executeJob(agentType: string, jobType: string, payload: any, bookId: string | null) {
  // Dynamic import to keep this file lean
  const { runEditor } = await import('./executors/editor');
  const { runDesigner } = await import('./executors/designer');
  const { runMarketing } = await import('./executors/marketing');
  const { runBlogger } = await import('./executors/blogger');
  const { runSupport } = await import('./executors/support');
  const { runMailer } = await import('./executors/mailer');
  const { runAccounts } = await import('./executors/accounts');
  const { runMaintenance } = await import('./executors/maintenance');
  const { runFormatter } = await import('./executors/formatter');
  const { runOrchestrator } = await import('./executors/orchestrator');

  const executors: Record<string, any> = {
    EDITOR: runEditor,
    DESIGNER: runDesigner,
    MARKETING: runMarketing,
    BLOGGER: runBlogger,
    SUPPORT: runSupport,
    MAILER: runMailer,
    ACCOUNTS: runAccounts,
    MAINTENANCE: runMaintenance,
    FORMATTER: runFormatter,
    ORCHESTRATOR: runOrchestrator,
  };

  const fn = executors[agentType];
  if (!fn) throw new Error(`No executor for agent type: ${agentType}`);

  return await fn(jobType, payload, bookId);
}

// Approve a pending approval and unblock its job
export async function approveJob(approvalId: string, adminUserId: string) {
  const approval = await prisma.approval.update({
    where: { id: approvalId },
    data: {
      status: 'APPROVED',
      approvedById: adminUserId,
      approvedAt: new Date(),
    },
  });

  // Find and resume the job
  const job = await prisma.job.findUnique({ where: { approvalId } });
  if (job && job.status === 'AWAITING_APPROVAL') {
    await prisma.job.update({
      where: { id: job.id },
      data: { status: 'QUEUED', scheduledAt: new Date() },
    });
  }

  return approval;
}

export async function rejectApproval(approvalId: string, adminUserId: string, reason: string) {
  await prisma.approval.update({
    where: { id: approvalId },
    data: {
      status: 'REJECTED',
      approvedById: adminUserId,
      approvedAt: new Date(),
      rejectedReason: reason,
    },
  });

  const job = await prisma.job.findUnique({ where: { approvalId } });
  if (job) {
    await prisma.job.update({
      where: { id: job.id },
      data: { status: 'CANCELLED' },
    });
  }
}

// Helper: log agent activity
export async function logAgent(agentId: string, level: string, message: string, metadata?: any) {
  await prisma.agentLog.create({
    data: {
      agentId,
      level,
      message,
      metadata: metadata ? JSON.stringify(metadata) : null,
    },
  });
}
