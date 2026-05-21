'use client'

import { useActionState, useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { signUp } from '@/features/auth/actions'
import type { AuthActionResult } from '@/features/auth/types'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { SignupPreview } from '@/app/(auth)/components/SignupPreview'
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

const INDUSTRY_OPTIONS = [
  { value: 'saas_b2c',    label: 'SaaS B2C' },
  { value: 'marketplace', label: 'Marketplace' },
  { value: 'ecommerce',   label: 'E-commerce' },
  { value: 'fintech',     label: 'Fintech' },
  { value: 'healthtech',  label: 'Healthtech' },
  { value: 'other',       label: 'Other' },
]

export default function SignupPage() {
  const [state, formAction, isPending] = useActionState<AuthActionResult | null, FormData>(
    signUp,
    null
  )

  const [fullNameValue, setFullNameValue] = useState('')
  const [emailValue, setEmailValue]       = useState('')
  const [passwordValue, setPasswordValue] = useState('')
  const [selectedIndustry, setSelectedIndustry] = useState('')
  const [otherDescription, setOtherDescription] = useState('')
  const [industryError, setIndustryError] = useState(false)

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

  const isOther = selectedIndustry === 'other'

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    if (!selectedIndustry) {
      e.preventDefault()
      setIndustryError(true)
      return
    }
    setIndustryError(false)
  }

  const canSubmit =
    fullNameValue &&
    emailValue &&
    passwordValue &&
    !!selectedIndustry &&
    (!isOther || otherDescription.trim().length > 0)

  return (
    <main className="min-h-screen flex">

      {/* ── Left panel ──────────────────────────────────────────── */}
      <div className="w-full lg:w-[520px] xl:w-[560px] shrink-0 flex flex-col justify-center px-10 py-12 bg-[var(--surface)] overflow-y-auto">

        <LogoFull variant="horizontal" theme="light" className="mb-10" />

        <div className="mb-7">
          <h1 className="text-3xl font-bold text-foreground tracking-tight mb-1">Create account</h1>
          <p className="text-sm text-[var(--foreground-muted)]">Start turning your data into experiments</p>
        </div>

        <form action={formAction} onSubmit={handleSubmit} className="space-y-5">

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

          {/* Industry dropdown */}
          <div>
            <label htmlFor="industrySelect" className="block text-sm font-medium text-foreground mb-1.5">
              What type of product do you build?{' '}
              <span className="text-[var(--rose-600)]">*</span>
            </label>
            <div className="relative">
              <select
                id="industrySelect"
                value={selectedIndustry}
                onChange={e => {
                  setSelectedIndustry(e.target.value)
                  setIndustryError(false)
                  if (e.target.value !== 'other') setOtherDescription('')
                }}
                className={[
                  'w-full appearance-none rounded-lg border px-3.5 py-2.5 pr-9 text-sm bg-[var(--input)] text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30',
                  industryError
                    ? 'border-[var(--rose-500)]'
                    : selectedIndustry
                      ? 'border-[var(--primary)]'
                      : 'border-[var(--border)]',
                ].join(' ')}
              >
                <option value="" disabled>Select your product type…</option>
                {INDUSTRY_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              {/* Chevron icon */}
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </div>
            {industryError && <FieldError message="Please select your product type to continue" />}

            {/* Hidden field carries the key value into formData */}
            <input type="hidden" name="industry" value={selectedIndustry} />
          </div>

          {/* "Other" free-text input — shown only when Other is selected */}
          {isOther && (
            <div>
              <label htmlFor="industryOther" className="block text-sm font-medium text-foreground mb-1.5">
                Describe your product{' '}
                <span className="text-[var(--rose-600)]">*</span>
              </label>
              <Input
                id="industryOther"
                name="industry_custom"
                type="text"
                placeholder="e.g. EdTech platform for K-12 schools"
                value={otherDescription}
                onChange={e => setOtherDescription(e.target.value)}
                required={isOther}
              />
              <p className="text-[11px] text-[var(--foreground-subtle)] mt-1">
                We&apos;ll use this to tailor your demo project.
              </p>
            </div>
          )}

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
            disabled={isPending || !canSubmit}
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
      <div className="hidden lg:flex flex-1 items-center justify-center bg-[var(--background)] relative overflow-hidden px-10 py-10">
        <div className="absolute top-[-120px] right-[-120px] w-96 h-96 rounded-full opacity-30" style={{ background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-80px] left-[-80px] w-72 h-72 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)' }} />
        <SignupPreview />
      </div>

    </main>
  )
}
