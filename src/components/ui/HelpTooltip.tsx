import { Tooltip } from './tooltip'
import type { ReactNode } from 'react'

interface Props {
  content: ReactNode
  side?: 'top' | 'bottom' | 'left' | 'right'
}

export function HelpTooltip({ content, side = 'top' }: Props) {
  return (
    <Tooltip content={content} side={side}>
      <button
        type="button"
        tabIndex={0}
        aria-label="More information"
        className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
      >
        <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden="true">
          <circle cx="4.5" cy="4.5" r="4" stroke="currentColor" strokeWidth="1"/>
          <path d="M4.5 2.5c-.55 0-1 .45-1 1h.7c0-.17.13-.3.3-.3s.3.13.3.3c0 .4-.7.5-.7 1.2h.7c0-.5.7-.7.7-1.2 0-.55-.45-1-1-1zm-.35 3.1v.8h.7v-.8h-.7z" fill="currentColor"/>
        </svg>
      </button>
    </Tooltip>
  )
}
