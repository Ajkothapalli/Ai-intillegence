'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import confetti from 'canvas-confetti'

type Props = {
  illustration: React.ComponentType<{ className?: string }>
  heading: string
  body: string
  cta: string
  ctaHref?: string
  onCta?: () => void
  onClose: () => void
  celebrate?: boolean
}

export function IllustrationModal({
  illustration: Illustration,
  heading,
  body,
  cta,
  ctaHref,
  onCta,
  onClose,
  celebrate = false,
}: Props) {
  const firedRef = useRef(false)

  useEffect(() => {
    if (!celebrate || firedRef.current) return
    firedRef.current = true
    const end = Date.now() + 1800
    const frame = () => {
      confetti({ particleCount: 4, angle: 60, spread: 60, origin: { x: 0 }, colors: ['#7c3aed', '#f59e0b', '#10b981'] })
      confetti({ particleCount: 4, angle: 120, spread: 60, origin: { x: 1 }, colors: ['#7c3aed', '#f59e0b', '#10b981'] })
      if (Date.now() < end) requestAnimationFrame(frame)
    }
    requestAnimationFrame(frame)
  }, [celebrate])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 flex flex-col items-center text-center"
        style={{ animation: 'modal-pop 200ms ease-out forwards' }}
      >
        <style>{`
          @keyframes modal-pop {
            from { opacity: 0; transform: scale(0.82); }
            to   { opacity: 1; transform: scale(1); }
          }
        `}</style>

        <Illustration className="h-40 w-40 mb-4" />

        <h2 className="text-xl font-bold text-slate-900 mb-2">{heading}</h2>
        <p className="text-sm text-slate-500 leading-relaxed mb-6">{body}</p>

        {ctaHref ? (
          <Link
            href={ctaHref}
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors"
          >
            {cta}
          </Link>
        ) : (
          <button
            onClick={() => { onCta?.(); onClose() }}
            className="w-full py-3 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors"
          >
            {cta}
          </button>
        )}

        <button
          onClick={onClose}
          className="mt-3 text-xs text-slate-400 hover:text-slate-600 transition-colors"
        >
          Maybe later
        </button>
      </div>
    </div>
  )
}
