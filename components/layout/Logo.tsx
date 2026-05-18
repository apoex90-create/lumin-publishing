import Link from 'next/link';

export default function Logo({ size = 'md', variant = 'dark' }: { size?: 'sm' | 'md' | 'lg'; variant?: 'dark' | 'light' }) {
  const sizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-4xl',
  };
  const color = variant === 'light' ? 'text-cream-50' : 'text-royal-900';

  return (
    <Link href="/" className="flex items-center gap-2 group">
      <div className="relative">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="transition-transform group-hover:rotate-12 duration-500">
          <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="1.5" className={color} opacity="0.3" />
          <path
            d="M10 8 L10 22 L22 22 M14 14 L18 14 M14 18 L20 18"
            stroke="url(#goldGrad)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="22" cy="10" r="2" fill="url(#goldGrad)" />
          <defs>
            <linearGradient id="goldGrad" x1="0" y1="0" x2="32" y2="32">
              <stop offset="0%" stopColor="#d4a017" />
              <stop offset="50%" stopColor="#eec85e" />
              <stop offset="100%" stopColor="#d4a017" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <span className={`font-display ${sizes[size]} font-medium tracking-[0.3em] ${color}`}>
        LUMIN
      </span>
    </Link>
  );
}
