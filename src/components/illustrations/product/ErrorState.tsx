export function ErrorState({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      {/* Floor */}
      <ellipse cx="200" cy="272" rx="155" ry="14" fill="#e2e8f0" />

      {/* Broken window / error screen */}
      <rect x="90" y="70" width="220" height="160" rx="12" fill="#1e293b" />
      <rect x="98" y="82" width="204" height="136" rx="6" fill="#0f172a" />

      {/* Crack pattern */}
      <path d="M200 82 L188 118 L202 130 L192 166 L200 230" stroke="#ef4444" strokeWidth="1" opacity="0.5" fill="none" />
      <path d="M188 118 L166 108" stroke="#ef4444" strokeWidth="1" opacity="0.3" fill="none" />
      <path d="M202 130 L228 122" stroke="#ef4444" strokeWidth="1" opacity="0.3" fill="none" />

      {/* X icon */}
      <circle cx="200" cy="124" r="26" fill="#ef4444" opacity="0.15" />
      <circle cx="200" cy="124" r="20" fill="#ef4444" opacity="0.2" />
      <line x1="190" y1="114" x2="210" y2="134" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
      <line x1="210" y1="114" x2="190" y2="134" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />

      {/* Error code */}
      <text x="148" y="162" fontSize="10" fill="#ef4444" fontFamily="monospace" opacity="0.8">500 Internal Error</text>
      <text x="156" y="176" fontSize="8" fill="#64748b" fontFamily="monospace">Something went wrong</text>

      {/* Monitor stand */}
      <rect x="190" y="230" width="20" height="14" rx="2" fill="#334155" />
      <rect x="170" y="242" width="60" height="8" rx="4" fill="#334155" />

      {/* Figure with hands up (frustrated) */}
      <circle cx="330" cy="136" r="20" fill="#fed7aa" />
      <ellipse cx="330" cy="121" rx="20" ry="10" fill="#1e293b" />
      <rect x="310" y="121" width="40" height="12" fill="#1e293b" />
      <circle cx="323" cy="136" r="2.5" fill="#1e293b" />
      <circle cx="337" cy="136" r="2.5" fill="#1e293b" />
      {/* Open mouth / frustrated */}
      <path d="M323 148 Q330 144 337 148" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <rect x="310" y="154" width="40" height="52" rx="14" fill="#334155" />
      {/* Arms raised in frustration */}
      <path d="M310 166 Q290 152 278 140" stroke="#fed7aa" strokeWidth="9" strokeLinecap="round" fill="none" />
      <path d="M350 166 Q370 152 382 140" stroke="#fed7aa" strokeWidth="9" strokeLinecap="round" fill="none" />
      <rect x="314" y="202" width="12" height="32" rx="6" fill="#1e293b" />
      <rect x="330" y="202" width="12" height="32" rx="6" fill="#1e293b" />
      <ellipse cx="320" cy="234" rx="10" ry="5" fill="#0f172a" />
      <ellipse cx="336" cy="234" rx="10" ry="5" fill="#0f172a" />
    </svg>
  )
}
