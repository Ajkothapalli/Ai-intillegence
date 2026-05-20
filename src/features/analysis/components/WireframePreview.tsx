'use client'

import { useState } from 'react'
import { generateWireframeForRecommendation } from '../actions'

interface Props {
  recommendationId: string
  projectId: string
  preloadedHtml?: string
  preloadedDescription?: string
}

export function WireframePreview({ recommendationId, projectId, preloadedHtml, preloadedDescription }: Props) {
  const [html, setHtml] = useState<string | null>(preloadedHtml ?? null)
  const [description, setDescription] = useState<string | null>(preloadedDescription ?? null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [view, setView] = useState<'annotated' | 'wireframe'>('annotated')

  async function handleGenerate() {
    setLoading(true)
    setError(null)
    try {
      const result = await generateWireframeForRecommendation(recommendationId, projectId)
      if (!result.success) {
        setError(result.error)
        return
      }
      // Fetch the wireframe HTML
      const res = await fetch(`/api/wireframes/${result.wireframeId}`)
      if (res.ok) {
        const data = await res.json() as { html: string; description: string }
        setHtml(data.html)
        setDescription(data.description)
        setView('wireframe')
      }
    } catch {
      setError('Failed to generate wireframe')
    } finally {
      setLoading(false)
    }
  }

  if (!html && !loading) {
    return (
      <div>
        <button
          onClick={handleGenerate}
          className="inline-flex items-center gap-2 h-8 px-4 rounded-full border border-violet-600 text-violet-600 text-xs font-semibold hover:bg-violet-50 transition-colors"
        >
          {/* Wand2 icon */}
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M2 12l7-7M9 2l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M11 1l2 2-1 1-2-2 1-1zM1 11l2 2-1 1-2-2 1-1z" fill="currentColor"/>
            <path d="M6.5 4.5l3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          See proposed design
        </button>
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-2.5 py-1" aria-busy="true" aria-label="Generating wireframe">
        <div className="flex items-center gap-2 text-xs text-violet-600 font-medium">
          <span className="w-3.5 h-3.5 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" aria-hidden="true" />
          Generating proposed design…
        </div>
        {/* Skeleton */}
        <div className="w-full rounded-lg border border-slate-100 bg-slate-50 p-3 space-y-2 animate-pulse">
          <div className="h-3 w-2/3 bg-slate-200 rounded" />
          <div className="h-24 w-full bg-slate-200 rounded-md" />
          <div className="h-3 w-1/2 bg-slate-200 rounded" />
          <div className="h-3 w-3/4 bg-slate-200 rounded" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Toggle */}
      <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-full w-fit">
        <button
          onClick={() => setView('annotated')}
          className={`text-xs font-medium px-3 py-1 rounded-full transition-colors ${view === 'annotated' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Annotated current
        </button>
        <button
          onClick={() => setView('wireframe')}
          className={`text-xs font-medium px-3 py-1 rounded-full transition-colors ${view === 'wireframe' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Proposed design
        </button>
      </div>

      {view === 'wireframe' && html && (
        <div className="space-y-2">
          <p className="text-[10px] font-semibold text-amber-600 uppercase tracking-wide">
            Proposed design — for reference only, not final
          </p>
          <iframe
            srcDoc={html}
            sandbox="allow-same-origin allow-scripts"
            {...{ csp: "default-src 'none'; style-src 'unsafe-inline' https://cdn.tailwindcss.com; font-src https://fonts.gstatic.com" }}
            className="w-full rounded-lg border border-slate-200 bg-white"
            style={{ height: 400 }}
            title="Proposed design wireframe"
          />
          {description && <p className="text-xs text-slate-500">{description}</p>}
        </div>
      )}
    </div>
  )
}
