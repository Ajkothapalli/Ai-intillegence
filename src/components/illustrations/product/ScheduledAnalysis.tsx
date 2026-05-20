export function ScheduledAnalysis({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      {/* Calendar */}
      <rect x="100" y="80" width="200" height="170" rx="12" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" />
      <rect x="100" y="80" width="200" height="44" rx="12" fill="#7c3aed" />
      <rect x="100" y="112" width="200" height="12" fill="#7c3aed" />
      {/* Calendar hooks */}
      <rect x="140" y="70" width="12" height="24" rx="6" fill="#6d28d9" />
      <rect x="248" y="70" width="12" height="24" rx="6" fill="#6d28d9" />
      {/* Month label */}
      <rect x="148" y="90" width="104" height="10" rx="5" fill="#ede9fe" opacity="0.5" />

      {/* Day grid */}
      {[0,1,2,3,4,5,6].map(i => (
        <rect key={`h${i}`} x={116 + i * 26} y={140} width={20} height={8} rx={3} fill="#f1f5f9" />
      ))}
      {[0,1,2,3,4,5,6].map(i => (
        <rect key={`r1-${i}`} x={116 + i * 26} y={156} width={20} height={14} rx={4} fill="#f1f5f9" />
      ))}
      {[0,1,2,3,4,5,6].map(i => (
        <rect key={`r2-${i}`} x={116 + i * 26} y={176} width={20} height={14} rx={4} fill="#f1f5f9" />
      ))}
      {[0,1,2,3,4,5,6].map(i => (
        <rect key={`r3-${i}`} x={116 + i * 26} y={196} width={20} height={14} rx={4} fill="#f1f5f9" />
      ))}
      {[0,1,2,3,4,5,6].map(i => (
        <rect key={`r4-${i}`} x={116 + i * 26} y={216} width={20} height={14} rx={4} fill="#f1f5f9" />
      ))}

      {/* Highlighted scheduled days */}
      <rect x="168" y="156" width="20" height="14" rx="4" fill="#7c3aed" opacity="0.8" />
      <rect x="246" y="176" width="20" height="14" rx="4" fill="#7c3aed" opacity="0.8" />
      <rect x="194" y="216" width="20" height="14" rx="4" fill="#7c3aed" opacity="0.5" />

      {/* Clock icon overlay */}
      <circle cx="300" cy="108" r="28" fill="white" stroke="#e2e8f0" strokeWidth="2" />
      <circle cx="300" cy="108" r="22" fill="#ede9fe" />
      <line x1="300" y1="96" x2="300" y2="108" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="300" y1="108" x2="308" y2="114" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="300" cy="108" r="3" fill="#6d28d9" />

      {/* Repeat arrows */}
      <path d="M74 148 Q60 148 60 164 Q60 180 74 180" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M74 148 L68 154 M74 180 L68 174" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  )
}
