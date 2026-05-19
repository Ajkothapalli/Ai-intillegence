'use client'

import { useState } from 'react'
import { triggerSync } from '../actions'
import type { SafeIntegration } from '../types'

interface Props {
  integrations: SafeIntegration[]
  projectId: string
}

export function SyncAllButton({ integrations, projectId }: Props) {
  const [syncing, setSyncing] = useState(false)
  const [result, setResult] = useState<{ done: number; failed: number } | null>(null)

  async function handleSyncAll() {
    setSyncing(true)
    setResult(null)
    let done = 0
    let failed = 0
    // Run sequentially to avoid rate-limit issues
    for (const integration of integrations) {
      const res = await triggerSync(integration.id, projectId)
      if (res.success) done++
      else failed++
    }
    setSyncing(false)
    setResult({ done, failed })
  }

  return (
    <div className="flex items-center gap-3">
      {result && (
        <span className={`text-xs font-medium ${result.failed > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
          {result.done} synced{result.failed > 0 ? `, ${result.failed} failed` : ''}
        </span>
      )}
      <button
        onClick={handleSyncAll}
        disabled={syncing}
        className="inline-flex h-9 items-center gap-2 rounded-full border border-[var(--border)] bg-white px-4 text-sm font-medium text-foreground hover:bg-gray-50 transition-colors disabled:opacity-50"
      >
        {syncing ? (
          <>
            <svg className="animate-spin" width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M7 1v2M7 11v2M1 7h2M11 7h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Syncing...
          </>
        ) : (
          <>
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M12 7A5 5 0 112 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              <path d="M12 3v4h-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Sync all
          </>
        )}
      </button>
    </div>
  )
}
