'use client'

import { useEffect, useState } from 'react'
import confetti from 'canvas-confetti'

export function OnboardingComplete() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const key = 'onboarding_complete_shown'
    if (localStorage.getItem(key)) return
    localStorage.setItem(key, '1')

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisible(true)
    const end = Date.now() + 2000
    const frame = () => {
      confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#196262', '#7c3aed', '#0369a1'] })
      confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#196262', '#7c3aed', '#0369a1'] })
      if (Date.now() < end) requestAnimationFrame(frame)
    }
    requestAnimationFrame(frame)

    const t = setTimeout(() => setVisible(false), 6000)
    return () => clearTimeout(t)
  }, [])

  if (!visible) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 w-80 bg-white rounded-2xl border-2 border-[var(--primary)] shadow-[0_8px_32px_rgba(0,0,0,0.15)] p-5 animate-in slide-in-from-bottom-4 duration-300"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-[var(--forest-50)] flex items-center justify-center shrink-0">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M4 10l4 4 8-8" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-foreground">Onboarding complete!</p>
          <p className="text-xs text-[var(--foreground-muted)] mt-0.5">
            You&apos;ve seen your first AI recommendations. Now you&apos;re ready to run your own analysis.
          </p>
        </div>
        <button
          onClick={() => setVisible(false)}
          className="text-[var(--foreground-subtle)] hover:text-foreground transition-colors shrink-0 mt-0.5"
          aria-label="Dismiss"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}
