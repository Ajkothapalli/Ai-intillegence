export function NoIntegrations({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      {/* Floor */}
      <ellipse cx="200" cy="272" rx="155" ry="14" fill="#e2e8f0" />

      {/* Central hub */}
      <circle cx="200" cy="160" r="36" fill="#7c3aed" />
      <circle cx="200" cy="160" r="24" fill="#6d28d9" />
      <path d="M188 154 L200 142 L212 154 L212 170 L200 178 L188 170 Z" fill="#ede9fe" opacity="0.8" />

      {/* Disconnected plugin slots */}
      {/* Top */}
      <line x1="200" y1="124" x2="200" y2="96" stroke="#e2e8f0" strokeWidth="3" strokeDasharray="5 3" />
      <rect x="176" y="72" width="48" height="28" rx="8" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="2" />
      <circle cx="200" cy="86" r="8" fill="#e2e8f0" />

      {/* Bottom */}
      <line x1="200" y1="196" x2="200" y2="224" stroke="#e2e8f0" strokeWidth="3" strokeDasharray="5 3" />
      <rect x="176" y="224" width="48" height="28" rx="8" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="2" />
      <circle cx="200" cy="238" r="8" fill="#e2e8f0" />

      {/* Left */}
      <line x1="164" y1="160" x2="120" y2="160" stroke="#e2e8f0" strokeWidth="3" strokeDasharray="5 3" />
      <rect x="76" y="144" width="48" height="28" rx="8" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="2" />
      <circle cx="100" cy="158" r="8" fill="#e2e8f0" />

      {/* Right */}
      <line x1="236" y1="160" x2="276" y2="160" stroke="#e2e8f0" strokeWidth="3" strokeDasharray="5 3" />
      <rect x="276" y="144" width="48" height="28" rx="8" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="2" />
      <circle cx="300" cy="158" r="8" fill="#e2e8f0" />

      {/* Plus icons on empty slots */}
      <path d="M196 86 L204 86 M200 82 L200 90" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M196 238 L204 238 M200 234 L200 242" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M96 158 L104 158 M100 154 L100 162" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M296 158 L304 158 M300 154 L300 162" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
