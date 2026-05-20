export function LoserOutcome({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      {/* Floor */}
      <ellipse cx="200" cy="272" rx="155" ry="14" fill="#e2e8f0" />

      {/* Downward chart */}
      <rect x="80" y="80" width="240" height="160" rx="10" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" />
      {/* Grid lines */}
      <line x1="96" y1="120" x2="304" y2="120" stroke="#f1f5f9" strokeWidth="1" />
      <line x1="96" y1="150" x2="304" y2="150" stroke="#f1f5f9" strokeWidth="1" />
      <line x1="96" y1="180" x2="304" y2="180" stroke="#f1f5f9" strokeWidth="1" />
      {/* Axes */}
      <line x1="96" y1="100" x2="96" y2="214" stroke="#e2e8f0" strokeWidth="2" />
      <line x1="96" y1="214" x2="304" y2="214" stroke="#e2e8f0" strokeWidth="2" />
      {/* Downward trending line */}
      <polyline points="104,110 144,118 184,132 224,158 264,188 296,212" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* Shaded area under */}
      <path d="M104 110 L144 118 L184 132 L224 158 L264 188 L296 212 L296 214 L104 214 Z" fill="#fef2f2" opacity="0.6" />
      {/* Arrow at end pointing down */}
      <path d="M296 212 L302 220 L290 220 Z" fill="#ef4444" />
      {/* Dotted horizontal line (goal) */}
      <line x1="104" y1="130" x2="296" y2="130" stroke="#ddd6fe" strokeWidth="1.5" strokeDasharray="5 3" />

      {/* "Learning" lightbulb */}
      <circle cx="340" cy="110" r="22" fill="#ede9fe" />
      <path d="M340 96 Q340 88 340 88" stroke="#7c3aed" strokeWidth="2" />
      <path d="M328 100 L322 94" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" />
      <path d="M352 100 L358 94" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" />
      {/* Bulb shape */}
      <path d="M332 108 Q328 116 332 122 L348 122 Q352 116 348 108 Q344 100 340 100 Q336 100 332 108 Z" fill="#7c3aed" opacity="0.3" stroke="#7c3aed" strokeWidth="1.5" />
      <rect x="333" y="122" width="14" height="5" rx="2" fill="#7c3aed" opacity="0.4" />
      <rect x="335" y="128" width="10" height="4" rx="2" fill="#7c3aed" opacity="0.3" />

      {/* Small figure shrugging */}
      <circle cx="56" cy="170" r="16" fill="#fed7aa" />
      <ellipse cx="56" cy="157" rx="16" ry="8" fill="#1e293b" />
      <rect x="40" y="157" width="32" height="10" fill="#1e293b" />
      <circle cx="50" cy="170" r="2" fill="#1e293b" />
      <circle cx="62" cy="170" r="2" fill="#1e293b" />
      <path d="M50 178 Q56 175 62 178" stroke="#1e293b" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <rect x="40" y="184" width="32" height="38" rx="10" fill="#334155" />
      {/* Shrug arms */}
      <path d="M40 194 Q28 186 24 180" stroke="#fed7aa" strokeWidth="7" strokeLinecap="round" fill="none" />
      <path d="M72 194 Q84 186 88 180" stroke="#fed7aa" strokeWidth="7" strokeLinecap="round" fill="none" />
    </svg>
  )
}
