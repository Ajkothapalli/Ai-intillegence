export function ResetPasswordIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      {/* Floor */}
      <ellipse cx="200" cy="272" rx="160" ry="14" fill="#e2e8f0" />

      {/* Old broken key on ground */}
      <g transform="rotate(15 120 250)">
        <circle cx="100" cy="250" r="12" fill="#94a3b8" />
        <circle cx="100" cy="250" r="7" fill="#e2e8f0" />
        <rect x="110" y="247" width="28" height="5" rx="2" fill="#94a3b8" />
        <rect x="124" y="247" width="5" height="9" rx="2" fill="#94a3b8" />
        {/* Break in key */}
        <line x1="116" y1="245" x2="120" y2="258" stroke="#f8fafc" strokeWidth="2" />
      </g>

      {/* New shiny key held by figure */}
      <g transform="rotate(-20 290 160)">
        <circle cx="290" cy="155" r="18" fill="#fbbf24" />
        <circle cx="290" cy="155" r="11" fill="#1e293b" />
        <rect x="304" y="152" width="42" height="7" rx="3" fill="#fbbf24" />
        <rect x="330" y="152" width="7" height="14" rx="2.5" fill="#fbbf24" />
        <rect x="318" y="152" width="7" height="12" rx="2.5" fill="#fbbf24" />
      </g>

      {/* Padlock open/unlocked */}
      <rect x="148" y="160" width="90" height="80" rx="10" fill="#334155" />
      <rect x="156" y="168" width="74" height="64" rx="6" fill="#1e293b" />
      {/* Shackle open */}
      <path d="M164 162 Q164 118 193 118 Q222 118 222 142" stroke="#334155" strokeWidth="18" strokeLinecap="round" fill="none" />
      <path d="M164 162 Q164 118 193 118 Q222 118 222 142" stroke="#475569" strokeWidth="12" strokeLinecap="round" fill="none" />
      {/* Keyhole with check */}
      <circle cx="193" cy="196" r="14" fill="#7c3aed" />
      <path d="M186 196 L191 202 L200 190" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />

      {/* Figure */}
      {/* Head */}
      <circle cx="108" cy="152" r="22" fill="#fed7aa" />
      {/* Hair */}
      <ellipse cx="108" cy="136" rx="22" ry="12" fill="#1e293b" />
      <rect x="86" y="136" width="44" height="14" fill="#1e293b" />
      {/* Eyes happy */}
      <circle cx="100" cy="152" r="2.5" fill="#1e293b" />
      <circle cx="116" cy="152" r="2.5" fill="#1e293b" />
      {/* Big smile */}
      <path d="M100 162 Q108 168 116 162" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" fill="none" />

      {/* Body */}
      <rect x="86" y="172" width="44" height="60" rx="14" fill="#7c3aed" />

      {/* Arm holding new key (right) */}
      <path d="M130 188 Q212 165 270 158" stroke="#fed7aa" strokeWidth="10" strokeLinecap="round" fill="none" />
      {/* Other arm */}
      <path d="M86 188 Q72 198 68 212" stroke="#fed7aa" strokeWidth="10" strokeLinecap="round" fill="none" />

      {/* Legs */}
      <rect x="90" y="228" width="14" height="36" rx="6" fill="#1e293b" />
      <rect x="108" y="228" width="14" height="36" rx="6" fill="#1e293b" />
      <ellipse cx="97" cy="265" rx="12" ry="5" fill="#0f172a" />
      <ellipse cx="115" cy="265" rx="12" ry="5" fill="#0f172a" />

      {/* Sparkles around new key */}
      <circle cx="340" cy="110" r="5" fill="#fbbf24" opacity="0.7" />
      <circle cx="356" cy="128" r="3" fill="#7c3aed" opacity="0.5" />
      <circle cx="348" cy="145" r="2.5" fill="#fbbf24" opacity="0.6" />
      <path d="M362 100 L365 107 L362 114 L359 107 Z" fill="#fbbf24" opacity="0.6" />
    </svg>
  )
}
