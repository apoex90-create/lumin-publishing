import { prisma } from '@/lib/db';

export async function runMaintenance(jobType: string, payload: any, bookId: string | null) {
  if (jobType === 'health_check') return healthCheck();
  if (jobType === 'backup') return backup();
  throw new Error(`Unknown maintenance job: ${jobType}`);
}

async function healthCheck() {
  const issues: string[] = [];

  // Check DB connection
  try {
    await prisma.user.count();
  } catch (e) {
    issues.push('Database unreachable');
  }

  // Check for stuck jobs (running > 10 min)
  const stuckJobs = await prisma.job.count({
    where: {
      status: 'RUNNING',
      startedAt: { lt: new Date(Date.now() - 10 * 60 * 1000) },
    },
  });
  if (stuckJobs > 0) issues.push(`${stuckJobs} jobs stuck running > 10min`);

  // Check pending approvals piling up
  const pendingApprovals = await prisma.approval.count({ where: { status: 'PENDING' } });
  if (pendingApprovals > 20) issues.push(`${pendingApprovals} approvals waiting for admin`);

  return { health: issues.length === 0 ? 'ok' : 'warning', issues, costINR: 0 };
}

async function backup() {
  // In production: trigger pg_dump and upload to S3
  return { backupAt: new Date(), costINR: 0 };
}
