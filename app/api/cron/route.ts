import { NextRequest, NextResponse } from 'next/server';
import { processNextJob, enqueueJob } from '@/lib/agents/queue';
import { prisma } from '@/lib/db';

// Triggered by Vercel cron or external cron service every minute
// Processes up to 5 jobs per invocation to stay within Vercel's 10-second limit
export async function GET(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    console.error('[cron] CRON_SECRET is not set — refusing to run. Set CRON_SECRET to enable the agent cron job.');
    return NextResponse.json({ error: 'Cron is not configured' }, { status: 503 });
  }

  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const processed = [];
  const startTime = Date.now();

  // Process up to 5 jobs per invocation
  for (let i = 0; i < 5; i++) {
    if (Date.now() - startTime > 8000) break; // leave 2s buffer

    const result = await processNextJob();
    if (!result) break;
    processed.push({ jobId: result.job.id, agent: result.job.agent.type, type: result.job.type });
  }

  // Trigger daily orchestration if it's been > 23 hours
  const lastOrchestration = await prisma.job.findFirst({
    where: { type: 'orchestrate_daily' },
    orderBy: { createdAt: 'desc' },
  });

  const shouldRunDaily = !lastOrchestration || (Date.now() - lastOrchestration.createdAt.getTime() > 23 * 60 * 60 * 1000);

  if (shouldRunDaily) {
    await enqueueJob({
      agentType: 'ORCHESTRATOR',
      jobType: 'orchestrate_daily',
      payload: {},
    });
  }

  return NextResponse.json({
    processed: processed.length,
    jobs: processed,
    dailyTriggered: shouldRunDaily,
    durationMs: Date.now() - startTime,
  });
}
