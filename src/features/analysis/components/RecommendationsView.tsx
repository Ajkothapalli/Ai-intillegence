'use client'

import { useState } from 'react'
import type { DbRecommendation } from '../types'
import type { UserSegment } from '@/features/segments/types'
import { SegmentFilter } from './SegmentFilter'
import { ImpactEffortMatrix } from './ImpactEffortMatrix'
import { ConfidenceChart } from './ConfidenceChart'
import { RecommendationCard } from './RecommendationCard'

interface Props {
  recommendations: DbRecommendation[]
  segments: UserSegment[]
  screenshotUrlMap: Record<string, string>
  projectId: string
  hasProjectSegments?: boolean
}

export function RecommendationsView({ recommendations, segments, screenshotUrlMap, projectId, hasProjectSegments }: Props) {
  const [activeSegmentId, setActiveSegmentId] = useState<string | null>(null)

  const filtered = activeSegmentId
    ? recommendations.filter(rec =>
        rec.target_segments?.some(ts => ts.segment_id === activeSegmentId)
      )
    : recommendations

  const totalReach = activeSegmentId
    ? (segments.find(s => s.id === activeSegmentId)?.user_count ?? null)
    : null

  return (
    <div className="space-y-6">
      {segments.length > 0 && (
        <SegmentFilter
          segments={segments}
          activeSegmentId={activeSegmentId}
          totalReach={totalReach}
          onSelect={setActiveSegmentId}
        />
      )}

      {recommendations.length > 0 && (
        <ImpactEffortMatrix
          recommendations={recommendations}
          activeSegmentId={activeSegmentId}
        />
      )}

      {recommendations.length > 0 && (
        <ConfidenceChart recommendations={filtered} />
      )}

      {filtered.length > 0 ? (
        <div className="space-y-6">
          {filtered.map(rec => (
            <RecommendationCard
              key={rec.id}
              rec={rec}
              screenshotUrl={rec.screenshot_id ? screenshotUrlMap[rec.screenshot_id] : undefined}
              projectId={projectId}
              hasProjectSegments={hasProjectSegments}
            />
          ))}
        </div>
      ) : activeSegmentId ? (
        <div className="text-center py-8">
          <p className="text-sm text-slate-500">No recommendations target this segment yet.</p>
          <p className="text-xs text-slate-400 mt-1">Run a new analysis with segments defined to get targeted recommendations.</p>
        </div>
      ) : null}
    </div>
  )
}
