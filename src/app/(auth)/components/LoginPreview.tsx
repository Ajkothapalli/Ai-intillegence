'use client'

import { useState, useEffect } from 'react'
import { AreaChartComponent, GroupedBarChart, HorizontalBarChart } from '@/components/ui/charts'

// ── Slide data ──────────────────────────────────────────────────────

const slides = [
  {
    tag: 'Onboarding funnel',
    heading: 'Activation lifted 14% in 6 weeks',
    subtext: 'AI spotted drop-off at step 3 and generated an A/B test hypothesis — validated in under 2 weeks.',
    stats: [
      { label: 'Experiments', value: '8' },
      { label: 'Avg confidence', value: '78%' },
      { label: 'Lift', value: '+14%' },
    ],
    recommendation: {
      badge: 'P1 · A/B Test · 84% confidence',
      text: 'Adding a progress bar to the onboarding flow increases activation by an estimated 12–18% based on 3 cohort signals.',
    },
    chart: (
      <AreaChartComponent
        data={[
          { week: 'W1', activation: 0.31, retention: 0.18 },
          { week: 'W2', activation: 0.38, retention: 0.22 },
          { week: 'W3', activation: 0.34, retention: 0.20 },
          { week: 'W4', activation: 0.44, retention: 0.27 },
          { week: 'W5', activation: 0.51, retention: 0.31 },
          { week: 'W6', activation: 0.47, retention: 0.29 },
          { week: 'W7', activation: 0.58, retention: 0.36 },
          { week: 'W8', activation: 0.63, retention: 0.41 },
        ]}
        series={[
          { key: 'activation', color: '#196262', label: 'Activation' },
          { key: 'retention',  color: '#3bcfcf', label: 'Retention' },
        ]}
        xKey="week"
        height={188}
        valueFormatter={v => `${Math.round(v * 100)}%`}
      />
    ),
  },
  {
    tag: 'Checkout optimisation',
    heading: 'Multivariate test cut drop-off by 22%',
    subtext: 'Three checkout variants compared across 4 funnel steps. Single-page layout won with 89% confidence.',
    stats: [
      { label: 'Variants tested', value: '3' },
      { label: 'Confidence', value: '89%' },
      { label: 'Drop-off reduction', value: '−22%' },
    ],
    recommendation: {
      badge: 'P1 · Multivariate · 89% confidence',
      text: 'Single-page checkout reduces funnel drop-off by 22% vs the 3-step flow. Payment step accounts for 61% of exits.',
    },
    chart: (
      <GroupedBarChart
        data={[
          { step: 'Cart',    control: 0.88, variant: 0.91 },
          { step: 'Details', control: 0.71, variant: 0.82 },
          { step: 'Payment', control: 0.49, variant: 0.68 },
          { step: 'Confirm', control: 0.44, variant: 0.64 },
        ]}
        series={[
          { key: 'control', color: '#aec8f4', label: 'Control' },
          { key: 'variant', color: '#196262', label: 'Variant' },
        ]}
        xKey="step"
        height={188}
        valueFormatter={v => `${Math.round(v * 100)}%`}
      />
    ),
  },
  {
    tag: 'Retention campaign',
    heading: 'D7 retention up 9 pts with day-3 nudge',
    subtext: 'Feature flag experiment: users who received a day-3 contextual prompt had significantly higher week-1 retention.',
    stats: [
      { label: 'Cohorts', value: '5' },
      { label: 'Confidence', value: '81%' },
      { label: 'D7 lift', value: '+9 pts' },
    ],
    recommendation: {
      badge: 'P2 · Feature Flag · 81% confidence',
      text: 'A contextual "next best action" prompt on day 3 increases D7 retention by 9 percentage points, especially for mobile users.',
    },
    chart: (
      <AreaChartComponent
        data={[
          { day: 'D1', treated: 0.82, control: 0.81 },
          { day: 'D3', treated: 0.71, control: 0.65 },
          { day: 'D7', treated: 0.58, control: 0.49 },
          { day: 'D14', treated: 0.47, control: 0.36 },
          { day: 'D21', treated: 0.41, control: 0.30 },
          { day: 'D30', treated: 0.37, control: 0.25 },
        ]}
        series={[
          { key: 'treated', color: '#196262', label: 'Treated' },
          { key: 'control', color: '#aec8f4', label: 'Control' },
        ]}
        xKey="day"
        height={188}
        valueFormatter={v => `${Math.round(v * 100)}%`}
      />
    ),
  },
  {
    tag: 'Feature adoption',
    heading: 'Power users convert 2.1× faster with tooltips',
    subtext: 'Holdout analysis across 6 segments revealed that progressive feature disclosure drives deeper engagement.',
    stats: [
      { label: 'Segments', value: '6' },
      { label: 'Confidence', value: '77%' },
      { label: 'Engagement lift', value: '2.1×' },
    ],
    recommendation: {
      badge: 'P2 · Holdout · 77% confidence',
      text: 'Progressive disclosure of advanced features — starting with tooltips on day 5 — increases power-user conversion by 2.1× within 30 days.',
    },
    chart: (
      <HorizontalBarChart
        data={[
          { label: 'Power',    value: 0.84, color: '#196262' },
          { label: 'Regular',  value: 0.61, color: '#29a3a3' },
          { label: 'Casual',   value: 0.43, color: '#3bcfcf' },
          { label: 'New',      value: 0.29, color: '#7cdede' },
          { label: 'Churned',  value: 0.12, color: '#b6ebeb' },
        ]}
        height={188}
        valueFormatter={v => `${Math.round(v * 100)}%`}
      />
    ),
  },
]

// ── Component ───────────────────────────────────────────────────────

export function LoginPreview() {
  const [active, setActive] = useState(0)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const id = setInterval(() => {
      setFading(true)
      setTimeout(() => {
        setActive(i => (i + 1) % slides.length)
        setFading(false)
      }, 300)
    }, 5000)
    return () => clearInterval(id)
  }, [])

  function goTo(i: number) {
    if (i === active) return
    setFading(true)
    setTimeout(() => {
      setActive(i)
      setFading(false)
    }, 300)
  }

  const slide = slides[active]

  return (
    <div className="w-full max-w-xl space-y-5">

      {/* Slide label + heading */}
      <div
        className="transition-all duration-300"
        style={{ opacity: fading ? 0 : 1, transform: fading ? 'translateY(6px)' : 'translateY(0)' }}
      >
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--primary)] mb-1">
          {slide.tag}
        </p>
        <h2 className="text-xl font-bold text-foreground tracking-tight">{slide.heading}</h2>
        <p className="text-sm text-[var(--foreground-muted)] mt-0.5 leading-relaxed">{slide.subtext}</p>
      </div>

      {/* Stat chips */}
      <div
        className="grid grid-cols-3 gap-3 transition-all duration-300"
        style={{ opacity: fading ? 0 : 1, transform: fading ? 'translateY(6px)' : 'translateY(0)' }}
      >
        {slide.stats.map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-[var(--border)] shadow-[var(--shadow-sm)] px-4 py-3 text-center">
            <p className="text-2xl font-bold text-foreground tabular-nums">{s.value}</p>
            <p className="text-[11px] text-[var(--foreground-muted)] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Chart card */}
      <div
        className="bg-white rounded-2xl border border-[var(--border)] shadow-[var(--shadow-md)] px-5 py-5 transition-all duration-300"
        style={{ opacity: fading ? 0 : 1, transform: fading ? 'translateY(8px)' : 'translateY(0)' }}
      >
        {slide.chart}
      </div>

      {/* Recommendation strip */}
      <div
        className="bg-white rounded-xl border border-[var(--forest-200)] shadow-[var(--shadow-sm)] px-4 py-3 flex items-start gap-3 transition-all duration-300"
        style={{ opacity: fading ? 0 : 1, transform: fading ? 'translateY(6px)' : 'translateY(0)' }}
      >
        <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M6 1v10M1 6h10" stroke="#196262" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        <div>
          <p className="text-xs font-semibold text-foreground">{slide.recommendation.badge}</p>
          <p className="text-xs text-[var(--foreground-muted)] mt-0.5 leading-relaxed">{slide.recommendation.text}</p>
        </div>
      </div>

      {/* Dot navigation */}
      <div className="flex items-center justify-center gap-2 pt-1">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="transition-all duration-300 rounded-full"
            style={{
              width: i === active ? 20 : 7,
              height: 7,
              background: i === active ? '#196262' : 'var(--border-strong)',
            }}
          />
        ))}
      </div>
    </div>
  )
}
