import type { DbRecommendation } from '../types'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

const priorityVariant: Record<number, 'p1' | 'p2' | 'p3' | 'p4' | 'p5'> = {
  1: 'p1',
  2: 'p2',
  3: 'p3',
  4: 'p4',
  5: 'p5',
}

const experimentTypeVariant: Record<string, 'ab' | 'multivariate' | 'flag' | 'holdout' | 'bandit'> = {
  'A/B Test':     'ab',
  'Multivariate': 'multivariate',
  'Feature Flag': 'flag',
  'Holdout':      'holdout',
  'Bandit':       'bandit',
}

export function RecommendationCard({ rec }: { rec: DbRecommendation }) {
  const pct = Math.round(rec.confidence * 100)
  const pVariant = priorityVariant[rec.priority] ?? 'p5'
  const expVariant = experimentTypeVariant[rec.experiment_type]

  return (
    <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] overflow-hidden shadow-[var(--shadow-sm)]">
      <div className="px-6 py-5 space-y-4">

        {/* Header row */}
        <div className="flex items-start gap-3">
          <Badge variant={pVariant} className="shrink-0 mt-0.5">P{rec.priority}</Badge>
          <p className="text-base font-semibold text-slate-900 leading-snug flex-1 min-w-0">
            {rec.hypothesis}
          </p>
        </div>

        {/* Confidence meter */}
        <div className="flex items-center gap-3">
          <Progress
            value={pct}
            variant={pct >= 80 ? 'brand' : pct >= 50 ? 'default' : 'accent'}
            size="sm"
            className="w-32 flex-none"
          />
          <span className="text-xs text-slate-500 tabular-nums">{pct}% confidence</span>
          {expVariant ? (
            <Badge variant={expVariant}>{rec.experiment_type}</Badge>
          ) : (
            <Badge variant="secondary">{rec.experiment_type}</Badge>
          )}
        </div>

        {/* Evidence */}
        <div>
          <p className="text-xs font-semibold text-[var(--foreground-subtle)] uppercase tracking-wide mb-1.5">
            Evidence
          </p>
          <ul className="space-y-1">
            {rec.evidence.map((e, i) => (
              <li key={i} className="flex gap-2 text-sm text-slate-500">
                <span className="text-[var(--primary)] shrink-0" aria-hidden="true">•</span>
                <span>{e}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Rationale — native collapsible */}
        {rec.rationale && (
          <details className="group">
            <summary className="cursor-pointer list-none text-xs font-medium text-[var(--primary)] hover:underline select-none">
              <span className="group-open:hidden">Show rationale ↓</span>
              <span className="hidden group-open:inline">Hide rationale ↑</span>
            </summary>
            <div className="mt-2 p-3 bg-[var(--background-elevated)] rounded-lg border border-[var(--border)]">
              <p className="text-sm text-slate-500 leading-relaxed">{rec.rationale}</p>
            </div>
          </details>
        )}
      </div>
    </div>
  )
}
