'use client'

import type { UserSegment } from '@/features/segments/types'

interface Props {
  segments: UserSegment[]
  activeSegmentId: string | null
  totalReach: number | null
  onSelect: (segmentId: string | null) => void
}

export function SegmentFilter({ segments, activeSegmentId, totalReach, onSelect }: Props) {
  if (segments.length === 0) return null

  const active = segments.find(s => s.id === activeSegmentId)

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Audience</span>
        <button
          type="button"
          onClick={() => onSelect(null)}
          className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
            activeSegmentId === null
              ? 'bg-slate-900 text-white border-slate-900'
              : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
          }`}
        >
          All Users
        </button>
        {segments.map(seg => (
          <button
            key={seg.id}
            type="button"
            onClick={() => onSelect(seg.id === activeSegmentId ? null : seg.id)}
            className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors flex items-center gap-1.5 ${
              seg.id === activeSegmentId
                ? 'bg-violet-600 text-white border-violet-600'
                : 'bg-white text-slate-600 border-slate-200 hover:border-violet-400'
            }`}
          >
            {seg.name}
            {seg.user_count != null && (
              <span className={`text-[10px] ${seg.id === activeSegmentId ? 'text-violet-200' : 'text-slate-400'}`}>
                {seg.user_count >= 1000
                  ? `${(seg.user_count / 1000).toFixed(0)}k`
                  : seg.user_count}
              </span>
            )}
          </button>
        ))}
      </div>

      {active && (
        <p className="text-xs text-violet-600 font-medium">
          Showing recommendations for <strong>{active.name}</strong>
          {totalReach != null && totalReach > 0 && ` — ~${totalReach.toLocaleString()} users`}
        </p>
      )}
    </div>
  )
}
