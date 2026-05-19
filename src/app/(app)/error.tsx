'use client'

import Link from 'next/link'

interface Props {
  error: Error & { digest?: string }
  reset: () => void
}

export default function AppError({ error, reset }: Props) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center gap-4">
      <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
          <circle cx="11" cy="11" r="10" stroke="#ef4444" strokeWidth="1.5"/>
          <path d="M11 6v6M11 15v1" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
      </div>
      <div>
        <h1 className="text-xl font-bold text-foreground">Something went wrong</h1>
        {error.message && (
          <p className="text-sm text-[var(--foreground-muted)] mt-1 max-w-sm">{error.message}</p>
        )}
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={reset}
          className="inline-flex h-9 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-[var(--primary-hover)] transition-colors"
        >
          Try again
        </button>
        <Link
          href="/dashboard"
          className="text-sm text-[var(--link)] hover:underline"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  )
}
