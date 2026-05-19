'use client'

import { useState, useRef } from 'react'
import { createIntegration } from '../actions'
import type { Platform } from '../types'

type Props = {
  platform: Platform
  projectId: string
  platformName: string
  onClose: () => void
  onSuccess: () => void
}

const EXPORT_INSTRUCTIONS: Record<string, string[]> = {
  hotjar: [
    'Log in to Hotjar and open your site.',
    'Go to Surveys → select a survey → Responses.',
    'Click "Export" → "Download CSV".',
    'Upload the downloaded CSV file below.',
  ],
  logrocket: [
    'Log in to LogRocket and open your project.',
    'Go to Sessions → filter as needed.',
    'Click "Export" → "Export CSV".',
    'Upload the downloaded CSV file below.',
  ],
}

interface InsightPreview {
  type: string
  location: string
  detail: string
  frequency: number
}

export function ConnectSessionModal({ platform, projectId, platformName, onClose, onSuccess }: Props) {
  const [file, setFile] = useState<File | null>(null)
  const [insights, setInsights] = useState<InsightPreview[] | null>(null)
  const [parsing, setParsing] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const instructions = EXPORT_INSTRUCTIONS[platform] ?? []

  async function handleFilePick(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = e.target.files?.[0]
    if (!picked) return
    setFile(picked)
    setError(null)
    setInsights(null)
    setParsing(true)
    try {
      const text = await picked.text()
      const { parseInsightsClientSide } = await import('../utils/sessionPreview')
      const parsed = parseInsightsClientSide(platform, text)
      setInsights(parsed)
    } catch {
      setError('Could not parse file — check that it is a valid CSV export')
    } finally {
      setParsing(false)
    }
  }

  async function handleSave() {
    if (!file) return
    setSubmitting(true)
    setError(null)
    // First create the integration record (no credentials needed for file-based tools)
    const result = await createIntegration(projectId, platform, {})
    if (!result.success) {
      setError(result.error)
      setSubmitting(false)
      return
    }
    setSubmitting(false)
    onSuccess()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-2xl border border-[var(--border)] shadow-xl w-full max-w-lg p-6 space-y-5">
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

        {/* Export Instructions */}
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 space-y-2">
          <p className="text-xs font-semibold text-[var(--foreground-subtle)] uppercase tracking-wide">How to export</p>
          <ol className="space-y-1.5">
            {instructions.map((step, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                <span className="w-5 h-5 rounded-full bg-white border border-gray-200 text-[11px] font-semibold text-[var(--foreground-subtle)] flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        {/* File Upload Zone */}
        <div>
          <input
            ref={fileRef}
            type="file"
            accept=".csv"
            className="sr-only"
            onChange={handleFilePick}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="w-full h-24 rounded-xl border-2 border-dashed border-[var(--border)] hover:border-[var(--primary)]/50 hover:bg-[var(--forest-50)]/30 transition-colors flex flex-col items-center justify-center gap-2 text-sm text-[var(--foreground-muted)]"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M3 14v2a1 1 0 001 1h12a1 1 0 001-1v-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M10 3v10M7 6l3-3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {file ? <span className="font-medium text-foreground">{file.name}</span> : 'Click to upload CSV export'}
          </button>
        </div>

        {/* Insights Preview */}
        {parsing && (
          <p className="text-sm text-[var(--foreground-muted)]">Parsing file...</p>
        )}
        {insights && insights.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-[var(--foreground-subtle)] uppercase tracking-wide">
              {insights.length} insight{insights.length !== 1 ? 's' : ''} extracted
            </p>
            <div className="max-h-48 overflow-y-auto space-y-2">
              {insights.map((insight, i) => (
                <div key={i} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-xs">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="bg-white border border-gray-200 rounded px-1.5 py-0.5 text-[10px] font-mono text-[var(--foreground-subtle)]">
                      {insight.type}
                    </span>
                    <span className="text-[var(--foreground-muted)] truncate">{insight.location}</span>
                  </div>
                  <p className="text-foreground">{insight.detail}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {insights && insights.length === 0 && (
          <p className="text-sm text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
            No insights could be extracted. Check that the CSV format matches the expected export format.
          </p>
        )}

        {error && (
          <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
        )}

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
            onClick={handleSave}
            disabled={!file || submitting}
            className="flex-1 h-9 rounded-lg bg-primary text-sm font-semibold text-primary-foreground hover:bg-[var(--primary-hover)] transition-colors disabled:opacity-50"
          >
            {submitting ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}
