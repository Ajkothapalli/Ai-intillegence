'use client'

import { useActionState, useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { signIn } from '@/features/auth/actions'
import type { AuthActionResult } from '@/features/auth/types'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { LoginPreview } from '@/app/(auth)/components/LoginPreview'
import { LogoFull } from '@/components/logo'

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

        <LogoFull variant="horizontal" theme="dark" className="mb-12" />

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
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="password" className="text-sm font-medium text-foreground">Password</label>
              <Link href="/forgot-password" className="text-xs text-[var(--link)] hover:underline">
                Forgot password?
              </Link>
            </div>
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
      <div className="hidden lg:flex flex-1 items-center justify-center bg-slate-50 relative overflow-hidden px-10 py-10">
        <div className="absolute top-[-120px] right-[-120px] w-96 h-96 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #196262 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-80px] left-[-80px] w-72 h-72 rounded-full opacity-15" style={{ background: 'radial-gradient(circle, #3bcfcf 0%, transparent 70%)' }} />
        <LoginPreview />
      </div>

    </main>
  )
}
