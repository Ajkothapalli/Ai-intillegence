export function StreakMilestone({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <style>{`
        @keyframes flame-flicker {
          0%, 100% { transform: scaleY(1) scaleX(1); }
          33% { transform: scaleY(1.06) scaleX(0.96); }
          66% { transform: scaleY(0.96) scaleX(1.04); }
        }
        .flame { animation: flame-flicker 0.8s ease-in-out infinite; transform-origin: 200px 180px; }
      `}</style>

      {/* Floor */}
      <ellipse cx="200" cy="272" rx="150" ry="12" fill="#e2e8f0" />

      {/* Week calendar strip */}
      {['M','T','W','T','F','S','S'].map((d, i) => (
        <g key={i}>
          <rect x={76 + i * 38} y={60} width={28} height={34} rx={8}
            fill={i < 5 ? '#7c3aed' : '#f1f5f9'}
            stroke={i < 5 ? '#6d28d9' : '#e2e8f0'} strokeWidth="1.5" />
          <text x={90 + i * 38} y={78} fontSize="10" fill={i < 5 ? 'white' : '#94a3b8'}
            textAnchor="middle" fontWeight="600">{d}</text>
          {i < 5 && (
            <path d={`M${82 + i * 38} 82 L${87 + i * 38} 87 L${97 + i * 38} 74`}
              stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          )}
        </g>
      ))}

      {/* Streak number */}
      <text x="200" y="136" fontSize="48" fill="#7c3aed" fontWeight="900" textAnchor="middle" fontFamily="system-ui">5</text>
      <text x="200" y="152" fontSize="11" fill="#6d28d9" textAnchor="middle" fontWeight="600">WEEK STREAK</text>

      {/* Flame */}
      <g className="flame">
        <path d="M200 244 Q180 224 182 200 Q184 180 200 172 Q216 180 218 200 Q220 224 200 244 Z" fill="#f97316" />
        <path d="M200 238 Q186 222 188 204 Q190 190 200 182 Q210 190 212 204 Q214 222 200 238 Z" fill="#fbbf24" />
        <path d="M200 228 Q192 216 194 206 Q196 198 200 194 Q204 198 206 206 Q208 216 200 228 Z" fill="#fef9c3" />
      </g>

      {/* Stars */}
      <path d="M72 160 L75 170 L86 170 L77 177 L80 188 L72 181 L64 188 L67 177 L58 170 L69 170 Z" fill="#fbbf24" opacity="0.6" />
      <path d="M328 148 L331 156 L340 156 L333 161 L336 170 L328 165 L320 170 L323 161 L316 156 L325 156 Z" fill="#fbbf24" opacity="0.6" />
      <circle cx="64" cy="216" r="5" fill="#7c3aed" opacity="0.3" />
      <circle cx="340" cy="220" r="4" fill="#10b981" opacity="0.4" />
    </svg>
  )
}
