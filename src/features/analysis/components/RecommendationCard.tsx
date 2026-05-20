'use client'

import { useState } from 'react'
import type { DbRecommendation } from '../types'
import { Badge } from '@/components/ui/badge'
import { HelpTooltip } from '@/components/ui/HelpTooltip'
import { AnnotatedScreenshot } from './AnnotatedScreenshot'
import { WireframePreview } from './WireframePreview'
import { createShareLink } from '../actions'
import { getQuadrantLabel } from './ImpactEffortMatrix'
import Link from 'next/link'

const priorityVariant: Record<number, 'p1' | 'p2' | 'p3' | 'p4' | 'p5'> = {
  1: 'p1', 2: 'p2', 3: 'p3', 4: 'p4', 5: 'p5',
}

const QUADRANT_STYLES: Record<string, string> = {
  'Do First':    'bg-violet-50 text-violet-700 border-violet-200',
  'Plan':        'bg-blue-50 text-blue-700 border-blue-200',
  'Quick Win':   'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Deprioritise':'bg-slate-50 text-slate-500 border-slate-200',
}

const SOURCE_ICON_CSV = (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0 mt-0.5">
    <rect x="1" y="1" width="10" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
    <path d="M3 4h6M3 6h6M3 8h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
)
const SOURCE_ICON_SCREENSHOT = (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0 mt-0.5">
    <rect x="1" y="2" width="10" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
    <circle cx="6" cy="6" r="2" stroke="currentColor" strokeWidth="1.2"/>
  </svg>
)
const SOURCE_ICON_DOC = (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0 mt-0.5">
    <rect x="2" y="1" width="8" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
    <path d="M4 4h4M4 6h4M4 8h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
)

function evidenceSourceIcon(evidence: string) {
  if (/screenshot|visual|image|ui|screen/i.test(evidence)) return SOURCE_ICON_SCREENSHOT
  if (/csv|funnel|data|metric|rate|drop|conversion/i.test(evidence)) return SOURCE_ICON_CSV
  return SOURCE_ICON_DOC
}

interface Props {
  rec: DbRecommendation
  screenshotUrl?: string
  projectId?: string
  hasProjectSegments?: boolean
}

export function RecommendationCard({ rec, screenshotUrl, projectId, hasProjectSegments }: Props) {
  const [copying, setCopying] = useState(false)
  const [copied, setCopied] = useState(false)

  const pct = Math.round(rec.confidence * 100)
  const pVariant = priorityVariant[rec.priority] ?? 'p5'
  const quadrant = getQuadrantLabel(rec)
  const quadrantStyle = QUADRANT_STYLES[quadrant] ?? QUADRANT_STYLES['Deprioritise']

  async function handleShare() {
    setCopying(true)
    try {
      const result = await createShareLink(rec.id)
      if (result.success) {
        await navigator.clipboard.writeText(result.url)
        setCopied(true)
        setTimeout(() => setCopied(false), 3000)
      }
    } finally {
      setCopying(false)
    }
  }

  return (
    <div id={`rec-card-${rec.id}`} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">

      {/* Annotated screenshot (if available) */}
      {rec.target_element && screenshotUrl && (
        <div className="p-4 border-b border-slate-100">
          <AnnotatedScreenshot
            screenshotUrl={screenshotUrl}
            targetElement={rec.target_element}
            recommendationId={rec.id}
            hypothesis={rec.hypothesis}
            evidence={rec.evidence}
          />
        </div>
      )}

      <div className="px-6 py-5 space-y-4">

        {/* Header row */}
        <div className="flex items-start gap-3">
          <Badge variant={pVariant} className="shrink-0 mt-0.5">P{rec.priority}</Badge>
          <div className="flex-1 min-w-0">
            <p className="text-base font-semibold text-slate-900 leading-snug">{rec.hypothesis}</p>
          </div>
          {/* Share button + manage link */}
          <div className="shrink-0 flex flex-col items-center gap-0.5">
            <button
              onClick={handleShare}
              disabled={copying}
              className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              title={copied ? 'Copied!' : 'Copy share link'}
              aria-label={copied ? 'Share link copied' : 'Copy share link'}
            >
              {copied ? (
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                  <path d="M2 7.5l4 4 7-7" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                  <path d="M10 2a2 2 0 100 4 2 2 0 000-4zM3 5a2 2 0 100 4 2 2 0 000-4zM10 9a2 2 0 100 4 2 2 0 000-4z" stroke="currentColor" strokeWidth="1.4"/>
                  <path d="M5 6.5l4-2M5 8.5l4 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
              )}
            </button>
            {copied && projectId && (
              <Link
                href={`/projects/${projectId}/share-links`}
                className="text-[9px] text-emerald-600 hover:underline whitespace-nowrap"
              >
                Manage links
              </Link>
            )}
          </div>
        </div>

        {/* Quadrant + confidence */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${quadrantStyle}`}>
            {quadrant}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-slate-400 tabular-nums">
            {pct}% confidence
            <HelpTooltip content="Confidence reflects how strongly the evidence supports this hypothesis. Higher = more data points aligned with this recommendation." side="top" />
          </span>
          <span className="inline-flex items-center gap-1">
            <Badge variant={rec.experiment_type === 'A/B Test' ? 'ab' : rec.experiment_type === 'Multivariate' ? 'multivariate' : rec.experiment_type === 'Feature Flag' ? 'flag' : rec.experiment_type === 'Holdout' ? 'holdout' : 'bandit'}>
              {rec.experiment_type}
            </Badge>
            <HelpTooltip content="The recommended experiment format based on hypothesis complexity and expected traffic volume." side="top" />
          </span>
        </div>

        {/* Segment targeting */}
        {rec.target_segments && rec.target_segments.length > 0 ? (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Targets</p>
            <div className="flex flex-wrap gap-1.5">
              {rec.target_segments.map(seg => (
                <span
                  key={seg.segment_id}
                  title={seg.relevance_reason}
                  className="inline-flex items-center gap-1 text-xs bg-violet-50 border border-violet-200 text-violet-700 px-2.5 py-1 rounded-full"
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="shrink-0">
                    <circle cx="4" cy="3.5" r="1.5" stroke="currentColor" strokeWidth="1.2"/>
                    <path d="M1 8.5c0-1.5 1.5-2.5 3-2.5s3 1 3 2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                  {seg.segment_name}
                </span>
              ))}
            </div>
          </div>
        ) : hasProjectSegments ? (
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-400 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-full">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="shrink-0">
              <circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M2 8c.5-2 1.5-3 3-3s2.5 1 3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              <circle cx="5" cy="3.5" r="1" stroke="currentColor" strokeWidth="1.2"/>
            </svg>
            Applies to all users
          </span>
        ) : (
          projectId && (
            <Link
              href={`/projects/${projectId}/segments`}
              className="text-xs text-violet-600 hover:underline"
            >
              + Add segments to see targeted recommendations
            </Link>
          )
        )}

        {/* Estimated reach */}
        {rec.estimated_reach != null && rec.estimated_reach > 0 && (
          <div className="bg-violet-50 border border-violet-200 rounded-lg px-3 py-2 flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-violet-500 shrink-0">
              <circle cx="5.5" cy="4.5" r="2" stroke="currentColor" strokeWidth="1.3"/>
              <path d="M1.5 11.5c0-2 2-3.5 4-3.5s4 1.5 4 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              <circle cx="10.5" cy="4" r="1.5" stroke="currentColor" strokeWidth="1.3"/>
              <path d="M10 10.5c0-1 .5-2 1.5-2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-violet-700">
              Estimated reach: ~{rec.estimated_reach.toLocaleString()} users
              <HelpTooltip content="Sum of users across all targeted segments. Actual reach depends on rollout percentage." side="right" />
            </span>
          </div>
        )}

        {/* Evidence with source icons */}
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Evidence</p>
          <ul className="space-y-1.5">
            {rec.evidence.map((e, i) => (
              <li key={i} className={`flex gap-2 text-sm text-slate-500${i >= 2 ? ' hidden sm:flex' : ''}`}>
                <span className="text-slate-400">{evidenceSourceIcon(e)}</span>
                <span>{e}</span>
              </li>
            ))}
          </ul>
          {rec.evidence.length > 2 && (
            <details className="sm:hidden mt-1">
              <summary className="text-xs text-violet-600 cursor-pointer select-none">+{rec.evidence.length - 2} more</summary>
              <ul className="space-y-1.5 mt-1.5">
                {rec.evidence.slice(2).map((e, i) => (
                  <li key={i} className="flex gap-2 text-sm text-slate-500">
                    <span className="text-slate-400">{evidenceSourceIcon(e)}</span>
                    <span>{e}</span>
                  </li>
                ))}
              </ul>
            </details>
          )}
        </div>

        {/* Rationale */}
        {rec.rationale && (
          <details className="group">
            <summary className="cursor-pointer list-none text-xs font-medium text-violet-600 hover:underline select-none">
              <span className="group-open:hidden">Show rationale ↓</span>
              <span className="hidden group-open:inline">Hide rationale ↑</span>
            </summary>
            <div className="mt-2 p-3 bg-slate-50 rounded-lg border border-slate-100">
              <p className="text-sm text-slate-500 leading-relaxed">{rec.rationale}</p>
            </div>
          </details>
        )}

        {/* Wireframe preview */}
        <WireframePreview recommendationId={rec.id} projectId={rec.project_id} />

        {/* PM summary box */}
        {rec.pm_summary && (
          <div className="bg-violet-50 border border-violet-200 rounded-lg p-4">
            <p className="text-xs font-semibold text-violet-500 uppercase tracking-wide mb-1">What to tell your team</p>
            <p className="text-sm text-slate-700 leading-relaxed">{rec.pm_summary}</p>
          </div>
        )}
      </div>
    </div>
  )
}
