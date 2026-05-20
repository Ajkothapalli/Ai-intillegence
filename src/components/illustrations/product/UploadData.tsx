export function UploadData({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <style>{`
        @keyframes float-up {
          0%, 100% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(-10px); opacity: 0.6; }
        }
        .doc-float { animation: float-up 1.8s ease-in-out infinite; transform-origin: 200px 180px; }
        .doc-float-2 { animation: float-up 1.8s ease-in-out 0.4s infinite; transform-origin: 200px 180px; }
      `}</style>

      {/* Floor */}
      <ellipse cx="200" cy="272" rx="160" ry="14" fill="#e2e8f0" />

      {/* Upload box */}
      <rect x="100" y="130" width="200" height="120" rx="12" fill="#f8fafc" stroke="#7c3aed" strokeWidth="2" strokeDasharray="8 4" />

      {/* Upload arrow */}
      <path d="M200 210 L200 170" stroke="#7c3aed" strokeWidth="3" strokeLinecap="round" />
      <path d="M186 182 L200 168 L214 182" stroke="#7c3aed" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />

      {/* Cloud */}
      <ellipse cx="200" cy="158" rx="28" ry="18" fill="#ede9fe" />
      <ellipse cx="178" cy="164" rx="16" ry="14" fill="#ede9fe" />
      <ellipse cx="222" cy="164" rx="16" ry="14" fill="#ede9fe" />

      {/* Floating CSV document */}
      <g className="doc-float">
        <rect x="66" y="128" width="52" height="66" rx="6" fill="white" stroke="#e2e8f0" strokeWidth="1.5" />
        <path d="M100 128 L118 128 L118 146 L100 146 Z" fill="#ddd6fe" />
        <path d="M100 128 L100 146 L118 146" stroke="#c4b5fd" strokeWidth="1" fill="none" />
        <rect x="74" y="152" width="36" height="4" rx="2" fill="#e2e8f0" />
        <rect x="74" y="162" width="28" height="4" rx="2" fill="#e2e8f0" />
        <rect x="74" y="172" width="32" height="4" rx="2" fill="#e2e8f0" />
        <text x="76" y="144" fontSize="9" fill="#7c3aed" fontWeight="bold">.CSV</text>
      </g>

      {/* Floating image document */}
      <g className="doc-float-2">
        <rect x="280" y="124" width="52" height="66" rx="6" fill="white" stroke="#e2e8f0" strokeWidth="1.5" />
        <rect x="280" y="124" width="52" height="28" rx="6" fill="#ddd6fe" />
        <rect x="280" y="140" width="52" height="12" fill="#ddd6fe" />
        <circle cx="294" cy="135" r="6" fill="#c4b5fd" />
        <path d="M284 152 Q296 144 308 150 Q320 156 332 148" stroke="#e2e8f0" strokeWidth="1" fill="none" />
        <rect x="288" y="158" width="36" height="4" rx="2" fill="#e2e8f0" />
        <rect x="288" y="168" width="28" height="4" rx="2" fill="#e2e8f0" />
        <text x="284" y="182" fontSize="9" fill="#7c3aed" fontWeight="bold">.PNG</text>
      </g>
    </svg>
  )
}
