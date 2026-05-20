export function NoShareLinks({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      {/* Floor */}
      <ellipse cx="200" cy="272" rx="155" ry="14" fill="#e2e8f0" />

      {/* Chain links - broken */}
      <g transform="translate(200, 148)">
        {/* Left link */}
        <rect x="-80" y="-22" width="64" height="44" rx="22" fill="none" stroke="#ddd6fe" strokeWidth="10" />
        <rect x="-80" y="-12" width="64" height="24" rx="0" fill="white" />
        {/* Right link */}
        <rect x="16" y="-22" width="64" height="44" rx="22" fill="none" stroke="#7c3aed" strokeWidth="10" />
        <rect x="16" y="-12" width="64" height="24" rx="0" fill="white" />
        {/* Break gap */}
        <line x1="-16" y1="0" x2="16" y2="0" stroke="white" strokeWidth="16" />
        <line x1="-8" y1="-4" x2="8" y2="4" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* Slash through link icon */}
      <line x1="140" y1="104" x2="260" y2="192" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" opacity="0.3" />

      {/* Share icon attempt */}
      <circle cx="140" cy="104" r="16" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="2" />
      <circle cx="260" cy="104" r="16" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="2" />
      <circle cx="260" cy="192" r="16" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="2" />
      <line x1="154" y1="108" x2="246" y2="108" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="6 4" />
      <line x1="152" y1="114" x2="248" y2="180" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="6 4" />

      {/* Figure */}
      <circle cx="70" cy="184" r="20" fill="#fed7aa" />
      <ellipse cx="70" cy="169" rx="20" ry="10" fill="#1e293b" />
      <rect x="50" y="169" width="40" height="12" fill="#1e293b" />
      <circle cx="63" cy="184" r="2.5" fill="#1e293b" />
      <circle cx="77" cy="184" r="2.5" fill="#1e293b" />
      <path d="M63 193 Q70 197 77 193" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <rect x="50" y="202" width="40" height="48" rx="14" fill="#334155" />
      <path d="M50 218 Q36 228 32 240" stroke="#fed7aa" strokeWidth="9" strokeLinecap="round" fill="none" />
      <path d="M90 218 Q102 230 100 242" stroke="#fed7aa" strokeWidth="9" strokeLinecap="round" fill="none" />
      <rect x="54" y="246" width="12" height="24" rx="6" fill="#1e293b" />
      <rect x="70" y="246" width="12" height="24" rx="6" fill="#1e293b" />
      <ellipse cx="60" cy="270" rx="10" ry="4" fill="#0f172a" />
      <ellipse cx="76" cy="270" rx="10" ry="4" fill="#0f172a" />
    </svg>
  )
}
