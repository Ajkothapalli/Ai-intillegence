'use client'

import { useState } from 'react'
import { saveFunnelMapping } from '../actions'

type FunnelTemplate = {
  id: string
  name: string
  category: string
  stages: string[]
  industry_median_drop_off: Record<string, number>
}

interface Props {
  projectId: string
  templates: FunnelTemplate[]
  onDone: () => void
}

const CATEGORY_LABELS: Record<string, string> = {
  saas_b2c:    'SaaS / B2C',
  marketplace: 'Marketplace',
  ecommerce:   'E-commerce',
  fintech:     'Fintech',
  healthtech:  'Healthtech',
}

const CATEGORY_COLORS: Record<string, string> = {
  saas_b2c:    'border-violet-300 bg-violet-50 hover:border-violet-400',
  marketplace: 'border-blue-300 bg-blue-50 hover:border-blue-400',
  ecommerce:   'border-emerald-300 bg-emerald-50 hover:border-emerald-400',
  fintech:     'border-amber-300 bg-amber-50 hover:border-amber-400',
  healthtech:  'border-rose-300 bg-rose-50 hover:border-rose-400',
}

const SELECTED_COLORS: Record<string, string> = {
  saas_b2c:    'border-violet-600 bg-violet-100 ring-2 ring-violet-300',
  marketplace: 'border-blue-600 bg-blue-100 ring-2 ring-blue-300',
  ecommerce:   'border-emerald-600 bg-emerald-100 ring-2 ring-emerald-300',
  fintech:     'border-amber-600 bg-amber-100 ring-2 ring-amber-300',
  healthtech:  'border-rose-600 bg-rose-100 ring-2 ring-rose-300',
}

export function FunnelTemplateSelector({ projectId, templates, onDone }: Props) {
  const [selectedTemplate, setSelectedTemplate] = useState<FunnelTemplate | null>(null)
  const [stageMappings, setStageMappings] = useState<Record<string, string>>({})
  const [step, setStep] = useState<'select' | 'map'>('select')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleSelectTemplate(t: FunnelTemplate) {
    setSelectedTemplate(t)
    setStageMappings({})
  }

  function handleNext() {
    if (!selectedTemplate) return
    setStep('map')
  }

  function handleMapChange(stage: string, value: string) {
    setStageMappings(prev => ({ ...prev, [stage]: value }))
  }

  async function handleSave() {
    if (!selectedTemplate) return
    setSaving(true)
    setError(null)
    const result = await saveFunnelMapping(projectId, selectedTemplate.id, stageMappings)
    setSaving(false)
    if (result.success) {
      onDone()
    } else {
      setError(result.error)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={e => { if (e.target === e.currentTarget) onDone() }}
    >
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Choose your funnel template</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              We&apos;ll compare your drop-off rates against industry medians to find the biggest opportunities.
            </p>
          </div>
          <button
            onClick={onDone}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {step === 'select' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {templates.map(t => {
                const isSelected = selectedTemplate?.id === t.id
                const colorClass = isSelected
                  ? (SELECTED_COLORS[t.category] ?? 'border-violet-600 bg-violet-100 ring-2 ring-violet-300')
                  : (CATEGORY_COLORS[t.category] ?? 'border-slate-200 hover:border-slate-300')

                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleSelectTemplate(t)}
                    className={`text-left rounded-xl border p-4 transition-all ${colorClass}`}
                  >
                    <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                    <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wide mt-0.5">
                      {CATEGORY_LABELS[t.category] ?? t.category}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {t.stages.slice(0, 4).map((stage, i) => (
                        <span key={i} className="text-[10px] bg-white/70 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200">
                          {stage}
                        </span>
                      ))}
                      {t.stages.length > 4 && (
                        <span className="text-[10px] text-slate-400">+{t.stages.length - 4} more</span>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          )}

          {step === 'map' && selectedTemplate && (
            <div className="space-y-4">
              <p className="text-sm text-slate-600">
                Optionally map your CSV column values to <strong>{selectedTemplate.name}</strong> stage names.
                This helps the AI compare your actual data against industry benchmarks.
              </p>
              <div className="space-y-3">
                {selectedTemplate.stages.map(stage => (
                  <div key={stage} className="flex items-center gap-3">
                    <span className="text-sm font-medium text-slate-700 w-36 shrink-0">{stage}</span>
                    <input
                      value={stageMappings[stage] ?? ''}
                      onChange={e => handleMapChange(stage, e.target.value)}
                      placeholder="Your CSV value (optional)"
                      className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-300"
                    />
                  </div>
                ))}
              </div>
              {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-slate-100 flex gap-2">
          <button
            type="button"
            onClick={onDone}
            className="h-9 px-4 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Skip for now
          </button>
          <div className="flex-1" />
          {step === 'map' && (
            <button
              type="button"
              onClick={() => setStep('select')}
              className="h-9 px-4 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Back
            </button>
          )}
          {step === 'select' ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={!selectedTemplate}
              className="h-9 px-5 rounded-lg bg-primary text-sm font-semibold text-primary-foreground hover:bg-[var(--primary-hover)] transition-colors disabled:opacity-50"
            >
              Next →
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="h-9 px-5 rounded-lg bg-primary text-sm font-semibold text-primary-foreground hover:bg-[var(--primary-hover)] transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save template'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
