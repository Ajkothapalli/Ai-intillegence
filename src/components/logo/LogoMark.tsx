export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Experiment Intelligence"
      role="img"
    >
      {/* Flask neck — two vertical walls */}
      <rect x="15" y="3" width="10" height="2.5" rx="1.25" fill="#7c3aed"/>
      <rect x="16.5" y="5" width="3" height="8" fill="#7c3aed"/>
      <rect x="20.5" y="5" width="3" height="8" fill="#7c3aed"/>
      {/* Flask shoulder — angled sides spreading outward */}
      <path
        d="M16.5 13 L8 26 Q6.5 36 20 36 Q33.5 36 32 26 L23.5 13 Z"
        fill="#7c3aed"
      />
      {/* Flask neck opening — top bar */}
      <rect x="14" y="2" width="12" height="3.5" rx="1.75" fill="#6d28d9"/>
      {/* Inner liquid fill — lighter violet sits inside flask body */}
      <path
        d="M17.5 16 L11 26.5 Q10 33 20 33 Q30 33 29 26.5 L22.5 16 Z"
        fill="#6d28d9"
        opacity="0.4"
      />
      {/* Sparkline inside flask — upward trend */}
      <polyline
        points="12,28 16,22 20,25 25,17"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Dots on sparkline */}
      <circle cx="12" cy="28" r="2" fill="#ffffff"/>
      <circle cx="20" cy="25" r="2" fill="#ffffff"/>
      <circle cx="25" cy="17" r="2" fill="#ffffff"/>
      {/* Highlight — small reflection on flask left wall */}
      <path
        d="M11.5 20 Q10.5 25 11 29"
        stroke="#ffffff"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.3"
        fill="none"
      />
    </svg>
  )
}
