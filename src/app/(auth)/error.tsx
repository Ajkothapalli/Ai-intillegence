'use client'

import Link from 'next/link'

interface Props {
  error: Error & { digest?: string }
  reset: () => void
}

export default function AuthError({ error, reset }: Props) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--forest-50)] px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl border border-[var(--border)] shadow-[var(--shadow-md)] p-8 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
            <circle cx="11" cy="11" r="10" stroke="#ef4444" strokeWidth="1.5"/>
            <path d="M11 6v6M11 15v1" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">Something went wrong</h1>
          {error.message && (
            <p className="text-sm text-[var(--foreground-muted)] mt-1">{error.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <button
            onClick={reset}
            className="w-full h-9 rounded-full bg-primary text-sm font-semibold text-primary-foreground hover:bg-[var(--primary-hover)] transition-colors"
          >
            Try again
          </button>
          <Link href="/login" className="text-sm text-[var(--link)] hover:underline">
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
