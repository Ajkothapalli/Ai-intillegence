'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import type { OnboardingStep } from '../types'

const ALL_STEPS: OnboardingStep[] = [
  'create_project',
  'connect_integration',
  'upload_data',
  'run_analysis',
  'view_recommendations',
]

interface StepConfig {
  title: string
  description: string
  action: string
  href: (projectId?: string) => string
}

const STEP_CONFIG: Record<OnboardingStep, StepConfig> = {
  create_project: {
    title: 'Create your first project',
    description: 'Set up a project with your app context and target metric.',
    action: 'Create project',
    href: () => '/experiments',
  },
  connect_integration: {
    title: 'Connect an analytics tool',
    description: 'Link Mixpanel, Amplitude, PostHog, or another platform.',
    action: 'Connect',
    href: (id) => id ? `/projects/${id}/integrations` : '/integrations',
  },
  upload_data: {
    title: 'Upload your data',
    description: 'Add a funnel CSV or screenshots for the AI to analyse.',
    action: 'Upload data',
    href: (id) => id ? `/projects/${id}/uploads` : '/experiments',
  },
  run_analysis: {
    title: 'Run your first analysis',
    description: 'Our AI reads your data and generates experiment recommendations.',
    action: 'Run analysis',
    href: (id) => id ? `/projects/${id}/analysis` : '/experiments',
  },
  view_recommendations: {
    title: 'View your recommendations',
    description: 'Browse prioritised experiment hypotheses ranked by impact.',
    action: 'View',
    href: (id) => id ? `/projects/${id}/recommendations` : '/experiments',
  },
}

interface Props {
  stepsCompleted: OnboardingStep[]
  completedAt: string | null
  firstProjectId?: string
}

export function OnboardingChecklist({ stepsCompleted, completedAt, firstProjectId }: Props) {
  const [dismissed, setDismissed] = useState(false)
  const confettiFiredRef = useRef(false)

  const doneCount = stepsCompleted.length
  const allDone = completedAt !== null || doneCount === ALL_STEPS.length

  useEffect(() => {
    if (!allDone || confettiFiredRef.current) return
    confettiFiredRef.current = true
    void import('canvas-confetti').then(({ default: confetti }) => {
      void confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#196262', '#7c3aed', '#059669', '#0284c7', '#d97706'],
      })
    })
  }, [allDone])

  if (dismissed) return null
  if (!allDone && stepsCompleted.length === 0 && completedAt === null) {
    // first render — show
  } else if (allDone && completedAt) {
    // show completion state
  }

  if (allDone) {
    return (
      <div className="bg-white rounded-2xl border border-emerald-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-50 to-[var(--forest-50)] px-6 py-5 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-emerald-600">
                <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M6 10l3 3 5-5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-emerald-900">You&apos;re all set!</p>
              <p className="text-xs text-emerald-700 mt-0.5 leading-relaxed">
                Setup complete. Keep running analyses after each sprint to track improvement over time.
              </p>
            </div>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="shrink-0 w-7 h-7 flex items-center justify-center rounded-lg text-emerald-500 hover:bg-emerald-100 transition-colors"
            aria-label="Dismiss"
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M1 1l11 11M12 1L1 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-[var(--border)] shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1.5">
            <p className="text-sm font-semibold text-foreground">Get started</p>
            <span className="text-xs text-[var(--foreground-subtle)]">{doneCount} of {ALL_STEPS.length} steps complete</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-[var(--primary)] rounded-full transition-all duration-500"
              style={{ width: `${(doneCount / ALL_STEPS.length) * 100}%` }}
            />
          </div>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="shrink-0 w-7 h-7 flex items-center justify-center rounded-lg text-[var(--foreground-muted)] hover:bg-gray-100 transition-colors"
          aria-label="Dismiss"
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M1 1l11 11M12 1L1 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      <div className="divide-y divide-[var(--border)]">
        {ALL_STEPS.map(step => {
          const done = stepsCompleted.includes(step)
          const config = STEP_CONFIG[step]
          const href = config.href(firstProjectId)
          return (
            <div key={step} className={`flex items-center gap-4 px-6 py-3.5 ${done ? 'opacity-60' : ''}`}>
              {/* Check circle */}
              <div className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${done ? 'bg-violet-600' : 'border-2 border-slate-300'}`}>
                {done && (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5l2.5 2.5 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${done ? 'text-[var(--foreground-muted)] line-through' : 'text-foreground'}`}>
                  {config.title}
                </p>
                <p className="text-xs text-[var(--foreground-muted)] mt-0.5">{config.description}</p>
              </div>

              {/* Action */}
              {!done && (
                <div className="flex flex-col items-end gap-1">
                  <Link
                    href={href}
                    className="shrink-0 h-7 px-3 rounded-full bg-[var(--forest-50)] text-xs font-semibold text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition-colors border border-[var(--primary)]/20"
                  >
                    {config.action}
                  </Link>
                  {step === 'upload_data' && (
                    <a href="/api/templates/funnel-csv" download className="text-[10px] text-[var(--foreground-muted)] hover:text-foreground whitespace-nowrap">
                      Download template
                    </a>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
