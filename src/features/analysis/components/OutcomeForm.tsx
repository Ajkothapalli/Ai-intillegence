'use client'

import { useState } from 'react'
import { logOutcome } from '../actions'

type EntryMode = 'manual' | 'external'
type Verdict = 'won' | 'lost' | 'inconclusive'

const PLATFORMS = ['Mixpanel', 'GA4', 'Amplitude', 'PostHog', 'Other'] as const

interface Props {
  runId: string
  runName: string
  projectId: string
  onClose: () => void
  onSuccess: () => void
}

export function OutcomeForm({ runId, runName, projectId, onClose, onSuccess }: Props) {
  const [mode, setMode] = useState<EntryMode>('manual')
  const [verdict, setVerdict] = useState<Verdict>('won')
  const [metricName, setMetricName] = useState('')
  const [baseline, setBaseline] = useState('')
  const [result, setResult] = useState('')
  const [sampleSize, setSampleSize] = useState('')
  const [confidence, setConfidence] = useState(95)
  const [notes, setNotes] = useState('')
  const [platform, setPlatform] = useState<string>(PLATFORMS[0])
  const [reportUrl, setReportUrl] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const baselineNum = parseFloat(baseline)
  const resultNum   = parseFloat(result)
  const lift = !isNaN(baselineNum) && !isNaN(resultNum) && baselineNum !== 0
    ? ((resultNum - baselineNum) / baselineNum) * 100
    : null

  async function handleSave() {
    setSaving(true)
    setError(null)
    const liftPercent = lift !== null ? parseFloat(lift.toFixed(2)) : null
    const res = await logOutcome(runId, projectId, verdict, liftPercent, notes.trim() || null)
    setSaving(false)
    if (res.success) onSuccess()
    else setError(res.error)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end bg-black/40 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white w-full sm:w-[420px] sm:h-full sm:max-h-screen overflow-y-auto shadow-2xl sm:rounded-l-2xl border-t sm:border-t-0 sm:border-l border-slate-200 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Log outcome</h2>
            <p className="text-xs text-slate-500 mt-0.5 truncate max-w-[280px]">{runName}</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Mode toggle */}
        <div className="px-6 pt-5">
          <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => setMode('manual')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${mode === 'manual' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Manual entry
            </button>
            <button
              type="button"
              onClick={() => setMode('external')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${mode === 'external' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              From external tool
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full">More reliable</span>
            </button>
          </div>

          {mode === 'manual' && (
            <p className="text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2 mt-2">
              External tool data is more reliable. Consider connecting Mixpanel or GA4.
            </p>
          )}
        </div>

        {/* Form */}
        <div className="px-6 py-5 space-y-4 flex-1">

          {mode === 'external' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Platform</label>
                <select
                  value={platform}
                  onChange={e => setPlatform(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
                >
                  {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                  Report URL <span className="font-normal text-slate-400">(optional)</span>
                </label>
                <input
                  value={reportUrl}
                  onChange={e => setReportUrl(e.target.value)}
                  placeholder="https://…"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
                />
              </div>
            </>
          )}

          {/* Metric fields (shared) */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Metric</label>
              <input
                value={metricName}
                onChange={e => setMetricName(e.target.value)}
                placeholder="e.g. Activation rate"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Sample size</label>
              <input
                type="number"
                value={sampleSize}
                onChange={e => setSampleSize(e.target.value)}
                placeholder="e.g. 5000"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Baseline</label>
              <input
                type="number"
                step="0.01"
                value={baseline}
                onChange={e => setBaseline(e.target.value)}
                placeholder="e.g. 0.24"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Result</label>
              <input
                type="number"
                step="0.01"
                value={result}
                onChange={e => setResult(e.target.value)}
                placeholder="e.g. 0.27"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
              />
            </div>
          </div>

          {/* Lift preview */}
          {lift !== null && (
            <div className={`rounded-lg px-4 py-2 text-sm font-semibold flex items-center gap-2 ${lift >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
              <span>Lift:</span>
              <span>{lift >= 0 ? '+' : ''}{lift.toFixed(1)}%</span>
            </div>
          )}

          {/* Confidence slider */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Confidence level</label>
              <span className="text-sm font-semibold text-slate-700">{confidence}%</span>
            </div>
            <input
              type="range"
              min={50}
              max={99}
              value={confidence}
              onChange={e => setConfidence(Number(e.target.value))}
              className="w-full accent-violet-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
              <span>50%</span><span>99%</span>
            </div>
          </div>

          {/* Verdict */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Verdict</label>
            <div className="flex gap-2">
              {(['won', 'lost', 'inconclusive'] as Verdict[]).map(v => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setVerdict(v)}
                  className={`flex-1 py-2 rounded-lg border text-xs font-semibold capitalize transition-colors ${
                    verdict === v
                      ? v === 'won' ? 'bg-emerald-500 text-white border-emerald-500'
                      : v === 'lost' ? 'bg-red-500 text-white border-red-500'
                      : 'bg-slate-600 text-white border-slate-600'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {v === 'won' ? 'Winner' : v === 'lost' ? 'Loser' : 'Inconclusive'}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
              Notes <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              placeholder="What did you learn? Any surprises?"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 resize-none"
            />
          </div>

          {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

          <div className="bg-violet-50 border border-violet-200 rounded-lg px-3 py-2 text-xs text-violet-700">
            Outcome saved — benchmark data updated. Future AI analyses will use this result to calibrate confidence scores.
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex gap-2 sticky bottom-0 bg-white">
          <button type="button" onClick={onClose} className="flex-1 h-9 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50">
            Cancel
          </button>
          <button type="button" onClick={handleSave} disabled={saving} className="flex-1 h-9 rounded-lg bg-primary text-sm font-semibold text-primary-foreground hover:bg-[var(--primary-hover)] disabled:opacity-50">
            {saving ? 'Saving…' : 'Save outcome'}
          </button>
        </div>
      </div>
    </div>
  )
}
