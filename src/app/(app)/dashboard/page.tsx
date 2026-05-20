import Link from 'next/link'
import { getDashboardStats } from '@/features/projects/queries'
import { DashboardCharts } from './DashboardCharts'
import { getRingProgress } from '@/features/onboarding/rings'
import { getStreak } from '@/features/onboarding/streaks'
import { ProgressRings } from '@/features/onboarding/components/ProgressRings'
import { StreakBadge } from '@/features/onboarding/components/StreakBadge'
import { WelcomeBanner } from '@/features/onboarding/components/WelcomeBanner'
import { createServerClient } from '@/lib/supabase/server'
import { getUserExperienceState } from '@/lib/onboarding/userState'
import { INDUSTRY_LABELS } from '@/lib/demo/demoData'

function TrendBadge({ delta, unit = '%' }: { delta: number; unit?: string }) {
  if (delta === 0) {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[var(--foreground-subtle)] bg-gray-100 px-2 py-0.5 rounded-full">
        — no change
      </span>
    )
  }
  const up = delta > 0
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${up ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true"
        className={up ? '' : 'rotate-180'}>
        <path d="M5 8V2M2 5l3-3 3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {up ? '+' : ''}{delta}{unit}
    </span>
  )
}

function StatusBadge({ status }: { status: string | null }) {
  if (!status) {
    return <span className="text-[11px] text-[var(--foreground-subtle)] bg-gray-100 px-2 py-0.5 rounded-full font-medium">No analysis</span>
  }
  const map: Record<string, string> = {
    completed: 'bg-emerald-50 text-emerald-700',
    running:   'bg-amber-50 text-amber-700',
    pending:   'bg-sky-50 text-sky-700',
    failed:    'bg-red-50 text-red-600',
  }
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-full capitalize ${map[status] ?? 'bg-gray-100 text-gray-600'}`}>
      {status === 'running' && (
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
      )}
      {status}
    </span>
  )
}

export default async function DashboardPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [stats, rings, streak, userState] = await Promise.all([
    getDashboardStats(),
    getRingProgress(),
    user ? getStreak(supabase, user.id) : Promise.resolve({ current: 0, longest: 0, activeThisWeek: false }),
    user ? getUserExperienceState(user.id) : Promise.resolve({ experience: 'rtue' as const }),
  ])

  // Industry label for FTUE banner copy
  const rawIndustry = user?.user_metadata?.['industry']
  const industryKey = typeof rawIndustry === 'string' ? rawIndustry : null
  const industryLabel = industryKey && industryKey in INDUSTRY_LABELS
    ? INDUSTRY_LABELS[industryKey as keyof typeof INDUSTRY_LABELS]
    : 'your product'

  // Demo project (for FTUE banners)
  const demoProject = stats.demoProject

  // Real project with completed analysis (for analysis_done stage)
  const realProjectWithAnalysis = stats.feed.find(f => !f.isDemo && f.analysisStatus === 'completed')
  // Any real project (for uploaded_data stage)
  const anyRealProject = stats.feed.find(f => !f.isDemo)

  const realProjectId = realProjectWithAnalysis?.id ?? anyRealProject?.id ?? null

  // Streak at risk: has a streak but hasn't been active this week
  const streakAtRisk = streak.current > 0 && !streak.activeThisWeek

  const statCards = [
    {
      label: 'Total Experiments',
      value: stats.totalProjects,
      delta: stats.projectsDelta,
      description: 'vs last 30 days',
      accent: 'from-[#196262]/10 to-[#196262]/5',
      iconBg: 'bg-[var(--forest-50)]',
      iconColor: 'text-[var(--primary)]',
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <path d="M6.5 2v5.5L2.5 14a1 1 0 00.9 1.5h11.2a1 1 0 00.9-1.5L11.5 7.5V2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5 2h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      label: 'Analyses Completed',
      value: stats.totalCompletedAnalyses,
      delta: stats.analysesDelta,
      description: 'vs last 30 days',
      accent: 'from-emerald-50 to-emerald-50/30',
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-700',
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.5" />
          <path d="M5.5 9l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      label: 'Recommendations',
      value: stats.totalRecommendations,
      delta: stats.recommendationsDelta,
      description: 'vs last 30 days',
      accent: 'from-violet-50 to-violet-50/30',
      iconBg: 'bg-violet-50',
      iconColor: 'text-violet-700',
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <path d="M9 2l2 5h5l-4 3 1.5 5L9 12.5 4.5 15 6 10l-4-3h5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      label: 'Avg Confidence',
      value: `${stats.avgConfidence}%`,
      delta: stats.confidenceDelta,
      description: 'vs last 30 days',
      unit: 'pts',
      accent: 'from-sky-50 to-sky-50/30',
      iconBg: 'bg-sky-50',
      iconColor: 'text-sky-700',
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <path d="M3 13l4-4 3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
  ]

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-8 space-y-8">

      {/* FTUE: welcome banner — never dims content below */}
      {userState.experience === 'ftue' && (
        <WelcomeBanner
          stage={userState.stage}
          industry={industryLabel}
          demoProjectId={demoProject?.id ?? null}
          realProjectId={realProjectId}
        />
      )}

      {/* RTUE: streak at risk nudge — only when streak > 0 and no action this week */}
      {userState.experience === 'rtue' && streakAtRisk && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-2.5 flex items-center justify-between gap-4">
          <span className="text-sm text-amber-800">
            🔥 Keep your {streak.current}-week streak — do something this week
          </span>
          <Link
            href="/projects/new"
            className="shrink-0 inline-flex items-center rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-semibold text-amber-800 hover:bg-amber-50 transition-colors"
          >
            Run analysis
          </Link>
        </div>
      )}

      {/* Dashboard header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Dashboard</h1>
          <p className="text-sm text-[var(--foreground-muted)] mt-1">
            All-time metrics and 30-day activity across your experiments.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <StreakBadge current={streak.current} longest={streak.longest} />
          {userState.experience === 'rtue' && (
            <Link
              href="/projects/new"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-[var(--primary-hover)] transition-colors shadow-sm"
            >
              New experiment
            </Link>
          )}
        </div>
      </div>

      {/* Progress rings */}
      <ProgressRings rings={rings} />

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(card => (
          <div
            key={card.label}
            className={`relative overflow-hidden bg-white rounded-2xl border border-[var(--border)] p-5 bg-gradient-to-br ${card.accent}`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-4 ${card.iconBg} ${card.iconColor}`}>
              {card.icon}
            </div>
            <p className="text-[28px] font-bold text-foreground leading-none tabular-nums">{card.value}</p>
            <p className="text-xs font-semibold text-foreground mt-1.5 mb-2">{card.label}</p>
            <div className="flex items-center gap-1.5">
              <TrendBadge delta={card.delta} unit={card.unit ?? '%'} />
              <span className="text-[10px] text-[var(--foreground-subtle)]">{card.description}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Activity chart */}
      <div className="bg-white rounded-2xl border border-[var(--border)] p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Activity</h2>
            <p className="text-xs text-[var(--foreground-muted)] mt-0.5">Experiments created and recommendations generated — last 30 days</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#196262]" />
              <span className="text-[11px] text-[var(--foreground-muted)] font-medium">Experiments</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-violet-600" />
              <span className="text-[11px] text-[var(--foreground-muted)] font-medium">Recommendations</span>
            </div>
          </div>
        </div>
        <DashboardCharts data={stats.activityData} />
      </div>

      {/* Experiment feed */}
      <div className="bg-white rounded-2xl border border-[var(--border)] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
          <h2 className="text-sm font-semibold text-foreground">Recent Experiments</h2>
          <Link
            href="/experiments"
            className="text-xs font-medium text-[var(--primary)] hover:underline"
          >
            View all →
          </Link>
        </div>

        {stats.feed.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-sm text-[var(--foreground-muted)]">No experiments yet.</p>
            <Link
              href="/experiments"
              className="inline-flex mt-3 h-8 items-center rounded-full bg-primary px-4 text-xs font-semibold text-primary-foreground hover:bg-[var(--primary-hover)] transition-colors"
            >
              Create first experiment
            </Link>
          </div>
        ) : (
          <ul>
            {stats.feed.map((item, i) => (
              <li key={item.id} className={i > 0 ? 'border-t border-[var(--border)]' : ''}>
                <Link
                  href={`/projects/${item.id}`}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-[var(--forest-50)] transition-colors group"
                >
                  <div className="w-2 h-2 rounded-full bg-[var(--primary)]/30 group-hover:bg-[var(--primary)] transition-colors shrink-0" />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-foreground group-hover:text-[var(--primary)] transition-colors truncate">
                        {item.name}
                      </p>
                      {item.isDemo && (
                        <span className="shrink-0 text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-full uppercase tracking-wide">
                          Demo
                        </span>
                      )}
                    </div>
                    {item.primaryMetric && (
                      <p className="text-[11px] text-[var(--foreground-subtle)] mt-0.5 truncate">
                        Metric: <span className="font-medium text-[var(--primary)]">{item.primaryMetric}</span>
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <StatusBadge status={item.analysisStatus} />
                    {item.recommendationCount > 0 && (
                      <span className="text-[11px] font-semibold text-violet-700 bg-violet-50 px-2 py-0.5 rounded-full">
                        {item.recommendationCount} recs
                      </span>
                    )}
                    <span className="text-[11px] text-[var(--foreground-subtle)] whitespace-nowrap">
                      {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

    </div>
  )
}
