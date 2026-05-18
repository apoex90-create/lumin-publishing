import Link from 'next/link';
import { Plus, Search, Mail, MoreVertical, Eye, Ban, TrendingUp } from 'lucide-react';
import { prisma } from '@/lib/db';

export default async function AdminAuthorsPage() {
  const authors = await prisma.user.findMany({
    where: { role: 'AUTHOR' },
    include: {
      books: { include: { sales: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-gold-400 font-bold">Author Management</p>
          <h2 className="font-display text-4xl text-cream-50 italic">All Authors</h2>
          <p className="text-cream-100/50 mt-2 text-sm">{authors.length} total authors • Manage profiles, books, and earnings.</p>
        </div>
        <Link href="/admin/authors/new" className="btn-gold">
          <Plus className="w-4 h-4 mr-2" /> Add Author Manually
        </Link>
      </div>

      <div className="bg-ink-900/60 border border-cream-100/10 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-cream-100/10 flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cream-100/30" />
            <input
              type="text"
              placeholder="Search by name, email, or country..."
              className="w-full pl-12 pr-4 py-2.5 rounded-full bg-cream-100/5 border border-cream-100/10 text-cream-50 placeholder:text-cream-100/30 focus:border-gold-500 outline-none text-sm"
            />
          </div>
          <select className="px-4 py-2.5 rounded-full bg-cream-100/5 border border-cream-100/10 text-cream-50 text-sm outline-none focus:border-gold-500">
            <option>All countries</option>
            <option>India</option>
            <option>USA</option>
            <option>UK</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-cream-100/5">
              <tr>
                <th className="text-left px-6 py-4 text-[10px] tracking-[0.2em] uppercase text-cream-100/50 font-bold">Author</th>
                <th className="text-left px-6 py-4 text-[10px] tracking-[0.2em] uppercase text-cream-100/50 font-bold">Country</th>
                <th className="text-center px-6 py-4 text-[10px] tracking-[0.2em] uppercase text-cream-100/50 font-bold">Books</th>
                <th className="text-center px-6 py-4 text-[10px] tracking-[0.2em] uppercase text-cream-100/50 font-bold">Sales</th>
                <th className="text-right px-6 py-4 text-[10px] tracking-[0.2em] uppercase text-cream-100/50 font-bold">Revenue</th>
                <th className="text-left px-6 py-4 text-[10px] tracking-[0.2em] uppercase text-cream-100/50 font-bold">Joined</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {authors.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-16 text-cream-100/40">No authors yet. Use "Add Author Manually" to create one.</td></tr>
              ) : authors.map((author) => {
                const initials = author.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
                const sales = author.books.reduce((sum, b) => sum + b.sales.length, 0);
                const revenue = author.books.reduce((sum, b) => sum + b.sales.reduce((s, sale) => s + sale.amount, 0), 0);
                return (
                  <tr key={author.id} className="border-t border-cream-100/5 hover:bg-cream-100/5 transition-colors">
                    <td className="px-6 py-4">
                      <Link href={`/admin/authors/${author.id}`} className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-500 to-burgundy-500 flex items-center justify-center text-cream-50 font-bold text-xs flex-shrink-0">
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <p className="text-cream-50 font-medium group-hover:text-gold-300 transition-colors">{author.fullName}</p>
                          <p className="text-xs text-cream-100/50 truncate">{author.email}</p>
                        </div>
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-cream-100/70">{author.country || '—'}</td>
                    <td className="px-6 py-4 text-center text-cream-50 font-medium">{author.books.length}</td>
                    <td className="px-6 py-4 text-center text-cream-50 font-medium">{sales}</td>
                    <td className="px-6 py-4 text-right text-gold-300 font-mono font-semibold">₹{revenue.toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4 text-xs text-cream-100/50">{new Date(author.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/admin/authors/${author.id}`} className="p-2 rounded-lg hover:bg-gold-500/10 text-cream-100/60 hover:text-gold-400 transition-colors" title="View profile">
                          <Eye size={14} />
                        </Link>
                        <a href={`mailto:${author.email}`} className="p-2 rounded-lg hover:bg-royal-500/10 text-cream-100/60 hover:text-royal-300 transition-colors" title="Email author">
                          <Mail size={14} />
                        </a>
                        <button className="p-2 rounded-lg hover:bg-cream-100/10 text-cream-100/60" title="More">
                          <MoreVertical size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 text-xs text-cream-100/40 text-center">
        Tip: Click any author row to view their full profile, all their books, and edit their account.
      </div>
    </div>
  );
}
