import type { Platform } from '../types'

export function PlatformLogo({ platform, color, className = 'w-10 h-10' }: { platform: Platform; color: string; className?: string }) {
  switch (platform) {
    case 'mixpanel':
      return (
        <svg viewBox="0 0 40 40" fill="none" className={className}>
          <circle cx="10" cy="20" r="6" fill={color} opacity=".9"/>
          <circle cx="30" cy="20" r="6" fill={color} opacity=".5"/>
          <circle cx="20" cy="12" r="6" fill={color} opacity=".7"/>
          <circle cx="20" cy="28" r="6" fill={color} opacity=".4"/>
        </svg>
      )
    case 'amplitude':
      return (
        <svg viewBox="0 0 40 40" fill="none" className={className}>
          <path d="M4 30l8-16 5 10 4-8 5 10 4-8 6 12" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    case 'ga4':
      return (
        <svg viewBox="0 0 40 40" fill="none" className={className}>
          <rect x="6" y="22" width="8" height="12" rx="2" fill="#f9ab00"/>
          <rect x="16" y="14" width="8" height="20" rx="2" fill="#e37400"/>
          <rect x="26" y="6" width="8" height="28" rx="2" fill="#e37400" opacity=".6"/>
        </svg>
      )
    case 'posthog':
      return (
        <svg viewBox="0 0 40 40" fill="none" className={className}>
          <path d="M20 6C12.27 6 6 12.27 6 20s6.27 14 14 14 14-6.27 14-14S27.73 6 20 6z" fill={color} opacity=".12"/>
          <path d="M14 20a6 6 0 1112 0" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
          <circle cx="20" cy="20" r="3" fill={color}/>
          <path d="M20 14v-4M26 17l3-3M14 17l-3-3" stroke={color} strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    case 'heap':
      return (
        <svg viewBox="0 0 40 40" fill="none" className={className}>
          <rect x="6" y="6" width="12" height="12" rx="3" fill={color} opacity=".8"/>
          <rect x="22" y="6" width="12" height="12" rx="3" fill={color} opacity=".5"/>
          <rect x="6" y="22" width="12" height="12" rx="3" fill={color} opacity=".5"/>
          <rect x="22" y="22" width="12" height="12" rx="3" fill={color} opacity=".3"/>
        </svg>
      )
    case 'segment':
      return (
        <svg viewBox="0 0 40 40" fill="none" className={className}>
          <circle cx="20" cy="20" r="10" stroke={color} strokeWidth="2.5" fill="none"/>
          <path d="M13 20h14M20 13v14" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
      )
    case 'pendo':
      return (
        <svg viewBox="0 0 40 40" fill="none" className={className}>
          <path d="M10 8h12a8 8 0 010 16H10V8z" fill={color} opacity=".8"/>
          <path d="M10 24v8" stroke={color} strokeWidth="3" strokeLinecap="round"/>
        </svg>
      )
    case 'hotjar':
      return (
        <svg viewBox="0 0 40 40" fill="none" className={className}>
          <path d="M20 6c-3 6-8 8-8 14a8 8 0 0016 0c0-4-2-7-4-10-1 3-2 5-4 6z" fill={color} opacity=".85"/>
        </svg>
      )
    case 'logrocket':
      return (
        <svg viewBox="0 0 40 40" fill="none" className={className}>
          <rect x="6" y="10" width="28" height="20" rx="4" stroke={color} strokeWidth="2.5" fill="none"/>
          <circle cx="14" cy="20" r="3" fill={color}/>
          <path d="M20 17v6M26 17v6" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
      )
    case 'google_sheets':
      return (
        <svg viewBox="0 0 40 40" fill="none" className={className}>
          <rect width="40" height="40" rx="8" fill="#34a853"/>
          {/* white sheet with folded corner */}
          <path d="M10 6h14l6 6v22a2 2 0 01-2 2H10a2 2 0 01-2-2V8a2 2 0 012-2z" fill="white" opacity=".95"/>
          <path d="M24 6l6 6h-6V6z" fill="#34a853" opacity=".4"/>
          {/* grid */}
          <path d="M10 16h20M10 22h20M10 28h20M17 11v22M23 11v22" stroke="#34a853" strokeWidth="1.3" opacity=".6"/>
        </svg>
      )
    case 'google_docs':
      return (
        <svg viewBox="0 0 40 40" fill="none" className={className}>
          <rect width="40" height="40" rx="8" fill="#4285f4"/>
          {/* white page with folded corner */}
          <path d="M10 6h14l6 6v22a2 2 0 01-2 2H10a2 2 0 01-2-2V8a2 2 0 012-2z" fill="white" opacity=".95"/>
          <path d="M24 6l6 6h-6V6z" fill="#4285f4" opacity=".4"/>
          {/* text lines */}
          <path d="M13 18h14M13 23h14M13 28h10" stroke="#4285f4" strokeWidth="2" strokeLinecap="round" opacity=".7"/>
        </svg>
      )
    case 'google_slides':
      return (
        <svg viewBox="0 0 40 40" fill="none" className={className}>
          <rect width="40" height="40" rx="8" fill="#fbbc05"/>
          {/* slide canvas */}
          <rect x="5" y="10" width="30" height="20" rx="2" fill="white" opacity=".95"/>
          {/* inner slide content suggestion */}
          <rect x="9" y="14" width="10" height="8" rx="1" fill="#fbbc05" opacity=".4"/>
          <path d="M22 16h9M22 20h7M22 24h9" stroke="#fbbc05" strokeWidth="1.5" strokeLinecap="round" opacity=".6"/>
          {/* bottom bar */}
          <rect x="16" y="32" width="8" height="2" rx="1" fill="white" opacity=".7"/>
          <rect x="17" y="30" width="6" height="2" rx="1" fill="white" opacity=".5"/>
        </svg>
      )
    case 'excel':
      return (
        <svg viewBox="0 0 40 40" fill="none" className={className}>
          <rect width="40" height="40" rx="8" fill="#217346"/>
          {/* Stylised X in white */}
          <path d="M11 11l18 18M29 11L11 29" stroke="white" strokeWidth="5" strokeLinecap="round"/>
          {/* subtle grid overlay for spreadsheet feel */}
          <path d="M20 8v24M8 20h24" stroke="white" strokeWidth="1.2" opacity=".2" strokeLinecap="round"/>
        </svg>
      )
    case 'word':
      return (
        <svg viewBox="0 0 40 40" fill="none" className={className}>
          <rect width="40" height="40" rx="8" fill="#2b579a"/>
          {/* Stylised W in white */}
          <path d="M7 12l5 16 8-10 8 10 5-16" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    case 'powerpoint':
      return (
        <svg viewBox="0 0 40 40" fill="none" className={className}>
          <rect width="40" height="40" rx="8" fill="#d24726"/>
          {/* Stylised P in white — stem + bowl */}
          <path d="M12 10h12a8 8 0 010 16H12V10z" fill="white" opacity=".95"/>
          <path d="M12 26v6" stroke="white" strokeWidth="4" strokeLinecap="round"/>
          {/* inner cutout to make it look like a P */}
          <circle cx="20" cy="18" r="4" fill="#d24726"/>
        </svg>
      )
    case 'pdf':
      return (
        <svg viewBox="0 0 40 40" fill="none" className={className}>
          <rect width="40" height="40" rx="8" fill="#e44d26"/>
          <text x="20" y="26" textAnchor="middle" fill="white" fontSize="13" fontWeight="700" fontFamily="Arial,sans-serif">PDF</text>
        </svg>
      )
  }
}
