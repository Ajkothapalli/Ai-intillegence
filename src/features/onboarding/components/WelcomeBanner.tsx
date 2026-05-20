'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { FTUEStage } from '@/lib/onboarding/userState'
import { UploadData } from '@/components/illustrations/product/UploadData'
import { AnalysisRunning } from '@/components/illustrations/product/AnalysisRunning'
import { ExperimentCreated } from '@/components/illustrations/celebration/ExperimentCreated'

type Props = {
  stage: FTUEStage
  industry: string
  demoProjectId: string | null
  realProjectId: string | null
}

type StageConfig = {
  eyebrow: React.ReactNode
  heading: string
  body: (ctx: { industry: string }) => string
  illustration: React.ReactNode
  ctas: React.ReactNode
  sub?: string
}

function EyebrowBadge({ children, dot }: { children: React.ReactNode; dot?: 'emerald' | 'violet' }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white mb-5">
      {dot && (
        <span className={`h-1.5 w-1.5 rounded-full ${dot === 'emerald' ? 'bg-emerald-400 animate-pulse' : 'bg-violet-300'}`} />
      )}
      {children}
    </span>
  )
}

function PrimaryCTA({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-indigo-900 hover:bg-white/90 transition-colors shadow-lg"
    >
      {children}
    </Link>
  )
}

function SecondaryCTA({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
    >
      {children}
    </Link>
  )
}

// Contextual illustration for the demo-loaded state.
// Shows a mini product mockup: funnel drop-off on the left, AI recs on the right.
function DemoPreviewIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      {/* Card frame */}
      <rect x="2" y="2" width="396" height="296" rx="14" fill="white" fillOpacity="0.07" />

      {/* Top bar */}
      <rect x="2" y="2" width="396" height="38" rx="14" fill="white" fillOpacity="0.08" />
      <rect x="2" y="26" width="396" height="14" fill="white" fillOpacity="0.08" />
      <circle cx="22" cy="21" r="5" fill="white" fillOpacity="0.25" />
      <circle cx="40" cy="21" r="5" fill="white" fillOpacity="0.25" />
      <circle cx="58" cy="21" r="5" fill="white" fillOpacity="0.25" />
      <rect x="80" y="14" width="72" height="14" rx="7" fill="white" fillOpacity="0.4" />
      <rect x="164" y="14" width="55" height="14" rx="7" fill="white" fillOpacity="0.15" />
      <rect x="230" y="14" width="55" height="14" rx="7" fill="white" fillOpacity="0.15" />

      {/* ── Left panel: Funnel ── */}
      <rect x="14" y="50" width="168" height="240" rx="8" fill="white" fillOpacity="0.05" />
      {/* Section label */}
      <rect x="26" y="62" width="55" height="8" rx="4" fill="white" fillOpacity="0.35" />
      <rect x="90" y="62" width="40" height="8" rx="4" fill="white" fillOpacity="0.15" />

      {/* Funnel steps — each bar shorter than previous */}
      {/* Step 1: Visits (full width) */}
      <rect x="26" y="84" width="144" height="24" rx="5" fill="white" fillOpacity="0.22" />
      <rect x="26" y="84" width="100" height="24" rx="5" fill="white" fillOpacity="0.1" />
      {/* Step 2: Sign-ups */}
      <rect x="26" y="118" width="108" height="24" rx="5" fill="white" fillOpacity="0.17" />
      {/* Drop-off badge */}
      <rect x="138" y="113" width="30" height="14" rx="7" fill="#f87171" fillOpacity="0.85" />
      {/* Step 3: Activation */}
      <rect x="26" y="152" width="76" height="24" rx="5" fill="white" fillOpacity="0.13" />
      <rect x="106" y="147" width="30" height="14" rx="7" fill="#fb923c" fillOpacity="0.85" />
      {/* Step 4: Purchase */}
      <rect x="26" y="186" width="50" height="24" rx="5" fill="white" fillOpacity="0.1" />
      <rect x="80" y="181" width="30" height="14" rx="7" fill="#f87171" fillOpacity="0.7" />

      {/* Connector arrows between steps */}
      <path d="M98 108 L98 118" stroke="white" strokeOpacity="0.2" strokeWidth="1.5" strokeDasharray="3 2" />
      <path d="M63 142 L63 152" stroke="white" strokeOpacity="0.2" strokeWidth="1.5" strokeDasharray="3 2" />
      <path d="M51 176 L51 186" stroke="white" strokeOpacity="0.2" strokeWidth="1.5" strokeDasharray="3 2" />

      {/* Sparkline at bottom of funnel panel */}
      <polyline points="26,248 52,238 80,242 112,228 144,220 162,215" stroke="white" strokeOpacity="0.25" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />

      {/* ── Right panel: AI Recommendations ── */}
      <rect x="194" y="50" width="194" height="240" rx="8" fill="white" fillOpacity="0.05" />

      {/* AI badge */}
      <rect x="206" y="62" width="100" height="20" rx="10" fill="white" fillOpacity="0.15" />
      {/* Sparkle dots inside badge */}
      <circle cx="218" cy="72" r="3" fill="white" fillOpacity="0.7" />
      <circle cx="226" cy="68" r="1.5" fill="white" fillOpacity="0.5" />
      <circle cx="223" cy="77" r="1.5" fill="white" fillOpacity="0.5" />
      <rect x="232" y="68" width="64" height="8" rx="4" fill="white" fillOpacity="0.45" />

      {/* Rec card 1 — highlighted (top priority) */}
      <rect x="206" y="92" width="170" height="58" rx="7" fill="white" fillOpacity="0.13" />
      <rect x="206" y="92" width="170" height="3" rx="1.5" fill="white" fillOpacity="0.5" />
      {/* Priority dot */}
      <circle cx="220" cy="107" r="4" fill="#4ade80" fillOpacity="0.9" />
      <rect x="230" y="103" width="90" height="8" rx="4" fill="white" fillOpacity="0.7" />
      <rect x="230" y="116" width="65" height="6" rx="3" fill="white" fillOpacity="0.3" />
      {/* Confidence bar */}
      <rect x="230" y="130" width="80" height="4" rx="2" fill="white" fillOpacity="0.12" />
      <rect x="230" y="130" width="64" height="4" rx="2" fill="#4ade80" fillOpacity="0.7" />

      {/* Rec card 2 */}
      <rect x="206" y="160" width="170" height="48" rx="7" fill="white" fillOpacity="0.08" />
      <circle cx="220" cy="174" r="4" fill="#facc15" fillOpacity="0.8" />
      <rect x="230" y="170" width="75" height="7" rx="3.5" fill="white" fillOpacity="0.55" />
      <rect x="230" y="183" width="52" height="5" rx="2.5" fill="white" fillOpacity="0.25" />
      <rect x="230" y="194" width="65" height="3.5" rx="1.75" fill="white" fillOpacity="0.12" />
      <rect x="230" y="194" width="42" height="3.5" rx="1.75" fill="#facc15" fillOpacity="0.55" />

      {/* Rec card 3 */}
      <rect x="206" y="218" width="170" height="48" rx="7" fill="white" fillOpacity="0.06" />
      <circle cx="220" cy="232" r="4" fill="#94a3b8" fillOpacity="0.6" />
      <rect x="230" y="228" width="85" height="7" rx="3.5" fill="white" fillOpacity="0.4" />
      <rect x="230" y="241" width="58" height="5" rx="2.5" fill="white" fillOpacity="0.18" />
      <rect x="230" y="252" width="65" height="3.5" rx="1.75" fill="white" fillOpacity="0.1" />
      <rect x="230" y="252" width="28" height="3.5" rx="1.75" fill="#94a3b8" fillOpacity="0.4" />
    </svg>
  )
}

export function WelcomeBanner({ stage, industry, demoProjectId, realProjectId }: Props) {
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (stage !== 'experiment_started') return
    const t = setTimeout(() => setDismissed(true), 5000)
    return () => clearTimeout(t)
  }, [stage])

  if (dismissed) return null

  const stageConfig: Record<FTUEStage, StageConfig> = {
    just_signed_up: {
      eyebrow: <EyebrowBadge dot="emerald">Live demo loaded</EyebrowBadge>,
      heading: 'See what Experiment Intelligence does — in 30 seconds',
      body: ({ industry: ind }) =>
        `We've pre-loaded a ${ind} funnel with real drop-off data. One click shows you an AI-generated recommendation with evidence and a proposed design change.`,
      illustration: <DemoPreviewIllustration className="w-80 h-60" />,
      ctas: demoProjectId ? (
        <PrimaryCTA href={`/projects/${demoProjectId}/recommendations`}>
          See your first recommendation →
        </PrimaryCTA>
      ) : (
        <PrimaryCTA href="/projects/new">Create a project →</PrimaryCTA>
      ),
      sub: 'Takes 30 seconds · No data needed yet',
    },

    seen_demo: {
      eyebrow: <EyebrowBadge dot="violet">Demo explored ✓</EyebrowBadge>,
      heading: 'Now bring your real data',
      body: () =>
        "You've seen what's possible. Upload your funnel CSV or connect Mixpanel, Amplitude, or GA4 to get recommendations for your actual product.",
      illustration: <UploadData className="w-80 h-60" aria-hidden="true" />,
      ctas: (
        <div className="flex items-center gap-3 flex-wrap">
          <PrimaryCTA href={demoProjectId ? `/projects/${demoProjectId}/uploads` : '/projects/new'}>
            Upload CSV →
          </PrimaryCTA>
          <SecondaryCTA href="/integrations">Connect analytics tool</SecondaryCTA>
        </div>
      ),
    },

    uploaded_data: {
      eyebrow: <EyebrowBadge dot="emerald">Data uploaded ✓</EyebrowBadge>,
      heading: 'Your data is ready — run your first analysis',
      body: ({ industry: ind }) =>
        `The AI will read your funnel, benchmark it against ${ind} industry patterns, and generate a prioritised experiment roadmap.`,
      illustration: <AnalysisRunning className="w-80 h-60" aria-hidden="true" />,
      ctas: realProjectId ? (
        <PrimaryCTA href={`/projects/${realProjectId}/analysis`}>Run analysis →</PrimaryCTA>
      ) : (
        <PrimaryCTA href="/projects/new">Set up your project →</PrimaryCTA>
      ),
      sub: 'Takes 20–60 seconds',
    },

    analysis_done: {
      eyebrow: <EyebrowBadge dot="emerald">Analysis complete ✓</EyebrowBadge>,
      heading: 'Your experiment recommendations are ready',
      body: () =>
        'The AI has analysed your funnel and found experiment opportunities ranked by impact. See what to test first.',
      illustration: <DemoPreviewIllustration className="w-80 h-60" />,
      ctas: realProjectId ? (
        <PrimaryCTA href={`/projects/${realProjectId}/recommendations`}>View recommendations →</PrimaryCTA>
      ) : (
        <PrimaryCTA href="/dashboard">View dashboard →</PrimaryCTA>
      ),
    },

    experiment_started: {
      eyebrow: null,
      heading: "You're running your first experiment 🎉",
      body: () =>
        "Come back to log the outcome when it's done. Every result makes future recommendations more accurate.",
      illustration: <ExperimentCreated className="w-80 h-60" aria-hidden="true" />,
      ctas: <PrimaryCTA href="/experiments">View experiment →</PrimaryCTA>,
    },
  }

  const config = stageConfig[stage]

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-900 to-indigo-800 p-8 motion-enter">
      {/* Background glow */}
      <div
        className="absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #818cf8 0%, transparent 70%)' }}
      />
      <div
        className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)' }}
      />

      {config.eyebrow}

      <div className="flex items-center justify-between gap-8">
        {/* Left: copy + CTAs */}
        <div className="flex-1 max-w-lg">
          <h2 className="text-2xl font-bold text-white mb-2 leading-snug">
            {config.heading}
          </h2>
          <p className="text-sm text-white/70 mb-6 leading-relaxed">
            {config.body({ industry })}
          </p>
          {config.ctas}
          {config.sub && (
            <p className="text-xs text-white/40 mt-3">{config.sub}</p>
          )}
        </div>

        {/* Right: illustration */}
        <div className="hidden md:flex flex-col items-center flex-shrink-0">
          {config.illustration}
        </div>
      </div>

      {/* experiment_started: countdown dismiss bar */}
      {stage === 'experiment_started' && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10 overflow-hidden rounded-b-2xl">
          <div className="h-full bg-white/30" style={{ animation: 'shrink 5s linear forwards' }} />
        </div>
      )}
      <style>{`@keyframes shrink { from { width: 100%; } to { width: 0%; } }`}</style>
    </div>
  )
}
