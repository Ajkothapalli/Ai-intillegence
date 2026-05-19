'use client'

import { useActionState, useState, useRef, useEffect } from 'react'
import { toast } from 'sonner'
import { updateProfile } from '@/features/auth/actions'
import type { PasswordResetResult } from '@/features/auth/actions'

interface Props {
  initialName: string
}

export function ProfileNameEdit({ initialName }: Props) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(initialName)

  const [state, formAction, isPending] = useActionState<PasswordResetResult | null, FormData>(
    updateProfile,
    null,
  )

  const prevState = useRef(state)
  useEffect(() => {
    if (state === prevState.current) return
    prevState.current = state
    if (state?.success) {
      toast.success('Profile saved')
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEditing(false)
    } else if (state && !state.success) {
      toast.error(state.error)
    }
  }, [state])

  if (!editing) {
    return (
      <div className="flex items-center gap-2">
        <p className="text-sm text-foreground">{name || '—'}</p>
        <button
          type="button"
          onClick={() => setEditing(true)}
          aria-label="Edit name"
          className="text-[var(--foreground-subtle)] hover:text-[var(--primary)] transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M9.5 2.5l2 2L4 12H2v-2L9.5 2.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    )
  }

  return (
    <form action={formAction} className="flex items-center gap-2 flex-wrap">
      <input type="hidden" name="full_name" value={name} />
      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        onKeyDown={e => { if (e.key === 'Escape') { setName(initialName); setEditing(false) } }}
        autoFocus
        className="h-8 rounded-lg border border-[var(--border)] px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)] w-48"
      />
      <button
        type="submit"
        disabled={isPending || !name.trim()}
        className="text-xs font-semibold text-[var(--primary)] hover:underline disabled:opacity-40"
      >
        {isPending ? 'Saving…' : 'Save'}
      </button>
      <button
        type="button"
        onClick={() => { setName(initialName); setEditing(false) }}
        className="text-xs text-[var(--foreground-muted)] hover:text-foreground transition-colors"
      >
        Cancel
      </button>
    </form>
  )
}
