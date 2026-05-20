import type { Analysis, DbRecommendation } from '../types'

interface Props {
  analysisA: Analysis
  analysisB: Analysis
  recommendationsA: DbRecommendation[]
  recommendationsB: DbRecommendation[]
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function AnalysisComparison({ analysisA, analysisB, recommendationsA, recommendationsB }: Props) {
  const hypsA = new Set(recommendationsA.map(r => r.hypothesis))
  const hypsB = new Set(recommendationsB.map(r => r.hypothesis))

  const resolved = recommendationsA.filter(r => !hypsB.has(r.hypothesis))
  const newRecs = recommendationsB.filter(r => !hypsA.has(r.hypothesis))
  const unchanged = recommendationsA.filter(r => hypsB.has(r.hypothesis))

  const dateA = analysisA.completed_at ?? analysisA.created_at
  const dateB = analysisB.completed_at ?? analysisB.created_at

  return (
    <div className="space-y-6">
      {/* Summary banner */}
      <div className="bg-white rounded-xl border border-[var(--border)] px-6 py-4">
        <p className="text-sm font-semibold text-foreground mb-1">
          Since {formatDate(dateA)}
        </p>
        <div className="flex flex-wrap gap-4 text-xs">
          <span className="flex items-center gap-1.5 text-emerald-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            {newRecs.length} new recommendations
          </span>
          <span className="flex items-center gap-1.5 text-slate-500">
            <span className="w-2 h-2 rounded-full bg-slate-400" />
            {resolved.length} resolved
          </span>
          <span className="flex items-center gap-1.5 text-[var(--foreground-muted)]">
            <span className="w-2 h-2 rounded-full bg-slate-200" />
            {unchanged.length} carried over
          </span>
        </div>
      </div>

      {/* Three-column comparison */}
      <div className="grid grid-cols-[1fr_140px_1fr] gap-4">
        {/* Column A */}
        <div className="space-y-2">
          <div className="text-center">
            <p className="text-xs font-semibold text-[var(--foreground-subtle)] uppercase tracking-wide">Earlier</p>
            <p className="text-[11px] text-[var(--foreground-muted)]">{formatDate(dateA)} · {analysisA.model}</p>
          </div>
          {resolved.map(r => (
            <div key={r.id} className="bg-slate-50 rounded-lg border border-slate-200 px-3 py-2.5">
              <span className="inline-block text-[9px] font-bold uppercase tracking-wide bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded-full mb-1">Resolved</span>
              <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{r.hypothesis}</p>
              <p className="text-[10px] text-slate-400 mt-1">P{r.priority} · {r.experiment_type}</p>
            </div>
          ))}
          {unchanged.map(r => (
            <div key={r.id} className="bg-white rounded-lg border border-[var(--border)] px-3 py-2.5">
              <p className="text-xs text-foreground line-clamp-3 leading-relaxed">{r.hypothesis}</p>
              <p className="text-[10px] text-[var(--foreground-muted)] mt-1">P{r.priority} · {r.experiment_type}</p>
            </div>
          ))}
          {recommendationsA.length === 0 && (
            <p className="text-xs text-slate-400 text-center py-4">No recommendations</p>
          )}
        </div>

        {/* Changes column */}
        <div className="flex flex-col items-center pt-8 gap-2">
          <div className="w-px flex-1 bg-[var(--border)]" />
          <div className="text-center space-y-1.5 py-2">
            {newRecs.length > 0 && (
              <div className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5 whitespace-nowrap">
                +{newRecs.length} new
              </div>
            )}
            {resolved.length > 0 && (
              <div className="text-[10px] font-semibold text-slate-500 bg-slate-100 border border-slate-200 rounded-full px-2 py-0.5 whitespace-nowrap">
                {resolved.length} resolved
              </div>
            )}
            {unchanged.length > 0 && (
              <div className="text-[10px] text-slate-400 whitespace-nowrap">
                {unchanged.length} same
              </div>
            )}
          </div>
          <div className="w-px flex-1 bg-[var(--border)]" />
        </div>

        {/* Column B */}
        <div className="space-y-2">
          <div className="text-center">
            <p className="text-xs font-semibold text-[var(--foreground-subtle)] uppercase tracking-wide">Later</p>
            <p className="text-[11px] text-[var(--foreground-muted)]">{formatDate(dateB)} · {analysisB.model}</p>
          </div>
          {newRecs.map(r => (
            <div key={r.id} className="bg-emerald-50 rounded-lg border border-emerald-200 px-3 py-2.5">
              <span className="inline-block text-[9px] font-bold uppercase tracking-wide bg-emerald-200 text-emerald-700 px-1.5 py-0.5 rounded-full mb-1">New</span>
              <p className="text-xs text-emerald-900 line-clamp-3 leading-relaxed">{r.hypothesis}</p>
              <p className="text-[10px] text-emerald-600 mt-1">P{r.priority} · {r.experiment_type}</p>
            </div>
          ))}
          {recommendationsB
            .filter(r => hypsA.has(r.hypothesis))
            .map(r => (
              <div key={r.id} className="bg-white rounded-lg border border-[var(--border)] px-3 py-2.5">
                <p className="text-xs text-foreground line-clamp-3 leading-relaxed">{r.hypothesis}</p>
                <p className="text-[10px] text-[var(--foreground-muted)] mt-1">P{r.priority} · {r.experiment_type}</p>
              </div>
            ))}
          {recommendationsB.length === 0 && (
            <p className="text-xs text-slate-400 text-center py-4">No recommendations</p>
          )}
        </div>
      </div>
    </div>
  )
}
