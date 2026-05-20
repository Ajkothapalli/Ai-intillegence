export function LoginIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      {/* Floor */}
      <ellipse cx="200" cy="272" rx="170" ry="14" fill="#e2e8f0" />

      {/* Desk */}
      <rect x="80" y="210" width="240" height="14" rx="4" fill="#334155" />
      <rect x="100" y="224" width="12" height="48" rx="4" fill="#1e293b" />
      <rect x="288" y="224" width="12" height="48" rx="4" fill="#1e293b" />

      {/* Laptop base */}
      <rect x="130" y="182" width="140" height="30" rx="4" fill="#1e293b" />
      <rect x="136" y="186" width="128" height="22" rx="2" fill="#334155" />
      <ellipse cx="200" cy="214" rx="10" ry="2" fill="#0f172a" />

      {/* Laptop screen */}
      <rect x="138" y="100" width="124" height="88" rx="4" fill="#1e293b" />
      <rect x="142" y="104" width="116" height="80" rx="2" fill="#7c3aed" />
      {/* Screen content */}
      <rect x="154" y="116" width="60" height="6" rx="3" fill="#ede9fe" opacity="0.8" />
      <rect x="154" y="128" width="92" height="5" rx="2.5" fill="#ddd6fe" opacity="0.6" />
      <rect x="154" y="139" width="80" height="5" rx="2.5" fill="#ddd6fe" opacity="0.6" />
      <rect x="154" y="156" width="92" height="14" rx="4" fill="#ede9fe" opacity="0.9" />

      {/* Plant */}
      <rect x="310" y="185" width="14" height="28" rx="4" fill="#7c3aed" opacity="0.3" />
      <ellipse cx="317" cy="170" rx="18" ry="22" fill="#10b981" opacity="0.8" />
      <ellipse cx="305" cy="178" rx="12" ry="14" fill="#10b981" opacity="0.7" />
      <ellipse cx="329" cy="178" rx="12" ry="14" fill="#10b981" opacity="0.7" />

      {/* Lamp */}
      <rect x="86" y="148" width="6" height="64" rx="3" fill="#334155" />
      <path d="M92 148 Q110 130 130 138" stroke="#334155" strokeWidth="4" strokeLinecap="round" fill="none" />
      <polygon points="116,132 144,138 138,155 110,148" fill="#fbbf24" opacity="0.9" />
      <ellipse cx="127" cy="145" rx="14" ry="8" fill="#fef9c3" opacity="0.4" />

      {/* Figure */}
      {/* Head */}
      <circle cx="200" cy="148" r="22" fill="#fed7aa" />
      {/* Hair */}
      <ellipse cx="200" cy="132" rx="22" ry="12" fill="#1e293b" />
      <rect x="178" y="132" width="44" height="14" fill="#1e293b" />
      {/* Eyes looking at screen */}
      <circle cx="192" cy="148" r="2.5" fill="#1e293b" />
      <circle cx="208" cy="148" r="2.5" fill="#1e293b" />
      {/* Focused expression */}
      <path d="M194 157 Q200 160 206 157" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" fill="none" />

      {/* Body */}
      <rect x="178" y="168" width="44" height="46" rx="14" fill="#334155" />

      {/* Arms on desk */}
      <path d="M178 188 Q160 196 152 202" stroke="#fed7aa" strokeWidth="10" strokeLinecap="round" fill="none" />
      <path d="M222 188 Q240 196 248 202" stroke="#fed7aa" strokeWidth="10" strokeLinecap="round" fill="none" />

      {/* Coffee mug */}
      <rect x="60" y="196" width="20" height="18" rx="4" fill="#7c3aed" />
      <path d="M80 202 Q88 202 88 210 Q88 216 80 216" stroke="#7c3aed" strokeWidth="3" strokeLinecap="round" fill="none" />
      <rect x="62" y="198" width="16" height="4" rx="2" fill="#ede9fe" opacity="0.5" />
    </svg>
  )
}
