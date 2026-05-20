'use client'

import { useState, useEffect } from 'react'
import { AreaChartComponent, GroupedBarChart, HorizontalBarChart } from '@/components/ui/charts'

const slides = [
  {
    eyebrow: 'Before vs After',
    heading: 'Upload your data. Get your first hypothesis in 90 seconds.',
    subtext: 'Teams that use AI-backed recommendations run 3× more experiments in their first quarter.',
    kpis: [
      { label: 'Avg time to insight', value: '90s', sub: 'vs days of analysis' },
      { label: 'Experiments shipped', value: '3×', sub: 'vs manual research' },
      { label: 'Avg confirmed lift', value: '+18%', sub: 'across winning tests' },
    ],
    chart: (
      <GroupedBarChart
        data={[
          { quarter: 'Q1',  manual: 2,  ai: 7  },
          { quarter: 'Q2',  manual: 3,  ai: 11 },
          { quarter: 'Q3',  manual: 3,  ai: 14 },
          { quarter: 'Q4',  manual: 4,  ai: 19 },
        ]}
        series={[
          { key: 'manual', color: '#ddd6fe', label: 'Manual research' },
          { key: 'ai',     color: '#7c3aed', label: 'AI-backed' },
        ]}
        xKey="quarter"
        height={176}
        valueFormatter={v => `${v} exp`}
      />
    ),
    insight: {
      badge: 'AI insight · 91% confidence',
      text: 'Teams on AI recommendations ship an average of 19 validated experiments per quarter — vs 4 for teams using manual analysis.',
    },
  },
  {
    eyebrow: 'Funnel intelligence',
    heading: 'Know exactly where users drop — before you guess.',
    subtext: 'Upload your funnel CSV and our AI maps every step-level drop-off to a ranked hypothesis in seconds.',
    kpis: [
      { label: 'Steps analysed', value: '12', sub: 'funnel stages per run' },
      { label: 'Hypotheses surfaced', value: '8–14', sub: 'per analysis run' },
      { label: 'Evidence cited', value: '100%', sub: 'every recommendation' },
    ],
    chart: (
      <HorizontalBarChart
        data={[
          { label: 'Landing',   value: 0.91, color: '#7c3aed' },
          { label: 'Sign-up',   value: 0.74, color: '#7c3aed' },
          { label: 'Onboard',   value: 0.52, color: '#6d28d9' },
          { label: 'Activate',  value: 0.31, color: '#5b21b6' },
          { label: 'Retain',    value: 0.19, color: '#4c1d95' },
        ]}
        height={176}
        valueFormatter={v => `${Math.round(v * 100)}%`}
      />
    ),
    insight: {
      badge: 'P1 · Flow experiment · 87% confidence',
      text: 'Onboarding → Activation has a 40% drop. Adding a single progress indicator is estimated to recover 12–16% of exits.',
    },
  },
  {
    eyebrow: 'Activation trends',
    heading: 'Watch your activation rate climb with every experiment.',
    subtext: 'Real results from teams that ran AI-recommended tests — activation and retention improve in parallel.',
    kpis: [
      { label: 'Avg activation lift', value: '+23%', sub: 'within 60 days' },
      { label: 'D30 retention gain', value: '+11 pts', sub: 'from winning tests' },
      { label: 'Revenue impact', value: '4–9×', sub: 'experiment ROI' },
    ],
    chart: (
      <AreaChartComponent
        data={[
          { week: 'W0',  activation: 0.28, retention: 0.14 },
          { week: 'W2',  activation: 0.31, retention: 0.16 },
          { week: 'W4',  activation: 0.38, retention: 0.21 },
          { week: 'W6',  activation: 0.46, retention: 0.27 },
          { week: 'W8',  activation: 0.54, retention: 0.33 },
          { week: 'W10', activation: 0.59, retention: 0.38 },
          { week: 'W12', activation: 0.65, retention: 0.44 },
        ]}
        series={[
          { key: 'activation', color: '#7c3aed', label: 'Activation' },
          { key: 'retention',  color: '#a78bfa', label: 'D30 Retention' },
        ]}
        xKey="week"
        height={176}
        valueFormatter={v => `${Math.round(v * 100)}%`}
      />
    ),
    insight: {
      badge: 'Portfolio view · 12 experiments',
      text: 'After 12 AI-recommended tests across 12 weeks, activation reached 65% (+23%) and D30 retention hit 44% (+11 pts).',
    },
  },
  {
    eyebrow: 'Segment intelligence',
    heading: 'Not all users are the same. Your experiments shouldn\'t be either.',
    subtext: 'AI automatically surfaces which segments have the most to gain — so you test where it counts.',
    kpis: [
      { label: 'Segments identified', value: '4–8', sub: 'per project' },
      { label: 'Best segment lift', value: '2.4×', sub: 'vs all-users test' },
      { label: 'Wasted traffic cut', value: '−60%', sub: 'by targeting right' },
    ],
    chart: (
      <HorizontalBarChart
        data={[
          { label: 'Mobile new',   value: 0.87, color: '#7c3aed' },
          { label: 'Web power',    value: 0.72, color: '#7c3aed' },
          { label: 'Mobile ret.',  value: 0.58, color: '#8b5cf6' },
          { label: 'Web casual',   value: 0.41, color: '#a78bfa' },
          { label: 'All users',    value: 0.36, color: '#c4b5fd' },
        ]}
        height={176}
        valueFormatter={v => `${Math.round(v * 100)}% lift potential`}
      />
    ),
    insight: {
      badge: 'Segment rec · 83% confidence',
      text: 'Mobile new-user segment shows 2.4× higher experiment sensitivity — targeting them first maximises your learning velocity.',
    },
  },
]

export function SignupPreview() {
  const [active, setActive] = useState(0)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const id = setInterval(() => {
      setFading(true)
      setTimeout(() => {
        setActive(i => (i + 1) % slides.length)
        setFading(false)
      }, 300)
    }, 5500)
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
        <p className="text-[11px] font-bold uppercase tracking-widest text-violet-500 mb-1">
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
            className="bg-white rounded-xl border border-slate-100 shadow-sm px-3 py-3 text-center"
            style={{ boxShadow: '0 1px 8px 0 rgba(124,58,237,0.06)' }}
          >
            <p className="text-[1.6rem] font-black text-violet-700 tabular-nums leading-none">{k.value}</p>
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
          boxShadow: '0 4px 24px 0 rgba(124,58,237,0.08), 0 1px 4px 0 rgba(0,0,0,0.04)',
        }}
      >
        {slide.chart}
      </div>

      {/* AI insight strip */}
      <div
        className="rounded-xl px-4 py-3 flex items-start gap-3 transition-all duration-300"
        style={{
          opacity: fading ? 0 : 1,
          transform: fading ? 'translateY(6px)' : 'translateY(0)',
          background: 'linear-gradient(135deg, #ede9fe 0%, #f5f3ff 100%)',
          border: '1px solid #ddd6fe',
        }}
      >
        <div className="w-6 h-6 rounded-lg bg-violet-600 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
            <path d="M5.5 1C3.01 1 1 3.01 1 5.5S3.01 10 5.5 10 10 7.99 10 5.5 7.99 1 5.5 1zm0 2a.75.75 0 110 1.5A.75.75 0 015.5 3zm0 2.25a.5.5 0 01.5.5v2a.5.5 0 01-1 0v-2a.5.5 0 01.5-.5z" fill="white"/>
          </svg>
        </div>
        <div>
          <p className="text-[11px] font-bold text-violet-800">{slide.insight.badge}</p>
          <p className="text-[11px] text-violet-700 mt-0.5 leading-relaxed">{slide.insight.text}</p>
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
              background: i === active ? '#7c3aed' : '#ddd6fe',
            }}
          />
        ))}
      </div>
    </div>
  )
}
