import { RecommendationCard } from './RecommendationCard'
import type { DbRecommendation } from '../types'

type Props = {
  recommendations: DbRecommendation[]
  summary?: string | null
  screenshotUrlMap?: Map<string, string>
}

export function RecommendationList({ recommendations, summary, screenshotUrlMap }: Props) {
  if (recommendations.length === 0) {
    return (
      <div className="text-center py-16 bg-[var(--surface)] rounded-xl border border-dashed border-[var(--border)]">
        <p className="text-[var(--foreground-muted)] text-sm">No recommendations yet — run an analysis first.</p>
      </div>
    )
  }

  const sorted = [...recommendations].sort((a, b) => a.priority - b.priority)

  return (
    <div className="space-y-6">
      {summary && (
        <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] px-6 py-4">
          <p className="text-xs font-semibold text-[var(--foreground-subtle)] uppercase tracking-wide mb-1">
            Summary
          </p>
          <p className="text-sm text-[var(--foreground-muted)] leading-relaxed">{summary}</p>
        </div>
      )}

      <div className="space-y-4">
        {sorted.map(rec => (
          <RecommendationCard
            key={rec.id}
            rec={rec}
            screenshotUrl={rec.screenshot_id && screenshotUrlMap ? screenshotUrlMap.get(rec.screenshot_id) : undefined}
          />
        ))}
      </div>
    </div>
  )
}
