export function VerifyEmailIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <style>{`
        @keyframes float-letter {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .letter-float { animation: float-letter 2.4s ease-in-out infinite; transform-origin: 200px 160px; }
      `}</style>

      {/* Floor */}
      <ellipse cx="200" cy="272" rx="155" ry="14" fill="#e2e8f0" />

      {/* Envelope body */}
      <rect x="100" y="148" width="200" height="140" rx="10" fill="#334155" />
      <rect x="106" y="154" width="188" height="128" rx="6" fill="#ede9fe" />

      {/* Envelope flap open */}
      <path d="M100 148 L200 210 L300 148 Z" fill="#7c3aed" />
      <path d="M100 148 L200 200 L300 148" stroke="#6d28d9" strokeWidth="1" fill="none" />

      {/* Letter emerging */}
      <g className="letter-float">
        <rect x="140" y="80" width="120" height="100" rx="6" fill="white" />
        <rect x="152" y="96" width="96" height="6" rx="3" fill="#ddd6fe" />
        <rect x="152" y="108" width="80" height="5" rx="2.5" fill="#e2e8f0" />
        <rect x="152" y="119" width="88" height="5" rx="2.5" fill="#e2e8f0" />
        <rect x="152" y="130" width="60" height="5" rx="2.5" fill="#e2e8f0" />
        {/* Checkmark on letter */}
        <circle cx="220" cy="155" r="14" fill="#7c3aed" />
        <path d="M213 155 L218 161 L227 149" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </g>

      {/* Figure reaching */}
      {/* Body */}
      <rect x="300" y="184" width="40" height="56" rx="14" fill="#334155" />
      {/* Head */}
      <circle cx="320" cy="168" r="20" fill="#fed7aa" />
      {/* Hair */}
      <ellipse cx="320" cy="153" rx="20" ry="10" fill="#1e293b" />
      <rect x="300" y="153" width="40" height="12" fill="#1e293b" />
      {/* Eyes */}
      <circle cx="313" cy="168" r="2.5" fill="#1e293b" />
      <circle cx="327" cy="168" r="2.5" fill="#1e293b" />
      {/* Happy expression */}
      <path d="M313 177 Q320 182 327 177" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" fill="none" />

      {/* Arm reaching for letter */}
      <path d="M300 196 Q278 180 258 155" stroke="#fed7aa" strokeWidth="10" strokeLinecap="round" fill="none" />
      {/* Other arm */}
      <path d="M340 196 Q354 206 356 216" stroke="#fed7aa" strokeWidth="10" strokeLinecap="round" fill="none" />

      {/* Legs */}
      <rect x="302" y="236" width="14" height="32" rx="6" fill="#1e293b" />
      <rect x="320" y="236" width="14" height="32" rx="6" fill="#1e293b" />
      <ellipse cx="309" cy="268" rx="12" ry="5" fill="#0f172a" />
      <ellipse cx="327" cy="268" rx="12" ry="5" fill="#0f172a" />

      {/* Sparkle dots */}
      <circle cx="80" cy="100" r="5" fill="#7c3aed" opacity="0.4" />
      <circle cx="72" cy="120" r="3" fill="#fbbf24" opacity="0.5" />
      <circle cx="90" cy="135" r="2.5" fill="#7c3aed" opacity="0.3" />
      <circle cx="356" cy="90" r="4" fill="#7c3aed" opacity="0.4" />
      <circle cx="368" cy="110" r="3" fill="#fbbf24" opacity="0.5" />
    </svg>
  )
}
