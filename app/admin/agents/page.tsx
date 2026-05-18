import Link from 'next/link';
import { prisma } from '@/lib/db';
import { AGENTS } from '@/lib/agents/registry';
import { Activity, AlertCircle, Pause, Play, Zap, Clock, AlertTriangle } from 'lucide-react';
import AgentToggle from '@/components/admin/AgentToggle';

export default async function AdminAgentsPage() {
  // Sync registry with DB - create missing agents
  for (const def of AGENTS) {
    await prisma.agent.upsert({
      where: { type: def.type as any },
      create: {
        type: def.type as any,
        name: `${def.emoji} ${def.name}`,
        description: def.description,
        config: JSON.stringify({ schedule: def.schedule, needsApproval: def.needsApproval || false }),
      },
      update: {
        name: `${def.emoji} ${def.name}`,
        description: def.description,
      },
    });
  }

  const agents = await prisma.agent.findMany({
    orderBy: { type: 'asc' },
  });

  // Get queue stats
  const [queued, running, awaiting, failed, recentLogs] = await Promise.all([
    prisma.job.count({ where: { status: 'QUEUED' } }),
    prisma.job.count({ where: { status: 'RUNNING' } }),
    prisma.job.count({ where: { status: 'AWAITING_APPROVAL' } }),
    prisma.job.count({ where: { status: 'FAILED' } }),
    prisma.agentLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: { agent: true },
    }),
  ]);

  const pendingApprovals = await prisma.approval.count({ where: { status: 'PENDING' } });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-gold-400 font-bold">Autonomous Operations</p>
          <h2 className="font-display text-4xl text-cream-50 italic">Agent Control Room</h2>
          <p className="text-cream-100/50 mt-2 text-sm">Manage all autonomous bots. Pause, monitor, and review their work.</p>
        </div>
        {pendingApprovals > 0 && (
          <Link href="/admin/approvals" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-burgundy-500/20 border border-burgundy-400 text-burgundy-200 hover:bg-burgundy-500/30 text-sm font-semibold">
            <AlertCircle size={14} className="animate-pulse" />
            {pendingApprovals} pending approval{pendingApprovals > 1 ? 's' : ''}
          </Link>
        )}
      </div>

      {/* Queue stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {[
          { label: 'Queued', value: queued, icon: Clock, color: 'text-cream-100/70' },
          { label: 'Running', value: running, icon: Zap, color: 'text-green-300' },
          { label: 'Awaiting You', value: awaiting, icon: AlertCircle, color: 'text-gold-300' },
          { label: 'Failed', value: failed, icon: AlertTriangle, color: 'text-burgundy-300' },
          { label: 'Pending Approvals', value: pendingApprovals, icon: AlertCircle, color: 'text-gold-300' },
        ].map((s, i) => (
          <div key={i} className="bg-ink-900/60 border border-cream-100/10 rounded-2xl p-5">
            <s.icon className={`w-5 h-5 ${s.color} mb-3`} />
            <p className="font-display text-3xl text-cream-50">{s.value}</p>
            <p className="text-xs tracking-widest uppercase text-cream-100/50 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Agents grid */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {agents.map((agent) => {
          const def = AGENTS.find(a => a.type === agent.type);
          return (
            <div key={agent.id} className={`bg-ink-900/60 border rounded-2xl p-6 ${
              agent.status === 'ACTIVE' ? 'border-cream-100/10' :
              agent.status === 'PAUSED' ? 'border-gold-500/40 bg-gold-500/5' :
              'border-burgundy-500/40 bg-burgundy-500/5'
            }`}>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="text-3xl flex-shrink-0">{def?.emoji}</div>
                  <div className="min-w-0">
                    <h3 className="font-display text-xl text-cream-50">{def?.name}</h3>
                    <p className="text-xs text-cream-100/50 mt-1">{def?.description}</p>
                  </div>
                </div>
                <AgentToggle agentId={agent.id} currentStatus={agent.status} />
              </div>

              <div className="grid grid-cols-3 gap-2 text-center pt-4 border-t border-cream-100/5">
                <div>
                  <p className="font-display text-xl text-cream-50">{agent.totalRuns}</p>
                  <p className="text-[10px] tracking-widest uppercase text-cream-100/50">Runs</p>
                </div>
                <div>
                  <p className="font-display text-xl text-cream-50">{agent.totalErrors}</p>
                  <p className="text-[10px] tracking-widest uppercase text-cream-100/50">Errors</p>
                </div>
                <div>
                  <p className="font-display text-xl text-gold-300">₹{agent.totalCostINR.toFixed(0)}</p>
                  <p className="text-[10px] tracking-widest uppercase text-cream-100/50">AI Cost</p>
                </div>
              </div>

              {agent.lastRunAt && (
                <p className="text-[10px] text-cream-100/40 mt-3 text-center">
                  Last run: {new Date(agent.lastRunAt).toLocaleString('en-IN')}
                </p>
              )}

              {def?.needsApproval && (
                <div className="mt-3 p-2 bg-gold-500/10 border border-gold-500/30 rounded-lg text-[10px] text-gold-300 text-center">
                  👑 All actions require admin approval
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Recent activity log */}
      <div className="bg-ink-900/60 border border-cream-100/10 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-cream-100/10 flex items-center gap-2">
          <Activity className="w-4 h-4 text-gold-400" />
          <h3 className="font-display text-xl text-cream-50">Live Activity Feed</h3>
        </div>
        <div className="divide-y divide-cream-100/5 max-h-96 overflow-y-auto">
          {recentLogs.length === 0 ? (
            <p className="p-8 text-center text-cream-100/40 text-sm">No activity yet. Agents will start working once you have books in the system.</p>
          ) : recentLogs.map((log) => {
            const def = AGENTS.find(a => a.type === log.agent.type);
            return (
              <div key={log.id} className="flex items-start gap-3 p-4 hover:bg-cream-100/5">
                <div className="text-lg">{def?.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-cream-50 text-sm font-medium">{def?.name}</span>
                    <span className={`text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full ${
                      log.level === 'error' ? 'bg-burgundy-500/20 text-burgundy-300' :
                      log.level === 'warn' ? 'bg-gold-500/20 text-gold-300' :
                      'bg-cream-100/10 text-cream-100/60'
                    }`}>{log.level.toUpperCase()}</span>
                  </div>
                  <p className="text-xs text-cream-100/60 mt-1">{log.message}</p>
                </div>
                <p className="text-[10px] text-cream-100/40 whitespace-nowrap">
                  {new Date(log.createdAt).toLocaleTimeString('en-IN')}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
