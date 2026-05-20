'use client'

import { useState } from 'react'
import type { DbRecommendation } from '../types'
import { HelpTooltip } from '@/components/ui/HelpTooltip'

const EFFORT_MAP: Record<string, number> = {
  'A/B Test':     0.15,
  'Feature Flag': 0.25,
  'Holdout':      0.5,
  'Bandit':       0.6,
  'Multivariate': 0.85,
}

function getImpact(priority: number): number {
  if (priority <= 2) return 0.15  // high impact → near top
  if (priority === 3) return 0.5
  return 0.85                     // low impact → near bottom
}

function getQuadrant(priority: number, experimentType: string): string {
  const impact = priority <= 2 ? 'high' : priority === 3 ? 'mid' : 'low'
  const effort = (EFFORT_MAP[experimentType] ?? 0.5) < 0.5 ? 'low' : 'high'
  if (impact === 'high' && effort === 'low') return 'Do First'
  if (impact === 'high' && effort === 'high') return 'Plan'
  if (impact !== 'high' && effort === 'low') return 'Quick Win'
  return 'Deprioritise'
}

export function getQuadrantLabel(rec: DbRecommendation): string {
  return getQuadrant(rec.priority, rec.experiment_type)
}

interface Props {
  recommendations: DbRecommendation[]
  activeSegmentId?: string | null
}

export function ImpactEffortMatrix({ recommendations, activeSegmentId }: Props) {
  const [tooltip, setTooltip] = useState<{ id: string; text: string; x: number; y: number } | null>(null)

  function scrollToCard(id: string) {
    const el = document.getElementById(`rec-card-${id}`)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex items-center gap-1.5 mb-0.5">
        <h2 className="text-sm font-semibold text-slate-900">Impact vs Effort</h2>
        <HelpTooltip content="Impact is derived from priority (P1–P5). Effort is estimated from experiment type complexity. 'Do First' = high impact, low effort." side="right" />
      </div>
      <p className="text-xs text-slate-500 mb-4">Click a dot to jump to that recommendation</p>

      <div className="relative w-full" style={{ paddingBottom: '50%' }}>
        <div className="absolute inset-0 flex">
          {/* Y axis label */}
          <div className="flex flex-col justify-between items-center pr-2 py-1">
            <span className="text-[10px] text-slate-400 rotate-[-90deg] whitespace-nowrap origin-center" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>High Impact</span>
            <span className="text-[10px] text-slate-400" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>Low Impact</span>
          </div>

          {/* Matrix grid */}
          <div className="relative flex-1 border border-slate-200 rounded-lg overflow-hidden">
            {/* Quadrant backgrounds */}
            <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
              <div className="border-r border-b border-slate-100 bg-violet-50/40 flex items-start justify-start p-2">
                <span className="text-[10px] font-semibold text-violet-500">Do First</span>
              </div>
              <div className="border-b border-slate-100 bg-slate-50/60 flex items-start justify-end p-2">
                <span className="text-[10px] font-semibold text-slate-400">Plan</span>
              </div>
              <div className="border-r border-slate-100 bg-slate-50/40 flex items-end justify-start p-2">
                <span className="text-[10px] font-semibold text-slate-400">Quick Win</span>
              </div>
              <div className="bg-slate-50/20 flex items-end justify-end p-2">
                <span className="text-[10px] font-semibold text-slate-300">Deprioritise</span>
              </div>
            </div>

            {/* Center dividers */}
            <div className="absolute top-1/2 left-0 right-0 border-t border-slate-200" />
            <div className="absolute left-1/2 top-0 bottom-0 border-l border-slate-200" />

            {/* Dots */}
            {recommendations.map(rec => {
              const xPct = (EFFORT_MAP[rec.experiment_type] ?? 0.5) * 100
              const yPct = getImpact(rec.priority) * 100
              const isTop = rec.priority <= 2 && (EFFORT_MAP[rec.experiment_type] ?? 0.5) < 0.5
              const size = Math.max(10, Math.min(20, Math.round(rec.confidence * 20)))
              const inActiveSegment = !activeSegmentId || rec.target_segments?.some(ts => ts.segment_id === activeSegmentId)
              const bg = inActiveSegment ? (isTop ? '#7c3aed' : '#94a3b8') : '#e2e8f0'

              return (
                <button
                  key={rec.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 rounded-full transition-all hover:scale-125 focus:outline-none"
                  style={{
                    left: `${xPct}%`,
                    top: `${yPct}%`,
                    width: size,
                    height: size,
                    backgroundColor: bg,
                    boxShadow: inActiveSegment && isTop ? '0 0 0 2px #ede9fe' : undefined,
                    opacity: inActiveSegment ? 1 : 0.4,
                  }}
                  onClick={() => inActiveSegment && scrollToCard(rec.id)}
                  onMouseEnter={() => setTooltip({ id: rec.id, text: rec.hypothesis.slice(0, 60) + (rec.hypothesis.length > 60 ? '…' : ''), x: xPct, y: yPct })}
                  onMouseLeave={() => setTooltip(null)}
                  aria-label={rec.hypothesis}
                />
              )
            })}

            {/* Tooltip */}
            {tooltip && (
              <div
                className="absolute z-10 bg-slate-900 text-white text-xs rounded px-2 py-1 pointer-events-none max-w-[160px] whitespace-normal"
                style={{ left: `${tooltip.x}%`, top: `${tooltip.y}%`, transform: 'translate(-50%, -130%)' }}
              >
                {tooltip.text}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* X axis */}
      <div className="flex justify-between mt-1 pl-6">
        <span className="text-[10px] text-slate-400">Low Effort</span>
        <span className="text-[10px] text-slate-400">High Effort</span>
      </div>

      {/* Mobile fallback: sorted priority list */}
      <div className="sm:hidden mt-4 space-y-2">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Priority order</p>
        {[...recommendations]
          .sort((a, b) => a.priority - b.priority)
          .map(rec => (
            <button
              key={rec.id}
              type="button"
              onClick={() => scrollToCard(rec.id)}
              className="w-full text-left flex items-center gap-2 rounded-lg border border-slate-100 px-3 py-2 hover:bg-slate-50 transition-colors"
            >
              <span className="text-xs font-bold text-violet-600 shrink-0">P{rec.priority}</span>
              <span className="text-xs text-slate-600 line-clamp-1">{rec.hypothesis}</span>
            </button>
          ))}
      </div>
    </div>
  )
}
