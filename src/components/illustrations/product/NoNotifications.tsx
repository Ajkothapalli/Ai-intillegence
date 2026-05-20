export function NoNotifications({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      {/* Bell */}
      <path d="M200 60 Q200 52 200 52" stroke="#7c3aed" strokeWidth="3" strokeLinecap="round" />
      <circle cx="200" cy="52" r="6" fill="none" stroke="#7c3aed" strokeWidth="2.5" />
      <path d="M152 196 Q148 220 200 220 Q252 220 248 196 Q230 186 230 148 Q230 112 200 112 Q170 112 170 148 Q170 186 152 196 Z" fill="#ede9fe" stroke="#ddd6fe" strokeWidth="2" />
      <path d="M148 196 L252 196" stroke="#c4b5fd" strokeWidth="2" strokeLinecap="round" />
      {/* Clapper */}
      <ellipse cx="200" cy="228" rx="16" ry="8" fill="#ddd6fe" />

      {/* ZZZ floating (silent) */}
      <text x="268" y="120" fontSize="18" fill="#94a3b8" fontWeight="bold">Z</text>
      <text x="286" y="102" fontSize="14" fill="#94a3b8" fontWeight="bold">z</text>
      <text x="300" y="88" fontSize="10" fill="#94a3b8" fontWeight="bold">z</text>

      {/* Empty notification lines */}
      <rect x="80" y="100" width="56" height="8" rx="4" fill="#f1f5f9" />
      <rect x="80" y="114" width="44" height="6" rx="3" fill="#f8fafc" />
      <rect x="80" y="136" width="56" height="8" rx="4" fill="#f1f5f9" />
      <rect x="80" y="150" width="36" height="6" rx="3" fill="#f8fafc" />

      {/* X marks next to empty notifications */}
      <circle cx="72" cy="104" r="8" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="1" />
      <line x1="69" y1="101" x2="75" y2="107" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="75" y1="101" x2="69" y2="107" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="72" cy="140" r="8" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="1" />
      <line x1="69" y1="137" x2="75" y2="143" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="75" y1="137" x2="69" y2="143" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />

      {/* Floor */}
      <ellipse cx="200" cy="272" rx="140" ry="10" fill="#e2e8f0" />
    </svg>
  )
}
