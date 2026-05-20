export function NoProjects({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      {/* Floor */}
      <ellipse cx="200" cy="272" rx="160" ry="14" fill="#e2e8f0" />

      {/* Empty folder stack */}
      <rect x="108" y="180" width="168" height="12" rx="4" fill="#cbd5e1" />
      <rect x="100" y="100" width="200" height="90" rx="10" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="2" />
      <path d="M100 124 Q100 110 114 110 L166 110 L174 100 L300 100 Q300 100 300 110 L300 124 Z" fill="#ddd6fe" />
      <rect x="100" y="124" width="200" height="66" rx="0" fill="#ede9fe" />
      <rect x="100" y="180" width="200" height="10" rx="0" fill="#ddd6fe" />

      {/* Dashed plus inside folder */}
      <circle cx="200" cy="156" r="22" fill="none" stroke="#7c3aed" strokeWidth="2" strokeDasharray="5 3" />
      <path d="M200 146 L200 166 M190 156 L210 156" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" />

      {/* Figure */}
      <circle cx="320" cy="148" r="20" fill="#fed7aa" />
      <ellipse cx="320" cy="133" rx="20" ry="10" fill="#1e293b" />
      <rect x="300" y="133" width="40" height="12" fill="#1e293b" />
      <circle cx="313" cy="148" r="2.5" fill="#1e293b" />
      <circle cx="327" cy="148" r="2.5" fill="#1e293b" />
      <path d="M313 157 Q320 162 327 157" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <rect x="300" y="166" width="40" height="52" rx="14" fill="#334155" />
      <path d="M300 182 Q284 190 280 202" stroke="#fed7aa" strokeWidth="9" strokeLinecap="round" fill="none" />
      <path d="M340 182 Q352 192 350 204" stroke="#fed7aa" strokeWidth="9" strokeLinecap="round" fill="none" />
      <rect x="304" y="214" width="12" height="32" rx="6" fill="#1e293b" />
      <rect x="320" y="214" width="12" height="32" rx="6" fill="#1e293b" />
      <ellipse cx="310" cy="246" rx="10" ry="5" fill="#0f172a" />
      <ellipse cx="326" cy="246" rx="10" ry="5" fill="#0f172a" />
    </svg>
  )
}
