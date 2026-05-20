export function RateLimitHit({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      {/* Floor */}
      <ellipse cx="200" cy="272" rx="155" ry="14" fill="#e2e8f0" />

      {/* Stop sign / shield */}
      <polygon points="200,60 240,80 256,120 240,160 200,180 160,160 144,120 160,80" fill="#ef4444" opacity="0.15" stroke="#fca5a5" strokeWidth="2" />
      <polygon points="200,68 236,86 250,122 236,158 200,172 164,158 150,122 164,86" fill="#fef2f2" />

      {/* Stop hand */}
      <rect x="183" y="100" width="12" height="40" rx="5" fill="#fed7aa" />
      <rect x="199" y="108" width="10" height="32" rx="4" fill="#fed7aa" />
      <rect x="213" y="112" width="10" height="28" rx="4" fill="#fed7aa" />
      <rect x="172" y="114" width="12" height="26" rx="4" fill="#fed7aa" />
      <rect x="170" y="138" width="56" height="14" rx="4" fill="#fed7aa" />

      {/* Gauge / speedometer */}
      <path d="M100 220 A80 80 0 0 1 300 220" fill="none" stroke="#e2e8f0" strokeWidth="16" strokeLinecap="round" />
      <path d="M100 220 A80 80 0 0 1 300 220" fill="none" stroke="url(#gauge-grad)" strokeWidth="16" strokeLinecap="round" strokeDasharray="251.2" strokeDashoffset="40" />
      <defs>
        <linearGradient id="gauge-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="60%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#ef4444" />
        </linearGradient>
      </defs>
      {/* Needle at max */}
      <line x1="200" y1="220" x2="284" y2="168" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
      <circle cx="200" cy="220" r="8" fill="#334155" />

      {/* Label */}
      <text x="178" y="250" fontSize="10" fill="#ef4444" fontWeight="bold">Rate limit reached</text>
    </svg>
  )
}
