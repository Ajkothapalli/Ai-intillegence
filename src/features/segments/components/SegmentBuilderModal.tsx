'use client'

import { useState } from 'react'
import type { UserSegment, SegmentDimensions, ExternalCohort } from '../types'
import type { SafeIntegration } from '@/features/integrations/types'
import { createSegment, updateSegment, fetchCohortsAction } from '../actions'

const ANALYTICS_PLATFORMS = ['mixpanel', 'amplitude', 'ga4', 'posthog', 'heap', 'segment', 'pendo']

type Tab = 'import' | 'manual'

interface Props {
  projectId: string
  integrations: SafeIntegration[]
  editingSegment?: UserSegment | null
  onClose: () => void
  onSuccess: () => void
}

const DEVICE_OPTIONS     = ['Mobile', 'Desktop', 'Tablet']
const CHANNEL_OPTIONS    = ['Paid Social', 'Organic Search', 'Referral', 'Direct', 'Email', 'Paid Search']
const PLAN_OPTIONS       = ['Free', 'Pro', 'Enterprise', 'Custom']
const BEHAVIOUR_OPTIONS  = ['Completed onboarding', 'Made first purchase', 'Churned', 'Inactive 30d', 'Power user']
const LIFECYCLE_OPTIONS  = ['New 0–7d', 'Growing 8–30d', 'Active', 'At-risk', 'Churned']
const GENDER_OPTIONS     = ['All', 'Male', 'Female', 'Non-binary', 'Prefer not to say']

function CheckboxGroup({
  label, options, selected, onChange,
}: {
  label: string
  options: string[]
  selected: string[]
  onChange: (vals: string[]) => void
}) {
  function toggle(val: string) {
    onChange(selected.includes(val) ? selected.filter(v => v !== val) : [...selected, val])
  }
  return (
    <fieldset className="space-y-1.5">
      <legend className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</legend>
      <div className="flex flex-wrap gap-1.5">
        {options.map(opt => (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            aria-pressed={selected.includes(opt)}
            className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
              selected.includes(opt)
                ? 'bg-violet-600 text-white border-violet-600'
                : 'bg-white text-slate-600 border-slate-200 hover:border-violet-400'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </fieldset>
  )
}

export function SegmentBuilderModal({ projectId, integrations, editingSegment, onClose, onSuccess }: Props) {
  const analyticsIntegrations = integrations.filter(i =>
    ANALYTICS_PLATFORMS.includes(i.platform) && i.status === 'connected'
  )

  const [tab, setTab] = useState<Tab>(editingSegment ? 'manual' : (analyticsIntegrations.length > 0 ? 'import' : 'manual'))

  // Import tab state
  const [selectedIntegrationId, setSelectedIntegrationId] = useState('')
  const [cohorts, setCohorts] = useState<ExternalCohort[]>([])
  const [loadingCohorts, setLoadingCohorts] = useState(false)
  const [cohortError, setCohortError] = useState<string | null>(null)
  const [selectedCohort, setSelectedCohort] = useState<ExternalCohort | null>(null)
  const [importing, setImporting] = useState(false)

  // Manual tab state
  const editing = editingSegment
  const [name, setName] = useState(editing?.name ?? '')
  const [description, setDescription] = useState(editing?.description ?? '')
  const [device, setDevice] = useState<string[]>((editing?.dimensions?.device ?? []) as string[])
  const [channel, setChannel] = useState<string[]>((editing?.dimensions?.acquisition_channel ?? []) as string[])
  const [geography, setGeography] = useState((editing?.dimensions?.geography ?? []) as string[])
  const [geoInput, setGeoInput] = useState('')
  const [planTier, setPlanTier] = useState<string[]>((editing?.dimensions?.plan_tier ?? []) as string[])
  const [behaviour, setBehaviour] = useState<string[]>((editing?.dimensions?.behaviour ?? []) as string[])
  const [lifecycle, setLifecycle] = useState<string[]>((editing?.dimensions?.lifecycle ?? []) as string[])
  const [ageMin, setAgeMin] = useState<number>(editing?.dimensions?.demographics?.age_min ?? 18)
  const [ageMax, setAgeMax] = useState<number>(editing?.dimensions?.demographics?.age_max ?? 65)
  const [gender, setGender] = useState<string[]>(editing?.dimensions?.demographics?.gender ?? ['All'])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleLoadCohorts() {
    if (!selectedIntegrationId) return
    setLoadingCohorts(true)
    setCohortError(null)
    setCohorts([])
    const result = await fetchCohortsAction(selectedIntegrationId)
    setLoadingCohorts(false)
    if (result.success) {
      setCohorts(result.cohorts)
      if (result.cohorts.length === 0) setCohortError('No cohorts found for this integration.')
    } else {
      setCohortError(result.error)
    }
  }

  async function handleImport() {
    if (!selectedCohort) return
    const integration = integrations.find(i => i.id === selectedIntegrationId)
    if (!integration) return
    setImporting(true)
    const platform = integration.platform === 'segment' ? 'segment_io' : integration.platform
    const result = await createSegment(projectId, {
      name:               selectedCohort.name,
      description:        selectedCohort.description ?? undefined,
      source:             platform as Parameters<typeof createSegment>[1]['source'],
      external_cohort_id: selectedCohort.id,
      dimensions:         selectedCohort.dimensions,
      user_count:         selectedCohort.user_count,
    })
    setImporting(false)
    if (result.success) {
      onSuccess()
    } else {
      setCohortError(result.error)
    }
  }

  async function handleSave() {
    if (!name.trim()) { setError('Name is required'); return }
    setSaving(true)
    setError(null)

    const dims: Partial<SegmentDimensions> = {}
    if (device.length > 0)    dims.device              = device
    if (channel.length > 0)   dims.acquisition_channel = channel
    if (geography.length > 0) dims.geography            = geography
    if (planTier.length > 0)  dims.plan_tier            = planTier
    if (behaviour.length > 0) dims.behaviour            = behaviour
    if (lifecycle.length > 0) dims.lifecycle            = lifecycle
    if (gender.length > 0 && !(gender.length === 1 && gender[0] === 'All')) {
      dims.demographics = { age_min: ageMin, age_max: ageMax, gender }
    }

    let result
    if (editing) {
      result = await updateSegment(editing.id, projectId, { name: name.trim(), description: description || undefined, dimensions: dims })
    } else {
      result = await createSegment(projectId, { name: name.trim(), description: description || undefined, source: 'manual', dimensions: dims })
    }

    setSaving(false)
    if (result.success) {
      onSuccess()
    } else {
      setError(result.error)
    }
  }

  function addGeo() {
    const trimmed = geoInput.trim()
    if (trimmed && !geography.includes(trimmed)) {
      setGeography([...geography, trimmed])
    }
    setGeoInput('')
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-2xl border border-[var(--border)] shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-900">
            {editing ? 'Edit segment' : 'New segment'}
          </h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-gray-100 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Tabs */}
        {!editing && (
          <div className="flex border-b border-slate-100 px-6">
            {(['import', 'manual'] as Tab[]).map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`py-3 mr-4 text-sm font-medium border-b-2 transition-colors ${
                  tab === t
                    ? 'border-violet-600 text-violet-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                {t === 'import' ? 'Import from integration' : 'Define manually'}
              </button>
            ))}
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {tab === 'import' && !editing && (
            <>
              {analyticsIntegrations.length === 0 ? (
                <p className="text-sm text-slate-500 bg-slate-50 rounded-lg px-4 py-3">
                  No connected analytics integrations. Connect one from the Integrations tab first.
                </p>
              ) : (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Integration
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={selectedIntegrationId}
                        onChange={e => { setSelectedIntegrationId(e.target.value); setCohorts([]); setSelectedCohort(null) }}
                        className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-300"
                      >
                        <option value="" disabled>Select platform…</option>
                        {analyticsIntegrations.map(i => (
                          <option key={i.id} value={i.id}>{i.platform.replace(/_/g, ' ')}</option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={handleLoadCohorts}
                        disabled={!selectedIntegrationId || loadingCohorts}
                        className="h-10 px-4 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-700 transition-colors disabled:opacity-50"
                      >
                        {loadingCohorts ? 'Loading…' : 'Load'}
                      </button>
                    </div>
                  </div>

                  {cohortError && (
                    <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{cohortError}</p>
                  )}

                  {cohorts.length > 0 && (
                    <div className="space-y-1.5">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        {cohorts.length} cohort{cohorts.length !== 1 ? 's' : ''} found
                      </p>
                      <div className="max-h-52 overflow-y-auto space-y-1.5 pr-1">
                        {cohorts.map(c => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => setSelectedCohort(selectedCohort?.id === c.id ? null : c)}
                            className={`w-full text-left rounded-lg border px-3 py-2.5 transition-colors ${
                              selectedCohort?.id === c.id
                                ? 'border-violet-400 bg-violet-50'
                                : 'border-slate-200 hover:border-violet-300'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-sm font-medium text-slate-800">{c.name}</p>
                              {c.user_count != null && (
                                <span className="text-xs text-slate-400 shrink-0">
                                  {c.user_count.toLocaleString()} users
                                </span>
                              )}
                            </div>
                            {c.description && (
                              <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{c.description}</p>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {(tab === 'manual' || editing) && (
            <>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Name</label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Mobile free-tier users"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-300"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Description</label>
                <input
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Optional"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-300"
                />
              </div>

              <div className="border-t border-slate-100 pt-4 space-y-4">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Dimensions</p>

                <CheckboxGroup label="Device" options={DEVICE_OPTIONS} selected={device} onChange={setDevice} />
                <CheckboxGroup label="Acquisition channel" options={CHANNEL_OPTIONS} selected={channel} onChange={setChannel} />

                {/* Geography */}
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Geography</p>
                  <div className="flex gap-2">
                    <input
                      value={geoInput}
                      onChange={e => setGeoInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addGeo() } }}
                      placeholder="Type a country (e.g. US) and press Enter"
                      className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
                    />
                    <button type="button" onClick={addGeo} className="px-3 py-2 rounded-lg bg-slate-100 text-xs font-medium text-slate-700 hover:bg-slate-200 transition-colors">Add</button>
                  </div>
                  {geography.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {geography.map(g => (
                        <span key={g} className="inline-flex items-center gap-1 text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                          {g}
                          <button type="button" onClick={() => setGeography(geography.filter(x => x !== g))} className="text-slate-400 hover:text-red-500">×</button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <CheckboxGroup label="Plan / Tier" options={PLAN_OPTIONS} selected={planTier} onChange={setPlanTier} />
                <CheckboxGroup label="Behaviour" options={BEHAVIOUR_OPTIONS} selected={behaviour} onChange={setBehaviour} />

                {/* Demographics */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Demographics</p>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500 w-16">Age {ageMin}–{ageMax >= 65 ? '65+' : ageMax}</span>
                    <input type="range" min={18} max={65} value={ageMin} onChange={e => setAgeMin(Number(e.target.value))} className="flex-1 accent-violet-600" />
                    <input type="range" min={18} max={65} value={ageMax} onChange={e => setAgeMax(Number(e.target.value))} className="flex-1 accent-violet-600" />
                  </div>
                  <CheckboxGroup label="Gender" options={GENDER_OPTIONS} selected={gender} onChange={setGender} />
                </div>

                <CheckboxGroup label="User lifecycle" options={LIFECYCLE_OPTIONS} selected={lifecycle} onChange={setLifecycle} />
              </div>

              {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-9 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          {tab === 'import' && !editing ? (
            <button
              type="button"
              onClick={handleImport}
              disabled={!selectedCohort || importing}
              className="flex-1 h-9 rounded-lg bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors disabled:opacity-50"
            >
              {importing ? 'Importing…' : 'Import segment'}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="flex-1 h-9 rounded-lg bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving…' : editing ? 'Update' : 'Create segment'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
