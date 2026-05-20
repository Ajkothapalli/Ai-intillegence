'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getProjectsList } from '../actions'
import { ConnectAnalyticsModal } from './ConnectAnalyticsModal'
import { ConnectSessionModal } from './ConnectSessionModal'
import type { Platform } from '../types'

type Category = 'analytics' | 'session' | 'document'

type Props = {
  platform: Platform
  platformName: string
  category: Category
  loginUrl: string
  onClose: () => void
}

export function GlobalConnectModal({ platform, platformName, category, loginUrl, onClose }: Props) {
  const router = useRouter()
  const [projects, setProjects] = useState<{ id: string; name: string }[]>([])
  const [selectedProjectId, setSelectedProjectId] = useState('')
  const [loading, setLoading] = useState(true)
  const [step, setStep] = useState<'select' | 'connect'>('select')

  useEffect(() => {
    getProjectsList().then(list => {
      setProjects(list)
      if (list.length === 1) setSelectedProjectId(list[0].id)
      setLoading(false)
    })
  }, [])

  function handleContinue() {
    if (!selectedProjectId) return
    if (category === 'document') {
      router.push(`/projects/${selectedProjectId}/uploads`)
      onClose()
      return
    }
    setStep('connect')
  }

  if (step === 'connect' && category === 'analytics') {
    return (
      <ConnectAnalyticsModal
        platform={platform}
        projectId={selectedProjectId}
        platformName={platformName}
        onClose={onClose}
        onSuccess={() => {
          router.push(`/projects/${selectedProjectId}/integrations`)
          onClose()
        }}
      />
    )
  }

  if (step === 'connect' && category === 'session') {
    return (
      <ConnectSessionModal
        platform={platform}
        projectId={selectedProjectId}
        platformName={platformName}
        onClose={onClose}
        onSuccess={() => {
          router.push(`/projects/${selectedProjectId}/integrations`)
          onClose()
        }}
      />
    )
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-2xl border border-[var(--border)] shadow-xl w-full max-w-md p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Connect {platformName}</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-[var(--foreground-muted)] hover:bg-gray-100 hover:text-foreground transition-colors"
            aria-label="Close"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Step 1: Login */}
        <div className="rounded-xl border border-[var(--border)] p-4 space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-[11px] font-bold flex items-center justify-center shrink-0">1</span>
            <p className="text-sm font-semibold text-foreground">
              {category === 'document' ? `Prepare your ${platformName} file` : `Log in to ${platformName}`}
            </p>
          </div>
          <p className="text-xs text-[var(--foreground-muted)] pl-7">
            {category === 'analytics' && 'Log in to your account and copy the API credentials shown below.'}
            {category === 'session' && 'Log in and export your session data as a CSV file.'}
            {category === 'document' && `Open your document in ${platformName} and export / download it to your computer.`}
          </p>
          {category !== 'document' && (
            <div className="pl-7">
              <a
                href={loginUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 h-8 px-4 rounded-full bg-primary text-xs font-semibold text-primary-foreground hover:bg-[var(--primary-hover)] transition-colors shadow-[0_2px_8px_rgba(25,98,98,0.25)]"
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                  <path d="M1 9L9 1M9 1H4M9 1v5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Open {platformName}
              </a>
            </div>
          )}
        </div>

        {/* Step 2: Select project */}
        <div className="rounded-xl border border-[var(--border)] p-4 space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-[11px] font-bold flex items-center justify-center shrink-0">2</span>
            <p className="text-sm font-semibold text-foreground">Select a project</p>
          </div>
          {loading ? (
            <p className="text-xs text-[var(--foreground-muted)] pl-7">Loading projects…</p>
          ) : projects.length === 0 ? (
            <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2 ml-7">
              No projects found. Create a project first.
            </p>
          ) : (
            <select
              value={selectedProjectId}
              onChange={e => setSelectedProjectId(e.target.value)}
              className="ml-7 w-[calc(100%-1.75rem)] rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)]"
            >
              <option value="" disabled>Choose a project…</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-9 rounded-lg border border-[var(--border)] text-sm font-medium text-foreground hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleContinue}
            disabled={!selectedProjectId}
            className="flex-1 h-9 rounded-lg bg-primary text-sm font-semibold text-primary-foreground hover:bg-[var(--primary-hover)] transition-colors disabled:opacity-50"
          >
            {category === 'document' ? 'Go to Uploads' : 'Continue →'}
          </button>
        </div>
      </div>
    </div>
  )
}
