'use client'

import { useState } from 'react'
import type { Platform, SafeIntegration } from '../types'
import { ConnectAnalyticsModal } from './ConnectAnalyticsModal'
import { ConnectSessionModal } from './ConnectSessionModal'
import { triggerSync, deleteIntegration } from '../actions'
import { PlatformLogo } from './PlatformLogo'

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


function timeAgo(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

export function IntegrationCard({ platform, meta, integration, projectId }: Props) {
  const [showModal, setShowModal] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [syncError, setSyncError] = useState<string | null>(null)

  const isDocument = DOCUMENT_PLATFORMS.includes(platform)
  const isSession = meta.category === 'session'
  const isConnected = integration?.status === 'connected'
  const isError = integration?.status === 'error'
  const errorMessage = integration?.error_message ?? null

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

  return (
    <>
      <div className="group relative bg-white rounded-xl border border-[var(--border)] overflow-hidden transition-all duration-200 hover:border-gray-300 hover:shadow-[0_4px_20px_rgba(0,0,0,0.09)] hover:-translate-y-0.5">

        {/* Status badge — top right */}
        {isConnected && (
          <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Connected
          </div>
        )}
        {isError && (
          <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1 bg-red-50 border border-red-200 text-red-600 text-[10px] font-semibold px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            Error
          </div>
        )}

        {/* Logo thumbnail area */}
        <div
          className="h-32 flex items-center justify-center relative overflow-hidden"
          style={{ backgroundColor: `${meta.color}10` }}
        >
          {/* Soft decorative blobs */}
          <div className="absolute w-28 h-28 rounded-full blur-2xl opacity-25 -top-6 -right-6" style={{ backgroundColor: meta.color }} />
          <div className="absolute w-20 h-20 rounded-full blur-2xl opacity-15 -bottom-4 -left-4" style={{ backgroundColor: meta.color }} />

          {/* Logo */}
          <div className="relative z-10 drop-shadow-sm scale-125">
            <PlatformLogo platform={platform} color={meta.color} />
          </div>

          {/* Hover overlay — not connected, not document */}
          {!isConnected && !isDocument && (
            <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 bg-white/85 backdrop-blur-[3px]">
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-1.5 h-8 px-4 rounded-full text-xs font-semibold text-white shadow-[0_2px_12px_rgba(0,0,0,0.18)] transition-transform hover:scale-105 active:scale-95"
                style={{ backgroundColor: meta.color }}
              >
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
                Connect
              </button>
            </div>
          )}

          {/* Hover overlay — error state */}
          {isError && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-white/90 backdrop-blur-[3px] px-4">
              <button
                onClick={() => setShowModal(true)}
                className="h-8 px-4 rounded-full text-xs font-semibold bg-red-500 text-white hover:bg-red-600 transition-transform hover:scale-105"
              >
                Reconnect
              </button>
              <button
                onClick={handleDelete}
                className="h-7 px-3 rounded-full text-xs font-medium text-slate-500 hover:text-slate-700 transition-colors"
              >
                Remove
              </button>
            </div>
          )}

          {/* Hover overlay — connected */}
          {isConnected && (
            <div className="absolute inset-0 z-10 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-white/85 backdrop-blur-[3px]">
              {!isDocument && !isSession && (
                <button
                  onClick={handleSync}
                  disabled={syncing}
                  className="h-8 px-3 rounded-full text-xs font-semibold text-white transition-transform hover:scale-105 disabled:opacity-60"
                  style={{ backgroundColor: meta.color }}
                >
                  {syncing ? 'Syncing…' : 'Sync now'}
                </button>
              )}
              <button
                onClick={handleDelete}
                className="h-8 px-3 rounded-full text-xs font-semibold bg-red-500 text-white hover:bg-red-600 transition-transform hover:scale-105"
              >
                Remove
              </button>
            </div>
          )}

          {/* Hover overlay — document */}
          {isDocument && (
            <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 bg-white/85 backdrop-blur-[3px] px-4">
              <p className="text-xs font-medium text-[var(--foreground-muted)] text-center leading-snug">
                Upload via the Files tab
              </p>
            </div>
          )}
        </div>

        {/* Card footer */}
        <div className="px-4 py-3 border-t border-[var(--border)]/50">
          <p className="text-sm font-semibold text-foreground leading-tight">{meta.name}</p>
          <p className="text-[11px] text-[var(--foreground-muted)] mt-0.5 leading-snug line-clamp-1">{meta.description}</p>
          {isConnected && integration?.last_synced_at && (
            <p className="text-[10px] text-[var(--foreground-subtle)] mt-1.5 flex items-center gap-1">
              <svg width="9" height="9" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                <circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M5 3v2l1.5 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              Synced {timeAgo(integration.last_synced_at)}
            </p>
          )}
          {syncError && <p className="text-[10px] text-red-500 mt-1 truncate" title={syncError}>Sync failed: {syncError}</p>}
          {!syncError && isError && errorMessage && (
            <p className="text-[10px] text-red-500 mt-1 truncate" title={errorMessage}>{errorMessage}</p>
          )}
        </div>
      </div>

      {showModal && !isDocument && !isSession && (
        <ConnectAnalyticsModal
          platform={platform}
          projectId={projectId}
          platformName={meta.name}
          onClose={() => setShowModal(false)}
          onSuccess={() => setShowModal(false)}
        />
      )}
      {showModal && isSession && (
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
