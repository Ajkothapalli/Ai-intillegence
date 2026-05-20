'use client'

import { useState, useRef, useEffect } from 'react'
import { toast } from 'sonner'

interface Props {
  analysisId: string
}

export function ExportMenu({ analysisId }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleExport(format: 'pdf' | 'csv') {
    setOpen(false)
    const toastId = toast.loading('Preparing export…')
    setTimeout(() => {
      window.location.href = `/api/export/${analysisId}/${format}`
      toast.dismiss(toastId)
      toast.success('Download started')
    }, 300)
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-[var(--border)] text-xs font-medium text-[var(--foreground-muted)] hover:text-foreground hover:bg-slate-50 transition-colors"
      >
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
          <path d="M6.5 1v8M3.5 6l3 3 3-3M1.5 11h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Export
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className={`transition-transform ${open ? 'rotate-180' : ''}`}>
          <path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-xl border border-[var(--border)] shadow-lg z-20 overflow-hidden">
          <button
            onClick={() => handleExport('pdf')}
            className="flex items-center gap-2 w-full px-3 py-2.5 text-xs text-foreground hover:bg-slate-50 transition-colors text-left"
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="text-red-500">
              <rect x="1.5" y="1" width="10" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
              <path d="M4 5.5h5M4 7.5h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            Export as PDF
          </button>
          <button
            onClick={() => handleExport('csv')}
            className="flex items-center gap-2 w-full px-3 py-2.5 text-xs text-foreground hover:bg-slate-50 transition-colors text-left border-t border-[var(--border)]"
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="text-emerald-600">
              <rect x="1.5" y="1" width="10" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
              <path d="M4 4.5h5M4 6.5h5M4 8.5h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            Export as CSV
          </button>
        </div>
      )}
    </div>
  )
}
