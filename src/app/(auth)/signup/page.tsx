'use client'

import { useActionState, useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { signUp } from '@/features/auth/actions'
import type { AuthActionResult } from '@/features/auth/types'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

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

export default function SignupPage() {
  const [state, formAction, isPending] = useActionState<AuthActionResult | null, FormData>(
    signUp,
    null
  )

  const [fullNameValue, setFullNameValue] = useState('')
  const [emailValue, setEmailValue]       = useState('')
  const [passwordValue, setPasswordValue] = useState('')

  const [fullNameDirty, setFullNameDirty] = useState(false)
  const [emailDirty, setEmailDirty]       = useState(false)
  const [passwordDirty, setPasswordDirty] = useState(false)
  const prevState = useRef(state)
  useEffect(() => {
    if (state !== prevState.current) {
      setFullNameDirty(false)
      setEmailDirty(false)
      setPasswordDirty(false)
      prevState.current = state
    }
  }, [state])

  const error = state && !state.success ? state : null
  const fullNameError = !fullNameDirty && error?.field === 'fullName' ? error.error : null
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
          <h1 className="text-3xl font-bold text-foreground tracking-tight mb-1">Create account</h1>
          <p className="text-sm text-[var(--foreground-muted)]">Start turning your data into experiments</p>
        </div>

        <form action={formAction} className="space-y-5">

          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-foreground mb-1.5">Full name</label>
            <Input
              id="fullName"
              name="fullName"
              type="text"
              autoComplete="name"
              required
              placeholder="Jane Smith"
              value={fullNameValue}
              error={!!fullNameError}
              onChange={e => { setFullNameValue(e.target.value); setFullNameDirty(true) }}
            />
            {fullNameError && <FieldError message={fullNameError} />}
          </div>

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
              autoComplete="new-password"
              required
              minLength={8}
              placeholder="At least 8 characters"
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
            disabled={isPending || !fullNameValue || !emailValue || !passwordValue}
            className="w-full"
            size="lg"
          >
            {isPending ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                Creating account…
              </span>
            ) : 'Create account'}
          </Button>

        </form>

        <p className="mt-6 text-sm text-center text-[var(--foreground-muted)]">
          Already have an account?{' '}
          <Link href="/login" className="text-[var(--link)] hover:text-[var(--link-hover)] hover:underline font-semibold transition-colors">
            Sign in
          </Link>
        </p>
      </div>

      {/* ── Right panel ─────────────────────────────────────────── */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-[var(--forest-50)] relative overflow-hidden px-12">
        <div className="absolute top-[-80px] right-[-80px] w-64 h-64 rounded-full border-2 border-dashed border-[var(--forest-200)] opacity-60" />
        <div className="absolute bottom-[-60px] left-[-60px] w-48 h-48 rounded-full border-2 border-dashed border-[var(--forest-200)] opacity-60" />

        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground tracking-tight mb-3">
              From raw data to experiment hypotheses in minutes
            </h2>
            <p className="text-sm text-[var(--foreground-muted)] leading-relaxed">
              Upload your analytics CSV and onboarding screenshots. Our AI generates prioritized, evidence-backed experiment recommendations for your team.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { icon: '📁', title: 'Upload your data', desc: 'CSVs, funnel screenshots, app metadata' },
              { icon: '🤖', title: 'AI analysis', desc: 'Claude reasons over your data to find opportunities' },
              { icon: '💡', title: 'Prioritized recommendations', desc: 'Ranked hypotheses with confidence scores and evidence' },
            ].map((f, i) => (
              <div key={i} className="flex items-start gap-3 bg-white rounded-xl border border-[var(--border)] px-4 py-3 shadow-[var(--shadow-sm)]">
                <span className="text-xl mt-0.5">{f.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-foreground">{f.title}</p>
                  <p className="text-xs text-[var(--foreground-muted)] mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute top-16 right-16 bg-white rounded-full px-3 py-1.5 shadow-[var(--shadow-md)] border border-[var(--border)] flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[var(--forest-400)]" />
          <span className="text-[11px] font-medium text-[var(--foreground-muted)]">AI-powered</span>
        </div>
        <div className="absolute bottom-20 right-10 bg-white rounded-full px-3 py-1.5 shadow-[var(--shadow-md)] border border-[var(--border)] flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <span className="text-[11px] font-medium text-[var(--foreground-muted)]">Evidence-backed</span>
        </div>
      </div>

    </main>
  )
}
