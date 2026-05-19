'use client'

import Link from 'next/link'

interface Props {
  error: Error & { digest?: string }
  reset: () => void
}

export default function RootError({ error, reset }: Props) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
            <circle cx="11" cy="11" r="10" stroke="#ef4444" strokeWidth="1.5"/>
            <path d="M11 6v6M11 15v1" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-bold">Something went wrong</h1>
          {error.message && (
            <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">{error.message}</p>
          )}
        </div>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex h-9 items-center rounded-full bg-[#196262] px-5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
          >
            Try again
          </button>
          <Link href="/dashboard" className="text-sm text-[#196262] hover:underline">
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
