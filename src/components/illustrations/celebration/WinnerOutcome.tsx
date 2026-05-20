export function WinnerOutcome({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <style>{`
        @keyframes trophy-glow {
          0%, 100% { opacity: 0.4; r: 52; }
          50% { opacity: 0.7; r: 60; }
        }
        @keyframes confetti-fall {
          0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(10px) rotate(30deg); opacity: 0.4; }
        }
        .glow { animation: trophy-glow 1.6s ease-in-out infinite; transform-origin: 200px 160px; }
        .conf-1 { animation: confetti-fall 1s ease-in-out infinite alternate; transform-origin: 80px 80px; }
        .conf-2 { animation: confetti-fall 1s ease-in-out 0.3s infinite alternate; transform-origin: 320px 90px; }
        .conf-3 { animation: confetti-fall 1s ease-in-out 0.6s infinite alternate; transform-origin: 60px 180px; }
      `}</style>

      {/* Glow */}
      <circle className="glow" cx="200" cy="160" r="52" fill="#fbbf24" opacity="0.4" />

      {/* Trophy */}
      <rect x="176" y="224" width="48" height="12" rx="4" fill="#f59e0b" />
      <rect x="184" y="212" width="32" height="14" rx="3" fill="#fbbf24" />
      {/* Cup body */}
      <path d="M152 120 Q152 196 200 196 Q248 196 248 120 Z" fill="#fbbf24" />
      <path d="M152 120 L248 120" stroke="#f59e0b" strokeWidth="3" />
      {/* Handles */}
      <path d="M152 128 Q128 128 128 148 Q128 168 152 168" stroke="#f59e0b" strokeWidth="8" strokeLinecap="round" fill="none" />
      <path d="M248 128 Q272 128 272 148 Q272 168 248 168" stroke="#f59e0b" strokeWidth="8" strokeLinecap="round" fill="none" />
      {/* Star on trophy */}
      <path d="M200 140 L205 154 L220 154 L208 163 L213 177 L200 168 L187 177 L192 163 L180 154 L195 154 Z" fill="#f59e0b" />
      {/* Shine */}
      <path d="M168 130 Q172 136 168 142" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.5" />

      {/* Confetti */}
      <rect className="conf-1" x="72" y="72" width="12" height="12" rx="2" fill="#7c3aed" opacity="0.7" />
      <rect className="conf-2" x="314" y="82" width="10" height="10" rx="2" fill="#10b981" opacity="0.7" />
      <circle className="conf-3" cx="60" cy="180" r="7" fill="#f43f5e" opacity="0.7" />
      <circle cx="340" cy="160" r="6" fill="#fbbf24" opacity="0.5" />
      <rect x="56" y="130" width="8" height="8" rx="1" fill="#10b981" opacity="0.4" transform="rotate(15 60 134)" />
      <rect x="344" y="200" width="8" height="8" rx="1" fill="#7c3aed" opacity="0.4" transform="rotate(-20 348 204)" />
      <circle cx="80" cy="220" r="5" fill="#fbbf24" opacity="0.4" />
      <circle cx="320" cy="210" r="4" fill="#f43f5e" opacity="0.4" />

      {/* Floor */}
      <ellipse cx="200" cy="272" rx="130" ry="10" fill="#e2e8f0" />
    </svg>
  )
}
