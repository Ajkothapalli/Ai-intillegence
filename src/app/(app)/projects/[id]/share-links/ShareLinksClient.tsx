'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { revokeShareLink } from '@/features/analysis/actions'

interface ShareLinkRow {
  id: string
  token: string
  expires_at: string
  created_at: string
  recommendation: {
    id: string
    hypothesis: string
    priority: number
  } | null
}

interface Props {
  links: ShareLinkRow[]
  projectId: string
}

function isActive(expiresAt: string) {
  return new Date(expiresAt) > new Date()
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function ShareLinksClient({ links, projectId }: Props) {
  const router = useRouter()
  const [revoking, setRevoking] = useState<string | null>(null)
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  async function handleRevoke(linkId: string) {
    setRevoking(linkId)
    await revokeShareLink(linkId, projectId)
    setRevoking(null)
    setConfirmId(null)
    router.refresh()
  }

  function handleCopy(token: string, linkId: string) {
    const base = window.location.origin
    void navigator.clipboard.writeText(`${base}/share/${token}`)
    setCopied(linkId)
    setTimeout(() => setCopied(prev => prev === linkId ? null : prev), 2000)
  }

  if (links.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[var(--border)] px-6 py-12 text-center">
        <p className="text-sm text-slate-500">No share links yet.</p>
        <p className="text-xs text-slate-400 mt-1">Share a recommendation to create a link.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-[var(--border)] overflow-hidden">
      {links.map((link, i) => {
        const active = isActive(link.expires_at)
        const isConfirming = confirmId === link.id
        const isRevoking = revoking === link.id
        return (
          <div key={link.id} className={`px-5 py-4 space-y-2 ${i > 0 ? 'border-t border-[var(--border)]' : ''}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${active ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                    {active ? 'Active' : 'Expired'}
                  </span>
                  <span className="text-[11px] text-[var(--foreground-muted)]">
                    Created {formatDate(link.created_at)} · Expires {formatDate(link.expires_at)}
                  </span>
                </div>
                {link.recommendation && (
                  <p className="text-sm text-foreground mt-1.5 line-clamp-2 leading-snug">
                    <span className="text-[11px] font-semibold text-violet-600 mr-1.5">P{link.recommendation.priority}</span>
                    {link.recommendation.hypothesis}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {active && (
                  <button
                    onClick={() => handleCopy(link.token, link.id)}
                    className="h-7 px-2.5 rounded-lg border border-[var(--border)] text-xs font-medium text-[var(--foreground-muted)] hover:text-foreground hover:bg-slate-50 transition-colors"
                  >
                    {copied === link.id ? 'Copied!' : 'Copy link'}
                  </button>
                )}
                {active && !isConfirming && (
                  <button
                    onClick={() => setConfirmId(link.id)}
                    className="h-7 px-2.5 rounded-lg border border-red-200 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Revoke
                  </button>
                )}
              </div>
            </div>

            {/* Confirm revoke dialog */}
            {isConfirming && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2.5 flex items-center justify-between gap-3">
                <p className="text-xs text-red-700 font-medium">This link will stop working immediately.</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setConfirmId(null)}
                    className="text-xs text-slate-500 hover:text-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => void handleRevoke(link.id)}
                    disabled={isRevoking}
                    className="h-6 px-3 rounded-full bg-red-500 text-[11px] font-semibold text-white hover:bg-red-600 transition-colors disabled:opacity-60"
                  >
                    {isRevoking ? 'Revoking…' : 'Confirm revoke'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
