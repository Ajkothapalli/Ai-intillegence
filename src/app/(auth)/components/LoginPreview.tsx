'use client'

import { useState, useEffect } from 'react'
import { AreaChartComponent, GroupedBarChart, HorizontalBarChart } from '@/components/ui/charts'

const slides = [
  {
    eyebrow: 'Onboarding funnel',
    heading: 'Activation lifted 14% in 6 weeks with one A/B test.',
    subtext: 'AI spotted drop-off at step 3 and generated the winning hypothesis — validated in under 2 weeks.',
    kpis: [
      { label: 'Experiments run', value: '8',   sub: 'over 6 weeks' },
      { label: 'Avg confidence', value: '78%',  sub: 'per recommendation' },
      { label: 'Activation lift', value: '+14%', sub: 'confirmed winner' },
    ],
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
        height={176}
        valueFormatter={v => `${Math.round(v * 100)}%`}
      />
    ),
    insight: {
      badge: 'P1 · A/B Test · 84% confidence',
      text: 'Adding a progress bar to the onboarding flow increases activation by an estimated 12–18% based on 3 cohort signals.',
    },
  },
  {
    eyebrow: 'Checkout optimisation',
    heading: 'Single-page checkout cut drop-off by 22% at payment.',
    subtext: 'Three checkout variants compared across 4 funnel steps. The winner shipped in week 3 with 89% confidence.',
    kpis: [
      { label: 'Variants tested', value: '3',   sub: 'multivariate run' },
      { label: 'Confidence',      value: '89%', sub: 'statistically robust' },
      { label: 'Drop-off cut',    value: '−22%', sub: 'at payment step' },
    ],
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
        height={176}
        valueFormatter={v => `${Math.round(v * 100)}%`}
      />
    ),
    insight: {
      badge: 'P1 · Multivariate · 89% confidence',
      text: 'Single-page checkout reduces funnel drop-off by 22% vs the 3-step flow. Payment step accounts for 61% of exits.',
    },
  },
  {
    eyebrow: 'Retention campaign',
    heading: 'D7 retention up 9 pts with a single day-3 nudge.',
    subtext: 'Feature flag experiment: a contextual prompt on day 3 drove significantly higher week-1 retention across all cohorts.',
    kpis: [
      { label: 'Cohorts tested', value: '5',     sub: 'across segments' },
      { label: 'Confidence',     value: '81%',   sub: 'feature flag test' },
      { label: 'D7 retention',   value: '+9 pts', sub: 'confirmed lift' },
    ],
    chart: (
      <AreaChartComponent
        data={[
          { day: 'D1',  treated: 0.82, control: 0.81 },
          { day: 'D3',  treated: 0.71, control: 0.65 },
          { day: 'D7',  treated: 0.58, control: 0.49 },
          { day: 'D14', treated: 0.47, control: 0.36 },
          { day: 'D21', treated: 0.41, control: 0.30 },
          { day: 'D30', treated: 0.37, control: 0.25 },
        ]}
        series={[
          { key: 'treated', color: '#196262', label: 'Treated' },
          { key: 'control', color: '#aec8f4', label: 'Control' },
        ]}
        xKey="day"
        height={176}
        valueFormatter={v => `${Math.round(v * 100)}%`}
      />
    ),
    insight: {
      badge: 'P2 · Feature Flag · 81% confidence',
      text: 'A contextual "next best action" prompt on day 3 increases D7 retention by 9 percentage points, especially for mobile users.',
    },
  },
  {
    eyebrow: 'Feature adoption',
    heading: 'Power users convert 2.1× faster with progressive tooltips.',
    subtext: 'Holdout analysis across 6 segments revealed that progressive feature disclosure drives deeper engagement within 30 days.',
    kpis: [
      { label: 'Segments analysed', value: '6',   sub: 'holdout study' },
      { label: 'Confidence',        value: '77%', sub: 'per recommendation' },
      { label: 'Conversion lift',   value: '2.1×', sub: 'power users' },
    ],
    chart: (
      <HorizontalBarChart
        data={[
          { label: 'Power',   value: 0.84, color: '#196262' },
          { label: 'Regular', value: 0.61, color: '#29a3a3' },
          { label: 'Casual',  value: 0.43, color: '#3bcfcf' },
          { label: 'New',     value: 0.29, color: '#7cdede' },
          { label: 'Churned', value: 0.12, color: '#b6ebeb' },
        ]}
        height={176}
        valueFormatter={v => `${Math.round(v * 100)}%`}
      />
    ),
    insight: {
      badge: 'P2 · Holdout · 77% confidence',
      text: 'Progressive disclosure of advanced features — starting with tooltips on day 5 — increases power-user conversion by 2.1× within 30 days.',
    },
  },
]

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
    setTimeout(() => { setActive(i); setFading(false) }, 300)
  }

  const slide = slides[active]

  return (
    <div className="w-full max-w-xl space-y-4">

      {/* Eyebrow + heading */}
      <div
        className="transition-all duration-300"
        style={{ opacity: fading ? 0 : 1, transform: fading ? 'translateY(6px)' : 'translateY(0)' }}
      >
        <p className="text-[11px] font-bold uppercase tracking-widest mb-1" style={{ color: '#196262' }}>
          {slide.eyebrow}
        </p>
        <h2 className="text-[1.35rem] font-bold text-slate-900 tracking-tight leading-snug">
          {slide.heading}
        </h2>
        <p className="text-sm text-slate-500 mt-1 leading-relaxed">{slide.subtext}</p>
      </div>

      {/* KPI chips */}
      <div
        className="grid grid-cols-3 gap-2.5 transition-all duration-300"
        style={{ opacity: fading ? 0 : 1, transform: fading ? 'translateY(6px)' : 'translateY(0)' }}
      >
        {slide.kpis.map(k => (
          <div
            key={k.label}
            className="bg-white rounded-xl border border-slate-100 px-3 py-3 text-center"
            style={{ boxShadow: '0 1px 8px 0 rgba(25,98,98,0.07)' }}
          >
            <p className="text-[1.6rem] font-black tabular-nums leading-none" style={{ color: '#196262' }}>{k.value}</p>
            <p className="text-[10px] font-semibold text-slate-700 mt-1 leading-tight">{k.label}</p>
            <p className="text-[10px] text-slate-400 leading-tight">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Chart card */}
      <div
        className="bg-white rounded-2xl border border-slate-100 px-5 pt-4 pb-3 transition-all duration-300"
        style={{
          opacity: fading ? 0 : 1,
          transform: fading ? 'translateY(8px)' : 'translateY(0)',
          boxShadow: '0 4px 24px 0 rgba(25,98,98,0.09), 0 1px 4px 0 rgba(0,0,0,0.04)',
        }}
      >
        {slide.chart}
      </div>

      {/* Insight strip */}
      <div
        className="rounded-xl px-4 py-3 flex items-start gap-3 transition-all duration-300"
        style={{
          opacity: fading ? 0 : 1,
          transform: fading ? 'translateY(6px)' : 'translateY(0)',
          background: 'linear-gradient(135deg, #e6f7f7 0%, #f0fafa 100%)',
          border: '1px solid #b6ebeb',
        }}
      >
        <div
          className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 shadow-sm"
          style={{ background: '#196262' }}
        >
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
            <path d="M5.5 1C3.01 1 1 3.01 1 5.5S3.01 10 5.5 10 10 7.99 10 5.5 7.99 1 5.5 1zm0 2a.75.75 0 110 1.5A.75.75 0 015.5 3zm0 2.25a.5.5 0 01.5.5v2a.5.5 0 01-1 0v-2a.5.5 0 01.5-.5z" fill="white"/>
          </svg>
        </div>
        <div>
          <p className="text-[11px] font-bold" style={{ color: '#0d4040' }}>{slide.insight.badge}</p>
          <p className="text-[11px] leading-relaxed mt-0.5" style={{ color: '#196262' }}>{slide.insight.text}</p>
        </div>
      </div>

      {/* Dot nav */}
      <div className="flex items-center justify-center gap-2 pt-1">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="transition-all duration-300 rounded-full"
            style={{
              width: i === active ? 22 : 7,
              height: 7,
              background: i === active ? '#196262' : '#b6ebeb',
            }}
          />
        ))}
      </div>
    </div>
  )
}
