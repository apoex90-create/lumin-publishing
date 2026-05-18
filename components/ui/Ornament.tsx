export default function Ornament({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 24" className={className} fill="none">
      <path
        d="M0 12 L40 12 M80 12 L120 12"
        stroke="currentColor"
        strokeWidth="0.5"
      />
      <circle cx="50" cy="12" r="1.5" fill="currentColor" />
      <path
        d="M60 4 L62 10 L68 12 L62 14 L60 20 L58 14 L52 12 L58 10 Z"
        fill="currentColor"
        opacity="0.9"
      />
      <circle cx="70" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}
