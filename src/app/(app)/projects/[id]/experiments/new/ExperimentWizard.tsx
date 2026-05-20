'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { NoExperiments } from '@/components/illustrations/product/NoExperiments'
import { NoSegments } from '@/components/illustrations/product/NoSegments'
import { AnalysisRunning } from '@/components/illustrations/product/AnalysisRunning'
import { createExperimentRun } from '@/features/experiments/actions'
import { EXPERIMENT_TYPES, OWNER_ROLES } from '@/features/experiments/schema'
import type { ExperimentAutofill } from '@/lib/experiments/autofill'
import type { UserSegment } from '@/features/segments/types'

type Props = {
  projectId: string
  projectName: string
  autofill: ExperimentAutofill
  segments: UserSegment[]
}

const STEPS = [
  { label: 'What', heading: 'What are you testing?' },
  { label: 'Who',  heading: 'Who are you targeting?' },
  { label: 'How',  heading: 'How will you measure it?' },
]

function SpeechBubble({ text }: { text: string }) {
  return (
    <div className="relative bg-white rounded-2xl border border-slate-200 shadow-sm px-4 py-3 text-xs text-slate-600 leading-relaxed">
      <div className="absolute -bottom-2 left-8 w-4 h-4 bg-white border-b border-r border-slate-200 rotate-45" />
      {text}
    </div>
  )
}

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {STEPS.map((s, i) => {
        const done    = i < step
        const active  = i === step
        return (
          <div key={s.label} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div className={[
                'w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all',
                done   ? 'bg-violet-600 border-violet-600' :
                active ? 'bg-white border-violet-600' :
                         'bg-white border-slate-200',
              ].join(' ')}>
                {done ? (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M2.5 7l3 3 6-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <span className={`text-xs font-bold ${active ? 'text-violet-600' : 'text-slate-300'}`}>{i + 1}</span>
                )}
              </div>
              <span className={`text-[10px] font-semibold ${active ? 'text-violet-600' : done ? 'text-violet-400' : 'text-slate-300'}`}>
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`w-16 h-0.5 mb-4 mx-1 transition-all ${i < step ? 'bg-violet-600' : 'bg-slate-200'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="block text-sm font-semibold text-slate-700 mb-1.5">{children}</label>
}

function FieldHint({ children }: { children: React.ReactNode }) {
  return <p className="text-xs text-slate-400 mt-1">{children}</p>
}

function inputClass(err?: boolean) {
  return `w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all focus:ring-2 focus:ring-violet-400 ${err ? 'border-red-400' : 'border-slate-200 hover:border-slate-300'}`
}

export function ExperimentWizard({ projectId, projectName, autofill, segments }: Props) {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Step 1 fields
  const [name, setName]                   = useState(autofill.suggestedName)
  const [hypothesis, setHypothesis]       = useState(autofill.hypothesis)
  const [experimentType, setExperimentType] = useState(autofill.experiment_type)
  const [step1Errors, setStep1Errors]     = useState<Record<string, string>>({})

  // Step 2 fields
  const [segmentId, setSegmentId]               = useState<string | null>(null)
  const [segmentRationale, setSegmentRationale] = useState('')

  // Step 3 fields
  const [successMetric, setSuccessMetric]   = useState(autofill.success_metric)
  const [startDate, setStartDate]           = useState(autofill.start_date)
  const [endDate, setEndDate]               = useState(autofill.end_date)
  const [sampleSize, setSampleSize]         = useState(String(autofill.sample_size_goal))
  const [ownerName, setOwnerName]           = useState('')
  const [ownerRole, setOwnerRole]           = useState('')
  const [notes, setNotes]                   = useState('')
  const [step3Errors, setStep3Errors]       = useState<Record<string, string>>({})

  function validateStep1() {
    const errs: Record<string, string> = {}
    if (!name.trim()) errs.name = 'Name is required'
    if (!hypothesis.trim() || hypothesis.trim().length < 10) errs.hypothesis = 'At least 10 characters required'
    if (!experimentType) errs.experimentType = 'Select a type'
    setStep1Errors(errs)
    return Object.keys(errs).length === 0
  }

  function validateStep3() {
    const errs: Record<string, string> = {}
    if (!successMetric.trim()) errs.successMetric = 'Required'
    if (!startDate) errs.startDate = 'Required'
    if (!endDate) errs.endDate = 'Required'
    if (startDate && endDate && endDate <= startDate) errs.endDate = 'Must be after start date'
    setStep3Errors(errs)
    return Object.keys(errs).length === 0
  }

  function handleStartDateChange(v: string) {
    setStartDate(v)
    if (v) {
      const d = new Date(v)
      d.setDate(d.getDate() + 14)
      setEndDate(d.toISOString().split('T')[0])
    }
  }

  async function handleSubmit() {
    if (!validateStep3()) return
    setSubmitting(true)
    setSubmitError(null)

    const result = await createExperimentRun(projectId, {
      name,
      hypothesis,
      experiment_type: experimentType,
      segment_id: segmentId,
      segment_rationale: segmentRationale || undefined,
      success_metric: successMetric,
      start_date: startDate,
      end_date: endDate,
      sample_size_goal: sampleSize ? parseInt(sampleSize, 10) : undefined,
      owner_name: ownerName || undefined,
      owner_role: ownerRole || undefined,
      notes: notes || undefined,
      recommendation_id: autofill.recommendation_id ?? undefined,
    })

    setSubmitting(false)
    if (!result.success) {
      setSubmitError(result.error)
      return
    }

    router.push(`/projects/${projectId}/experiments/${result.id}?created=1`)
  }

  const illustrations = [NoExperiments, NoSegments, AnalysisRunning]
  const IllustrationComponent = illustrations[step]
  const speeches = [
    "Every great experiment starts with a clear hypothesis. What change are you testing?",
    "Targeting the right users makes your results more meaningful. Who should see this experiment?",
    "A clear success metric is what separates a learning from a guess. What will you measure?",
  ]

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href={`/projects/${projectId}/experiments`}
          className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
        >
          ← {projectName}
        </Link>
        <span className="text-slate-300">/</span>
        <span className="text-sm font-semibold text-slate-700">New experiment</span>
      </div>

      <div className="bg-white rounded-3xl shadow-[0_4px_32px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden">
        <div className="px-8 pt-8 pb-6 border-b border-slate-100">
          <ProgressBar step={step} />
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{STEPS[step].heading}</h1>
        </div>

        <div className="flex gap-0">
          {/* Left: form */}
          <div className="flex-1 px-8 py-7 space-y-5">

            {/* ── STEP 1 ── */}
            {step === 0 && (
              <>
                <div>
                  <FieldLabel>Experiment name</FieldLabel>
                  <input
                    className={inputClass(!!step1Errors.name)}
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. A/B Test on checkout — June 2026"
                  />
                  {step1Errors.name && <p className="text-xs text-red-500 mt-1">{step1Errors.name}</p>}
                </div>

                <div>
                  <FieldLabel>Hypothesis</FieldLabel>
                  <textarea
                    className={`${inputClass(!!step1Errors.hypothesis)} resize-none`}
                    rows={4}
                    value={hypothesis}
                    onChange={e => setHypothesis(e.target.value)}
                    placeholder="We believe that… will result in… because…"
                  />
                  {step1Errors.hypothesis
                    ? <p className="text-xs text-red-500 mt-1">{step1Errors.hypothesis}</p>
                    : autofill.hypothesis
                      ? <FieldHint>Pre-filled from your top recommendation — edit freely</FieldHint>
                      : null}
                </div>

                <div>
                  <FieldLabel>Experiment type</FieldLabel>
                  <div className="flex flex-wrap gap-2">
                    {EXPERIMENT_TYPES.map(t => (
                      <button
                        key={t.value}
                        type="button"
                        onClick={() => setExperimentType(t.value)}
                        className={[
                          'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all',
                          experimentType === t.value
                            ? 'bg-violet-600 text-white border-violet-600 shadow-sm'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-violet-300 hover:text-violet-600',
                        ].join(' ')}
                      >
                        <span>{t.icon}</span>
                        {t.label}
                      </button>
                    ))}
                  </div>
                  {step1Errors.experimentType && <p className="text-xs text-red-500 mt-1">{step1Errors.experimentType}</p>}
                </div>

                <button
                  onClick={() => { if (validateStep1()) setStep(1) }}
                  className="w-full mt-2 py-3 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors"
                >
                  Who are you testing on? →
                </button>
              </>
            )}

            {/* ── STEP 2 ── */}
            {step === 1 && (
              <>
                <div>
                  <FieldLabel>Target audience</FieldLabel>
                  {segments.length === 0 ? (
                    <div className="rounded-xl border border-slate-200 px-4 py-4 text-sm text-slate-500 bg-slate-50">
                      No segments defined yet.{' '}
                      <Link href={`/projects/${projectId}/segments`} className="text-violet-600 font-semibold hover:underline">
                        Add segments
                      </Link>{' '}
                      to target specific user groups.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-2">
                      {/* All users */}
                      <button
                        type="button"
                        onClick={() => setSegmentId(null)}
                        className={[
                          'text-left rounded-xl border-2 px-4 py-3 transition-all',
                          segmentId === null
                            ? 'border-violet-600 bg-violet-50'
                            : 'border-slate-200 hover:border-violet-200',
                        ].join(' ')}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-slate-800">All users</span>
                          {segmentId === null && (
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                              <circle cx="8" cy="8" r="7" fill="#7c3aed"/>
                              <path d="M4.5 8l2.5 2.5 4.5-4.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">Show to everyone</p>
                      </button>
                      {segments.map(seg => (
                        <button
                          key={seg.id}
                          type="button"
                          onClick={() => setSegmentId(seg.id)}
                          className={[
                            'text-left rounded-xl border-2 px-4 py-3 transition-all',
                            segmentId === seg.id
                              ? 'border-violet-600 bg-violet-50'
                              : 'border-slate-200 hover:border-violet-200',
                          ].join(' ')}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-slate-800">{seg.name}</span>
                            {segmentId === seg.id && (
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                                <circle cx="8" cy="8" r="7" fill="#7c3aed"/>
                                <path d="M4.5 8l2.5 2.5 4.5-4.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {segmentId !== null && (
                  <div>
                    <FieldLabel>Why this audience? <span className="text-slate-400 font-normal">(optional)</span></FieldLabel>
                    <textarea
                      className={`${inputClass()} resize-none`}
                      rows={3}
                      value={segmentRationale}
                      onChange={e => setSegmentRationale(e.target.value)}
                      placeholder="e.g. Mobile users show 3x higher drop-off at this step"
                    />
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setStep(0)}
                    className="flex-1 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => setStep(2)}
                    className="flex-[2] py-3 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors"
                  >
                    How will you measure it? →
                  </button>
                </div>
              </>
            )}

            {/* ── STEP 3 ── */}
            {step === 2 && (
              <>
                <div>
                  <FieldLabel>Success metric</FieldLabel>
                  <input
                    className={inputClass(!!step3Errors.successMetric)}
                    value={successMetric}
                    onChange={e => setSuccessMetric(e.target.value)}
                    placeholder="e.g. Checkout conversion rate"
                  />
                  <FieldHint>The single number that tells you if this worked</FieldHint>
                  {step3Errors.successMetric && <p className="text-xs text-red-500 mt-1">{step3Errors.successMetric}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <FieldLabel>Start date</FieldLabel>
                    <input
                      type="date"
                      className={inputClass(!!step3Errors.startDate)}
                      value={startDate}
                      onChange={e => handleStartDateChange(e.target.value)}
                    />
                    {step3Errors.startDate && <p className="text-xs text-red-500 mt-1">{step3Errors.startDate}</p>}
                  </div>
                  <div>
                    <FieldLabel>End date</FieldLabel>
                    <input
                      type="date"
                      className={inputClass(!!step3Errors.endDate)}
                      value={endDate}
                      onChange={e => setEndDate(e.target.value)}
                    />
                    {step3Errors.endDate && <p className="text-xs text-red-500 mt-1">{step3Errors.endDate}</p>}
                  </div>
                </div>

                <div>
                  <FieldLabel>Sample size goal <span className="text-slate-400 font-normal">(optional)</span></FieldLabel>
                  <input
                    type="number"
                    className={inputClass()}
                    value={sampleSize}
                    onChange={e => setSampleSize(e.target.value)}
                    min={100}
                    placeholder="1000"
                  />
                  <FieldHint>Minimum users needed for statistical significance</FieldHint>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <FieldLabel>Owner <span className="text-slate-400 font-normal">(optional)</span></FieldLabel>
                    <input
                      className={inputClass()}
                      value={ownerName}
                      onChange={e => setOwnerName(e.target.value)}
                      placeholder="Jane Smith"
                    />
                  </div>
                  <div>
                    <FieldLabel>Role <span className="text-slate-400 font-normal">(optional)</span></FieldLabel>
                    <div className="relative">
                      <select
                        className={`${inputClass()} appearance-none pr-8`}
                        value={ownerRole}
                        onChange={e => setOwnerRole(e.target.value)}
                      >
                        <option value="">Select…</option>
                        {OWNER_ROLES.map(r => (
                          <option key={r.value} value={r.value}>{r.label}</option>
                        ))}
                      </select>
                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <FieldLabel>Team brief <span className="text-slate-400 font-normal">(optional)</span></FieldLabel>
                  <textarea
                    className={`${inputClass()} resize-none`}
                    rows={3}
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="e.g. Only show to new users on mobile checkout"
                  />
                </div>

                {submitError && (
                  <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{submitError}</p>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="flex-[2] py-3 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Launching…
                      </span>
                    ) : 'Launch experiment 🚀'}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Right: illustration */}
          <div className="hidden md:flex w-52 flex-col items-center justify-start pt-6 px-4 pb-6 border-l border-slate-100 bg-slate-50/50 gap-4">
            <IllustrationComponent className="h-44 w-44" />
            <SpeechBubble text={speeches[step]} />
          </div>
        </div>
      </div>
    </div>
  )
}
