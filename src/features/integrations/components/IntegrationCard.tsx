'use client'

import { useState } from 'react'
import type { Platform, SafeIntegration } from '../types'
import { SyncStatusBadge } from './SyncStatusBadge'
import { ConnectAnalyticsModal } from './ConnectAnalyticsModal'
import { ConnectSessionModal } from './ConnectSessionModal'
import { triggerSync, deleteIntegration } from '../actions'

interface PlatformMeta {
  name: string
  description: string
  category: 'analytics' | 'session' | 'document'
  color: string
}

interface Props {
  platform: Platform
  meta: PlatformMeta
  integration: SafeIntegration | null
  projectId: string
}

const DOCUMENT_PLATFORMS: Platform[] = ['google_sheets', 'google_docs', 'google_slides', 'excel', 'word', 'powerpoint', 'pdf']

export function IntegrationCard({ platform, meta, integration, projectId }: Props) {
  const [showModal, setShowModal] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [syncError, setSyncError] = useState<string | null>(null)

  const isDocument = DOCUMENT_PLATFORMS.includes(platform)
  const isSession = meta.category === 'session'
  const isConnected = integration?.status === 'connected'
  const isError = integration?.status === 'error'

  async function handleSync() {
    if (!integration) return
    setSyncing(true)
    setSyncError(null)
    const result = await triggerSync(integration.id, projectId)
    setSyncing(false)
    if (!result.success) setSyncError(result.error)
  }

  async function handleDelete() {
    if (!integration) return
    await deleteIntegration(integration.id, projectId)
  }

  const initial = meta.name.charAt(0).toUpperCase()

  return (
    <>
      <div className="bg-white rounded-xl border border-[var(--border)] p-4 flex flex-col gap-3 hover:border-gray-300 transition-colors">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-sm font-bold shrink-0"
            style={{ backgroundColor: meta.color }}
          >
            {initial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground leading-tight">{meta.name}</p>
            <p className="text-[11px] text-[var(--foreground-muted)] mt-0.5 leading-tight">{meta.description}</p>
          </div>
        </div>

        {/* Status */}
        <SyncStatusBadge
          status={integration?.status ?? 'disconnected'}
          lastSyncedAt={integration?.last_synced_at ?? null}
        />

        {syncError && (
          <p className="text-[11px] text-red-500">{syncError}</p>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-auto">
          {!integration ? (
            <button
              onClick={() => setShowModal(true)}
              disabled={isDocument}
              className="flex-1 h-7 rounded-lg border border-[var(--border)] text-xs font-medium text-foreground hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              title={isDocument ? 'Upload files via the Uploads page' : undefined}
            >
              {isDocument ? 'Upload via Files' : 'Connect'}
            </button>
          ) : (
            <>
              {!isDocument && !isSession && (
                <button
                  onClick={handleSync}
                  disabled={syncing}
                  className="flex-1 h-7 rounded-lg bg-primary text-xs font-semibold text-primary-foreground hover:bg-[var(--primary-hover)] transition-colors disabled:opacity-50"
                >
                  {syncing ? 'Syncing...' : 'Sync'}
                </button>
              )}
              <button
                onClick={handleDelete}
                className="h-7 px-2.5 rounded-lg border border-red-200 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors"
              >
                Remove
              </button>
            </>
          )}
        </div>

        {/* Error retry */}
        {isError && !isDocument && !isSession && (
          <button
            onClick={handleSync}
            disabled={syncing}
            className="w-full h-7 rounded-lg border border-amber-200 text-xs font-medium text-amber-600 hover:bg-amber-50 transition-colors"
          >
            Retry sync
          </button>
        )}
      </div>

      {/* Modals */}
      {showModal && !isConnected && !isDocument && !isSession && (
        <ConnectAnalyticsModal
          platform={platform}
          projectId={projectId}
          platformName={meta.name}
          onClose={() => setShowModal(false)}
          onSuccess={() => setShowModal(false)}
        />
      )}
      {showModal && !isConnected && isSession && (
        <ConnectSessionModal
          platform={platform}
          projectId={projectId}
          platformName={meta.name}
          onClose={() => setShowModal(false)}
          onSuccess={() => setShowModal(false)}
        />
      )}
    </>
  )
}
