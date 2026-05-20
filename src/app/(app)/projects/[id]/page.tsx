import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getProject } from '@/features/projects/queries'
import { getAnalysisByProject } from '@/features/analysis/queries'
import { getIntegrationsByProject } from '@/features/integrations/queries'
import { getSegmentsByProject } from '@/features/segments/queries'
import { createServerClient } from '@/lib/supabase/server'
import { AnalysisPoller } from '@/features/analysis/components/AnalysisPoller'
import { ToastOnMount } from '@/components/ui/toast-on-mount'
import { FunnelTemplateSetup } from '@/features/projects/components/FunnelTemplateSetup'

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ from?: string }> }

export default async function ProjectPage({ params, searchParams }: Props) {
  const { id } = await params
  const { from } = await searchParams

  const [project, analysis, supabase, integrations, segments] = await Promise.all([
    getProject(id),
    getAnalysisByProject(id),
    createServerClient(),
    getIntegrationsByProject(id),
    getSegmentsByProject(id),
  ])
  const funnelTemplates = from === 'new'
    ? (await supabase.from('funnel_templates').select('id, name, category, stages, industry_median_drop_off')).data
    : null
  if (!project) notFound()

  const status = analysis?.status ?? null
  const isPolling = status === 'pending' || status === 'running'

  // Get first screenshot signed URL for thumbnail + recommendation count
  let thumbnailUrl: string | null = null
  let recommendationCount = 0

  if (status === 'completed' && analysis) {
    const [screenshotsRes, recCountRes] = await Promise.all([
      supabase.from('uploads')
        .select('storage_path')
        .eq('project_id', id)
        .eq('file_type', 'screenshot')
        .order('created_at', { ascending: true })
        .limit(1),
      supabase.from('recommendations')
        .select('*', { count: 'exact', head: true })
        .eq('analysis_id', analysis.id),
    ])

    if (screenshotsRes.data?.[0]) {
      const { data: signed } = await supabase.storage
        .from('uploads')
        .createSignedUrl(screenshotsRes.data[0].storage_path, 3600)
      thumbnailUrl = signed?.signedUrl ?? null
    }
    recommendationCount = recCountRes.count ?? 0
  }

  const actionCards = [
    {
      href: `/projects/${id}/uploads`,
      label: 'Upload data',
      description: 'Add CSVs and screenshots for analysis',
      accent: 'hover:border-sky-400/60 hover:bg-sky-50/40',
      iconBg: 'bg-sky-50',
      iconColor: 'text-sky-600',
      spotlightTarget: undefined as string | undefined,
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M3 14v2a1 1 0 001 1h12a1 1 0 001-1v-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M10 3v10M7 6l3-3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      href: `/projects/${id}/analysis`,
      label: 'Run analysis',
      spotlightTarget: 'run-analysis' as string | undefined,
      description: 'AI generates experiment recommendations',
      status,
      accent: 'hover:border-[var(--primary)]/50 hover:bg-[var(--forest-50)]/60',
      iconBg: 'bg-[var(--forest-50)]',
      iconColor: 'text-[var(--primary)]',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M7.5 7.5s0-1 1.5-1 2 1 2 2-1 1.5-1.5 2v1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          <circle cx="10" cy="14" r="0.75" fill="currentColor"/>
        </svg>
      ),
    },
    {
      href: `/projects/${id}/recommendations`,
      label: 'Recommendations',
      description: 'View prioritized experiment hypotheses',
      accent: 'hover:border-violet-400/60 hover:bg-violet-50/40',
      iconBg: 'bg-violet-50',
      iconColor: 'text-violet-600',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M10 2.5l2 5h5l-4 3 1.5 5L10 13l-4.5 2.5L7 10.5l-4-3h5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      href: `/projects/${id}/segments`,
      label: 'Audience Segments',
      description: segments.length > 0
        ? `${segments.length} segment${segments.length === 1 ? '' : 's'} defined`
        : 'Define who each experiment targets',
      accent: 'hover:border-orange-400/60 hover:bg-orange-50/40',
      iconBg: 'bg-orange-50',
      iconColor: 'text-orange-600',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <circle cx="7" cy="7" r="3" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M2 17c0-3 2-5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="14" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.4"/>
          <path d="M10 17c0-2.5 1.8-4 4-4s4 1.5 4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
      ),
    },
  ]

  const statusConfig: Record<string, { label: string; className: string; dot?: boolean }> = {
    completed: { label: 'Completed', className: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
    running:   { label: 'Running',   className: 'bg-amber-50 text-amber-700 border border-amber-200', dot: true },
    pending:   { label: 'Pending',   className: 'bg-sky-50 text-sky-700 border border-sky-200' },
    failed:    { label: 'Failed',    className: 'bg-red-50 text-red-600 border border-red-200' },
  }

  return (
    <main className="min-h-screen bg-background">
      {from === 'new' && <ToastOnMount message="Project created" type="success" />}
      {from === 'new' && funnelTemplates && funnelTemplates.length > 0 && (
        <FunnelTemplateSetup
          projectId={id}
          templates={funnelTemplates as Array<{ id: string; name: string; category: string; stages: string[]; industry_median_drop_off: Record<string, number> }>}
        />
      )}

      {/* Header */}
      <header className="border-b border-[var(--border)] bg-white/80 backdrop-blur-sm px-8 py-4 flex items-center justify-between sticky top-0 z-10">
        <Link
          href="/experiments"
          className="flex items-center gap-1.5 text-sm text-[var(--foreground-muted)] hover:text-foreground transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M9 11L5 7l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Experiments
        </Link>
        <div className="flex items-center gap-2">
        <Link
          href={`/projects/${id}/share-links`}
          className="flex items-center gap-1.5 text-xs font-medium text-[var(--foreground-muted)] hover:text-foreground transition-colors px-3 py-1.5 rounded-lg hover:bg-[var(--forest-50)]"
        >
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M9.5 2a2 2 0 100 4 2 2 0 000-4zM4.5 5a2 2 0 100 4 2 2 0 000-4zM9.5 8a2 2 0 100 4 2 2 0 000-4z" stroke="currentColor" strokeWidth="1.2"/>
            <path d="M6.5 6.5l2-2M6.5 8.5l2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          Share links
        </Link>
        <Link
          href={`/projects/${id}/settings`}
          className="flex items-center gap-1.5 text-xs font-medium text-[var(--foreground-muted)] hover:text-foreground transition-colors px-3 py-1.5 rounded-lg hover:bg-[var(--forest-50)]"
        >
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <circle cx="7" cy="7" r="2" stroke="currentColor" strokeWidth="1.3"/>
            <path d="M7 1v1.5M7 11.5V13M1 7h1.5M11.5 7H13M2.93 2.93l1.06 1.06M10.01 10.01l1.06 1.06M2.93 11.07l1.06-1.06M10.01 3.99l1.06-1.06" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          Settings
        </Link>
        </div>
      </header>

      <div className="px-6 lg:px-8 xl:px-10 py-8 space-y-6">

        {/* Project title + meta */}
        <div className="bg-white rounded-2xl border border-[var(--border)] px-7 py-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-foreground tracking-tight">{project.name}</h1>
              {project.description && (
                <p className="text-[var(--foreground-muted)] mt-1.5 text-sm leading-relaxed">{project.description}</p>
              )}
            </div>
            {project.app_url && (
              <a
                href={project.app_url}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 flex items-center gap-1.5 text-xs text-[var(--primary)] border border-[var(--primary)]/30 rounded-full px-3 py-1.5 hover:bg-[var(--forest-50)] transition-colors"
              >
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M5 2H2a1 1 0 00-1 1v7a1 1 0 001 1h7a1 1 0 001-1V7M8 1h3m0 0v3m0-3L5 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Visit app
              </a>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-5">
            {project.primary_metric && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--primary)] bg-[var(--forest-50)] border border-[var(--primary)]/20 px-3 py-1 rounded-full">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                  <path d="M1 7l3-4 2 2 3-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {project.primary_metric}
              </span>
            )}
            {project.target_audience && (
              <span className="inline-flex items-center text-xs font-medium text-[var(--foreground-muted)] bg-gray-50 border border-gray-200 px-3 py-1 rounded-full">
                {project.target_audience}
              </span>
            )}
            {project.funnel_stages?.map(stage => (
              <span key={stage} className="inline-flex items-center text-xs text-[var(--foreground-subtle)] bg-gray-50 border border-gray-100 px-3 py-1 rounded-full">
                {stage}
              </span>
            ))}
          </div>
        </div>

        {/* Action cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {actionCards.map(card => {
            const sc = card.status ? statusConfig[card.status] : null
            return (
              <Link
                key={card.href}
                href={card.href}
                {...(card.spotlightTarget ? { 'data-spotlight-target': card.spotlightTarget } : {})}
                className={`group bg-white rounded-2xl border border-[var(--border)] p-6 transition-all duration-150 hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 ${card.accent}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${card.iconBg} ${card.iconColor} transition-transform group-hover:scale-110`}>
                  {card.icon}
                </div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-foreground text-sm leading-snug">{card.label}</h3>
                  {sc && (
                    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${sc.className}`}>
                      {sc.dot && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />}
                      {sc.label}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[var(--foreground-muted)] mt-1.5 leading-relaxed">{card.description}</p>
              </Link>
            )
          })}
        </div>

        {/* Polling state */}
        {analysis && isPolling && (
          <AnalysisPoller
            analysisId={analysis.id}
            initialStatus={status as 'pending' | 'running'}
            projectId={id}
          />
        )}

        {/* Analysis complete card */}
        {status === 'completed' && analysis && (
          <div className="bg-white rounded-2xl border border-[var(--border)] overflow-hidden">
            <div className="flex items-stretch">
              {/* Thumbnail */}
              {thumbnailUrl ? (
                <div className="w-48 shrink-0 relative bg-gray-50 border-r border-[var(--border)]">
                  <Image
                    src={thumbnailUrl}
                    alt="Analysis screenshot"
                    fill
                    className="object-cover"
                    sizes="192px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10" />
                </div>
              ) : (
                <div className="w-48 shrink-0 bg-gradient-to-br from-[var(--forest-50)] to-emerald-50 border-r border-[var(--border)] flex items-center justify-center">
                  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true" className="text-[var(--primary)]/30">
                    <circle cx="18" cy="18" r="15" stroke="currentColor" strokeWidth="2"/>
                    <path d="M11 18l5 5 9-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}

              {/* Content */}
              <div className="flex-1 px-7 py-5 flex items-center justify-between gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <p className="text-sm font-semibold text-foreground">Analysis complete</p>
                  </div>

                  <div className="flex flex-wrap gap-x-5 gap-y-1.5">
                    {analysis.completed_at && (
                      <div>
                        <p className="text-[10px] font-semibold text-[var(--foreground-subtle)] uppercase tracking-wide">Completed</p>
                        <p className="text-xs text-foreground mt-0.5">
                          {new Date(analysis.completed_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-[10px] font-semibold text-[var(--foreground-subtle)] uppercase tracking-wide">Model</p>
                      <p className="text-xs text-foreground mt-0.5 font-mono">{analysis.model}</p>
                    </div>
                    {recommendationCount > 0 && (
                      <div>
                        <p className="text-[10px] font-semibold text-[var(--foreground-subtle)] uppercase tracking-wide">Recommendations</p>
                        <p className="text-xs font-bold text-violet-700 mt-0.5">{recommendationCount} generated</p>
                      </div>
                    )}
                  </div>
                </div>

                <Link
                  href={`/projects/${id}/recommendations`}
                  className="shrink-0 inline-flex h-10 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-all hover:bg-[var(--primary-hover)] hover:shadow-[0_4px_14px_rgba(25,98,98,0.4)] hover:-translate-y-px"
                >
                  View recommendations
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Data Sources */}
        {integrations.length > 0 && (
          <div className="bg-white rounded-2xl border border-[var(--border)] px-7 py-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-sky-50 flex items-center justify-center">
                  <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="text-sky-600">
                    <rect x="1" y="1" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.3"/>
                    <path d="M4 5h6M4 7h4M4 9h5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                </div>
                <h2 className="text-xs font-semibold text-[var(--foreground-subtle)] uppercase tracking-wider">Data Sources</h2>
              </div>
              <Link
                href={`/projects/${id}/integrations`}
                className="text-xs text-[var(--primary)] hover:underline font-medium"
              >
                Manage
              </Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {integrations.map(integration => (
                <span
                  key={integration.id}
                  className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full border ${
                    integration.status === 'connected'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                      : integration.status === 'error'
                        ? 'bg-red-50 border-red-200 text-red-600'
                        : 'bg-gray-50 border-gray-200 text-[var(--foreground-muted)]'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    integration.status === 'connected' ? 'bg-emerald-500' : integration.status === 'error' ? 'bg-red-500' : 'bg-gray-300'
                  }`} />
                  {integration.platform.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Business goal */}
        {project.business_goal && (
          <div className="bg-white rounded-2xl border border-[var(--border)] px-7 py-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-lg bg-amber-50 flex items-center justify-center">
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="text-amber-600">
                  <path d="M7 1.5v1M7 11.5v1M1.5 7h1M11.5 7h1M3.11 3.11l.7.7M10.19 10.19l.7.7M3.11 10.89l.7-.7M10.19 3.81l.7-.7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                  <circle cx="7" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.3"/>
                </svg>
              </div>
              <h2 className="text-xs font-semibold text-[var(--foreground-subtle)] uppercase tracking-wider">Business goal</h2>
            </div>
            <p className="text-sm text-foreground leading-relaxed">{project.business_goal}</p>
          </div>
        )}

      </div>
    </main>
  )
}
