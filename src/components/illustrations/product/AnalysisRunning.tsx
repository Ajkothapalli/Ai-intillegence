export function AnalysisRunning({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <style>{`
        @keyframes spin-arc {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 0.3; r: 4; }
          50% { opacity: 1; r: 6; }
        }
        .spin-arc { animation: spin-arc 1.4s linear infinite; transform-origin: 200px 148px; }
        .dot-1 { animation: pulse-dot 1.2s ease-in-out infinite; }
        .dot-2 { animation: pulse-dot 1.2s ease-in-out 0.4s infinite; }
        .dot-3 { animation: pulse-dot 1.2s ease-in-out 0.8s infinite; }
      `}</style>

      {/* Background circle */}
      <circle cx="200" cy="148" r="72" fill="#ede9fe" />
      <circle cx="200" cy="148" r="60" fill="white" />

      {/* Spinning progress arc */}
      <g className="spin-arc">
        <circle cx="200" cy="148" r="60" fill="none" stroke="#ddd6fe" strokeWidth="8" />
        <circle cx="200" cy="148" r="60" fill="none" stroke="#7c3aed" strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray="94.25 282.74"
          strokeDashoffset="0"
        />
      </g>

      {/* Brain/AI icon in center */}
      <circle cx="200" cy="148" r="28" fill="#7c3aed" />
      <path d="M192 140 Q192 132 200 132 Q208 132 208 140" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
      <circle cx="192" cy="144" r="6" fill="none" stroke="white" strokeWidth="2" />
      <circle cx="208" cy="144" r="6" fill="none" stroke="white" strokeWidth="2" />
      <path d="M192 150 Q196 156 200 156 Q204 156 208 150" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
      <line x1="200" y1="132" x2="200" y2="128" stroke="white" strokeWidth="2" strokeLinecap="round" />

      {/* Processing dots */}
      <circle className="dot-1" cx="160" cy="220" r="5" fill="#7c3aed" />
      <circle className="dot-2" cx="200" cy="220" r="5" fill="#7c3aed" />
      <circle className="dot-3" cx="240" cy="220" r="5" fill="#7c3aed" />

      {/* Labels */}
      <rect x="140" y="230" width="120" height="18" rx="9" fill="#f8fafc" />
      <rect x="152" y="235" width="96" height="8" rx="4" fill="#ddd6fe" />

      {/* Floating data particles */}
      <circle cx="80" cy="100" r="5" fill="#7c3aed" opacity="0.3" />
      <circle cx="68" cy="130" r="3" fill="#7c3aed" opacity="0.2" />
      <circle cx="320" cy="90" r="4" fill="#7c3aed" opacity="0.3" />
      <circle cx="336" cy="120" r="6" fill="#ddd6fe" opacity="0.6" />
      <circle cx="348" cy="148" r="3" fill="#7c3aed" opacity="0.2" />
    </svg>
  )
}
