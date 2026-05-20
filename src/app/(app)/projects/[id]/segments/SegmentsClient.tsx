'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { UserSegment } from '@/features/segments/types'
import type { SafeIntegration } from '@/features/integrations/types'
import { SegmentCard } from '@/features/segments/components/SegmentCard'
import { SegmentBuilderModal } from '@/features/segments/components/SegmentBuilderModal'
import { syncSegmentsFromIntegration } from '@/features/segments/actions'

interface Props {
  projectId: string
  initialSegments: UserSegment[]
  integrations: SafeIntegration[]
}

export function SegmentsClient({ projectId, initialSegments, integrations }: Props) {
  const router = useRouter()
  const [segments] = useState<UserSegment[]>(initialSegments)
  const [syncing, setSyncing] = useState(false)
  const [syncMsg, setSyncMsg] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingSegment, setEditingSegment] = useState<UserSegment | null>(null)

  async function handleSync() {
    setSyncing(true)
    setSyncMsg(null)
    const result = await syncSegmentsFromIntegration(projectId)
    setSyncing(false)
    if (result.success) {
      setSyncMsg(`Synced ${result.count} cohort${result.count !== 1 ? 's' : ''}`)
      router.refresh()
    } else {
      setSyncMsg(result.error)
    }
  }

  const analyticsIntegrations = integrations.filter(i =>
    ['mixpanel', 'amplitude', 'ga4', 'posthog', 'heap', 'segment', 'pendo'].includes(i.platform) &&
    i.status === 'connected'
  )

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-[var(--border)] bg-[var(--surface)] px-8 py-4 flex items-center justify-between">
        <Link href={`/projects/${projectId}`} className="text-sm text-[var(--foreground-muted)] hover:text-foreground transition-colors">
          ← Project
        </Link>
        <div className="flex items-center gap-2">
          {analyticsIntegrations.length > 0 && (
            <button
              onClick={handleSync}
              disabled={syncing}
              className="h-8 px-3 rounded-lg border border-[var(--border)] text-xs font-medium text-[var(--foreground-muted)] hover:bg-slate-50 transition-colors disabled:opacity-50 flex items-center gap-1.5"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={syncing ? 'animate-spin' : ''}>
                <path d="M11 6a5 5 0 01-9.5 2M1 6a5 5 0 019.5-2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
              {syncing ? 'Syncing…' : 'Sync from integrations'}
            </button>
          )}
          <button
            onClick={() => { setEditingSegment(null); setModalOpen(true) }}
            className="h-8 px-3 rounded-lg bg-primary text-xs font-semibold text-primary-foreground hover:bg-[var(--primary-hover)] transition-colors"
          >
            + New segment
          </button>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-8 py-10 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Audience Segments</h1>
          <p className="text-sm text-[var(--foreground-muted)] mt-1">
            Define who each experiment targets. Segments filter recommendations and attach target audiences to experiment runs.
          </p>
        </div>

        {syncMsg && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2.5 text-sm text-emerald-700">
            {syncMsg}
          </div>
        )}

        {analyticsIntegrations.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-200 px-5 py-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Connected platforms</p>
            <div className="flex flex-wrap gap-2">
              {analyticsIntegrations.map(i => (
                <span
                  key={i.id}
                  className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {i.platform.replace(/_/g, ' ')}
                  {i.last_synced_at && (
                    <span className="text-emerald-500 font-normal">
                      · {new Date(i.last_synced_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>
        )}

        {segments.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center mx-auto mb-4">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" className="text-violet-500">
                <circle cx="11" cy="7.5" r="4" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M2.5 19c0-4 3.5-6.5 8.5-6.5s8.5 2.5 8.5 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <p className="text-sm font-medium text-slate-700">No segments yet</p>
            <p className="text-xs text-slate-500 mt-1">
              {analyticsIntegrations.length > 0
                ? 'Sync from your analytics tools or create one manually'
                : 'Create a segment manually or connect an analytics integration first'}
            </p>
            <button
              onClick={() => { setEditingSegment(null); setModalOpen(true) }}
              className="mt-4 inline-flex h-9 items-center px-4 rounded-full bg-primary text-sm font-semibold text-primary-foreground hover:bg-[var(--primary-hover)] transition-colors"
            >
              + New segment
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {segments.map(seg => (
              <SegmentCard
                key={seg.id}
                segment={seg}
                projectId={projectId}
                onEdit={s => { setEditingSegment(s); setModalOpen(true) }}
              />
            ))}
          </div>
        )}
      </div>

      {modalOpen && (
        <SegmentBuilderModal
          projectId={projectId}
          integrations={integrations}
          editingSegment={editingSegment}
          onClose={() => { setModalOpen(false); setEditingSegment(null) }}
          onSuccess={() => {
            setModalOpen(false)
            setEditingSegment(null)
            router.refresh()
          }}
        />
      )}
    </main>
  )
}
