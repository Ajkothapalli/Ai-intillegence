'use client'

import { useState } from 'react'
import type { Platform, SafeIntegration } from '../types'
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

function PlatformLogo({ platform, color }: { platform: Platform; color: string }) {
  switch (platform) {
    case 'mixpanel':
      return (
        <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
          <circle cx="10" cy="20" r="6" fill={color} opacity=".9"/>
          <circle cx="30" cy="20" r="6" fill={color} opacity=".5"/>
          <circle cx="20" cy="12" r="6" fill={color} opacity=".7"/>
          <circle cx="20" cy="28" r="6" fill={color} opacity=".4"/>
        </svg>
      )
    case 'amplitude':
      return (
        <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
          <path d="M4 30l8-16 5 10 4-8 5 10 4-8 6 12" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    case 'ga4':
      return (
        <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
          <rect x="6" y="22" width="8" height="12" rx="2" fill="#f9ab00"/>
          <rect x="16" y="14" width="8" height="20" rx="2" fill="#e37400"/>
          <rect x="26" y="6" width="8" height="28" rx="2" fill="#e37400" opacity=".6"/>
        </svg>
      )
    case 'posthog':
      return (
        <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
          <path d="M20 6C12.27 6 6 12.27 6 20s6.27 14 14 14 14-6.27 14-14S27.73 6 20 6z" fill={color} opacity=".12"/>
          <path d="M14 20a6 6 0 1112 0" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
          <circle cx="20" cy="20" r="3" fill={color}/>
          <path d="M20 14v-4M26 17l3-3M14 17l-3-3" stroke={color} strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    case 'heap':
      return (
        <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
          <rect x="6" y="6" width="12" height="12" rx="3" fill={color} opacity=".8"/>
          <rect x="22" y="6" width="12" height="12" rx="3" fill={color} opacity=".5"/>
          <rect x="6" y="22" width="12" height="12" rx="3" fill={color} opacity=".5"/>
          <rect x="22" y="22" width="12" height="12" rx="3" fill={color} opacity=".3"/>
        </svg>
      )
    case 'segment':
      return (
        <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
          <circle cx="20" cy="20" r="10" stroke={color} strokeWidth="2.5" fill="none"/>
          <path d="M13 20h14M20 13v14" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
      )
    case 'pendo':
      return (
        <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
          <path d="M10 8h12a8 8 0 010 16H10V8z" fill={color} opacity=".8"/>
          <path d="M10 24v8" stroke={color} strokeWidth="3" strokeLinecap="round"/>
        </svg>
      )
    case 'hotjar':
      return (
        <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
          <path d="M20 6c-3 6-8 8-8 14a8 8 0 0016 0c0-4-2-7-4-10-1 3-2 5-4 6z" fill={color} opacity=".85"/>
        </svg>
      )
    case 'logrocket':
      return (
        <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
          <rect x="6" y="10" width="28" height="20" rx="4" stroke={color} strokeWidth="2.5" fill="none"/>
          <circle cx="14" cy="20" r="3" fill={color}/>
          <path d="M20 17v6M26 17v6" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
      )
    case 'google_sheets':
      return (
        <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
          <rect x="9" y="5" width="22" height="30" rx="3" fill="#34a853" opacity=".15"/>
          <rect x="9" y="5" width="22" height="30" rx="3" stroke="#34a853" strokeWidth="1.5"/>
          <path d="M13 15h14M13 20h14M13 25h10" stroke="#34a853" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      )
    case 'google_docs':
      return (
        <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
          <rect x="9" y="5" width="22" height="30" rx="3" fill="#4285f4" opacity=".12"/>
          <rect x="9" y="5" width="22" height="30" rx="3" stroke="#4285f4" strokeWidth="1.5"/>
          <path d="M14 15h12M14 20h12M14 25h8" stroke="#4285f4" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      )
    case 'google_slides':
      return (
        <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
          <rect x="5" y="10" width="30" height="20" rx="3" fill="#fbbc05" opacity=".15"/>
          <rect x="5" y="10" width="30" height="20" rx="3" stroke="#fbbc05" strokeWidth="1.5"/>
          <rect x="11" y="15" width="18" height="10" rx="1.5" fill="#fbbc05" opacity=".4"/>
        </svg>
      )
    case 'excel':
      return (
        <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
          <rect x="9" y="5" width="22" height="30" rx="3" fill="#217346" opacity=".15"/>
          <rect x="9" y="5" width="22" height="30" rx="3" stroke="#217346" strokeWidth="1.5"/>
          <path d="M14 14l12 12M26 14L14 26" stroke="#217346" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    case 'word':
      return (
        <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
          <rect x="9" y="5" width="22" height="30" rx="3" fill="#2b579a" opacity=".12"/>
          <rect x="9" y="5" width="22" height="30" rx="3" stroke="#2b579a" strokeWidth="1.5"/>
          <path d="M13 14l3 12 4-8 4 8 3-12" stroke="#2b579a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    case 'powerpoint':
      return (
        <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
          <rect x="9" y="5" width="22" height="30" rx="3" fill="#d24726" opacity=".12"/>
          <rect x="9" y="5" width="22" height="30" rx="3" stroke="#d24726" strokeWidth="1.5"/>
          <path d="M13 13h9a4 4 0 010 8h-9V13z" fill="#d24726" opacity=".5"/>
          <path d="M13 21v8" stroke="#d24726" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      )
    case 'pdf':
      return (
        <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
          <rect x="9" y="5" width="22" height="30" rx="3" fill="#e44d26" opacity=".12"/>
          <rect x="9" y="5" width="22" height="30" rx="3" stroke="#e44d26" strokeWidth="1.5"/>
          <path d="M14 22h4a2 2 0 000-4h-4v8M22 18h2a3 3 0 010 6h-2M28 18v8" stroke="#e44d26" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
  }
}

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
          {syncError && <p className="text-[10px] text-red-500 mt-1 truncate">{syncError}</p>}
        </div>
      </div>

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
