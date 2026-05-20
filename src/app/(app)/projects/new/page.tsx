'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { createProject } from '@/features/projects/actions'
import { NoProjects } from '@/components/illustrations/product/NoProjects'

// ── Industry config ────────────────────────────────────────────────────────

const INDUSTRIES = [
  { value: 'saas_b2c',    label: 'SaaS B2C' },
  { value: 'marketplace', label: 'Marketplace' },
  { value: 'ecommerce',   label: 'E-commerce' },
  { value: 'fintech',     label: 'Fintech' },
  { value: 'healthtech',  label: 'Healthtech' },
] as const

type IndustryValue = typeof INDUSTRIES[number]['value']

const DEFAULT_STAGES: Record<IndustryValue, string[]> = {
  saas_b2c:    ['Landing', 'Sign Up', 'Email Verify', 'Onboarding', 'First Value', 'Retained'],
  marketplace: ['Discovery', 'Browse', 'Listing View', 'Enquiry', 'Transaction', 'Repeat'],
  ecommerce:   ['Landing', 'Browse', 'Product View', 'Add to Cart', 'Checkout', 'Purchase'],
  fintech:     ['Landing', 'Sign Up', 'KYC', 'Account Setup', 'First Transaction', 'Active'],
  healthtech:  ['Onboard', 'Assessment', 'Plan Selection', 'First Session', 'Week 2', 'Retained'],
}

const METRIC_SUGGESTIONS: Record<IndustryValue, string[]> = {
  saas_b2c:    ['Activation rate', 'Day-7 retention', 'Trial-to-paid conversion', 'MRR growth'],
  marketplace: ['GMV', 'Listing conversion', 'Repeat purchase rate', 'Buyer-to-seller ratio'],
  ecommerce:   ['Add-to-cart rate', 'Checkout conversion', 'Average order value', 'Return rate'],
  fintech:     ['KYC completion', 'First transaction', '30-day retention', 'AUM growth'],
  healthtech:  ['Assessment completion', 'Plan adoption', 'Session frequency', 'Outcome score'],
}

const BENCHMARKS: Record<IndustryValue, { label: string; value: string }[]> = {
  saas_b2c:    [
    { label: 'Avg trial-to-paid', value: '8–12%' },
    { label: 'Onboarding drop-off', value: '30–40%' },
    { label: 'Top-quartile activation', value: '>45%' },
  ],
  marketplace: [
    { label: 'Listing conversion', value: '2–5%' },
    { label: 'Repeat purchase rate', value: '25–35%' },
    { label: 'Buyer retention D30', value: '40–55%' },
  ],
  ecommerce:   [
    { label: 'Add-to-cart rate', value: '8–12%' },
    { label: 'Checkout conversion', value: '2–4%' },
    { label: 'Avg order value growth', value: '5–15%/yr' },
  ],
  fintech:     [
    { label: 'KYC completion', value: '60–75%' },
    { label: 'First transaction D7', value: '35–50%' },
    { label: '30-day retention', value: '45–60%' },
  ],
  healthtech:  [
    { label: 'Assessment completion', value: '55–70%' },
    { label: 'Plan adoption', value: '30–45%' },
    { label: 'Week-4 retention', value: '35–50%' },
  ],
}

const INDUSTRY_ICONS: Record<IndustryValue, React.ReactNode> = {
  saas_b2c:    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 1l1.5 4h4l-3.25 2.5 1.25 4L8 9 4.5 11.5l1.25-4L2.5 5h4z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>,
  marketplace: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 2h12l-1.5 6H3.5L2 2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/><circle cx="5" cy="13" r="1.25" stroke="currentColor" strokeWidth="1.3"/><circle cx="11" cy="13" r="1.25" stroke="currentColor" strokeWidth="1.3"/></svg>,
  ecommerce:   <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4 3h10l-1 7H5L4 3z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/><path d="M1 1h2.5l.5 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><circle cx="6.5" cy="13.5" r="1" stroke="currentColor" strokeWidth="1.3"/><circle cx="11.5" cy="13.5" r="1" stroke="currentColor" strokeWidth="1.3"/></svg>,
  fintech:     <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><rect x="2" y="4" width="12" height="9" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M2 7h12" stroke="currentColor" strokeWidth="1.3"/><path d="M5 10.5h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  healthtech:  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 13.5C4 11 2 8.5 2 6a3.5 3.5 0 017-0 3.5 3.5 0 017 0c0 2.5-2 5-6 7.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>,
}

// ── Sortable pill ────────────────────────────────────────────────────────

function SortablePill({ id, label, onRemove }: { id: string; label: string; onRemove: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
      className="inline-flex items-center gap-1.5 bg-violet-50 border border-violet-200 text-violet-800 text-xs font-medium px-2.5 py-1.5 rounded-full cursor-grab select-none"
    >
      <span {...attributes} {...listeners} className="cursor-grab">
        <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true" className="opacity-40">
          <circle cx="3" cy="2.5" r="1"/><circle cx="7" cy="2.5" r="1"/>
          <circle cx="3" cy="5" r="1"/><circle cx="7" cy="5" r="1"/>
          <circle cx="3" cy="7.5" r="1"/><circle cx="7" cy="7.5" r="1"/>
        </svg>
      </span>
      {label}
      <button type="button" onClick={onRemove} className="ml-0.5 text-violet-400 hover:text-violet-700 transition-colors" aria-label={`Remove ${label}`}>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
          <path d="M2 2l6 6M8 2L2 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  )
}

// ── Tag input ────────────────────────────────────────────────────────────

function TagInput({ stages, onChange }: { stages: string[]; onChange: (s: string[]) => void }) {
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  function addStage(raw: string) {
    const trimmed = raw.trim()
    if (trimmed && !stages.includes(trimmed)) onChange([...stages, trimmed])
    setInput('')
  }

  function handleKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addStage(input)
    } else if (e.key === 'Backspace' && input === '' && stages.length > 0) {
      onChange(stages.slice(0, -1))
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = stages.indexOf(active.id as string)
      const newIndex = stages.indexOf(over.id as string)
      onChange(arrayMove(stages, oldIndex, newIndex))
    }
  }

  return (
    <div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div
          className="min-h-[52px] w-full rounded-lg border border-slate-200 px-3 py-2 flex flex-wrap gap-1.5 items-center cursor-text focus-within:ring-2 focus-within:ring-violet-300 focus-within:border-violet-400 transition-all"
          onClick={() => inputRef.current?.focus()}
        >
          <SortableContext items={stages} strategy={horizontalListSortingStrategy}>
            {stages.map(s => (
              <SortablePill
                key={s}
                id={s}
                label={s}
                onRemove={() => onChange(stages.filter(x => x !== s))}
              />
            ))}
          </SortableContext>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            onBlur={() => { if (input.trim()) addStage(input) }}
            placeholder={stages.length === 0 ? 'Type a stage, press Enter…' : ''}
            className="flex-1 min-w-[120px] text-sm text-slate-800 placeholder:text-slate-400 outline-none bg-transparent"
          />
        </div>
      </DndContext>
      <p className="text-xs text-slate-400 mt-1.5">Press Enter after each stage. Drag to reorder.</p>
    </div>
  )
}

// ── Metric suggestions ───────────────────────────────────────────────────

function MetricInput({
  value, onChange, industry,
}: { value: string; onChange: (v: string) => void; industry: IndustryValue | '' }) {
  const [open, setOpen] = useState(false)
  const suggestions = industry ? METRIC_SUGGESTIONS[industry] : []

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setOpen(suggestions.length > 0)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder="e.g. Activation rate, Day-7 retention"
        className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400 transition-all"
      />
      {open && (
        <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white rounded-lg border border-slate-200 shadow-lg overflow-hidden">
          {suggestions.map(s => (
            <button
              key={s}
              type="button"
              onMouseDown={() => { onChange(s); setOpen(false) }}
              className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-violet-50 hover:text-violet-800 transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Right panel ────────────────────────────────────────────────────────

function ContextPanel({ industry, stageCount }: { industry: IndustryValue | ''; stageCount: number }) {
  if (!industry) {
    return (
      <div className="space-y-4">
        <NoProjects className="h-32 w-full" />
        <div>
          <p className="text-sm font-semibold text-slate-900 mb-3">What makes a great project?</p>
          <ul className="space-y-2">
            {[
              'A clear funnel with defined stages',
              'One primary metric you\'re trying to move',
              'A specific user audience in mind',
            ].map(tip => (
              <li key={tip} className="flex items-start gap-2 text-xs text-slate-500">
                <span className="mt-0.5 shrink-0 w-4 h-4 rounded-full bg-violet-100 flex items-center justify-center">
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
                    <path d="M1.5 4l1.5 1.5 3-3" stroke="#7c3aed" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  const industryLabel = INDUSTRIES.find(i => i.value === industry)?.label ?? ''
  const benchmarks = BENCHMARKS[industry]

  return (
    <div className="space-y-5">
      {/* Benchmarks */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-slate-500">{INDUSTRY_ICONS[industry]}</span>
          <p className="text-sm font-semibold text-slate-900">{industryLabel} benchmarks</p>
        </div>
        <div className="space-y-2">
          {benchmarks.map(b => (
            <div key={b.label} className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2">
              <span className="text-xs text-slate-500">{b.label}</span>
              <span className="text-xs font-bold text-slate-800">{b.value}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-2">Based on our benchmark database</p>
      </div>

      {/* What AI will analyse — shown after 2+ stages */}
      {stageCount >= 2 && (
        <div className="border-t border-slate-100 pt-4 space-y-2.5">
          <p className="text-sm font-semibold text-slate-900">What the AI will analyse</p>
          <ul className="space-y-1.5">
            {[
              'Drop-off rate at each funnel stage',
              `Comparison to ${industryLabel} benchmarks`,
              'Experiment opportunities ranked by impact',
            ].map(item => (
              <li key={item} className="flex items-start gap-2 text-xs text-slate-600">
                <span className="mt-0.5 shrink-0 w-4 h-4 rounded-full bg-emerald-50 flex items-center justify-center">
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
                    <path d="M1.5 4l1.5 1.5 3-3" stroke="#10b981" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                {item}
              </li>
            ))}
          </ul>
          <p className="text-xs text-violet-600 font-medium">Upload your CSV after this step to personalise further</p>
        </div>
      )}
    </div>
  )
}

// ── Step indicator ────────────────────────────────────────────────────────

function StepIndicator() {
  const steps = ['Product', 'Data', 'Analysis']
  return (
    <div className="flex items-center justify-center gap-0 mt-4">
      {steps.map((label, i) => (
        <div key={label} className="flex items-center">
          <div className="flex flex-col items-center gap-1">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
              i === 0 ? 'bg-violet-600 border-violet-600 text-white' : 'bg-white border-slate-200 text-slate-300'
            }`}>
              {i === 0 ? (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <circle cx="6" cy="4" r="2.5" stroke="white" strokeWidth="1.4"/>
                  <path d="M1.5 11c0-2.485 2.015-4.5 4.5-4.5S10.5 8.515 10.5 11" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
              ) : (i + 1)}
            </div>
            <span className={`text-[10px] font-semibold ${i === 0 ? 'text-violet-600' : 'text-slate-300'}`}>{label}</span>
          </div>
          {i < steps.length - 1 && (
            <div className="w-12 h-0.5 mb-4 mx-1 bg-slate-200" />
          )}
        </div>
      ))}
    </div>
  )
}

// ── Form field wrapper ────────────────────────────────────────────────────

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-sm font-medium text-slate-700 mb-1.5">
      {children}{required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
  )
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">{children}</p>
  )
}

// ── Draft localStorage key ────────────────────────────────────────────────

const DRAFT_KEY = 'new_project_draft'

type Draft = {
  name: string
  appUrl: string
  targetAudience: string
  industry: IndustryValue | ''
  stages: string[]
  primaryMetric: string
  businessGoal: string
  description: string
}

const EMPTY_DRAFT: Draft = {
  name: '', appUrl: '', targetAudience: '', industry: '',
  stages: [], primaryMetric: '', businessGoal: '', description: '',
}

// ── Main page ─────────────────────────────────────────────────────────────

export default function NewProjectPage() {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Lazy init reads localStorage once on mount — no effect, no cascading renders
  const [draft, setDraft] = useState<Draft>(() => {
    if (typeof window === 'undefined') return EMPTY_DRAFT
    try {
      const raw = localStorage.getItem(DRAFT_KEY)
      if (!raw) return EMPTY_DRAFT
      const d = JSON.parse(raw) as Draft
      return {
        name: d.name ?? '',
        appUrl: d.appUrl ?? '',
        targetAudience: d.targetAudience ?? '',
        industry: d.industry ?? '',
        stages: d.stages ?? [],
        primaryMetric: d.primaryMetric ?? '',
        businessGoal: d.businessGoal ?? '',
        description: d.description ?? '',
      }
    } catch { return EMPTY_DRAFT }
  })
  const { name, appUrl, targetAudience, industry, stages, primaryMetric, businessGoal, description } = draft

  function set<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft(prev => ({ ...prev, [key]: value }))
  }

  // Progressive reveal
  const showSection2 = name.trim().length > 0
  const showSection3 = !!industry

  // Favicon domain
  const faviconDomain = (() => {
    try { return new URL(appUrl).hostname } catch { return null }
  })()

  // Save draft on every change
  const saveDraft = useCallback(() => {
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify(draft)) } catch { /* ignore */ }
  }, [draft])

  useEffect(() => { saveDraft() }, [saveDraft])

  // Pre-fill stages when industry changes
  function selectIndustry(v: IndustryValue) {
    setDraft(prev => ({
      ...prev,
      industry: v,
      stages: prev.stages.length === 0 ? DEFAULT_STAGES[v] : prev.stages,
    }))
  }

  // Submit
  const canSubmit = name.trim().length > 0 && !!industry && stages.length >= 2

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!canSubmit || submitting) return
    setSubmitting(true)
    setServerError(null)
    const result = await createProject({
      name: name.trim(),
      app_url: appUrl.trim() || undefined,
      target_audience: targetAudience.trim() || undefined,
      funnel_stages: stages.join(','),
      primary_metric: primaryMetric.trim() || undefined,
      business_goal: businessGoal.trim() || undefined,
      description: description.trim() || undefined,
    })
    if (!result.success) {
      setServerError(result.error)
      setSubmitting(false)
      return
    }
    try { localStorage.removeItem(DRAFT_KEY) } catch { /* ignore */ }
    router.push(`/projects/${result.id}`)
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Top nav */}
      <div className="max-w-5xl mx-auto px-8 pt-8">
        <Link href="/dashboard" className="text-sm text-slate-400 hover:text-slate-700 transition-colors">
          ← Dashboard
        </Link>
      </div>

      {/* Page header */}
      <div className="max-w-5xl mx-auto px-8 pt-6 pb-8 text-center">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Step 1 of 3</p>
        <h1 className="text-2xl font-bold text-slate-900 mb-1.5">Tell us about your product</h1>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          The AI uses this to calibrate recommendations to your specific funnel and audience.
        </p>
        <StepIndicator />
      </div>

      {/* Two-column layout */}
      <div className="max-w-5xl mx-auto px-8 pb-16">
        <form onSubmit={handleSubmit}>
          <div className="flex gap-8 items-start">

            {/* ── Left: form ── */}
            <div className="flex-1 space-y-8 min-w-0">

              {/* Section 1 — The basics */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
                <SectionHeader>About your product</SectionHeader>

                <div>
                  <FieldLabel required>Project name</FieldLabel>
                  <input
                    type="text"
                    value={name}
                    onChange={e => set('name', e.target.value)}
                    placeholder="e.g. Checkout funnel Q3"
                    className="w-full rounded-lg border border-slate-200 px-3.5 py-3 text-lg text-slate-900 placeholder:text-slate-300 font-medium focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400 transition-all"
                    autoFocus
                  />
                </div>

                <div>
                  <FieldLabel>App / product URL</FieldLabel>
                  <input
                    type="url"
                    value={appUrl}
                    onChange={e => set('appUrl', e.target.value)}
                    placeholder="https://myapp.com"
                    className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400 transition-all"
                  />
                  {faviconDomain && (
                    <div className="flex items-center gap-2 mt-2 px-1">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`https://www.google.com/s2/favicons?domain=${faviconDomain}&sz=16`}
                        alt=""
                        width={16}
                        height={16}
                        className="rounded-sm"
                      />
                      <span className="text-xs text-slate-500">{faviconDomain}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Section 2 — Your users (revealed after name) */}
              <div
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5 transition-all duration-300 origin-top"
                style={{
                  opacity: showSection2 ? 1 : 0,
                  transform: showSection2 ? 'translateY(0)' : 'translateY(-8px)',
                  pointerEvents: showSection2 ? 'auto' : 'none',
                  maxHeight: showSection2 ? '1000px' : '0px',
                  overflow: 'hidden',
                  padding: showSection2 ? undefined : '0',
                  marginTop: showSection2 ? undefined : '0',
                  border: showSection2 ? undefined : 'none',
                }}
              >
                <SectionHeader>Who uses your product</SectionHeader>

                <div>
                  <FieldLabel>Target audience</FieldLabel>
                  <input
                    type="text"
                    value={targetAudience}
                    onChange={e => set('targetAudience', e.target.value)}
                    placeholder="e.g. Mobile users aged 25–40 in the US"
                    className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400 transition-all"
                  />
                </div>

                <div>
                  <FieldLabel required>Industry</FieldLabel>
                  <div className="flex flex-wrap gap-2">
                    {INDUSTRIES.map(ind => (
                      <button
                        key={ind.value}
                        type="button"
                        onClick={() => selectIndustry(ind.value)}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-sm font-medium transition-all ${
                          industry === ind.value
                            ? 'border-violet-600 bg-violet-50 text-violet-700 shadow-sm'
                            : 'border-slate-200 bg-white text-slate-600 hover:border-violet-300 hover:text-violet-600'
                        }`}
                      >
                        <span className={industry === ind.value ? 'text-violet-600' : 'text-slate-400'}>
                          {INDUSTRY_ICONS[ind.value]}
                        </span>
                        {ind.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Section 3 — Your funnel (revealed after industry) */}
              <div
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5 transition-all duration-300 origin-top"
                style={{
                  opacity: showSection3 ? 1 : 0,
                  transform: showSection3 ? 'translateY(0)' : 'translateY(-8px)',
                  pointerEvents: showSection3 ? 'auto' : 'none',
                  maxHeight: showSection3 ? '2000px' : '0px',
                  overflow: 'hidden',
                  padding: showSection3 ? undefined : '0',
                  marginTop: showSection3 ? undefined : '0',
                  border: showSection3 ? undefined : 'none',
                }}
              >
                <SectionHeader>What you&apos;re optimising</SectionHeader>

                <div>
                  <FieldLabel required>Funnel stages</FieldLabel>
                  <TagInput stages={stages} onChange={v => set('stages', v)} />
                </div>

                <div>
                  <FieldLabel>Primary metric</FieldLabel>
                  <MetricInput value={primaryMetric} onChange={v => set('primaryMetric', v)} industry={industry} />
                </div>

                <div>
                  <FieldLabel>Business goal</FieldLabel>
                  <textarea
                    value={businessGoal}
                    onChange={e => set('businessGoal', e.target.value)}
                    rows={2}
                    placeholder="e.g. Increase trial-to-paid conversion from 8% to 14% in Q3"
                    className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400 transition-all resize-none"
                  />
                  <p className="text-xs text-slate-400 mt-1.5">This gives the AI context for prioritising recommendations</p>
                </div>

                <div>
                  <FieldLabel>Additional context <span className="text-slate-400 font-normal">(optional)</span></FieldLabel>
                  <textarea
                    value={description}
                    onChange={e => set('description', e.target.value)}
                    rows={2}
                    placeholder="Anything else the AI should know about your product or users"
                    className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400 transition-all resize-none"
                  />
                </div>
              </div>

              {serverError && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-600">
                  {serverError}
                </div>
              )}

              {/* Submit */}
              <div className="group">
                <button
                  type="submit"
                  disabled={!canSubmit || submitting}
                  title={!canSubmit ? 'Fill in project name, industry, and funnel stages to continue' : undefined}
                  className={`w-full py-3.5 rounded-lg text-sm font-semibold transition-all relative overflow-hidden ${
                    canSubmit && !submitting
                      ? 'bg-violet-600 text-white hover:bg-violet-700 shadow-md hover:shadow-lg cursor-pointer'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {/* Shimmer when enabled */}
                  {canSubmit && !submitting && (
                    <span
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.18) 50%, transparent 60%)',
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 2s infinite',
                      }}
                    />
                  )}
                  <span className="relative flex items-center justify-center gap-2">
                    {!canSubmit && (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                        <rect x="3" y="6" width="8" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
                        <path d="M5 6V4.5a2 2 0 014 0V6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                      </svg>
                    )}
                    {submitting ? 'Creating project…' : 'Create project & set up data →'}
                  </span>
                </button>
                <style>{`@keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }`}</style>
              </div>
            </div>

            {/* ── Right: context panel ── */}
            <div className="hidden lg:block w-72 shrink-0 sticky top-8">
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <ContextPanel industry={industry} stageCount={stages.length} />
              </div>
            </div>

          </div>
        </form>
      </div>
    </main>
  )
}
