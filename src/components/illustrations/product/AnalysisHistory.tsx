export function AnalysisHistory({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      {/* Floor */}
      <ellipse cx="200" cy="272" rx="160" ry="14" fill="#e2e8f0" />

      {/* Timeline line */}
      <line x1="120" y1="80" x2="120" y2="240" stroke="#e2e8f0" strokeWidth="3" />

      {/* Timeline items */}
      {/* Item 1 - recent */}
      <circle cx="120" cy="100" r="8" fill="#7c3aed" />
      <rect x="140" y="88" width="180" height="28" rx="6" fill="#ede9fe" stroke="#ddd6fe" strokeWidth="1" />
      <rect x="152" y="96" width="80" height="6" rx="3" fill="#7c3aed" opacity="0.5" />
      <rect x="240" y="96" width="60" height="6" rx="3" fill="#ddd6fe" />

      {/* Item 2 */}
      <circle cx="120" cy="152" r="8" fill="#6d28d9" />
      <rect x="140" y="140" width="180" height="28" rx="6" fill="#ede9fe" stroke="#ddd6fe" strokeWidth="1" />
      <rect x="152" y="148" width="100" height="6" rx="3" fill="#7c3aed" opacity="0.4" />
      <rect x="260" y="148" width="40" height="6" rx="3" fill="#ddd6fe" />

      {/* Item 3 - older */}
      <circle cx="120" cy="204" r="8" fill="#c4b5fd" />
      <rect x="140" y="192" width="180" height="28" rx="6" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
      <rect x="152" y="200" width="60" height="6" rx="3" fill="#ddd6fe" />
      <rect x="220" y="200" width="80" height="6" rx="3" fill="#f1f5f9" />

      {/* Clock icon */}
      <circle cx="350" cy="100" r="24" fill="#ede9fe" stroke="#ddd6fe" strokeWidth="2" />
      <line x1="350" y1="88" x2="350" y2="100" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="350" y1="100" x2="360" y2="106" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="350" cy="100" r="3" fill="#7c3aed" />

      {/* Small figure */}
      <circle cx="64" cy="172" r="16" fill="#fed7aa" />
      <ellipse cx="64" cy="160" rx="16" ry="8" fill="#1e293b" />
      <rect x="48" y="160" width="32" height="10" fill="#1e293b" />
      <circle cx="58" cy="172" r="2" fill="#1e293b" />
      <circle cx="70" cy="172" r="2" fill="#1e293b" />
      <path d="M58 179 Q64 183 70 179" stroke="#1e293b" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <rect x="48" y="186" width="32" height="40" rx="10" fill="#334155" />
      <path d="M48 198 Q38 206 36 214" stroke="#fed7aa" strokeWidth="7" strokeLinecap="round" fill="none" />
      <path d="M80 198 Q88 208 86 216" stroke="#fed7aa" strokeWidth="7" strokeLinecap="round" fill="none" />
    </svg>
  )
}
