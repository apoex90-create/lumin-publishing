import { prisma } from '@/lib/db';
import { Crown, AlertCircle, CheckCircle, XCircle, Clock } from 'lucide-react';
import ApprovalActions from '@/components/admin/ApprovalActions';

export default async function AdminApprovalsPage() {
  const [pending, recent] = await Promise.all([
    prisma.approval.findMany({
      where: { status: 'PENDING' },
      orderBy: { createdAt: 'asc' },
    }),
    prisma.approval.findMany({
      where: { status: { in: ['APPROVED', 'REJECTED'] } },
      orderBy: { approvedAt: 'desc' },
      take: 20,
      include: { approvedBy: { select: { fullName: true } } },
    }),
  ]);

  const totalPendingINR = pending
    .filter(a => a.currency === 'INR')
    .reduce((sum, a) => sum + (a.amount || 0), 0);

  return (
    <div>
      <div className="mb-8">
        <p className="text-[10px] tracking-[0.3em] uppercase text-gold-400 font-bold">King's Throne Room</p>
        <h2 className="font-display text-4xl text-cream-50 italic">Approvals</h2>
        <p className="text-cream-100/50 mt-2 text-sm">Every transaction requires your blessing. Approve or reject below.</p>
      </div>

      {/* Summary */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gold-500/10 border border-gold-500/40 rounded-2xl p-6">
          <Crown className="w-5 h-5 text-gold-400 mb-3" />
          <p className="font-display text-4xl text-gold-gradient">{pending.length}</p>
          <p className="text-xs tracking-widest uppercase text-gold-200 mt-2">Awaiting Your Decision</p>
        </div>
        <div className="bg-ink-900/60 border border-cream-100/10 rounded-2xl p-6">
          <Clock className="w-5 h-5 text-cream-100/40 mb-3" />
          <p className="font-display text-4xl text-cream-50">₹{totalPendingINR.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
          <p className="text-xs tracking-widest uppercase text-cream-100/50 mt-2">Pending Money Total</p>
        </div>
        <div className="bg-ink-900/60 border border-cream-100/10 rounded-2xl p-6">
          <CheckCircle className="w-5 h-5 text-green-300 mb-3" />
          <p className="font-display text-4xl text-cream-50">{recent.filter(a => a.status === 'APPROVED').length}</p>
          <p className="text-xs tracking-widest uppercase text-cream-100/50 mt-2">Recently Approved</p>
        </div>
      </div>

      {/* Pending approvals */}
      <div className="bg-ink-900/60 border border-cream-100/10 rounded-2xl overflow-hidden mb-8">
        <div className="p-5 border-b border-cream-100/10 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-gold-400" />
          <h3 className="font-display text-xl text-cream-50">Pending — {pending.length}</h3>
        </div>

        {pending.length === 0 ? (
          <div className="p-12 text-center">
            <CheckCircle className="w-12 h-12 text-green-400/50 mx-auto mb-3" />
            <p className="text-cream-100/60">All clear, your majesty. Nothing waiting for your decision.</p>
          </div>
        ) : (
          <div className="divide-y divide-cream-100/5">
            {pending.map((approval) => (
              <div key={approval.id} className="p-6 hover:bg-cream-100/5">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-[10px] font-bold tracking-wider px-2 py-1 rounded-full ${
                        approval.type === 'payout' ? 'bg-green-500/20 text-green-300' :
                        approval.type === 'refund' ? 'bg-burgundy-500/20 text-burgundy-300' :
                        'bg-gold-500/20 text-gold-300'
                      }`}>{approval.type.toUpperCase()}</span>
                      <span className="text-[10px] text-cream-100/40 font-mono">{approval.requesterAgent}</span>
                      <span className="text-[10px] text-cream-100/40">
                        {new Date(approval.createdAt).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <h4 className="font-display text-2xl text-cream-50">{approval.title}</h4>
                    <p className="text-sm text-cream-100/70 mt-2">{approval.description}</p>
                    {approval.amount && (
                      <p className="font-display text-3xl text-gold-gradient mt-4">
                        {approval.currency === 'INR' ? '₹' : '$'}{approval.amount.toLocaleString('en-IN')}
                      </p>
                    )}
                  </div>
                  <ApprovalActions approvalId={approval.id} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent decisions */}
      <div className="bg-ink-900/60 border border-cream-100/10 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-cream-100/10">
          <h3 className="font-display text-xl text-cream-50">Recent Decisions</h3>
        </div>
        {recent.length === 0 ? (
          <p className="p-8 text-center text-cream-100/40 text-sm">No history yet.</p>
        ) : (
          <table className="w-full">
            <tbody className="divide-y divide-cream-100/5">
              {recent.map((approval) => (
                <tr key={approval.id} className="hover:bg-cream-100/5">
                  <td className="px-6 py-3 text-xs text-cream-100/40">{new Date(approval.approvedAt || approval.createdAt).toLocaleDateString('en-IN')}</td>
                  <td className="px-6 py-3 text-sm text-cream-100/70 capitalize">{approval.type}</td>
                  <td className="px-6 py-3 text-sm text-cream-50">{approval.title}</td>
                  <td className="px-6 py-3 text-right text-gold-300 font-mono">{approval.amount ? `${approval.currency === 'INR' ? '₹' : '$'}${approval.amount.toLocaleString('en-IN')}` : '—'}</td>
                  <td className="px-6 py-3">
                    {approval.status === 'APPROVED' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wider px-2 py-1 rounded-full bg-green-500/20 text-green-300">
                        <CheckCircle size={10} /> APPROVED
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wider px-2 py-1 rounded-full bg-burgundy-500/20 text-burgundy-300">
                        <XCircle size={10} /> REJECTED
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-3 text-xs text-cream-100/40">{approval.approvedBy?.fullName || ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
