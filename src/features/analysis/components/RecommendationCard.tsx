'use client'

import { useState } from 'react'
import type { DbRecommendation } from '../types'
import { ConfidenceMeter } from '@/components/ui/progress'

const priorityLabel: Record<number, string> = { 1: 'P1', 2: 'P2', 3: 'P3', 4: 'P4', 5: 'P5' }
const priorityColor: Record<number, string> = {
  1: 'bg-[var(--rose-50)] text-[var(--rose-700)] border-[var(--rose-200)]',
  2: 'bg-[var(--ember-50)] text-[var(--ember-700)] border-[var(--ember-200)]',
  3: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  4: 'bg-[var(--cobalt-50)] text-[var(--cobalt-700)] border-[var(--cobalt-200)]',
  5: 'bg-[var(--background-elevated)] text-[var(--foreground-muted)] border-[var(--border)]',
}

const experimentTypeColor: Record<string, string> = {
  'A/B Test':     'bg-purple-50 text-purple-700 border-purple-200',
  'Multivariate': 'bg-[var(--cobalt-50)] text-[var(--cobalt-700)] border-[var(--cobalt-200)]',
  'Feature Flag': 'bg-[var(--forest-50)] text-[var(--forest-700)] border-[var(--forest-200)]',
  'Holdout':      'bg-teal-50 text-teal-700 border-teal-200',
  'Bandit':       'bg-[var(--ember-50)] text-[var(--ember-700)] border-[var(--ember-200)]',
}

export function RecommendationCard({ rec }: { rec: DbRecommendation }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="bg-white rounded-xl border border-[var(--border)] overflow-hidden shadow-[var(--shadow-sm)]">
      <div className="px-6 py-5">
        <div className="flex items-start gap-3">
          <span className={`shrink-0 text-xs font-bold px-2 py-1 rounded border ${priorityColor[rec.priority] ?? priorityColor[5]}`}>
            {priorityLabel[rec.priority] ?? `P${rec.priority}`}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground leading-snug">{rec.hypothesis}</p>

            <div className="flex flex-wrap items-center gap-3 mt-3">
              <span className={`text-xs px-2 py-1 rounded border font-medium ${experimentTypeColor[rec.experiment_type] ?? 'bg-[var(--background-elevated)] text-[var(--foreground-muted)] border-[var(--border)]'}`}>
                {rec.experiment_type}
              </span>
              <ConfidenceMeter value={rec.confidence} />
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-1">
          <p className="text-xs font-semibold text-[var(--foreground-subtle)] uppercase tracking-wide">Evidence</p>
          <ul className="space-y-1">
            {rec.evidence.map((e, i) => (
              <li key={i} className="flex gap-2 text-sm text-[var(--foreground-muted)]">
                <span className="text-[var(--forest-400)] shrink-0">•</span>
                <span>{e}</span>
              </li>
            ))}
          </ul>
        </div>

        {rec.rationale && (
          <button
            onClick={() => setExpanded(v => !v)}
            className="mt-4 text-xs text-[var(--forest-600)] hover:underline font-medium"
          >
            {expanded ? 'Hide rationale ↑' : 'Show rationale ↓'}
          </button>
        )}

        {expanded && rec.rationale && (
          <div className="mt-3 p-3 bg-[var(--background-elevated)] rounded-lg border border-[var(--border)]">
            <p className="text-sm text-[var(--foreground-muted)] leading-relaxed">{rec.rationale}</p>
          </div>
        )}
      </div>
    </div>
  )
}
