export function NoSegments({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      {/* Floor */}
      <ellipse cx="200" cy="272" rx="160" ry="14" fill="#e2e8f0" />

      {/* Venn diagram circles (empty / no segments) */}
      <circle cx="170" cy="168" r="72" fill="#ede9fe" opacity="0.4" stroke="#ddd6fe" strokeWidth="2" />
      <circle cx="230" cy="168" r="72" fill="#ddd6fe" opacity="0.4" stroke="#c4b5fd" strokeWidth="2" />
      {/* Overlap area */}
      <path d="M200 108 Q228 128 228 168 Q228 208 200 228 Q172 208 172 168 Q172 128 200 108 Z" fill="#7c3aed" opacity="0.15" />

      {/* Empty user icons in each circle */}
      <circle cx="152" cy="162" r="10" fill="#ddd6fe" />
      <path d="M140 178 Q152 172 164 178" stroke="#ddd6fe" strokeWidth="2" fill="none" />
      <circle cx="248" cy="162" r="10" fill="#c4b5fd" />
      <path d="M236 178 Q248 172 260 178" stroke="#c4b5fd" strokeWidth="2" fill="none" />

      {/* Plus icon in overlap */}
      <circle cx="200" cy="168" r="18" fill="#7c3aed" opacity="0.2" stroke="#7c3aed" strokeWidth="1.5" strokeDasharray="4 2" />
      <path d="M200 160 L200 176 M192 168 L208 168" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" />

      {/* Figure */}
      <circle cx="340" cy="120" r="20" fill="#fed7aa" />
      <ellipse cx="340" cy="105" rx="20" ry="10" fill="#1e293b" />
      <rect x="320" y="105" width="40" height="12" fill="#1e293b" />
      <circle cx="333" cy="120" r="2.5" fill="#1e293b" />
      <circle cx="347" cy="120" r="2.5" fill="#1e293b" />
      <path d="M333 129 Q340 134 347 129" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <rect x="320" y="138" width="40" height="52" rx="14" fill="#7c3aed" />
      <path d="M320 154 Q304 162 300 174" stroke="#fed7aa" strokeWidth="9" strokeLinecap="round" fill="none" />
      <path d="M360 154 Q372 166 370 178" stroke="#fed7aa" strokeWidth="9" strokeLinecap="round" fill="none" />
      <rect x="324" y="186" width="12" height="34" rx="6" fill="#1e293b" />
      <rect x="340" y="186" width="12" height="34" rx="6" fill="#1e293b" />
      <ellipse cx="330" cy="220" rx="10" ry="5" fill="#0f172a" />
      <ellipse cx="346" cy="220" rx="10" ry="5" fill="#0f172a" />
    </svg>
  )
}
