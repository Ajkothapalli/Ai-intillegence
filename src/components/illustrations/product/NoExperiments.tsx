export function NoExperiments({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      {/* Floor */}
      <ellipse cx="200" cy="272" rx="155" ry="14" fill="#e2e8f0" />

      {/* Flask / beaker */}
      <path d="M170 80 L170 168 Q148 198 148 220 Q148 244 200 244 Q252 244 252 220 Q252 198 230 168 L230 80 Z" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" />
      <path d="M160 80 L240 80" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
      {/* Flask neck */}
      <rect x="170" y="80" width="60" height="6" rx="3" fill="#334155" />
      {/* Liquid in flask */}
      <path d="M152 220 Q152 238 200 238 Q248 238 248 220 L234 182 Q216 172 184 182 Z" fill="#ede9fe" />
      {/* Bubbles */}
      <circle cx="182" cy="220" r="5" fill="#7c3aed" opacity="0.3" />
      <circle cx="208" cy="212" r="3" fill="#7c3aed" opacity="0.4" />
      <circle cx="224" cy="224" r="4" fill="#7c3aed" opacity="0.25" />
      {/* Dashed circle (empty state) */}
      <circle cx="200" cy="188" r="24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeDasharray="5 3" />
      <path d="M200 178 L200 198 M190 188 L210 188" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" />

      {/* Figure */}
      <circle cx="330" cy="140" r="20" fill="#fed7aa" />
      <ellipse cx="330" cy="125" rx="20" ry="10" fill="#1e293b" />
      <rect x="310" y="125" width="40" height="12" fill="#1e293b" />
      <circle cx="323" cy="140" r="2.5" fill="#1e293b" />
      <circle cx="337" cy="140" r="2.5" fill="#1e293b" />
      <path d="M323 149 Q330 153 337 149" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <rect x="310" y="158" width="40" height="52" rx="14" fill="#334155" />
      {/* Arm holding flask */}
      <path d="M310 174 Q290 180 276 190" stroke="#fed7aa" strokeWidth="9" strokeLinecap="round" fill="none" />
      <path d="M350 174 Q362 186 360 198" stroke="#fed7aa" strokeWidth="9" strokeLinecap="round" fill="none" />
      <rect x="314" y="206" width="12" height="34" rx="6" fill="#1e293b" />
      <rect x="330" y="206" width="12" height="34" rx="6" fill="#1e293b" />
      <ellipse cx="320" cy="240" rx="10" ry="5" fill="#0f172a" />
      <ellipse cx="336" cy="240" rx="10" ry="5" fill="#0f172a" />
    </svg>
  )
}
