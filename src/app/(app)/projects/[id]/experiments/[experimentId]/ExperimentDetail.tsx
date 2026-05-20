'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ExperimentCreated } from '@/components/illustrations/celebration/ExperimentCreated'
import { WinnerOutcome } from '@/components/illustrations/celebration/WinnerOutcome'
import { LoserOutcome } from '@/components/illustrations/celebration/LoserOutcome'
import { IllustrationModal } from '@/components/illustrations/IllustrationModal'
import { updateExperimentStatus } from '@/features/experiments/actions'
import { OutcomeForm } from '@/features/analysis/components/OutcomeForm'

type Exp = {
  id: string
  name: string
  hypothesis: string | null
  experiment_type: string | null
  status: string
  success_metric: string | null
  start_date: string | null
  end_date: string | null
  sample_size_goal: number | null
  owner_name: string | null
  owner_role: string | null
  notes: string | null
  outcome: string | null
  lift_percent: number | null
  outcome_notes: string | null
  created_at: string
}

type ModalState =
  | { type: 'created'; name: string }
  | { type: 'winner'; lift: number | null; metric: string | null }
  | { type: 'loser' }
  | null

const PIPELINE: { key: string; label: string }[] = [
  { key: 'planned',   label: 'Planned' },
  { key: 'running',   label: 'Running' },
  { key: 'completed', label: 'Complete' },
]

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  if (!value) return null
  return (
    <div className="flex items-start gap-3">
      <span className="text-xs font-semibold text-slate-500 w-32 shrink-0 pt-0.5">{label}</span>
      <span className="text-sm text-slate-800">{value}</span>
    </div>
  )
}

function formatDate(d: string | null) {
  if (!d) return null
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function ExperimentDetail({
  exp: rawExp,
  projectId,
  segmentName,
  recHypothesis,
  justCreated,
}: {
  exp: Record<string, unknown>
  projectId: string
  segmentName: string | null
  recHypothesis: string | null
  justCreated: boolean
}) {
  const exp = rawExp as Exp
  const router = useRouter()
  const [modal, setModal] = useState<ModalState>(justCreated ? { type: 'created', name: exp.name } : null)
  const [showOutcomeForm, setShowOutcomeForm] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)

  async function markRunning() {
    setUpdatingStatus(true)
    await updateExperimentStatus(exp.id, projectId, 'running')
    setUpdatingStatus(false)
    router.refresh()
  }

  function handleOutcomeSuccess() {
    setShowOutcomeForm(false)
    router.refresh()
    // Determine modal after a tick (to pick up new outcome from server)
    setTimeout(() => {
      router.refresh()
    }, 300)
  }

  const roleLabels: Record<string, string> = {
    pm: 'PM', designer: 'Designer', engineer: 'Engineer', data_analyst: 'Data Analyst',
  }

  return (
    <div className="max-w-2xl mx-auto px-8 py-10 space-y-8">

      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-2xl font-bold text-slate-900">{exp.name}</h1>
          <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${
            exp.status === 'planned'   ? 'bg-slate-100 text-slate-600' :
            exp.status === 'running'   ? 'bg-amber-50 text-amber-700' :
            exp.status === 'completed' ? 'bg-emerald-50 text-emerald-700' :
                                         'bg-red-50 text-red-600'
          }`}>
            {exp.status === 'running' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />}
            {exp.status}
          </span>
          {exp.experiment_type && (
            <span className="text-xs font-medium text-violet-600 bg-violet-50 px-2.5 py-1 rounded-full">
              {exp.experiment_type}
            </span>
          )}
        </div>

        {/* Status pipeline */}
        <div className="flex items-center gap-2 pt-2">
          {PIPELINE.map((step, i) => {
            const idx = PIPELINE.findIndex(s => s.key === exp.status)
            const done   = i < idx
            const active = i === idx
            return (
              <div key={step.key} className="flex items-center gap-2">
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  done   ? 'bg-violet-100 text-violet-700' :
                  active ? 'bg-violet-600 text-white' :
                           'bg-slate-100 text-slate-400'
                }`}>
                  {done && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                      <path d="M2 5l2.5 2.5 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                  {step.label}
                </div>
                {i < PIPELINE.length - 1 && <div className={`w-6 h-0.5 ${i < idx ? 'bg-violet-400' : 'bg-slate-200'}`} />}
              </div>
            )
          })}
        </div>
      </div>

      {/* Outcome badge */}
      {exp.outcome && (
        <div className={`flex items-center gap-3 rounded-2xl px-5 py-4 ${
          exp.outcome === 'won' ? 'bg-emerald-50 border border-emerald-200' :
          exp.outcome === 'lost' ? 'bg-red-50 border border-red-200' :
                                   'bg-slate-50 border border-slate-200'
        }`}>
          <span className="text-2xl">{exp.outcome === 'won' ? '🏆' : exp.outcome === 'lost' ? '📉' : '📊'}</span>
          <div>
            <p className="text-sm font-bold text-slate-800 capitalize">{exp.outcome}</p>
            {exp.lift_percent !== null && (
              <p className="text-xs text-slate-500">{exp.lift_percent > 0 ? '+' : ''}{exp.lift_percent}% on {exp.success_metric ?? 'primary metric'}</p>
            )}
            {exp.outcome_notes && <p className="text-xs text-slate-400 mt-0.5">{exp.outcome_notes}</p>}
          </div>
        </div>
      )}

      {/* Brief */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Experiment Brief</h2>
        <div className="space-y-3">
          {exp.hypothesis && (
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-1">Hypothesis</p>
              <p className="text-sm text-slate-800 leading-relaxed">{exp.hypothesis}</p>
            </div>
          )}
          <InfoRow label="Success metric" value={exp.success_metric} />
          <InfoRow label="Audience" value={segmentName ?? 'All users'} />
          <InfoRow label="Start date" value={formatDate(exp.start_date)} />
          <InfoRow label="End date" value={formatDate(exp.end_date)} />
          <InfoRow label="Sample size goal" value={exp.sample_size_goal ? `${exp.sample_size_goal.toLocaleString()} users` : null} />
          <InfoRow label="Owner" value={exp.owner_name ? `${exp.owner_name}${exp.owner_role ? ` · ${roleLabels[exp.owner_role] ?? exp.owner_role}` : ''}` : null} />
          {exp.notes && (
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-1">Team brief</p>
              <p className="text-sm text-slate-700 leading-relaxed">{exp.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Linked recommendation */}
      {recHypothesis && (
        <div className="bg-violet-50 border border-violet-200 rounded-2xl px-5 py-4">
          <p className="text-xs font-semibold text-violet-500 mb-1">From recommendation</p>
          <p className="text-sm text-violet-800 leading-relaxed line-clamp-3">{recHypothesis}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        {exp.status === 'planned' && (
          <button
            onClick={markRunning}
            disabled={updatingStatus}
            className="flex-1 py-3 rounded-xl bg-amber-500 text-white text-sm font-semibold hover:bg-amber-600 transition-colors disabled:opacity-50"
          >
            {updatingStatus ? 'Updating…' : '▶ Mark as running'}
          </button>
        )}
        {exp.status === 'running' && !exp.outcome && (
          <button
            onClick={() => setShowOutcomeForm(true)}
            className="flex-1 py-3 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors"
          >
            Log outcome
          </button>
        )}
      </div>

      {/* Modals */}
      {modal?.type === 'created' && (
        <IllustrationModal
          illustration={ExperimentCreated}
          heading="Experiment launched!"
          body={`"${modal.name}" is now planned. Share the brief with your team and kick it off.`}
          cta="Got it 🚀"
          onClose={() => setModal(null)}
          celebrate
        />
      )}

      {modal?.type === 'winner' && (
        <IllustrationModal
          illustration={WinnerOutcome}
          heading="You found a winner! 🏆"
          body={`${modal.lift !== null ? `+${modal.lift}% lift on ${modal.metric ?? 'your metric'}. ` : ''}This result has been added to your benchmark data to improve future recommendations.`}
          cta="Run another experiment →"
          ctaHref={`/projects/${projectId}/experiments/new`}
          onClose={() => setModal(null)}
          celebrate
        />
      )}

      {modal?.type === 'loser' && (
        <IllustrationModal
          illustration={LoserOutcome}
          heading="Good learning."
          body="Not every experiment wins — but every result makes your next recommendation more accurate. Your benchmark data has been updated."
          cta="See next recommendation →"
          ctaHref={`/projects/${projectId}/recommendations`}
          onClose={() => setModal(null)}
          celebrate={false}
        />
      )}

      {showOutcomeForm && (
        <OutcomeForm
          runId={exp.id}
          runName={exp.name}
          projectId={projectId}
          onClose={() => setShowOutcomeForm(false)}
          onSuccess={handleOutcomeSuccess}
        />
      )}
    </div>
  )
}
