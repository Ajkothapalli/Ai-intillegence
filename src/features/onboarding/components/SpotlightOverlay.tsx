'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import type { SpotlightDef } from '../spotlightLogic'

const DISMISS_DURATION_MS = 24 * 60 * 60 * 1000

type Rect = { top: number; left: number; width: number; height: number }

function storageKey(id: string) {
  return `spotlight_dismissed_${id}`
}

function isDismissed(id: string): boolean {
  try {
    const raw = localStorage.getItem(storageKey(id))
    if (!raw) return false
    const ts = parseInt(raw, 10)
    return Date.now() - ts < DISMISS_DURATION_MS
  } catch {
    return false
  }
}

function markDismissed(id: string) {
  try {
    localStorage.setItem(storageKey(id), String(Date.now()))
  } catch {
    // storage unavailable
  }
}

export function SpotlightOverlay({ spotlight }: { spotlight: SpotlightDef }) {
  const [state, setState] = useState<{ rect: Rect; visible: boolean } | null>(null)

  useEffect(() => {
    if (isDismissed(spotlight.id)) return

    const target = document.querySelector(`[data-spotlight-target="${spotlight.target}"]`)
    if (!target) return

    const r = target.getBoundingClientRect()
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState({ rect: { top: r.top, left: r.left, width: r.width, height: r.height }, visible: true })
  }, [spotlight.id, spotlight.target])

  const rect = state?.rect ?? null
  const visible = state?.visible ?? false

  const dismiss = useCallback(() => {
    markDismissed(spotlight.id)
    setState(null)
  }, [spotlight.id])

  useEffect(() => {
    if (!visible) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismiss()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [visible, dismiss])

  if (!visible || !rect) return null

  const PAD = 8
  const tooltipTop = rect.top + rect.height + PAD + 12

  return (
    <>
      {/* Dark overlay — divided into 4 rects around the target */}
      <div className="fixed inset-0 z-[90] pointer-events-none">
        {/* Top strip */}
        <div
          className="absolute bg-black/50"
          style={{ top: 0, left: 0, right: 0, height: rect.top - PAD }}
        />
        {/* Bottom strip */}
        <div
          className="absolute bg-black/50"
          style={{ top: rect.top + rect.height + PAD, left: 0, right: 0, bottom: 0 }}
        />
        {/* Left strip */}
        <div
          className="absolute bg-black/50"
          style={{ top: rect.top - PAD, left: 0, width: rect.left - PAD, height: rect.height + PAD * 2 }}
        />
        {/* Right strip */}
        <div
          className="absolute bg-black/50"
          style={{ top: rect.top - PAD, left: rect.left + rect.width + PAD, right: 0, height: rect.height + PAD * 2 }}
        />
        {/* Highlight ring around target */}
        <div
          className="absolute rounded-xl ring-2 ring-violet-400 ring-offset-2 ring-offset-transparent"
          style={{
            top: rect.top - PAD,
            left: rect.left - PAD,
            width: rect.width + PAD * 2,
            height: rect.height + PAD * 2,
          }}
        />
      </div>

      {/* Backdrop click to dismiss */}
      <div
        className="fixed inset-0 z-[91] cursor-pointer"
        aria-label="Dismiss spotlight"
        role="button"
        tabIndex={0}
        onClick={dismiss}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') dismiss() }}
      />

      {/* Tooltip */}
      <div
        className="fixed z-[92] w-80 bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.18)] border border-[var(--border)] p-5"
        style={{ top: Math.min(tooltipTop, window.innerHeight - 220), left: Math.max(8, Math.min(rect.left, window.innerWidth - 336)) }}
        role="dialog"
        aria-modal="false"
        aria-label={spotlight.heading}
      >
        {/* Arrow */}
        <div
          className="absolute -top-2 w-4 h-2 overflow-hidden"
          style={{ left: Math.min(rect.left - Math.max(8, Math.min(rect.left, window.innerWidth - 336)) + rect.width / 2 - 8, 240) }}
        >
          <div className="w-3 h-3 bg-white border-l border-t border-[var(--border)] rotate-45 translate-y-1 ml-0.5" />
        </div>

        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-violet-500 shrink-0 mt-0.5" />
            <h3 className="text-sm font-bold text-foreground">{spotlight.heading}</h3>
          </div>
          <button
            onClick={dismiss}
            className="shrink-0 text-[var(--foreground-subtle)] hover:text-foreground transition-colors"
            aria-label="Dismiss"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <p className="text-xs text-[var(--foreground-muted)] leading-relaxed mb-4">{spotlight.body}</p>

        <div className="flex items-center gap-2">
          {spotlight.cta && (
            <Link
              href={spotlight.cta.href}
              onClick={dismiss}
              className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-semibold px-3.5 py-2 rounded-full hover:bg-[var(--primary-hover)] transition-colors"
            >
              {spotlight.cta.label}
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                <path d="M2 5h6M5.5 2.5 8 5l-2.5 2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          )}
          <button
            onClick={dismiss}
            className="text-xs text-[var(--foreground-subtle)] hover:text-foreground transition-colors px-2"
          >
            Dismiss
          </button>
        </div>
      </div>
    </>
  )
}
