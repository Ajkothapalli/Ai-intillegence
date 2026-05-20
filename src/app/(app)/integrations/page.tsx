'use client'

import { useState } from 'react'
import type { Platform } from '@/features/integrations/types'
import { GlobalConnectModal } from '@/features/integrations/components/GlobalConnectModal'

const LOGO_DEV_KEY = 'pk_Qzx_5yxSQ06xtnVRtd6ptQ'

type Category = 'analytics' | 'session' | 'document'

interface PlatformMeta {
  name: string
  description: string
  category: Category
  color: string
  domain: string
  fields: string
  loginUrl: string
}

const PLATFORM_META: Record<Platform, PlatformMeta> = {
  mixpanel:      { name: 'Mixpanel',           description: 'Pull funnel analysis, cohort data and retention metrics directly from your Mixpanel project.',     category: 'analytics', color: '#7856ff', domain: 'mixpanel.com',          fields: 'Project ID · Service Account', loginUrl: 'https://mixpanel.com/login' },
  amplitude:     { name: 'Amplitude',          description: 'Import product analytics and retention data from Amplitude into your analysis pipeline.',           category: 'analytics', color: '#1da4b5', domain: 'amplitude.com',         fields: 'API Key · Secret Key',         loginUrl: 'https://app.amplitude.com/login' },
  ga4:           { name: 'Google Analytics 4', description: 'Connect GA4 to pull web analytics, conversion funnels and audience data.',                         category: 'analytics', color: '#e37400', domain: 'analytics.google.com', fields: 'Property ID · API Secret',     loginUrl: 'https://analytics.google.com' },
  posthog:       { name: 'PostHog',            description: 'Fetch funnel analysis, session recordings context and feature flag data from PostHog.',             category: 'analytics', color: '#f54e00', domain: 'posthog.com',           fields: 'API Key · Project ID',         loginUrl: 'https://us.posthog.com/login' },
  heap:          { name: 'Heap',               description: 'Import automatically captured event data and conversion funnels from Heap.',                        category: 'analytics', color: '#6f42c1', domain: 'heap.io',               fields: 'App ID · API Key',             loginUrl: 'https://heapanalytics.com/login' },
  segment:       { name: 'Segment',            description: 'Pull unified customer data and event streams from your Segment workspace.',                         category: 'analytics', color: '#52bd94', domain: 'segment.com',           fields: 'Workspace Slug · Access Token', loginUrl: 'https://app.segment.com/login' },
  pendo:         { name: 'Pendo',              description: 'Import product engagement, feature adoption and in-app guide performance data from Pendo.',         category: 'analytics', color: '#ff4876', domain: 'pendo.io',              fields: 'Integration Key',              loginUrl: 'https://app.pendo.io/login' },
  hotjar:        { name: 'Hotjar',             description: 'Upload Hotjar survey exports and heatmap screenshots to enrich your session analysis.',             category: 'session',   color: '#fd3a5c', domain: 'hotjar.com',            fields: 'CSV export upload',            loginUrl: 'https://insights.hotjar.com/login' },
  logrocket:     { name: 'LogRocket',          description: 'Import session summary CSVs from LogRocket to surface rage clicks and error-heavy paths.',          category: 'session',   color: '#764abc', domain: 'logrocket.com',         fields: 'CSV export upload',            loginUrl: 'https://app.logrocket.com/login' },
  google_sheets: { name: 'Google Sheets',      description: 'Upload a Google Sheets export — funnel data is auto-detected and parsed into the analysis.',        category: 'document',  color: '#34a853', domain: 'sheets.google.com',    fields: 'File upload (.xlsx, .csv)',     loginUrl: 'https://sheets.google.com' },
  google_docs:   { name: 'Google Docs',        description: 'Upload a Google Docs export to inject research context into your AI analysis.',                     category: 'document',  color: '#4285f4', domain: 'docs.google.com',      fields: 'File upload (.docx)',           loginUrl: 'https://docs.google.com' },
  google_slides: { name: 'Google Slides',      description: 'Upload a Google Slides export — slide text is extracted as structured research context.',           category: 'document',  color: '#f9ab00', domain: 'slides.google.com',    fields: 'File upload (.pptx)',           loginUrl: 'https://slides.google.com' },
  excel:         { name: 'Excel',              description: 'Upload an Excel workbook — funnel sheets are auto-detected and parsed.',                            category: 'document',  color: '#217346', domain: 'excel.office.com',      fields: 'File upload (.xlsx)',           loginUrl: 'https://excel.office.com' },
  word:          { name: 'Word',               description: 'Upload a Word document to add research context to your experiment analysis.',                       category: 'document',  color: '#2b579a', domain: 'word.office.com',       fields: 'File upload (.docx)',           loginUrl: 'https://word.office.com' },
  powerpoint:    { name: 'PowerPoint',         description: 'Upload a PowerPoint — slide content is extracted and injected into your analysis.',                 category: 'document',  color: '#d24726', domain: 'powerpoint.office.com', fields: 'File upload (.pptx)',           loginUrl: 'https://powerpoint.office.com' },
  pdf:           { name: 'PDF',                description: 'Upload any PDF report or research document — our AI reads it directly during analysis.',             category: 'document',  color: '#e44d26', domain: 'adobe.com',             fields: 'File upload (.pdf)',            loginUrl: 'https://acrobat.adobe.com' },
}

const SECTIONS: { key: Category; title: string; description: string }[] = [
  { key: 'analytics', title: 'Analytics Platforms',  description: 'Connect via API key to pull funnel and cohort data on demand.' },
  { key: 'session',   title: 'Session Tools',         description: 'Upload CSV exports from session recording tools.' },
  { key: 'document',  title: 'Documents & Files',     description: 'Upload spreadsheets, docs, slides and PDFs as analysis context.' },
]

const CATEGORY_BADGE: Record<Category, string> = {
  analytics: 'bg-violet-50 text-violet-700 border border-violet-200',
  session:   'bg-amber-50 text-amber-700 border border-amber-200',
  document:  'bg-sky-50 text-sky-700 border border-sky-200',
}

function PlatformIcon({ domain, name, color }: { domain: string; name: string; color: string }) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <span className="text-[11px] font-bold leading-none" style={{ color }}>
        {name.slice(0, 2).toUpperCase()}
      </span>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://img.logo.dev/${domain}?token=${LOGO_DEV_KEY}&size=40&format=png`}
      alt={name}
      width={24}
      height={24}
      className="w-6 h-6 object-contain"
      onError={() => setFailed(true)}
    />
  )
}

type ModalState = { platform: Platform; open: boolean } | null

export default function IntegrationsPage() {
  const allPlatforms = Object.keys(PLATFORM_META) as Platform[]
  const [modal, setModal] = useState<ModalState>(null)

  return (
    <>
    <div className="max-w-3xl mx-auto px-6 lg:px-8 py-8 space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Integrations</h1>
        <p className="text-sm text-[var(--foreground-muted)] mt-1">
          Connect analytics platforms, session tools, and documents to enrich your AI analysis.
        </p>
      </div>

      {SECTIONS.map(section => {
        const platforms = allPlatforms.filter(p => PLATFORM_META[p].category === section.key)
        return (
          <section key={section.key}>
            <div className="mb-4">
              <h2 className="text-base font-semibold text-foreground">{section.title}</h2>
              <p className="text-xs text-[var(--foreground-muted)] mt-0.5">{section.description}</p>
            </div>

            <div className="bg-white rounded-2xl border border-[var(--border)] divide-y divide-[var(--border)] overflow-hidden">
              {platforms.map(platform => {
                const meta = PLATFORM_META[platform]
                return (
                  <div key={platform} className="group flex items-center gap-4 px-5 py-4 hover:bg-[var(--forest-50)]/50 transition-colors">

                    {/* Logo */}
                    <div
                      className="w-10 h-10 rounded-md flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${meta.color}15` }}
                    >
                      <PlatformIcon domain={meta.domain} name={meta.name} color={meta.color} />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-foreground">{meta.name}</p>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${CATEGORY_BADGE[meta.category]}`}>
                          {meta.category === 'analytics' ? 'Analytics' : meta.category === 'session' ? 'Session' : 'Document'}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--foreground-muted)] mt-0.5 line-clamp-1 leading-relaxed">
                        {meta.description}
                      </p>
                      <p className="text-[10px] text-[var(--foreground-subtle)] mt-1">{meta.fields}</p>
                    </div>

                    {/* Hover CTA */}
                    <button
                      type="button"
                      onClick={() => setModal({ platform, open: true })}
                      className="shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-150 translate-x-1 group-hover:translate-x-0 inline-flex items-center gap-1.5 h-8 px-4 rounded-full bg-primary text-xs font-semibold text-white hover:bg-[var(--primary-hover)] shadow-[0_2px_8px_rgba(25,98,98,0.25)]"
                    >
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                        <path d="M1 9L9 1M9 1H4M9 1v5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Integrate
                    </button>
                  </div>
                )
              })}
            </div>
          </section>
        )
      })}
    </div>

    {modal?.open && (
      <GlobalConnectModal
        platform={modal.platform}
        platformName={PLATFORM_META[modal.platform].name}
        category={PLATFORM_META[modal.platform].category}
        loginUrl={PLATFORM_META[modal.platform].loginUrl}
        onClose={() => setModal(null)}
      />
    )}
    </>
  )
}
