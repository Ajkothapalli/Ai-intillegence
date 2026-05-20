'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { DbRecommendation } from '@/features/analysis/types'
import type { UserSegment } from '@/features/segments/types'
import { createExperimentRun } from '@/features/analysis/actions'
import { OutcomeForm } from '@/features/analysis/components/OutcomeForm'
import { NoExperiments } from '@/components/illustrations/product/NoExperiments'

type ExperimentRun = {
  id: string
  name: string
  hypothesis: string | null
  status: string
  segment_id: string | null
  segment_snapshot: UserSegment | null
  outcome: string | null
  lift_percent: number | null
  outcome_notes: string | null
  started_at: string | null
  completed_at: string | null
  created_at: string
  recommendation_id: string | null
}

interface Props {
  projectId: string
  projectName: string
  runs: ExperimentRun[]
  segments: UserSegment[]
  recommendations: Pick<DbRecommendation, 'id' | 'hypothesis' | 'experiment_type' | 'priority'>[]
}


function NewRunModal({
  projectId,
  segments,
  recommendations,
  onClose,
  onSuccess,
}: {
  projectId: string
  segments: UserSegment[]
  recommendations: Props['recommendations']
  onClose: () => void
  onSuccess: () => void
}) {
  const [name, setName] = useState('')
  const [hypothesis, setHypothesis] = useState('')
  const [selectedRecId, setSelectedRecId] = useState('')
  const [selectedSegmentId, setSelectedSegmentId] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSave() {
    if (!name.trim()) { setError('Name is required'); return }
    setSaving(true)
    setError(null)
    const result = await createExperimentRun(projectId, {
      name: name.trim(),
      hypothesis: hypothesis.trim() || undefined,
      recommendation_id: selectedRecId || undefined,
      segment_id: selectedSegmentId || undefined,
    })
    setSaving(false)
    if (result.success) onSuccess()
    else setError(result.error)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-2xl border border-[var(--border)] shadow-xl w-full max-w-md p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">New experiment run</h2>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-gray-100">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Name</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. CTA copy A/B test"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-300"
            />
          </div>

          {recommendations.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                Linked recommendation <span className="font-normal text-slate-400">(optional)</span>
              </label>
              <select
                value={selectedRecId}
                onChange={e => {
                  setSelectedRecId(e.target.value)
                  const rec = recommendations.find(r => r.id === e.target.value)
                  if (rec && !hypothesis) setHypothesis(rec.hypothesis)
                }}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-300"
              >
                <option value="">None</option>
                {recommendations.map(r => (
                  <option key={r.id} value={r.id}>
                    P{r.priority} — {r.hypothesis.slice(0, 60)}{r.hypothesis.length > 60 ? '…' : ''}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
              Hypothesis <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <textarea
              value={hypothesis}
              onChange={e => setHypothesis(e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-300 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
              Target audience <span className="font-normal text-slate-400">(optional)</span>
            </label>
            {segments.length === 0 ? (
              <p className="text-xs text-slate-400">
                No segments defined.{' '}
                <Link href={`/projects/${projectId}/segments`} className="text-violet-600 hover:underline">Create one →</Link>
              </p>
            ) : (
              <select
                value={selectedSegmentId}
                onChange={e => setSelectedSegmentId(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-300"
              >
                <option value="">All users</option>
                {segments.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name}{s.user_count != null ? ` — ${s.user_count.toLocaleString()} users` : ''}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

        <div className="flex gap-2 pt-1">
          <button type="button" onClick={onClose} className="flex-1 h-9 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button type="button" onClick={handleSave} disabled={saving} className="flex-1 h-9 rounded-lg bg-primary text-sm font-semibold text-primary-foreground hover:bg-[var(--primary-hover)] transition-colors disabled:opacity-50">
            {saving ? 'Creating…' : 'Create run'}
          </button>
        </div>
      </div>
    </div>
  )
}


const COLUMNS: { key: string; label: string; bg: string }[] = [
  { key: 'planned',   label: 'Planned',  bg: 'bg-slate-100' },
  { key: 'running',   label: 'Running',  bg: 'bg-amber-50' },
  { key: 'completed', label: 'Complete', bg: 'bg-emerald-50' },
]

function daysLeft(end: string | null): number | null {
  if (!end) return null
  return Math.ceil((new Date(end).getTime() - Date.now()) / 86400000)
}

function RunCard({ run, seg, onLogOutcome }: { run: ExperimentRun; seg: UserSegment | undefined; onLogOutcome: () => void }) {
  const days = run.status === 'running' ? daysLeft((run as ExperimentRun & { end_date?: string | null }).end_date ?? null) : null
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-2 hover:border-violet-300 hover:shadow-sm transition-all">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold text-slate-800 line-clamp-1">{run.name}</p>
        <div className="flex items-center gap-1 shrink-0">
          {days !== null && (
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${days <= 3 ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
              {days}d
            </span>
          )}
          {run.outcome && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${run.outcome === 'won' ? 'bg-emerald-50 text-emerald-700' : run.outcome === 'lost' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-500'}`}>
              {run.outcome === 'won' ? '🏆' : run.outcome === 'lost' ? '✗' : '—'} {run.outcome}
              {run.lift_percent != null && run.outcome === 'won' ? ` +${run.lift_percent}%` : ''}
            </span>
          )}
        </div>
      </div>
      {run.hypothesis && <p className="text-xs text-slate-400 line-clamp-2">{run.hypothesis}</p>}
      <div className="flex flex-wrap gap-1.5 items-center">
        {seg && <span className="text-[10px] font-medium text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full">{seg.name}</span>}
        {run.status !== 'completed' && (
          <button
            onClick={onLogOutcome}
            className="text-[10px] font-semibold text-violet-600 hover:text-violet-800 underline underline-offset-2"
          >
            Log outcome
          </button>
        )}
      </div>
    </div>
  )
}

export function ExperimentsClient({ projectId, projectName, runs, segments, recommendations }: Props) {
  const router = useRouter()
  const [modalOpen, setModalOpen] = useState(false)
  const [logOutcomeRun, setLogOutcomeRun] = useState<ExperimentRun | null>(null)
  const segmentMap = new Map(segments.map(s => [s.id, s]))

  if (runs.length === 0) {
    return (
      <main className="min-h-screen bg-background">
        <header className="border-b border-[var(--border)] bg-white px-8 py-4 flex items-center justify-between">
          <Link href={`/projects/${projectId}`} className="text-sm text-[var(--foreground-muted)] hover:text-foreground transition-colors">
            ← {projectName}
          </Link>
          <Link
            href={`/projects/${projectId}/experiments/new`}
            className="inline-flex items-center gap-1.5 bg-violet-600 text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-violet-700 transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            New experiment
          </Link>
        </header>
        <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
          <NoExperiments className="h-40 w-40 mb-5" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">No experiments yet</h2>
          <p className="text-sm text-slate-500 max-w-sm mb-6">
            Your recommendations are waiting to be tested. Turn your top hypothesis into a real experiment.
          </p>
          <Link
            href={`/projects/${projectId}/experiments/new`}
            className="inline-flex items-center gap-2 bg-violet-600 text-white font-semibold text-sm px-6 py-3 rounded-full hover:bg-violet-700 transition-colors shadow-sm"
          >
            Start your first experiment →
          </Link>
        </div>
      </main>
    )
  }

  const byStatus = (s: string) => runs.filter(r => r.status === s)

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-[var(--border)] bg-white px-8 py-4 flex items-center justify-between">
        <div>
          <Link href={`/projects/${projectId}`} className="text-sm text-[var(--foreground-muted)] hover:text-foreground transition-colors">
            ← {projectName}
          </Link>
          <h1 className="text-lg font-bold text-foreground mt-0.5">Experiments</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setModalOpen(true)}
            className="text-xs font-medium text-slate-500 hover:text-slate-700 px-3 py-2 rounded-full border border-slate-200 hover:border-slate-300 transition-colors"
          >
            Quick add
          </button>
          <Link
            href={`/projects/${projectId}/experiments/new`}
            className="inline-flex items-center gap-1.5 bg-violet-600 text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-violet-700 transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            New experiment
          </Link>
        </div>
      </header>

      <div className="px-8 py-6 grid grid-cols-1 lg:grid-cols-3 gap-5">
        {COLUMNS.map(col => {
          const colRuns = byStatus(col.key)
          return (
            <div key={col.key} className="space-y-3">
              <div className={`flex items-center gap-2 px-3 py-2 rounded-xl ${col.bg}`}>
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">{col.label}</span>
                <span className="ml-auto text-xs font-semibold text-slate-400">{colRuns.length}</span>
              </div>
              {colRuns.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 px-4 py-5 text-center">
                  <p className="text-xs text-slate-400">No {col.label.toLowerCase()} experiments</p>
                </div>
              ) : (
                colRuns.map(run => (
                  <RunCard
                    key={run.id}
                    run={run}
                    seg={run.segment_id ? segmentMap.get(run.segment_id) : undefined}
                    onLogOutcome={() => setLogOutcomeRun(run)}
                  />
                ))
              )}
            </div>
          )
        })}
      </div>

      {modalOpen && (
        <NewRunModal
          projectId={projectId}
          segments={segments}
          recommendations={recommendations}
          onClose={() => setModalOpen(false)}
          onSuccess={() => { setModalOpen(false); router.refresh() }}
        />
      )}

      {logOutcomeRun && (
        <OutcomeForm
          runId={logOutcomeRun.id}
          runName={logOutcomeRun.name}
          projectId={projectId}
          onClose={() => setLogOutcomeRun(null)}
          onSuccess={() => { setLogOutcomeRun(null); router.refresh() }}
        />
      )}
    </main>
  )
}
