export function ForgotPasswordIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      {/* Floor */}
      <ellipse cx="200" cy="272" rx="155" ry="14" fill="#e2e8f0" />

      {/* Large padlock */}
      <rect x="148" y="140" width="104" height="90" rx="12" fill="#334155" />
      <rect x="156" y="148" width="88" height="74" rx="8" fill="#1e293b" />
      {/* Keyhole */}
      <circle cx="200" cy="182" r="14" fill="#7c3aed" />
      <rect x="194" y="186" width="12" height="24" rx="4" fill="#7c3aed" />
      <circle cx="200" cy="182" r="7" fill="#1e293b" />

      {/* Shackle */}
      <path d="M164 142 Q164 96 200 96 Q236 96 236 142" stroke="#334155" strokeWidth="20" strokeLinecap="round" fill="none" />
      <path d="M164 142 Q164 96 200 96 Q236 96 236 142" stroke="#475569" strokeWidth="14" strokeLinecap="round" fill="none" />

      {/* Key nearby */}
      <g transform="rotate(-30 300 220)">
        <circle cx="300" cy="210" r="16" fill="#fbbf24" />
        <circle cx="300" cy="210" r="10" fill="#1e293b" />
        <rect x="312" y="207" width="36" height="6" rx="3" fill="#fbbf24" />
        <rect x="336" y="207" width="6" height="12" rx="2" fill="#fbbf24" />
        <rect x="326" y="207" width="6" height="10" rx="2" fill="#fbbf24" />
      </g>

      {/* Figure */}
      {/* Head */}
      <circle cx="96" cy="158" r="22" fill="#fed7aa" />
      {/* Hair */}
      <ellipse cx="96" cy="141" rx="22" ry="12" fill="#1e293b" />
      <rect x="74" y="141" width="44" height="14" fill="#1e293b" />
      {/* Eyes — looking at padlock */}
      <circle cx="91" cy="157" r="2.5" fill="#1e293b" />
      <circle cx="103" cy="156" r="2.5" fill="#1e293b" />
      {/* Worried expression */}
      <path d="M89 167 Q96 164 103 167" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* Eyebrows worried */}
      <path d="M88 150 Q91 147 95 150" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M101 150 Q105 147 108 150" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" fill="none" />

      {/* Body */}
      <rect x="74" y="178" width="44" height="60" rx="14" fill="#7c3aed" />

      {/* Arm pointing at padlock */}
      <path d="M118 192 Q136 180 148 174" stroke="#fed7aa" strokeWidth="10" strokeLinecap="round" fill="none" />
      {/* Other arm */}
      <path d="M74 192 Q60 200 58 212" stroke="#fed7aa" strokeWidth="10" strokeLinecap="round" fill="none" />

      {/* Legs */}
      <rect x="78" y="234" width="14" height="32" rx="6" fill="#1e293b" />
      <rect x="96" y="234" width="14" height="32" rx="6" fill="#1e293b" />
      <ellipse cx="85" cy="266" rx="12" ry="5" fill="#0f172a" />
      <ellipse cx="103" cy="266" rx="12" ry="5" fill="#0f172a" />

      {/* Question mark floating */}
      <text x="340" y="120" fontSize="42" fill="#7c3aed" opacity="0.3" fontFamily="serif" fontWeight="bold">?</text>
      <text x="60" y="130" fontSize="28" fill="#7c3aed" opacity="0.2" fontFamily="serif" fontWeight="bold">?</text>
    </svg>
  )
}
