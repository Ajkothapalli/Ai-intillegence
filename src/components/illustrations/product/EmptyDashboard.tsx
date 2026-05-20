export function EmptyDashboard({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      {/* Dashboard screen */}
      <rect x="60" y="40" width="280" height="200" rx="12" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" />
      {/* Top bar */}
      <rect x="60" y="40" width="280" height="36" rx="12" fill="#1e293b" />
      <rect x="60" y="64" width="280" height="12" fill="#1e293b" />
      <circle cx="84" cy="58" r="6" fill="#ef4444" opacity="0.7" />
      <circle cx="100" cy="58" r="6" fill="#fbbf24" opacity="0.7" />
      <circle cx="116" cy="58" r="6" fill="#10b981" opacity="0.7" />

      {/* Empty stat cards */}
      <rect x="80" y="96" width="72" height="48" rx="8" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1" />
      <rect x="164" y="96" width="72" height="48" rx="8" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1" />
      <rect x="248" y="96" width="72" height="48" rx="8" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1" />

      {/* Wavy empty chart */}
      <rect x="80" y="158" width="240" height="64" rx="8" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="1" />
      <path d="M96 190 Q116 182 136 190 Q156 198 176 190 Q196 182 216 190 Q236 198 256 190 Q276 182 296 190 Q306 194 310 190" stroke="#ddd6fe" strokeWidth="2" strokeLinecap="round" fill="none" strokeDasharray="6 4" />

      {/* Figure standing to the side */}
      <circle cx="340" cy="152" r="20" fill="#fed7aa" />
      <ellipse cx="340" cy="137" rx="20" ry="10" fill="#1e293b" />
      <rect x="320" y="137" width="40" height="12" fill="#1e293b" />
      <circle cx="333" cy="152" r="2.5" fill="#1e293b" />
      <circle cx="347" cy="152" r="2.5" fill="#1e293b" />
      <path d="M333 161 Q340 165 347 161" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <rect x="320" y="170" width="40" height="52" rx="14" fill="#7c3aed" />
      <path d="M320 186 Q306 196 302 208" stroke="#fed7aa" strokeWidth="9" strokeLinecap="round" fill="none" />
      <path d="M360 186 Q366 200 364 212" stroke="#fed7aa" strokeWidth="9" strokeLinecap="round" fill="none" />
      <rect x="324" y="220" width="12" height="32" rx="6" fill="#1e293b" />
      <rect x="340" y="220" width="12" height="32" rx="6" fill="#1e293b" />
      <ellipse cx="330" cy="252" rx="10" ry="5" fill="#0f172a" />
      <ellipse cx="346" cy="252" rx="10" ry="5" fill="#0f172a" />

      {/* Arrow pointing to dashboard */}
      <path d="M312 170 Q296 164 288 160" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeDasharray="5 3" fill="none" />
      <polygon points="286,158 292,166 298,158" fill="#7c3aed" />
    </svg>
  )
}
