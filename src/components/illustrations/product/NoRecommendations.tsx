export function NoRecommendations({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      {/* Floor */}
      <ellipse cx="200" cy="272" rx="155" ry="14" fill="#e2e8f0" />

      {/* Large blank clipboard */}
      <rect x="120" y="60" width="160" height="200" rx="10" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" />
      {/* Clip */}
      <rect x="168" y="52" width="64" height="20" rx="6" fill="#334155" />
      <rect x="178" y="48" width="44" height="14" rx="4" fill="#475569" />

      {/* Empty lines */}
      <rect x="140" y="92" width="120" height="8" rx="4" fill="#e2e8f0" />
      <rect x="140" y="108" width="96" height="6" rx="3" fill="#f1f5f9" />
      <rect x="140" y="122" width="112" height="6" rx="3" fill="#f1f5f9" />
      <rect x="140" y="148" width="120" height="8" rx="4" fill="#e2e8f0" />
      <rect x="140" y="164" width="80" height="6" rx="3" fill="#f1f5f9" />
      <rect x="140" y="178" width="104" height="6" rx="3" fill="#f1f5f9" />

      {/* Magnifying glass */}
      <circle cx="200" cy="224" r="20" fill="none" stroke="#7c3aed" strokeWidth="3" />
      <line x1="214" y1="237" x2="226" y2="250" stroke="#7c3aed" strokeWidth="3" strokeLinecap="round" />
      {/* X inside lens */}
      <line x1="192" y1="216" x2="208" y2="232" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" />
      <line x1="208" y1="216" x2="192" y2="232" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" />

      {/* Figure */}
      <circle cx="330" cy="140" r="20" fill="#fed7aa" />
      <ellipse cx="330" cy="125" rx="20" ry="10" fill="#1e293b" />
      <rect x="310" y="125" width="40" height="12" fill="#1e293b" />
      <circle cx="323" cy="140" r="2.5" fill="#1e293b" />
      <circle cx="337" cy="140" r="2.5" fill="#1e293b" />
      <path d="M323 149 Q330 153 337 149" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <rect x="310" y="158" width="40" height="52" rx="14" fill="#7c3aed" />
      <path d="M310 174 Q296 184 292 196" stroke="#fed7aa" strokeWidth="9" strokeLinecap="round" fill="none" />
      <path d="M350 174 Q362 186 360 198" stroke="#fed7aa" strokeWidth="9" strokeLinecap="round" fill="none" />
      <rect x="314" y="206" width="12" height="34" rx="6" fill="#1e293b" />
      <rect x="330" y="206" width="12" height="34" rx="6" fill="#1e293b" />
      <ellipse cx="320" cy="240" rx="10" ry="5" fill="#0f172a" />
      <ellipse cx="336" cy="240" rx="10" ry="5" fill="#0f172a" />
    </svg>
  )
}
