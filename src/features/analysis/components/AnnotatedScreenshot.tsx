'use client'

import { useEffect, useRef } from 'react'
import type { UIElement } from '@/lib/ai/schemas/recommendation'

interface Props {
  screenshotUrl: string
  targetElement: UIElement
  recommendationId: string
  hypothesis: string
  evidence: string[]
}

export function AnnotatedScreenshot({ screenshotUrl, targetElement, recommendationId, hypothesis, evidence }: Props) {
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ringRef.current
    if (!el) return
    el.style.animation = 'none'
    void el.offsetHeight
    el.style.animation = ''
  }, [recommendationId])

  const { x, y, width, height } = targetElement.bounding_hint

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start">
      {/* Screenshot with overlay */}
      <div className="relative flex-1 min-w-0 rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={screenshotUrl} alt="Product screenshot" className="w-full h-auto block" />

        {/* Highlight overlay */}
        <div
          className="absolute pointer-events-none"
          style={{ left: `${x}%`, top: `${y}%`, width: `${width}%`, height: `${height}%` }}
        >
          {/* Fill */}
          <div className="absolute inset-0 bg-violet-600/20 rounded" />
          {/* Border */}
          <div className="absolute inset-0 border-2 border-violet-600 rounded" />
          {/* Ping ring */}
          <div
            ref={ringRef}
            className="absolute inset-0 border-2 border-violet-600/30 rounded animate-ping"
            style={{ animationIterationCount: 1, animationDuration: '1s' }}
          />
        </div>
      </div>

      {/* Sidebar panel */}
      <div className="w-72 shrink-0 space-y-3">
        {/* Element badge */}
        <span className="inline-block text-xs font-semibold bg-violet-100 text-violet-700 px-2.5 py-1 rounded-full">
          {targetElement.label}
        </span>

        {/* Issue */}
        <p className="text-base font-semibold text-slate-900 leading-snug">
          {targetElement.issue}
        </p>

        {/* Current state */}
        <p className="text-sm text-slate-500">
          <span className="font-medium text-slate-700">Currently:</span> {targetElement.current_state}
        </p>

        <div className="border-t border-slate-100" />

        {/* Hypothesis */}
        <p className="text-sm font-medium text-violet-600 leading-snug">
          {hypothesis}
        </p>

        {/* Evidence */}
        {evidence.length > 0 && (
          <ul className="space-y-1">
            {evidence.slice(0, 3).map((e, i) => (
              <li key={i} className="flex gap-2 text-sm text-slate-500">
                <span className="text-violet-400 shrink-0">•</span>
                <span>{e}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
