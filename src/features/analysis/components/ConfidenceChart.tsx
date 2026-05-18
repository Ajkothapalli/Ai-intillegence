'use client'

import { HorizontalBarChart } from '@/components/ui/charts'
import type { DbRecommendation } from '../types'

const priorityColor: Record<number, string> = {
  1: '#e03360',
  2: '#ed8020',
  3: '#f4a040',
  4: '#196262',
  5: '#71717a',
}

export function ConfidenceChart({ recommendations }: { recommendations: DbRecommendation[] }) {
  const sorted = [...recommendations].sort((a, b) => a.priority - b.priority)
  const data = sorted.map(r => ({
    label: `P${r.priority}`,
    value: r.confidence,
    color: priorityColor[r.priority] ?? '#196262',
  }))

  return (
    <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] shadow-[var(--shadow-sm)] px-6 py-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Confidence overview</h2>
          <p className="text-xs text-[var(--foreground-muted)] mt-0.5">
            AI confidence score per recommendation, P1 = highest priority
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-foreground tabular-nums">
            {Math.round((recommendations.reduce((s, r) => s + r.confidence, 0) / recommendations.length) * 100)}%
          </p>
          <p className="text-[11px] text-[var(--foreground-muted)]">avg confidence</p>
        </div>
      </div>
      <HorizontalBarChart data={data} valueFormatter={v => `${Math.round(v * 100)}%`} />
    </div>
  )
}
