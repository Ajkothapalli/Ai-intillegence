export function NotFound({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      {/* Floor */}
      <ellipse cx="200" cy="272" rx="155" ry="14" fill="#e2e8f0" />

      {/* 404 large text background */}
      <text x="62" y="200" fontSize="120" fill="#f1f5f9" fontWeight="900" fontFamily="system-ui, sans-serif">404</text>

      {/* Magnifying glass over the zero */}
      <circle cx="200" cy="160" r="44" fill="none" stroke="#7c3aed" strokeWidth="6" />
      <circle cx="200" cy="160" r="36" fill="#ede9fe" opacity="0.5" />
      {/* Question mark inside glass */}
      <text x="188" y="175" fontSize="36" fill="#7c3aed" fontWeight="bold" fontFamily="system-ui, sans-serif">?</text>
      {/* Glass handle */}
      <line x1="234" y1="194" x2="258" y2="218" stroke="#7c3aed" strokeWidth="6" strokeLinecap="round" />

      {/* Figure */}
      <circle cx="68" cy="168" r="18" fill="#fed7aa" />
      <ellipse cx="68" cy="154" rx="18" ry="9" fill="#1e293b" />
      <rect x="50" y="154" width="36" height="10" fill="#1e293b" />
      <circle cx="62" cy="168" r="2" fill="#1e293b" />
      <circle cx="74" cy="168" r="2" fill="#1e293b" />
      <path d="M62 175 Q68 179 74 175" stroke="#1e293b" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <rect x="50" y="184" width="36" height="44" rx="12" fill="#7c3aed" />
      <path d="M50 196 Q38 204 36 214" stroke="#fed7aa" strokeWidth="8" strokeLinecap="round" fill="none" />
      <path d="M86 196 Q96 206 94 218" stroke="#fed7aa" strokeWidth="8" strokeLinecap="round" fill="none" />
      <rect x="54" y="224" width="10" height="28" rx="5" fill="#1e293b" />
      <rect x="68" y="224" width="10" height="28" rx="5" fill="#1e293b" />
      <ellipse cx="59" cy="252" rx="9" ry="4" fill="#0f172a" />
      <ellipse cx="73" cy="252" rx="9" ry="4" fill="#0f172a" />
    </svg>
  )
}
