'use client'

import { useActionState, useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { signIn } from '@/features/auth/actions'
import type { AuthActionResult } from '@/features/auth/types'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { LoginPreview } from '@/app/(auth)/components/LoginPreview'

function FieldError({ message }: { message: string }) {
  return (
    <p className="flex items-center gap-1.5 text-xs text-[var(--rose-600)] mt-1.5">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" className="shrink-0">
        <circle cx="6" cy="6" r="5.5" stroke="currentColor" />
        <path d="M6 3.5v3M6 8v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
      {message}
    </p>
  )
}

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState<AuthActionResult | null, FormData>(
    signIn,
    null
  )

  const [emailValue, setEmailValue]       = useState('')
  const [passwordValue, setPasswordValue] = useState('')

  // Clear a field's error as soon as the user edits that field after a submission
  const [emailDirty, setEmailDirty]       = useState(false)
  const [passwordDirty, setPasswordDirty] = useState(false)
  const prevState = useRef(state)
  useEffect(() => {
    if (state !== prevState.current) {
      setEmailDirty(false)
      setPasswordDirty(false)
      prevState.current = state
    }
  }, [state])

  const error = state && !state.success ? state : null
  const emailError    = !emailDirty    && error?.field === 'email'    ? error.error : null
  const passwordError = !passwordDirty && error?.field === 'password' ? error.error : null
  const formError     = error?.field === 'form' ? error.error : null

  return (
    <main className="min-h-screen flex">

      {/* ── Left panel ──────────────────────────────────────────── */}
      <div className="w-full lg:w-[480px] xl:w-[520px] shrink-0 flex flex-col justify-center px-10 py-12 bg-white">

        <div className="flex items-center gap-2.5 mb-12">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-[var(--shadow-primary)]">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M2 8h3M8 2v12M11 5l3 3-3 3" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-sm font-semibold text-foreground tracking-tight">Experiment Intelligence</span>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground tracking-tight mb-1">Welcome back</h1>
          <p className="text-sm text-[var(--foreground-muted)]">Sign in to your account to continue</p>
        </div>

        <form action={formAction} className="space-y-5">

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">Email</label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@company.com"
              value={emailValue}
              error={!!emailError}
              onChange={e => { setEmailValue(e.target.value); setEmailDirty(true) }}
            />
            {emailError && <FieldError message={emailError} />}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1.5">Password</label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="••••••••"
              value={passwordValue}
              error={!!passwordError}
              onChange={e => { setPasswordValue(e.target.value); setPasswordDirty(true) }}
            />
            {passwordError && <FieldError message={passwordError} />}
          </div>

          {formError && (
            <p className="flex items-center gap-1.5 text-xs text-[var(--rose-600)]">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" className="shrink-0">
                <circle cx="6" cy="6" r="5.5" stroke="currentColor" />
                <path d="M6 3.5v3M6 8v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              {formError}
            </p>
          )}

          <Button
            type="submit"
            disabled={isPending || !emailValue || !passwordValue}
            className="w-full"
            size="lg"
          >
            {isPending ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                Signing in…
              </span>
            ) : 'Sign in'}
          </Button>

        </form>

        <p className="mt-6 text-sm text-center text-[var(--foreground-muted)]">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-[var(--link)] hover:text-[var(--link-hover)] hover:underline font-semibold transition-colors">
            Create account
          </Link>
        </p>
      </div>

      {/* ── Right panel ─────────────────────────────────────────── */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-[var(--forest-50)] relative overflow-hidden px-10 py-10">
        <div className="absolute top-[-80px] right-[-80px] w-72 h-72 rounded-full border-2 border-dashed border-[var(--forest-200)] opacity-50" />
        <div className="absolute bottom-[-60px] left-[-60px] w-52 h-52 rounded-full border-2 border-dashed border-[var(--forest-200)] opacity-50" />
        <LoginPreview />
      </div>

    </main>
  )
}
