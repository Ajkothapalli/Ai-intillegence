export function AnalysisFailed({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      {/* Floor */}
      <ellipse cx="200" cy="272" rx="155" ry="14" fill="#e2e8f0" />

      {/* Broken screen / error terminal */}
      <rect x="100" y="80" width="200" height="140" rx="12" fill="#1e293b" />
      <rect x="108" y="92" width="184" height="116" rx="6" fill="#0f172a" />
      {/* Crack */}
      <path d="M200 80 L194 104 L204 116 L196 140 L200 220" stroke="#ef4444" strokeWidth="1.5" opacity="0.4" fill="none" />

      {/* Error content */}
      <text x="124" y="120" fontSize="11" fill="#ef4444" fontFamily="monospace">ERROR: Analysis failed</text>
      <text x="124" y="136" fontSize="9" fill="#64748b" fontFamily="monospace">timeout: 30000ms exceeded</text>
      <text x="124" y="152" fontSize="9" fill="#64748b" fontFamily="monospace">at processCSV (line 42)</text>
      <text x="124" y="168" fontSize="9" fill="#64748b" fontFamily="monospace">at runAnalysis (line 18)</text>

      {/* Blinking cursor */}
      <rect x="124" y="178" width="8" height="12" rx="1" fill="#7c3aed" opacity="0.8" />

      {/* Stand */}
      <rect x="190" y="220" width="20" height="16" rx="2" fill="#334155" />
      <rect x="168" y="234" width="64" height="8" rx="4" fill="#334155" />

      {/* Figure */}
      <circle cx="330" cy="148" r="20" fill="#fed7aa" />
      <ellipse cx="330" cy="133" rx="20" ry="10" fill="#1e293b" />
      <rect x="310" y="133" width="40" height="12" fill="#1e293b" />
      {/* Worried eyes */}
      <circle cx="323" cy="148" r="2.5" fill="#1e293b" />
      <circle cx="337" cy="148" r="2.5" fill="#1e293b" />
      <path d="M323 158 Q330 155 337 158" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* Worried brow */}
      <path d="M320 143 Q323 140 327 143" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M333 143 Q337 140 340 143" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <rect x="310" y="166" width="40" height="54" rx="14" fill="#334155" />
      <path d="M310 182 Q296 192 292 204" stroke="#fed7aa" strokeWidth="9" strokeLinecap="round" fill="none" />
      <path d="M350 182 Q362 194 360 206" stroke="#fed7aa" strokeWidth="9" strokeLinecap="round" fill="none" />
      <rect x="314" y="216" width="12" height="32" rx="6" fill="#1e293b" />
      <rect x="330" y="216" width="12" height="32" rx="6" fill="#1e293b" />
      <ellipse cx="320" cy="248" rx="10" ry="5" fill="#0f172a" />
      <ellipse cx="336" cy="248" rx="10" ry="5" fill="#0f172a" />

      {/* Warning triangle */}
      <polygon points="60,80 100,80 80,50" fill="#fbbf24" opacity="0.2" />
      <text x="76" y="75" fontSize="20" fill="#fbbf24" opacity="0.4">⚠</text>
    </svg>
  )
}
