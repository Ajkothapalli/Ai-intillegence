'use client'

import type { RingProgress } from '../rings'

const RING_COLORS: Record<string, { stroke: string; bg: string; text: string }> = {
  data:         { stroke: '#196262', bg: 'bg-[var(--forest-50)]',  text: 'text-[var(--primary)]' },
  analysis:     { stroke: '#7c3aed', bg: 'bg-violet-50',           text: 'text-violet-700' },
  experiments:  { stroke: '#0369a1', bg: 'bg-sky-50',              text: 'text-sky-700' },
  segments:     { stroke: '#b45309', bg: 'bg-amber-50',            text: 'text-amber-700' },
  integrations: { stroke: '#047857', bg: 'bg-emerald-50',          text: 'text-emerald-700' },
}

const RADIUS = 20
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

function Ring({ progress }: { progress: RingProgress }) {
  const colors = RING_COLORS[progress.name] ?? RING_COLORS.data
  const dashOffset = CIRCUMFERENCE * (1 - progress.pct / 100)

  return (
    <div className="flex flex-col items-center gap-1.5" title={`${progress.label}: ${progress.pct}% (${progress.completed}/${progress.total} actions)`}>
      <div className="relative w-12 h-12">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true" className="-rotate-90">
          {/* Track */}
          <circle cx="24" cy="24" r={RADIUS} stroke="#e5e7eb" strokeWidth="4" fill="none" />
          {/* Progress */}
          <circle
            cx="24"
            cy="24"
            r={RADIUS}
            stroke={colors.stroke}
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-foreground">
          {progress.pct}%
        </span>
      </div>
      <span className={`text-[10px] font-semibold ${colors.text}`}>{progress.label}</span>
    </div>
  )
}

export function ProgressRings({ rings }: { rings: RingProgress[] }) {
  const overall = rings.length > 0
    ? Math.round(rings.reduce((s, r) => s + r.pct, 0) / rings.length)
    : 0

  return (
    <div className="bg-white rounded-2xl border border-[var(--border)] p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Feature Progress</h3>
          <p className="text-xs text-[var(--foreground-muted)] mt-0.5">Complete actions in each area</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-foreground tabular-nums">{overall}%</p>
          <p className="text-[10px] text-[var(--foreground-subtle)]">overall</p>
        </div>
      </div>

      <div className="flex items-end justify-between gap-2">
        {rings.map(r => (
          <Ring key={r.name} progress={r} />
        ))}
      </div>

      {/* Legend / next action */}
      {rings.some(r => r.pct < 100) && (
        <div className="mt-4 pt-4 border-t border-[var(--border)]">
          <p className="text-[11px] text-[var(--foreground-subtle)] font-medium mb-2">Next to unlock</p>
          <div className="flex flex-wrap gap-1.5">
            {rings.filter(r => r.pct < 100).slice(0, 3).map(r => {
              const next = r.actions.find(a => !r.completedActions.includes(a))
              if (!next) return null
              const colors = RING_COLORS[r.name] ?? RING_COLORS.data
              return (
                <span
                  key={r.name}
                  className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${colors.bg} ${colors.text}`}
                >
                  {r.label}: {next.replace(/_/g, ' ')}
                </span>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
