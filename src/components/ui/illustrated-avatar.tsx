// Deterministic illustrated avatar — picks one of 10 characters based on a seed string.

function hashSeed(str: string): number {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(31, h) + str.charCodeAt(i) | 0
  }
  return Math.abs(h)
}

// ── 10 hand-crafted character SVGs (64×64 viewBox) ────────────────────────────

const CHARACTERS = [

  // 0 — Amber / short brown hair / warm skin
  <g key="0">
    <circle cx="32" cy="32" r="32" fill="#F59E0B"/>
    <ellipse cx="32" cy="38" rx="14" ry="16" fill="#FED7AA"/>
    <path d="M18 28 Q18 14 32 13 Q46 14 46 28 Q44 20 32 19 Q20 20 18 28Z" fill="#78350F"/>
    <path d="M18 28 Q18 24 20 24 Q20 20 32 19 Q44 20 44 24 Q46 24 46 28 Q44 18 32 17 Q20 18 18 28Z" fill="#92400E"/>
    <circle cx="26" cy="35" r="2.5" fill="#1C1917"/>
    <circle cx="38" cy="35" r="2.5" fill="#1C1917"/>
    <circle cx="27.2" cy="33.8" r="0.9" fill="white"/>
    <circle cx="39.2" cy="33.8" r="0.9" fill="white"/>
    <path d="M27 42 Q32 47 37 42" stroke="#92400E" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
  </g>,

  // 1 — Emerald / afro / deep skin
  <g key="1">
    <circle cx="32" cy="32" r="32" fill="#10B981"/>
    <ellipse cx="32" cy="39" rx="13" ry="14" fill="#92400E"/>
    <circle cx="32" cy="22" r="17" fill="#1C1917"/>
    <ellipse cx="32" cy="29" rx="9" ry="6" fill="#92400E"/>
    <circle cx="26" cy="36" r="2.5" fill="#1C1917"/>
    <circle cx="38" cy="36" r="2.5" fill="#1C1917"/>
    <circle cx="27.2" cy="34.8" r="0.8" fill="white"/>
    <circle cx="39.2" cy="34.8" r="0.8" fill="white"/>
    <path d="M27 43 Q32 48 37 43" stroke="#1C1917" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
  </g>,

  // 2 — Sky blue / blonde straight / light skin
  <g key="2">
    <circle cx="32" cy="32" r="32" fill="#38BDF8"/>
    <ellipse cx="32" cy="38" rx="14" ry="16" fill="#FEF3C7"/>
    <path d="M18 30 Q18 14 32 13 Q46 14 46 30" fill="#D97706"/>
    <path d="M18 30 Q16 36 17 42" fill="#D97706"/>
    <path d="M46 30 Q48 36 47 42" fill="#D97706"/>
    <circle cx="26" cy="35" r="2.2" fill="#1C1917"/>
    <circle cx="38" cy="35" r="2.2" fill="#1C1917"/>
    <circle cx="27" cy="34" r="0.8" fill="white"/>
    <circle cx="39" cy="34" r="0.8" fill="white"/>
    <path d="M28 42 Q32 46 36 42" stroke="#9A3412" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <circle cx="26" cy="40" r="1.2" fill="#FCA5A5" opacity="0.7"/>
    <circle cx="38" cy="40" r="1.2" fill="#FCA5A5" opacity="0.7"/>
  </g>,

  // 3 — Violet / bun / medium skin
  <g key="3">
    <circle cx="32" cy="32" r="32" fill="#8B5CF6"/>
    <ellipse cx="32" cy="39" rx="13" ry="15" fill="#FBBF7C"/>
    <path d="M19 30 Q19 16 32 15 Q45 16 45 30 Q43 22 32 21 Q21 22 19 30Z" fill="#1C1917"/>
    <circle cx="32" cy="13" r="7" fill="#1C1917"/>
    <circle cx="26" cy="36" r="2.4" fill="#1C1917"/>
    <circle cx="38" cy="36" r="2.4" fill="#1C1917"/>
    <circle cx="27" cy="35" r="0.9" fill="white"/>
    <circle cx="39" cy="35" r="0.9" fill="white"/>
    <path d="M27 43 Q32 48 37 43" stroke="#78350F" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
    {/* earrings */}
    <circle cx="19" cy="38" r="2" fill="#F0ABFC"/>
    <circle cx="45" cy="38" r="2" fill="#F0ABFC"/>
  </g>,

  // 4 — Rose / wavy auburn / light freckles
  <g key="4">
    <circle cx="32" cy="32" r="32" fill="#F43F5E"/>
    <ellipse cx="32" cy="38" rx="14" ry="16" fill="#FDDCB5"/>
    <path d="M18 28 Q20 14 32 13 Q44 14 46 28 Q43 22 32 21 Q21 22 18 28Z" fill="#B45309"/>
    <path d="M18 28 Q16 36 18 44 Q20 48 22 46 Q20 38 19 32" fill="#B45309"/>
    <path d="M46 28 Q48 36 46 44 Q44 48 42 46 Q44 38 45 32" fill="#B45309"/>
    <circle cx="26" cy="34" r="2.2" fill="#1C1917"/>
    <circle cx="38" cy="34" r="2.2" fill="#1C1917"/>
    <circle cx="27" cy="33" r="0.8" fill="white"/>
    <circle cx="39" cy="33" r="0.8" fill="white"/>
    <circle cx="27" cy="40" r="1" fill="#FCA5A5" opacity="0.6"/>
    <circle cx="32" cy="41" r="1" fill="#FCA5A5" opacity="0.6"/>
    <circle cx="37" cy="40" r="1" fill="#FCA5A5" opacity="0.6"/>
    <path d="M28 43 Q32 47 36 43" stroke="#9A3412" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
  </g>,

  // 5 — Teal / braids / warm brown skin
  <g key="5">
    <circle cx="32" cy="32" r="32" fill="#0D9488"/>
    <ellipse cx="32" cy="38" rx="13" ry="15" fill="#D97706"/>
    <path d="M19 28 Q19 15 32 14 Q45 15 45 28 Q43 20 32 19 Q21 20 19 28Z" fill="#1C1917"/>
    {/* braids */}
    <path d="M19 28 Q17 36 19 46 Q20 50 22 49 Q20 40 20 32" fill="#1C1917"/>
    <path d="M45 28 Q47 36 45 46 Q44 50 42 49 Q44 40 44 32" fill="#1C1917"/>
    <ellipse cx="20.5" cy="46" rx="2" ry="3" fill="#1C1917"/>
    <ellipse cx="43.5" cy="46" rx="2" ry="3" fill="#1C1917"/>
    {/* eyes — slight star shape using dots */}
    <circle cx="26" cy="35" r="2.5" fill="#1C1917"/>
    <circle cx="38" cy="35" r="2.5" fill="#1C1917"/>
    <circle cx="27" cy="34" r="0.9" fill="white"/>
    <circle cx="39" cy="34" r="0.9" fill="white"/>
    <path d="M27 43 Q32 48 37 43" stroke="#78350F" strokeWidth="2" fill="none" strokeLinecap="round"/>
  </g>,

  // 6 — Orange / cap / deep skin / confident
  <g key="6">
    <circle cx="32" cy="32" r="32" fill="#EA580C"/>
    <ellipse cx="32" cy="39" rx="13" ry="15" fill="#92400E"/>
    {/* cap brim */}
    <path d="M16 26 Q16 12 32 11 Q48 12 48 26 L50 26 Q50 14 32 13 Q14 14 14 26Z" fill="#1D4ED8"/>
    <rect x="12" y="25" width="40" height="5" rx="2.5" fill="#1D4ED8"/>
    <circle cx="32" cy="18" r="2" fill="#93C5FD"/>
    <circle cx="26" cy="37" r="2.5" fill="#1C1917"/>
    <circle cx="38" cy="37" r="2.5" fill="#1C1917"/>
    <circle cx="27" cy="36" r="0.9" fill="white"/>
    <circle cx="39" cy="36" r="0.9" fill="white"/>
    <path d="M27 44 Q32 48 37 44" stroke="#1C1917" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
  </g>,

  // 7 — Indigo / glasses / light skin / straight hair
  <g key="7">
    <circle cx="32" cy="32" r="32" fill="#6366F1"/>
    <ellipse cx="32" cy="38" rx="14" ry="16" fill="#FEE2E2"/>
    <path d="M18 28 Q18 14 32 13 Q46 14 46 28 Q44 20 32 19 Q20 20 18 28Z" fill="#1E1B4B"/>
    {/* glasses */}
    <circle cx="26" cy="35" r="5" stroke="#1E1B4B" strokeWidth="1.5" fill="none"/>
    <circle cx="38" cy="35" r="5" stroke="#1E1B4B" strokeWidth="1.5" fill="none"/>
    <path d="M31 35 L33 35" stroke="#1E1B4B" strokeWidth="1.5"/>
    <path d="M21 35 L19 33" stroke="#1E1B4B" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M43 35 L45 33" stroke="#1E1B4B" strokeWidth="1.5" strokeLinecap="round"/>
    {/* eyes inside glasses */}
    <circle cx="26" cy="35" r="2" fill="#1E1B4B"/>
    <circle cx="38" cy="35" r="2" fill="#1E1B4B"/>
    <circle cx="26.8" cy="34" r="0.7" fill="white"/>
    <circle cx="38.8" cy="34" r="0.7" fill="white"/>
    <path d="M28 43 Q32 47 36 43" stroke="#9A3412" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
  </g>,

  // 8 — Lime / pigtails / medium skin
  <g key="8">
    <circle cx="32" cy="32" r="32" fill="#84CC16"/>
    <ellipse cx="32" cy="38" rx="13" ry="15" fill="#FDE68A"/>
    <path d="M19 28 Q19 15 32 14 Q45 15 45 28 Q43 20 32 19 Q21 20 19 28Z" fill="#92400E"/>
    {/* pigtails */}
    <circle cx="16" cy="26" r="5" fill="#92400E"/>
    <circle cx="48" cy="26" r="5" fill="#92400E"/>
    <circle cx="26" cy="34" r="2.3" fill="#1C1917"/>
    <circle cx="38" cy="34" r="2.3" fill="#1C1917"/>
    <circle cx="27" cy="33" r="0.8" fill="white"/>
    <circle cx="39" cy="33" r="0.8" fill="white"/>
    <path d="M27 42 Q32 47 37 42" stroke="#78350F" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
    {/* hair ties */}
    <circle cx="16" cy="26" r="2.5" fill="#FDE68A"/>
    <circle cx="48" cy="26" r="2.5" fill="#FDE68A"/>
  </g>,

  // 9 — Slate / beard / deep warm / thoughtful
  <g key="9">
    <circle cx="32" cy="32" r="32" fill="#475569"/>
    <ellipse cx="32" cy="38" rx="13" ry="15" fill="#B45309"/>
    <path d="M19 30 Q19 15 32 14 Q45 15 45 30 Q43 21 32 20 Q21 21 19 30Z" fill="#1C1917"/>
    {/* beard */}
    <path d="M19 42 Q19 52 32 54 Q45 52 45 42 Q42 48 32 49 Q22 48 19 42Z" fill="#1C1917"/>
    <circle cx="26" cy="35" r="2.5" fill="#1C1917"/>
    <circle cx="38" cy="35" r="2.5" fill="#1C1917"/>
    <circle cx="27" cy="34" r="0.9" fill="white"/>
    <circle cx="39" cy="34" r="0.9" fill="white"/>
    <path d="M27 42 Q32 43 37 42" stroke="#1C1917" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
  </g>,

]

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  seed: string          // user email or user ID — used for deterministic selection
  size?: number         // rendered px size, default 32
  className?: string
}

export function IllustratedAvatar({ seed, size = 32, className }: Props) {
  const index = hashSeed(seed) % CHARACTERS.length

  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="User avatar"
      style={{ borderRadius: '50%', display: 'block', flexShrink: 0 }}
    >
      <clipPath id={`avatar-clip-${index}`}>
        <circle cx="32" cy="32" r="32" />
      </clipPath>
      <g clipPath={`url(#avatar-clip-${index})`}>
        {CHARACTERS[index]}
      </g>
    </svg>
  )
}
