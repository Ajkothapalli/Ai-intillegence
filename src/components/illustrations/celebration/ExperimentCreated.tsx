export function ExperimentCreated({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <style>{`
        @keyframes pop-star {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.4); opacity: 1; }
        }
        .star-1 { animation: pop-star 1.2s ease-in-out infinite; transform-origin: 72px 80px; }
        .star-2 { animation: pop-star 1.2s ease-in-out 0.4s infinite; transform-origin: 328px 72px; }
        .star-3 { animation: pop-star 1.2s ease-in-out 0.8s infinite; transform-origin: 344px 200px; }
      `}</style>

      {/* Floor */}
      <ellipse cx="200" cy="272" rx="160" ry="14" fill="#e2e8f0" />

      {/* Flask success */}
      <path d="M170 80 L170 168 Q148 198 148 220 Q148 244 200 244 Q252 244 252 220 Q252 198 230 168 L230 80 Z" fill="#f8fafc" stroke="#7c3aed" strokeWidth="2.5" />
      <path d="M160 80 L240 80" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
      <rect x="170" y="80" width="60" height="6" rx="3" fill="#334155" />
      {/* Liquid */}
      <path d="M152 220 Q152 238 200 238 Q248 238 248 220 L234 182 Q216 172 184 182 Z" fill="#7c3aed" opacity="0.8" />
      {/* Bubbles rising */}
      <circle cx="190" cy="200" r="6" fill="#ede9fe" opacity="0.8" />
      <circle cx="210" cy="188" r="4" fill="#ede9fe" opacity="0.6" />
      <circle cx="198" cy="172" r="3" fill="#ede9fe" opacity="0.5" />

      {/* Checkmark on flask */}
      <circle cx="200" cy="152" r="22" fill="#7c3aed" />
      <path d="M190 152 L197 160 L212 142" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />

      {/* Confetti dots */}
      <circle className="star-1" cx="72" cy="80" r="8" fill="#fbbf24" />
      <circle className="star-2" cx="328" cy="72" r="7" fill="#10b981" />
      <circle className="star-3" cx="344" cy="200" r="6" fill="#f43f5e" />
      <circle cx="64" cy="160" r="5" fill="#7c3aed" opacity="0.5" />
      <circle cx="340" cy="140" r="4" fill="#fbbf24" opacity="0.5" />
      <rect x="52" y="110" width="10" height="10" rx="2" fill="#10b981" opacity="0.4" transform="rotate(20 57 115)" />
      <rect x="346" y="170" width="8" height="8" rx="2" fill="#f43f5e" opacity="0.4" transform="rotate(-15 350 174)" />
    </svg>
  )
}
