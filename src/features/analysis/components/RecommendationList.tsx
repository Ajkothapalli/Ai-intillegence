import { RecommendationCard } from './RecommendationCard'
import type { DbRecommendation } from '../types'

export function RecommendationList({ recommendations }: { recommendations: DbRecommendation[] }) {
  if (recommendations.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-xl border border-dashed border-[var(--border)]">
        <p className="text-[var(--foreground-muted)] text-sm">No recommendations yet — run an analysis first.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {recommendations.map(rec => (
        <RecommendationCard key={rec.id} rec={rec} />
      ))}
    </div>
  )
}
