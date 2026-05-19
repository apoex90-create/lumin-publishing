import Link from 'next/link';
import { redirect } from 'next/navigation';
import { CheckCircle, ArrowRight, BookOpen, DollarSign, User, FileText } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import Ornament from '@/components/ui/Ornament';
import CompleteOnboardingButton from '@/components/dashboard/CompleteOnboardingButton';

export const dynamic = 'force-dynamic';

const steps = [
  {
    icon: User,
    title: 'Complete your profile',
    description: 'Add your bio, profile photo, and contact details so readers know who you are.',
    href: '/dashboard/settings',
    cta: 'Go to Profile',
  },
  {
    icon: FileText,
    title: 'Start your first book',
    description: 'Use the upload wizard to share your manuscript and choose a publishing plan.',
    href: '/dashboard/upload',
    cta: 'Start a Book',
  },
  {
    icon: BookOpen,
    title: 'Track your submissions',
    description: 'View all your books — drafts, in-review, and published — in one place.',
    href: '/dashboard/books',
    cta: 'View Books',
  },
  {
    icon: DollarSign,
    title: 'Add payout details',
    description: 'When your books start selling, we need to know where to send your earnings.',
    href: '/dashboard/settings',
    cta: 'Add Payout Info',
  },
];

export default async function WelcomePage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="text-center mb-12">
        <Ornament className="w-32 h-6 text-gold-500 mx-auto mb-4" />
        <p className="eyebrow">Welcome aboard</p>
        <h1 className="font-display text-5xl text-royal-900">
          Hello, <em className="italic text-gold-gradient">{user.fullName.split(' ')[0]}</em>!
        </h1>
        <p className="mt-6 text-lg text-ink-900/70 font-serif max-w-2xl mx-auto">
          You're all set up. Here's a quick tour of everything you can do here. Take your time — your dashboard is always available.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {steps.map((step, i) => (
          <div key={i} className="card-premium p-6 group">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-royal-700 to-royal-900 flex items-center justify-center flex-shrink-0">
                <step.icon className="w-5 h-5 text-gold-300" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold tracking-widest uppercase text-gold-700">Step {i + 1}</span>
                </div>
                <h3 className="font-display text-xl text-royal-900 mb-2">{step.title}</h3>
                <p className="text-sm text-ink-900/70 mb-4 leading-relaxed">{step.description}</p>
                <Link
                  href={step.href}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-royal-800 hover:text-gold-700 group-hover:gap-2 transition-all"
                >
                  {step.cta} <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card-premium p-8 text-center bg-gradient-to-br from-royal-900 to-ink-950 text-cream-50">
        <h2 className="font-display text-2xl mb-3">A few things to know</h2>
        <ul className="text-left max-w-xl mx-auto space-y-3 text-cream-100/80 text-sm">
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-gold-400 flex-shrink-0 mt-0.5" />
            <span>You retain <strong>100% rights</strong> to your work. We hold only a non-exclusive distribution license.</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-gold-400 flex-shrink-0 mt-0.5" />
            <span>You're only charged when your book is <strong>approved for publishing</strong>. Submissions are free.</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-gold-400 flex-shrink-0 mt-0.5" />
            <span>Our editorial team typically responds within <strong>3-5 business days</strong>.</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-gold-400 flex-shrink-0 mt-0.5" />
            <span>For ISBN applications, we'll submit on your behalf to <strong>RRRNA</strong> (the Indian ISBN agency).</span>
          </li>
        </ul>
      </div>

      <div className="text-center mt-10">
        <CompleteOnboardingButton />
      </div>
    </div>
  );
}
