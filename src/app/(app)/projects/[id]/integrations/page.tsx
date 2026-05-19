import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProject } from '@/features/projects/queries'
import { getIntegrationsByProject } from '@/features/integrations/queries'
import type { Platform, SafeIntegration } from '@/features/integrations/types'
import { IntegrationCard } from '@/features/integrations/components/IntegrationCard'
import { SyncAllButton } from '@/features/integrations/components/SyncAllButton'

type Props = { params: Promise<{ id: string }> }

const PLATFORM_META: Record<Platform, { name: string; description: string; category: 'analytics' | 'session' | 'document'; color: string }> = {
  mixpanel:      { name: 'Mixpanel',           description: 'Funnel analysis & cohort data',          category: 'analytics', color: '#7856ff' },
  amplitude:     { name: 'Amplitude',          description: 'Product analytics & retention',           category: 'analytics', color: '#1da4b5' },
  ga4:           { name: 'Google Analytics 4', description: 'Web analytics & conversions',             category: 'analytics', color: '#f9ab00' },
  posthog:       { name: 'PostHog',            description: 'Open-source product analytics',           category: 'analytics', color: '#f54e00' },
  heap:          { name: 'Heap',               description: 'Automatic event capture',                 category: 'analytics', color: '#6f42c1' },
  segment:       { name: 'Segment',            description: 'Customer data platform',                  category: 'analytics', color: '#52bd94' },
  pendo:         { name: 'Pendo',              description: 'Product engagement & guidance',           category: 'analytics', color: '#ff4876' },
  hotjar:        { name: 'Hotjar',             description: 'Heatmaps & session recordings',           category: 'session',   color: '#fd3a5c' },
  logrocket:     { name: 'LogRocket',          description: 'Session replay & error tracking',         category: 'session',   color: '#764abc' },
  google_sheets: { name: 'Google Sheets',      description: 'Import funnel data from Sheets',          category: 'document',  color: '#34a853' },
  google_docs:   { name: 'Google Docs',        description: 'Import research docs',                    category: 'document',  color: '#4285f4' },
  google_slides: { name: 'Google Slides',      description: 'Import slide decks as context',           category: 'document',  color: '#fbbc05' },
  excel:         { name: 'Excel',              description: 'Import .xlsx funnel data',                category: 'document',  color: '#217346' },
  word:          { name: 'Word',               description: 'Import .docx research documents',         category: 'document',  color: '#2b579a' },
  powerpoint:    { name: 'PowerPoint',         description: 'Import .pptx presentations',              category: 'document',  color: '#d24726' },
  pdf:           { name: 'PDF',                description: 'Import PDF reports & research',           category: 'document',  color: '#e44d26' },
}

export const PLATFORM_META_EXPORT = PLATFORM_META

export default async function IntegrationsPage({ params }: Props) {
  const { id } = await params
  const [project, integrations] = await Promise.all([
    getProject(id),
    getIntegrationsByProject(id),
  ])
  if (!project) notFound()

  const connectedMap = new Map<Platform, SafeIntegration>(
    integrations.map(i => [i.platform, i])
  )

  const allPlatforms = Object.keys(PLATFORM_META) as Platform[]
  const analyticsPlatforms = allPlatforms.filter(p => PLATFORM_META[p].category === 'analytics')
  const sessionPlatforms   = allPlatforms.filter(p => PLATFORM_META[p].category === 'session')
  const documentPlatforms  = allPlatforms.filter(p => PLATFORM_META[p].category === 'document')
  const connectedIntegrations = integrations.filter(i => i.status === 'connected')

  return (
    <div className="max-w-5xl mx-auto px-6 lg:px-8 py-8 space-y-10">
      <div>
        <Link
          href={`/projects/${id}`}
          className="inline-flex items-center gap-1 text-sm text-[var(--foreground-muted)] hover:text-foreground transition-colors mb-6"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M9 11L5 7l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {project.name}
        </Link>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Data Sources</h1>
            <p className="text-sm text-[var(--foreground-muted)] mt-1">
              Connect analytics platforms, session tools, and documents to enrich your AI analysis.
            </p>
          </div>
          {connectedIntegrations.length > 0 && (
            <SyncAllButton integrations={connectedIntegrations} projectId={id} />
          )}
        </div>
      </div>

      {/* Analytics Platforms */}
      <section aria-labelledby="analytics-heading">
        <div className="flex items-center gap-3 mb-4">
          <h2 id="analytics-heading" className="text-base font-semibold text-foreground">Analytics Platforms</h2>
          <span className="text-xs text-[var(--foreground-subtle)] bg-gray-100 px-2 py-0.5 rounded-full">
            {connectedIntegrations.filter(i => PLATFORM_META[i.platform].category === 'analytics').length} connected
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {analyticsPlatforms.map(platform => (
            <IntegrationCard
              key={platform}
              platform={platform}
              meta={PLATFORM_META[platform]}
              integration={connectedMap.get(platform) ?? null}
              projectId={id}
            />
          ))}
        </div>
      </section>

      {/* Session Tools */}
      <section aria-labelledby="session-heading">
        <div className="flex items-center gap-3 mb-4">
          <h2 id="session-heading" className="text-base font-semibold text-foreground">Session Tools</h2>
          <span className="text-xs text-[var(--foreground-subtle)] bg-gray-100 px-2 py-0.5 rounded-full">
            {connectedIntegrations.filter(i => PLATFORM_META[i.platform].category === 'session').length} connected
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {sessionPlatforms.map(platform => (
            <IntegrationCard
              key={platform}
              platform={platform}
              meta={PLATFORM_META[platform]}
              integration={connectedMap.get(platform) ?? null}
              projectId={id}
            />
          ))}
        </div>
      </section>

      {/* Documents & Files */}
      <section aria-labelledby="documents-heading">
        <div className="flex items-center gap-3 mb-4">
          <h2 id="documents-heading" className="text-base font-semibold text-foreground">Documents & Files</h2>
          <span className="text-xs text-[var(--foreground-subtle)] bg-gray-100 px-2 py-0.5 rounded-full">
            {connectedIntegrations.filter(i => PLATFORM_META[i.platform].category === 'document').length} connected
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {documentPlatforms.map(platform => (
            <IntegrationCard
              key={platform}
              platform={platform}
              meta={PLATFORM_META[platform]}
              integration={connectedMap.get(platform) ?? null}
              projectId={id}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
