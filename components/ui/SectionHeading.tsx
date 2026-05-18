import { ReactNode } from 'react';

interface Props {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  centered?: boolean;
  light?: boolean;
}

export default function SectionHeading({ eyebrow, title, description, centered = true, light = false }: Props) {
  return (
    <div className={`${centered ? 'text-center mx-auto' : ''} max-w-3xl mb-16`}>
      {eyebrow && (
        <div className={`eyebrow ${light ? 'text-gold-300' : 'text-gold-600'}`}>
          <span className="inline-flex items-center gap-3">
            <span className="w-8 h-px bg-current" />
            {eyebrow}
            <span className="w-8 h-px bg-current" />
          </span>
        </div>
      )}
      <h2 className={`h-display ${light ? 'text-cream-50' : 'text-royal-900'}`}>{title}</h2>
      {description && (
        <p className={`mt-6 text-lg leading-relaxed ${light ? 'text-cream-100/70' : 'text-ink-900/70'}`}>
          {description}
        </p>
      )}
    </div>
  );
}
