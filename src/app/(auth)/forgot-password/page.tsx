'use client'

import { useActionState, useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { requestPasswordReset } from '@/features/auth/actions'
import type { PasswordResetResult } from '@/features/auth/actions'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ForgotPasswordIllustration } from '@/components/illustrations/auth/ForgotPasswordIllustration'

export default function ForgotPasswordPage() {
  const [state, formAction, isPending] = useActionState<PasswordResetResult | null, FormData>(
    requestPasswordReset,
    null,
  )
  const [emailValue, setEmailValue] = useState('')
  const [emailDirty, setEmailDirty] = useState(false)
  const prevState = useRef(state)
  useEffect(() => {
    if (state !== prevState.current) { setEmailDirty(false); prevState.current = state }
  }, [state])

  const error = state && !state.success ? state.error : null
  const showError = !emailDirty && !!error
  const sent = state?.success === true

  return (
    <main className="min-h-screen flex">
      {/* Left panel */}
      <div className="w-full lg:w-[480px] xl:w-[520px] shrink-0 flex flex-col justify-center px-10 py-12 bg-white">
        <div className="flex items-center gap-2.5 mb-12">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-[var(--shadow-primary)]">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M2 8h3M8 2v12M11 5l3 3-3 3" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-sm font-semibold text-foreground tracking-tight">Experiment Intelligence</span>
        </div>

        <div className="bg-white space-y-6">
          {sent ? (
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                  <path d="M3 7l8 6 8-6" stroke="#10b981" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  <rect x="1" y="4" width="20" height="14" rx="3" stroke="#10b981" strokeWidth="1.6"/>
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-foreground">Check your email</h1>
              <p className="text-sm text-[var(--foreground-muted)]">
                We sent a password reset link to <strong>{emailValue}</strong>. Check your inbox and click the link to continue.
              </p>
              <Link href="/login" className="block text-sm text-[var(--link)] hover:underline mt-4">
                Back to sign in
              </Link>
            </div>
          ) : (
            <>
              <div>
                <h1 className="text-3xl font-bold text-foreground tracking-tight mb-1">Forgot password?</h1>
                <p className="text-sm text-[var(--foreground-muted)]">
                  Enter your email and we&apos;ll send you a reset link.
                </p>
              </div>

              <form action={formAction} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="you@company.com"
                    value={emailValue}
                    error={showError}
                    onChange={e => { setEmailValue(e.target.value); setEmailDirty(true) }}
                  />
                  {showError && (
                    <p className="text-xs text-[var(--rose-600)] mt-1.5">{error}</p>
                  )}
                </div>

                <Button type="submit" disabled={isPending || !emailValue} className="w-full" size="lg">
                  {isPending ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                      Sending…
                    </span>
                  ) : 'Send reset link'}
                </Button>
              </form>

              <p className="text-sm text-[var(--foreground-muted)]">
                <Link href="/login" className="text-[var(--link)] hover:underline font-medium">
                  Back to sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>

      {/* Right panel */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-[var(--forest-50)] relative overflow-hidden px-10 py-10">
        <div className="absolute top-[-80px] right-[-80px] w-72 h-72 rounded-full border-2 border-dashed border-[var(--forest-200)] opacity-50" />
        <div className="absolute bottom-[-60px] left-[-60px] w-52 h-52 rounded-full border-2 border-dashed border-[var(--forest-200)] opacity-50" />
        <div className="flex flex-col items-center gap-6 max-w-sm">
          <ForgotPasswordIllustration className="w-80 h-60" />
          <p className="text-center text-sm text-slate-500 italic">Don&apos;t worry — it happens to the best of us. We&apos;ll get you back in.</p>
        </div>
      </div>
    </main>
  )
}
