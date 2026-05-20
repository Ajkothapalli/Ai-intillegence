'use client'

import { Suspense, useEffect, useState, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'
import { VerifyEmailIllustration } from '@/components/illustrations/auth/VerifyEmailIllustration'

const COOLDOWN_SECONDS = 60

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const email = searchParams.get('email') ?? ''

  const [cooldown, setCooldown] = useState(0)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [resendError, setResendError] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user.email_confirmed_at) {
        router.replace('/dashboard')
      }
    })
  }, [router])

  useEffect(() => {
    if (cooldown <= 0) return
    const t = setInterval(() => setCooldown(c => Math.max(0, c - 1)), 1000)
    return () => clearInterval(t)
  }, [cooldown])

  const handleResend = useCallback(async () => {
    if (!email || cooldown > 0 || sending) return
    setSending(true)
    setResendError(null)
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
    const { error } = await supabase.auth.resend({ type: 'signup', email })
    setSending(false)
    if (error) {
      setResendError(error.message)
    } else {
      setSent(true)
      setCooldown(COOLDOWN_SECONDS)
    }
  }, [email, cooldown, sending])

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

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight mb-1">Check your email</h1>
            <p className="text-sm text-[var(--foreground-muted)] leading-relaxed">
              We sent a verification link to{' '}
              {email ? (
                <span className="font-semibold text-foreground">{email}</span>
              ) : (
                'your email address'
              )}
              . Click it to activate your account.
            </p>
          </div>

          {sent && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3 text-sm text-emerald-700">
              Verification email resent.
            </div>
          )}

          {resendError && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-600">
              {resendError}
            </div>
          )}

          <div className="space-y-3">
            <button
              type="button"
              onClick={handleResend}
              disabled={!email || cooldown > 0 || sending}
              className="w-full h-11 rounded-xl border border-[var(--border)] text-sm font-medium text-foreground hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              {sending
                ? 'Sending…'
                : cooldown > 0
                  ? `Resend in ${cooldown}s`
                  : 'Resend verification email'}
            </button>

            <Link
              href="/signup"
              className="block text-center text-sm text-[var(--foreground-muted)] hover:text-foreground transition-colors"
            >
              Wrong email? Sign up again
            </Link>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-[var(--forest-50)] relative overflow-hidden px-10 py-10">
        <div className="absolute top-[-80px] right-[-80px] w-72 h-72 rounded-full border-2 border-dashed border-[var(--forest-200)] opacity-50" />
        <div className="absolute bottom-[-60px] left-[-60px] w-52 h-52 rounded-full border-2 border-dashed border-[var(--forest-200)] opacity-50" />
        <div className="flex flex-col items-center gap-6 max-w-sm">
          <VerifyEmailIllustration className="w-80 h-60" />
          <p className="text-center text-sm text-slate-500 italic">One click and you&apos;re in. Your experiment journey starts now.</p>
        </div>
      </div>
    </main>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailContent />
    </Suspense>
  )
}
