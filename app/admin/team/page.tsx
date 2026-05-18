import Link from 'next/link';
import { Plus, Shield, Mail, Crown, Trash2, Edit } from 'lucide-react';
import { prisma } from '@/lib/db';

export default async function AdminTeamPage() {
  const team = await prisma.user.findMany({
    where: { role: { in: ['ADMIN'] } },
    orderBy: { createdAt: 'asc' },
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-gold-400 font-bold">Internal Team</p>
          <h2 className="font-display text-4xl text-cream-50 italic">Team & Roles</h2>
          <p className="text-cream-100/50 mt-2 text-sm">Add team members and assign roles. Admins have full platform control.</p>
        </div>
        <Link href="/admin/team/new" className="btn-gold">
          <Plus className="w-4 h-4 mr-2" /> Add Team Member
        </Link>
      </div>

      {/* Role definitions */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-gold-500/10 to-gold-700/5 border border-gold-500/30 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Crown className="w-5 h-5 text-gold-400" />
            <h4 className="font-display text-lg text-cream-50">Super Admin</h4>
          </div>
          <p className="text-xs text-cream-100/60">Complete control. Can manage all authors, books, money, team, and settings.</p>
        </div>
        <div className="bg-cream-100/5 border border-cream-100/10 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-royal-400" />
            <h4 className="font-display text-lg text-cream-50">Editor</h4>
          </div>
          <p className="text-xs text-cream-100/60">Reviews manuscripts, approves books, manages publishing pipeline.</p>
        </div>
        <div className="bg-cream-100/5 border border-cream-100/10 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-burgundy-400" />
            <h4 className="font-display text-lg text-cream-50">Support</h4>
          </div>
          <p className="text-xs text-cream-100/60">Responds to author inquiries, helps with account issues. Read-only access.</p>
        </div>
      </div>

      {/* Team list */}
      <div className="bg-ink-900/60 border border-cream-100/10 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-cream-100/10">
          <h3 className="font-display text-xl text-cream-50">Current Team ({team.length})</h3>
        </div>

        {team.length === 0 ? (
          <div className="p-12 text-center">
            <Shield className="w-16 h-16 text-cream-100/20 mx-auto mb-4" />
            <p className="text-cream-100/60 mb-4">No team members yet. You're alone at the top!</p>
            <Link href="/admin/team/new" className="btn-gold inline-flex">
              <Plus className="w-4 h-4 mr-2" /> Add Your First Team Member
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-cream-100/5">
            {team.map((member) => {
              const initials = member.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
              return (
                <div key={member.id} className="flex items-center gap-4 p-5 hover:bg-cream-100/5">
                  <div className="w-12 h-12 rounded-full bg-gold-shimmer flex items-center justify-center text-royal-900 font-bold">
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-cream-50 font-medium">{member.fullName}</p>
                      <span className="inline-flex items-center gap-1 bg-gold-shimmer text-royal-900 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider">
                        <Crown size={10} /> {member.role}
                      </span>
                    </div>
                    <p className="text-xs text-cream-100/50 mt-1">{member.email}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <a href={`mailto:${member.email}`} className="p-2 rounded-lg hover:bg-cream-100/10 text-cream-100/60 hover:text-gold-400 transition-colors">
                      <Mail size={14} />
                    </a>
                    <Link href={`/admin/team/${member.id}/edit`} className="p-2 rounded-lg hover:bg-cream-100/10 text-cream-100/60 hover:text-gold-400 transition-colors">
                      <Edit size={14} />
                    </Link>
                    <button className="p-2 rounded-lg hover:bg-burgundy-500/10 text-cream-100/60 hover:text-burgundy-300 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <p className="text-xs text-cream-100/40 text-center mt-6">
        Tip: New team members receive an email with login instructions. They can change their password on first login.
      </p>
    </div>
  );
}
