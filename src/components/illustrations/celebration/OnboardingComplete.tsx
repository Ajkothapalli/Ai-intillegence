export function OnboardingComplete({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <style>{`
        @keyframes rocket-launch {
          0% { transform: translate(0, 0) rotate(-30deg); }
          100% { transform: translate(20px, -30px) rotate(-30deg); }
        }
        @keyframes trail-fade {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.2; }
        }
        .rocket { animation: rocket-launch 1.2s ease-in-out infinite alternate; transform-origin: 200px 160px; }
        .trail { animation: trail-fade 1.2s ease-in-out infinite; }
      `}</style>

      {/* Stars background */}
      <circle cx="60" cy="60" r="3" fill="#ddd6fe" />
      <circle cx="120" cy="40" r="2" fill="#ddd6fe" />
      <circle cx="280" cy="50" r="3" fill="#ddd6fe" />
      <circle cx="340" cy="80" r="2" fill="#ddd6fe" />
      <circle cx="80" cy="120" r="2" fill="#ddd6fe" />
      <circle cx="350" cy="130" r="3" fill="#ddd6fe" />
      <circle cx="40" cy="180" r="2" fill="#ddd6fe" />
      <circle cx="360" cy="200" r="2" fill="#ddd6fe" />

      {/* Earth / planet at bottom */}
      <ellipse cx="200" cy="270" rx="180" ry="40" fill="#ede9fe" opacity="0.4" />
      <ellipse cx="200" cy="268" rx="160" ry="28" fill="#ddd6fe" opacity="0.5" />

      {/* Rocket */}
      <g className="rocket">
        {/* Body */}
        <path d="M200 100 Q215 120 215 160 L185 160 Q185 120 200 100 Z" fill="#7c3aed" />
        {/* Nose */}
        <path d="M200 100 Q208 88 200 80 Q192 88 200 100 Z" fill="#6d28d9" />
        {/* Window */}
        <circle cx="200" cy="140" r="10" fill="#ede9fe" />
        <circle cx="200" cy="140" r="6" fill="#c4b5fd" />
        {/* Fins */}
        <path d="M185 155 L172 175 L185 168 Z" fill="#6d28d9" />
        <path d="M215 155 L228 175 L215 168 Z" fill="#6d28d9" />
        {/* Flame */}
        <path d="M192 168 Q200 188 208 168" fill="#fbbf24" />
        <path d="M194 168 Q200 182 206 168" fill="#f97316" />
        <path d="M196 168 Q200 176 204 168" fill="#fef9c3" />
      </g>

      {/* Rocket trail */}
      <g className="trail">
        <ellipse cx="195" cy="200" rx="6" ry="14" fill="#fbbf24" opacity="0.4" transform="rotate(-30 195 200)" />
        <ellipse cx="186" cy="218" rx="5" ry="12" fill="#fbbf24" opacity="0.25" transform="rotate(-30 186 218)" />
        <ellipse cx="178" cy="234" rx="4" ry="10" fill="#fbbf24" opacity="0.12" transform="rotate(-30 178 234)" />
      </g>

      {/* Confetti */}
      <rect x="60" y="90" width="12" height="12" rx="2" fill="#7c3aed" opacity="0.6" transform="rotate(20 66 96)" />
      <rect x="320" y="100" width="10" height="10" rx="2" fill="#10b981" opacity="0.6" transform="rotate(-15 325 105)" />
      <circle cx="72" cy="160" r="7" fill="#fbbf24" opacity="0.6" />
      <circle cx="340" cy="155" r="6" fill="#f43f5e" opacity="0.5" />
      <rect x="100" y="220" width="8" height="8" rx="1" fill="#f43f5e" opacity="0.4" transform="rotate(30 104 224)" />
      <rect x="290" y="215" width="8" height="8" rx="1" fill="#7c3aed" opacity="0.4" transform="rotate(-25 294 219)" />

      {/* Check badge */}
      <circle cx="320" cy="60" r="22" fill="#10b981" />
      <path d="M310 60 L317 68 L330 50" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  )
}
