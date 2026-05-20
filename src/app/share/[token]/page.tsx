import { notFound } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import type { DbRecommendation, TargetSegmentRef } from '@/features/analysis/types'
import type { UIElement } from '@/lib/ai/schemas/recommendation'
import { LogoFull } from '@/components/logo'

type Props = { params: Promise<{ token: string }> }

const QUADRANT_STYLES: Record<string, string> = {
  'Do First':    'bg-violet-50 text-violet-700 border-violet-200',
  'Plan':        'bg-blue-50 text-blue-700 border-blue-200',
  'Quick Win':   'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Deprioritise':'bg-slate-50 text-slate-500 border-slate-200',
}

function getQuadrant(priority: number, experimentType: string): string {
  const EFFORT_MAP: Record<string, number> = {
    'A/B Test': 0.15, 'Feature Flag': 0.25, 'Holdout': 0.5, 'Bandit': 0.6, 'Multivariate': 0.85,
  }
  const impact = priority <= 2 ? 'high' : priority === 3 ? 'mid' : 'low'
  const effort = (EFFORT_MAP[experimentType] ?? 0.5) < 0.5 ? 'low' : 'high'
  if (impact === 'high' && effort === 'low') return 'Do First'
  if (impact === 'high' && effort === 'high') return 'Plan'
  if (impact !== 'high' && effort === 'low') return 'Quick Win'
  return 'Deprioritise'
}

export async function generateMetadata({ params }: Props) {
  const { token } = await params
  const supabase = await createServerClient()
  const { data: link } = await supabase
    .from('share_links')
    .select('recommendation_id')
    .eq('token', token)
    .gt('expires_at', new Date().toISOString())
    .single()
  if (!link) return { title: 'PM Brief' }
  const { data: rec } = await supabase
    .from('recommendations')
    .select('hypothesis, pm_summary')
    .eq('id', link.recommendation_id)
    .single()
  return {
    title: rec?.hypothesis ?? 'PM Brief',
    description: rec?.pm_summary ?? undefined,
    openGraph: {
      title: rec?.hypothesis ?? 'PM Brief',
      description: rec?.pm_summary ?? undefined,
    },
  }
}

export default async function SharePage({ params }: Props) {
  const { token } = await params
  const supabase = await createServerClient()

  // First check if token exists at all (may be revoked)
  const { data: anyLink } = await supabase
    .from('share_links')
    .select('recommendation_id, expires_at')
    .eq('token', token)
    .single()

  if (!anyLink) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-10 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" className="text-slate-400">
              <circle cx="11" cy="11" r="9" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M8 8l6 6M14 8l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <h1 className="text-lg font-semibold text-slate-900">This link is no longer active</h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            The person who shared this link has removed it. Ask them to share a new link if you still need access.
          </p>
        </div>
      </main>
    )
  }

  // Check if expired
  const { data: link } = await supabase
    .from('share_links')
    .select('recommendation_id, expires_at')
    .eq('token', token)
    .gt('expires_at', new Date().toISOString())
    .single()

  if (!link) notFound()

  const { data: rec } = await supabase
    .from('recommendations')
    .select('*')
    .eq('id', link.recommendation_id)
    .single()

  if (!rec) notFound()

  const recommendation = rec as DbRecommendation

  // Fetch wireframe if available
  const { data: wireframe } = await supabase
    .from('wireframes')
    .select('html, description')
    .eq('recommendation_id', link.recommendation_id)
    .maybeSingle()

  // Fetch screenshot signed URL if screenshot_id present
  let screenshotUrl: string | null = null
  if (recommendation.screenshot_id) {
    const { data: upload } = await supabase
      .from('uploads')
      .select('storage_path')
      .eq('id', recommendation.screenshot_id)
      .single()
    if (upload) {
      const { data: signed } = await supabase.storage
        .from('uploads')
        .createSignedUrl(upload.storage_path, 3600)
      screenshotUrl = signed?.signedUrl ?? null
    }
  }

  // Fetch project + analysis date
  const { data: analysis } = await supabase
    .from('analyses')
    .select('completed_at, projects(name)')
    .eq('id', recommendation.analysis_id)
    .single()

  const projectName = (analysis?.projects as { name?: string } | null)?.name ?? 'Experiment Intelligence'
  const analysisDate = analysis?.completed_at
    ? new Date(analysis.completed_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : null

  const quadrant = getQuadrant(recommendation.priority, recommendation.experiment_type)
  const quadrantStyle = QUADRANT_STYLES[quadrant] ?? QUADRANT_STYLES['Deprioritise']
  const pct = Math.round(recommendation.confidence * 100)
  const targetElement = recommendation.target_element as UIElement | null
  const targetSegments = recommendation.target_segments as TargetSegmentRef[] | null

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-6 py-10 space-y-8">

        {/* Header */}
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wide font-medium">{projectName}</p>
          {analysisDate && <p className="text-xs text-slate-400 mt-0.5">Analysis from {analysisDate}</p>}
        </div>

        {/* Annotated screenshot */}
        {targetElement && screenshotUrl && (
          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
            <div className="relative rounded-lg overflow-hidden border border-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={screenshotUrl} alt="Product screenshot" className="w-full h-auto block" />
              <div
                className="absolute pointer-events-none"
                style={{
                  left: `${targetElement.bounding_hint.x}%`,
                  top: `${targetElement.bounding_hint.y}%`,
                  width: `${targetElement.bounding_hint.width}%`,
                  height: `${targetElement.bounding_hint.height}%`,
                }}
              >
                <div className="absolute inset-0 bg-violet-600/20 rounded" />
                <div className="absolute inset-0 border-2 border-violet-600 rounded" />
              </div>
            </div>
            <div>
              <span className="text-xs font-semibold bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">
                {targetElement.label}
              </span>
              <p className="text-sm text-slate-600 mt-2">{targetElement.issue}</p>
            </div>
          </div>
        )}

        {/* Hypothesis */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-start gap-3 flex-wrap">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${quadrantStyle}`}>{quadrant}</span>
            <span className="text-xs text-slate-400 tabular-nums pt-0.5">{pct}% confidence</span>
          </div>
          <p className="text-lg font-semibold text-slate-900 leading-snug">{recommendation.hypothesis}</p>

          {/* Evidence */}
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Evidence</p>
            <ul className="space-y-1.5">
              {recommendation.evidence.map((e, i) => (
                <li key={i} className="flex gap-2 text-sm text-slate-500">
                  <span className="text-slate-300 shrink-0 mt-0.5">•</span>
                  <span>{e}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* PM summary */}
          {recommendation.pm_summary && (
            <div className="bg-violet-50 border border-violet-200 rounded-lg p-4">
              <p className="text-xs font-semibold text-violet-500 uppercase tracking-wide mb-1">What to tell your team</p>
              <p className="text-sm text-slate-700 leading-relaxed">{recommendation.pm_summary}</p>
            </div>
          )}

          {/* Target audience */}
          {targetSegments && targetSegments.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Target audience</p>
              <div className="flex flex-wrap gap-1.5">
                {targetSegments.map(seg => (
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
              {recommendation.estimated_reach != null && recommendation.estimated_reach > 0 && (
                <p className="text-xs text-slate-500 mt-1.5">
                  Estimated reach: ~{recommendation.estimated_reach.toLocaleString()} users
                </p>
              )}
            </div>
          )}
        </div>

        {/* Wireframe */}
        {wireframe && (
          <div className="space-y-2">
            <p className="text-[10px] font-semibold text-amber-600 uppercase tracking-wide">
              Proposed design — for reference only, not final
            </p>
            <iframe
              srcDoc={wireframe.html}
              sandbox="allow-same-origin"
              className="w-full rounded-xl border border-slate-200 bg-white"
              style={{ height: 400 }}
              title="Proposed design wireframe"
            />
            <p className="text-xs text-slate-500">{wireframe.description}</p>
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-slate-200 pt-6 flex flex-col items-center gap-2">
          <LogoFull variant="horizontal" theme="dark" className="opacity-50" />
          <p className="text-xs text-slate-400">Generated by Experiment Intelligence</p>
        </div>
      </div>
    </div>
  )
}
