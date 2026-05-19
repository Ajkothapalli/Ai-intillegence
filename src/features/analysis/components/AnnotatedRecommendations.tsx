'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { DbRecommendation } from '../types'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

// ── Constants ─────────────────────────────────────────────────────────────────

// Fallback pin positions used when the AI didn't return coordinates
const FALLBACK_PINS = [
  { x: 26, y: 28 },
  { x: 72, y: 22 },
  { x: 58, y: 60 },
  { x: 20, y: 70 },
  { x: 78, y: 66 },
]

const COLORS = ['#196262', '#0D9488', '#6366F1', '#F43F5E', '#D97706']

// ── Types ─────────────────────────────────────────────────────────────────────

interface Screenshot {
  signedUrl: string
  file_name: string
}

interface LinePath {
  index: number
  d: string
  color: string
}

interface Props {
  recommendations: DbRecommendation[]
  screenshots: Screenshot[]
  summary?: string | null
}

// ── Main component ────────────────────────────────────────────────────────────

export function AnnotatedRecommendations({ recommendations, screenshots, summary }: Props) {
  const containerRef  = useRef<HTMLDivElement>(null)
  const imgWrapRef    = useRef<HTMLDivElement>(null)
  const cardRefs      = useRef<(HTMLDivElement | null)[]>([])
  const [lines, setLines]       = useState<LinePath[]>([])
  const [imgLoaded, setImgLoaded] = useState(false)

  const sorted = useMemo(
    () => [...recommendations].sort((a, b) => a.priority - b.priority).slice(0, 5),
    [recommendations],
  )

  const primaryShot = screenshots[0] ?? null

  const computeLines = useCallback(() => {
    if (!containerRef.current || !imgWrapRef.current) return
    const root    = containerRef.current.getBoundingClientRect()
    const imgRect = imgWrapRef.current.getBoundingClientRect()

    const next: LinePath[] = []

    sorted.forEach((rec, i) => {
      const cardEl = cardRefs.current[i]
      if (!cardEl) return

      const cardRect = cardEl.getBoundingClientRect()

      // Use AI-provided coordinates if available (and on screenshot 0), else fallback
      const annotation = rec.screenshot_annotation?.screenshot_index === 0
        ? rec.screenshot_annotation
        : null
      const pin = annotation ?? FALLBACK_PINS[i] ?? FALLBACK_PINS[0]

      // Pin centre in container-relative coords
      const px = (imgRect.left - root.left) + (pin.x / 100) * imgRect.width
      const py = (imgRect.top  - root.top)  + (pin.y / 100) * imgRect.height

      // Card left-edge mid-point in container-relative coords
      const cx = cardRect.left  - root.left
      const cy = (cardRect.top  - root.top) + cardRect.height / 2

      // Cubic bezier: exits pin horizontally, enters card horizontally
      const cpx = (px + cx) / 2
      const d   = `M ${px} ${py} C ${cpx} ${py}, ${cpx} ${cy}, ${cx} ${cy}`

      next.push({ index: i, d, color: COLORS[i] ?? '#196262' })
    })

    setLines(next)
  }, [sorted])

  useEffect(() => {
    if (!imgLoaded) return
    computeLines()
    const ro = new ResizeObserver(computeLines)
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [imgLoaded, computeLines])

  // ── Fallback: no screenshots ───────────────────────────────────────────────

  if (!primaryShot || sorted.length === 0) {
    return <FallbackList recommendations={sorted} summary={summary} />
  }

  // ── Annotated layout ───────────────────────────────────────────────────────

  return (
    <div ref={containerRef} className="relative">

      {/* ── Summary ────────────────────────────────────────────────── */}
      {summary && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-5 py-4 mb-6">
          <p className="text-[11px] font-semibold text-[var(--foreground-subtle)] uppercase tracking-wider mb-1">
            AI Summary
          </p>
          <p className="text-sm text-[var(--foreground-muted)] leading-relaxed">{summary}</p>
        </div>
      )}

      {/* ── Two-column annotated view (desktop) ────────────────────── */}
      <div className="hidden lg:flex gap-6 items-start">

        {/* Screenshot + pins */}
        <div
          ref={imgWrapRef}
          className="relative flex-1 min-w-0 rounded-2xl overflow-hidden shadow-lg border border-[var(--border)] bg-[var(--forest-50)]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={primaryShot.signedUrl}
            alt={primaryShot.file_name}
            className="w-full h-auto block"
            onLoad={() => setImgLoaded(true)}
          />

          {/* Pins */}
          {sorted.map((rec, i) => {
            const annotation = rec.screenshot_annotation?.screenshot_index === 0
              ? rec.screenshot_annotation
              : null
            const pin   = annotation ?? FALLBACK_PINS[i] ?? FALLBACK_PINS[0]
            const color = COLORS[i] ?? '#196262'
            return (
              <span
                key={i}
                className="absolute"
                style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                aria-hidden="true"
              >
                {/* Pulse ring */}
                <span
                  className="absolute rounded-full"
                  style={{
                    width: 34, height: 34,
                    backgroundColor: color,
                    transform: 'translate(-50%, -50%)',
                    animation: `pinPulse ${1.6 + i * 0.25}s ease-out infinite`,
                  }}
                />
                {/* Solid pin */}
                <span
                  className="relative z-10 flex items-center justify-center w-7 h-7 rounded-full text-white text-[11px] font-bold shadow-lg ring-2 ring-white/60"
                  style={{
                    backgroundColor: color,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  {i + 1}
                </span>
              </span>
            )
          })}
        </div>

        {/* Recommendation cards */}
        <div className="w-[360px] flex-none space-y-3">
          {sorted.map((rec, i) => {
            const color = COLORS[i] ?? '#196262'
            const pct   = Math.round(rec.confidence * 100)
            return (
              <div
                key={rec.id}
                ref={el => { cardRefs.current[i] = el }}
                className="relative rounded-xl border border-[var(--border)] bg-white shadow-sm overflow-hidden"
              >
                {/* Coloured left accent bar */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-[3px]"
                  style={{ backgroundColor: color }}
                />
                <div className="pl-5 pr-4 py-4 space-y-2">
                  {/* Header */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className="flex items-center justify-center w-5 h-5 rounded-full text-white text-[10px] font-bold shrink-0"
                      style={{ backgroundColor: color }}
                    >
                      {i + 1}
                    </span>
                    <Badge variant={`p${rec.priority}` as 'p1' | 'p2' | 'p3' | 'p4' | 'p5'}>
                      P{rec.priority}
                    </Badge>
                    <span className="text-[11px] text-[var(--foreground-subtle)]">
                      {rec.experiment_type}
                    </span>
                  </div>

                  {/* Hypothesis */}
                  <p className="text-sm font-semibold text-foreground leading-snug">
                    {rec.hypothesis}
                  </p>

                  {/* Confidence */}
                  <div className="flex items-center gap-2">
                    <Progress
                      value={pct}
                      variant={pct >= 80 ? 'brand' : pct >= 50 ? 'default' : 'accent'}
                      size="sm"
                      className="w-24 flex-none"
                    />
                    <span className="text-[11px] tabular-nums text-[var(--foreground-subtle)]">
                      {pct}% confidence
                    </span>
                  </div>

                  {/* First evidence bullet */}
                  {rec.evidence[0] && (
                    <p className="text-xs text-[var(--foreground-muted)] line-clamp-2 leading-relaxed">
                      {rec.evidence[0]}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Animated dotted SVG lines */}
        {imgLoaded && lines.length > 0 && (
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ overflow: 'visible', zIndex: 20 }}
            aria-hidden="true"
          >
            {lines.map(line => (
              <path
                key={line.index}
                d={line.d}
                fill="none"
                stroke={line.color}
                strokeWidth="1.5"
                strokeOpacity="0.55"
                strokeDasharray="5 4"
                style={{
                  animation: `dashFlow 1.4s linear infinite`,
                  animationDelay: `${line.index * 0.18}s`,
                }}
              />
            ))}
          </svg>
        )}
      </div>

      {/* ── Mobile stacked view ─────────────────────────────────────── */}
      <div className="lg:hidden space-y-6">
        {/* Screenshot with pins */}
        <div className="relative rounded-2xl overflow-hidden shadow-md border border-[var(--border)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={primaryShot.signedUrl}
            alt={primaryShot.file_name}
            className="w-full h-auto block"
          />
          {sorted.map((rec, i) => {
            const annotation = rec.screenshot_annotation?.screenshot_index === 0
              ? rec.screenshot_annotation
              : null
            const pin   = annotation ?? FALLBACK_PINS[i] ?? FALLBACK_PINS[0]
            const color = COLORS[i] ?? '#196262'
            return (
              <span
                key={i}
                className="absolute flex items-center justify-center w-6 h-6 rounded-full text-white text-[10px] font-bold shadow ring-2 ring-white/60"
                style={{
                  left: `${pin.x}%`,
                  top: `${pin.y}%`,
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: color,
                }}
                aria-hidden="true"
              >
                {i + 1}
              </span>
            )
          })}
        </div>

        {/* Cards */}
        <div className="space-y-3">
          {sorted.map((rec, i) => {
            const color = COLORS[i] ?? '#196262'
            const pct   = Math.round(rec.confidence * 100)
            return (
              <div
                key={rec.id}
                className="relative rounded-xl border border-[var(--border)] bg-white shadow-sm overflow-hidden"
              >
                <div
                  className="absolute left-0 top-0 bottom-0 w-[3px]"
                  style={{ backgroundColor: color }}
                />
                <div className="pl-5 pr-4 py-4 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className="flex items-center justify-center w-5 h-5 rounded-full text-white text-[10px] font-bold shrink-0"
                      style={{ backgroundColor: color }}
                    >
                      {i + 1}
                    </span>
                    <Badge variant={`p${rec.priority}` as 'p1' | 'p2' | 'p3' | 'p4' | 'p5'}>
                      P{rec.priority}
                    </Badge>
                    <span className="text-[11px] text-[var(--foreground-subtle)]">{rec.experiment_type}</span>
                  </div>
                  <p className="text-sm font-semibold text-foreground leading-snug">{rec.hypothesis}</p>
                  <div className="flex items-center gap-2">
                    <Progress
                      value={pct}
                      variant={pct >= 80 ? 'brand' : pct >= 50 ? 'default' : 'accent'}
                      size="sm"
                      className="w-24 flex-none"
                    />
                    <span className="text-[11px] tabular-nums text-[var(--foreground-subtle)]">{pct}% confidence</span>
                  </div>
                  {rec.evidence[0] && (
                    <p className="text-xs text-[var(--foreground-muted)] line-clamp-2">{rec.evidence[0]}</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ── Fallback list (no screenshots) ────────────────────────────────────────────

function FallbackList({
  recommendations,
  summary,
}: {
  recommendations: DbRecommendation[]
  summary?: string | null
}) {
  return (
    <div className="space-y-4">
      {summary && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-5 py-4">
          <p className="text-[11px] font-semibold text-[var(--foreground-subtle)] uppercase tracking-wider mb-1">
            AI Summary
          </p>
          <p className="text-sm text-[var(--foreground-muted)] leading-relaxed">{summary}</p>
        </div>
      )}
      {recommendations.map((rec, i) => {
        const color = COLORS[i] ?? '#196262'
        const pct   = Math.round(rec.confidence * 100)
        return (
          <div
            key={rec.id}
            className="relative rounded-xl border border-[var(--border)] bg-white shadow-sm overflow-hidden"
          >
            <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ backgroundColor: color }} />
            <div className="pl-5 pr-4 py-4 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant={`p${rec.priority}` as 'p1' | 'p2' | 'p3' | 'p4' | 'p5'}>P{rec.priority}</Badge>
                <span className="text-[11px] text-[var(--foreground-subtle)]">{rec.experiment_type}</span>
              </div>
              <p className="text-sm font-semibold text-foreground leading-snug">{rec.hypothesis}</p>
              <div className="flex items-center gap-2">
                <Progress
                  value={pct}
                  variant={pct >= 80 ? 'brand' : pct >= 50 ? 'default' : 'accent'}
                  size="sm"
                  className="w-24 flex-none"
                />
                <span className="text-[11px] tabular-nums text-[var(--foreground-subtle)]">{pct}% confidence</span>
              </div>
              {rec.evidence[0] && (
                <p className="text-xs text-[var(--foreground-muted)] line-clamp-2">{rec.evidence[0]}</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
