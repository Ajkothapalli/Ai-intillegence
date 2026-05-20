export function SignupIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      {/* Floor */}
      <ellipse cx="200" cy="272" rx="160" ry="14" fill="#e2e8f0" />

      {/* Door frame */}
      <rect x="148" y="80" width="104" height="176" rx="4" fill="#1e293b" />
      <rect x="154" y="86" width="92" height="164" rx="3" fill="#7c3aed" />

      {/* Door open panel */}
      <rect x="154" y="86" width="46" height="164" rx="3" fill="#6d28d9" />
      <circle cx="196" cy="170" r="4" fill="#ede9fe" />

      {/* Light streaming through */}
      <polygon points="200,86 320,60 320,250 200,250" fill="#fef9c3" opacity="0.35" />
      <polygon points="200,86 340,50 340,260 200,250" fill="#fef9c3" opacity="0.15" />

      {/* Figure body */}
      <rect x="224" y="172" width="28" height="60" rx="14" fill="#334155" />

      {/* Figure head */}
      <circle cx="238" cy="157" r="20" fill="#fed7aa" />
      {/* Hair */}
      <ellipse cx="238" cy="142" rx="20" ry="10" fill="#1e293b" />
      <rect x="218" y="142" width="40" height="12" fill="#1e293b" />

      {/* Eyes */}
      <circle cx="231" cy="157" r="2.5" fill="#1e293b" />
      <circle cx="245" cy="157" r="2.5" fill="#1e293b" />

      {/* Smile */}
      <path d="M231 165 Q238 170 245 165" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" fill="none" />

      {/* Arm reaching toward door */}
      <path d="M224 185 Q210 175 198 168" stroke="#fed7aa" strokeWidth="10" strokeLinecap="round" fill="none" />
      {/* Other arm */}
      <path d="M252 185 Q260 195 258 205" stroke="#fed7aa" strokeWidth="10" strokeLinecap="round" fill="none" />

      {/* Legs */}
      <rect x="224" y="228" width="12" height="36" rx="6" fill="#1e293b" />
      <rect x="240" y="228" width="12" height="36" rx="6" fill="#1e293b" />

      {/* Shoes */}
      <ellipse cx="230" cy="265" rx="10" ry="5" fill="#0f172a" />
      <ellipse cx="246" cy="265" rx="10" ry="5" fill="#0f172a" />

      {/* Sparkles */}
      <circle cx="320" cy="100" r="4" fill="#7c3aed" opacity="0.6" />
      <circle cx="340" cy="140" r="3" fill="#7c3aed" opacity="0.4" />
      <circle cx="310" cy="160" r="2" fill="#6d28d9" opacity="0.5" />
      <path d="M330 80 L333 86 L330 92 L327 86 Z" fill="#fbbf24" opacity="0.7" />
    </svg>
  )
}
