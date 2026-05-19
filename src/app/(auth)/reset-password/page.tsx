'use client'

import { useActionState, useState, useRef, useEffect } from 'react'
import { updatePassword } from '@/features/auth/actions'
import type { PasswordResetResult } from '@/features/auth/actions'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function ResetPasswordPage() {
  const [state, formAction, isPending] = useActionState<PasswordResetResult | null, FormData>(
    updatePassword,
    null,
  )
  const [pw, setPw]       = useState('')
  const [cpw, setCpw]     = useState('')
  const [pwDirty, setPwDirty]   = useState(false)
  const [cpwDirty, setCpwDirty] = useState(false)
  const [sessionReady, setSessionReady] = useState(false)
  const [sessionError, setSessionError] = useState<string | null>(null)
  const prevState = useRef(state)

  useEffect(() => {
    if (state !== prevState.current) {
      setPwDirty(false); setCpwDirty(false); prevState.current = state
    }
  }, [state])

  // Exchange PKCE code for session on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    if (code) {
      const supabase = createClient()
      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        if (error) setSessionError('This reset link has expired or is invalid. Please request a new one.')
        else setSessionReady(true)
      })
    } else {
      Promise.resolve().then(() => setSessionReady(true))
    }
  }, [])

  const error = state && !state.success ? state.error : null
  const showError = (!pwDirty && !cpwDirty) && !!error

  if (sessionError) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[var(--forest-50)] px-4">
        <div className="w-full max-w-sm bg-white rounded-2xl border border-[var(--border)] shadow-[var(--shadow-md)] p-8 text-center space-y-4">
          <p className="text-sm font-semibold text-[var(--rose-600)]">{sessionError}</p>
          <a href="/forgot-password" className="text-sm text-[var(--link)] hover:underline">
            Request a new reset link
          </a>
        </div>
      </main>
    )
  }

  if (!sessionReady) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[var(--forest-50)]">
        <span className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--forest-50)] px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2.5 mb-10 justify-center">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-[var(--shadow-primary)]">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M2 8h3M8 2v12M11 5l3 3-3 3" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-sm font-semibold text-foreground tracking-tight">Experiment Intelligence</span>
        </div>

        <div className="bg-white rounded-2xl border border-[var(--border)] shadow-[var(--shadow-md)] p-8 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Set new password</h1>
            <p className="text-sm text-[var(--foreground-muted)] mt-1">Choose a strong password for your account.</p>
          </div>

          <form action={formAction} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1.5">
                New password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                placeholder="••••••••"
                value={pw}
                onChange={e => { setPw(e.target.value); setPwDirty(true) }}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-1.5">
                Confirm password
              </label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                placeholder="••••••••"
                value={cpw}
                error={showError}
                onChange={e => { setCpw(e.target.value); setCpwDirty(true) }}
              />
              {showError && (
                <p className="text-xs text-[var(--rose-600)] mt-1.5">{error}</p>
              )}
            </div>

            <Button type="submit" disabled={isPending || !pw || !cpw} className="w-full" size="lg">
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  Updating…
                </span>
              ) : 'Update password'}
            </Button>
          </form>
        </div>
      </div>
    </main>
  )
}
