import { DollarSign, TrendingUp, Crown, Download } from 'lucide-react';
import { prisma } from '@/lib/db';

export default async function AdminEarningsPage() {
  const sales = await prisma.sale.findMany({
    include: { book: { include: { author: true } } },
    orderBy: { createdAt: 'desc' },
  });

  const transactions = await prisma.transaction.findMany({
    include: { user: true },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  const totalRevenue = sales.reduce((s, sale) => s + sale.amount, 0);
  const platformCut = totalRevenue * 0.25;
  const authorPayout = totalRevenue * 0.75;
  const pendingPayouts = transactions.filter(t => t.type === 'royalty_payout' && t.status === 'pending').reduce((s, t) => s + Math.abs(t.amount), 0);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-gold-400 font-bold">Money Control</p>
          <h2 className="font-display text-4xl text-cream-50 italic">Revenue & Payouts</h2>
          <p className="text-cream-100/50 mt-2 text-sm">Complete financial overview of the platform.</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-cream-100/5 border border-cream-100/20 text-cream-50 hover:bg-cream-100/10 text-sm font-medium">
          <Download size={14} /> Export Financial Report
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-gold-500/20 to-gold-700/10 border border-gold-500/30 rounded-2xl p-6">
          <Crown className="w-5 h-5 text-gold-400 mb-3" />
          <p className="font-display text-3xl text-gold-gradient">₹{platformCut.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
          <p className="text-xs tracking-widest uppercase text-gold-300 mt-2">Platform Earnings (25%)</p>
        </div>
        <div className="bg-ink-900/60 border border-cream-100/10 rounded-2xl p-6">
          <DollarSign className="w-5 h-5 text-cream-100/40 mb-3" />
          <p className="font-display text-3xl text-cream-50">₹{totalRevenue.toLocaleString('en-IN')}</p>
          <p className="text-xs tracking-widest uppercase text-cream-100/50 mt-2">Total Revenue</p>
        </div>
        <div className="bg-ink-900/60 border border-cream-100/10 rounded-2xl p-6">
          <TrendingUp className="w-5 h-5 text-cream-100/40 mb-3" />
          <p className="font-display text-3xl text-cream-50">₹{authorPayout.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
          <p className="text-xs tracking-widest uppercase text-cream-100/50 mt-2">Authors Earned (75%)</p>
        </div>
        <div className="bg-ink-900/60 border border-cream-100/10 rounded-2xl p-6">
          <DollarSign className="w-5 h-5 text-burgundy-400 mb-3" />
          <p className="font-display text-3xl text-burgundy-300">₹{pendingPayouts.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
          <p className="text-xs tracking-widest uppercase text-cream-100/50 mt-2">Pending Payouts</p>
        </div>
      </div>

      {/* Sales table */}
      <div className="bg-ink-900/60 border border-cream-100/10 rounded-2xl overflow-hidden mb-6">
        <div className="p-5 border-b border-cream-100/10">
          <h3 className="font-display text-xl text-cream-50">All Sales ({sales.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-cream-100/5">
              <tr>
                <th className="text-left px-6 py-3 text-[10px] tracking-[0.2em] uppercase text-cream-100/50 font-bold">Date</th>
                <th className="text-left px-6 py-3 text-[10px] tracking-[0.2em] uppercase text-cream-100/50 font-bold">Book</th>
                <th className="text-left px-6 py-3 text-[10px] tracking-[0.2em] uppercase text-cream-100/50 font-bold">Author</th>
                <th className="text-left px-6 py-3 text-[10px] tracking-[0.2em] uppercase text-cream-100/50 font-bold">Channel</th>
                <th className="text-right px-6 py-3 text-[10px] tracking-[0.2em] uppercase text-cream-100/50 font-bold">Amount</th>
                <th className="text-right px-6 py-3 text-[10px] tracking-[0.2em] uppercase text-cream-100/50 font-bold">Platform</th>
                <th className="text-right px-6 py-3 text-[10px] tracking-[0.2em] uppercase text-cream-100/50 font-bold">Author</th>
              </tr>
            </thead>
            <tbody>
              {sales.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-cream-100/40">No sales yet. Once books are published and sell, transactions appear here.</td></tr>
              ) : sales.slice(0, 30).map((sale) => (
                <tr key={sale.id} className="border-t border-cream-100/5">
                  <td className="px-6 py-3 text-xs text-cream-100/50">{new Date(sale.createdAt).toLocaleDateString('en-IN')}</td>
                  <td className="px-6 py-3 text-sm text-cream-50">{sale.book.title}</td>
                  <td className="px-6 py-3 text-sm text-cream-100/70">{sale.book.author.fullName}</td>
                  <td className="px-6 py-3 text-xs text-royal-300 capitalize">{sale.channel}</td>
                  <td className="px-6 py-3 text-right font-mono text-cream-50">{sale.currency === 'INR' ? '₹' : '$'}{sale.amount.toFixed(2)}</td>
                  <td className="px-6 py-3 text-right font-mono text-gold-300">{sale.currency === 'INR' ? '₹' : '$'}{(sale.amount * 0.25).toFixed(2)}</td>
                  <td className="px-6 py-3 text-right font-mono text-green-300">{sale.currency === 'INR' ? '₹' : '$'}{(sale.amount * 0.75).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pending payouts */}
      <div className="bg-ink-900/60 border border-cream-100/10 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-cream-100/10 flex items-center justify-between">
          <h3 className="font-display text-xl text-cream-50">Recent Transactions</h3>
          <button className="text-xs text-gold-400 hover:text-gold-300 font-semibold tracking-widest uppercase">Process Payouts →</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-cream-100/5">
              <tr>
                <th className="text-left px-6 py-3 text-[10px] tracking-[0.2em] uppercase text-cream-100/50 font-bold">Date</th>
                <th className="text-left px-6 py-3 text-[10px] tracking-[0.2em] uppercase text-cream-100/50 font-bold">User</th>
                <th className="text-left px-6 py-3 text-[10px] tracking-[0.2em] uppercase text-cream-100/50 font-bold">Type</th>
                <th className="text-left px-6 py-3 text-[10px] tracking-[0.2em] uppercase text-cream-100/50 font-bold">Status</th>
                <th className="text-right px-6 py-3 text-[10px] tracking-[0.2em] uppercase text-cream-100/50 font-bold">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-12 text-cream-100/40">No transactions yet.</td></tr>
              ) : transactions.map((tx) => (
                <tr key={tx.id} className="border-t border-cream-100/5">
                  <td className="px-6 py-3 text-xs text-cream-100/50">{new Date(tx.createdAt).toLocaleDateString('en-IN')}</td>
                  <td className="px-6 py-3 text-sm text-cream-50">{tx.user.fullName}</td>
                  <td className="px-6 py-3 text-sm text-cream-100/70 capitalize">{tx.type.replace('_', ' ')}</td>
                  <td className="px-6 py-3">
                    <span className={`text-[10px] font-bold tracking-wider px-2 py-1 rounded-full ${
                      tx.status === 'completed' ? 'bg-green-500/20 text-green-300' :
                      tx.status === 'pending' ? 'bg-gold-500/20 text-gold-300' :
                      'bg-burgundy-500/20 text-burgundy-300'
                    }`}>{tx.status}</span>
                  </td>
                  <td className="px-6 py-3 text-right font-mono text-cream-50">{tx.currency === 'INR' ? '₹' : '$'}{Math.abs(tx.amount).toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
