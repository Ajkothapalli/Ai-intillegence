'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { signIn } from '@/features/auth/actions'
import type { AuthActionResult } from '@/features/auth/types'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Alert } from '@/components/ui/alert'

const initialState: AuthActionResult | null = null

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState<AuthActionResult | null, FormData>(
    signIn,
    initialState
  )

  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-sm bg-[var(--surface)] rounded-xl border border-[var(--border)] shadow-[var(--shadow-md)] p-8 space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--foreground-subtle)] mb-1">
            Experiment Intelligence
          </p>
          <h1 className="text-2xl font-bold text-foreground">Sign in</h1>
          <p className="text-sm text-[var(--foreground-muted)] mt-1">Welcome back</p>
        </div>

        {state && !state.success && (
          <Alert variant="destructive">{state.error}</Alert>
        )}

        <form action={formAction} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-sm font-medium text-foreground">
              Email
            </label>
            <Input id="email" name="email" type="email" autoComplete="email" required placeholder="you@company.com" />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="block text-sm font-medium text-foreground">
              Password
            </label>
            <Input id="password" name="password" type="password" autoComplete="current-password" required placeholder="••••••••" />
          </div>

          <Button type="submit" disabled={isPending} className="w-full" size="lg">
            {isPending ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>

        <p className="text-sm text-center text-[var(--foreground-muted)]">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-[var(--forest-400)] hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  )
}
