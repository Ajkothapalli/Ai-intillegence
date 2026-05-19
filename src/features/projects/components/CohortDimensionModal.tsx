'use client'

import { useState } from 'react'
import { saveCohortDimension } from '../actions'

interface Props {
  projectId: string
  uploadId: string
  segments: string[]
  onClose: () => void
}

export function CohortDimensionModal({ projectId, uploadId, segments, onClose }: Props) {
  const [name, setName]       = useState('')
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState<string | null>(null)

  async function handleSave() {
    if (!name.trim()) { setError('Please enter a dimension name'); return }
    setSaving(true)
    setError(null)
    const result = await saveCohortDimension(projectId, uploadId, name, segments)
    setSaving(false)
    if (result.success) { onClose() }
    else { setError(result.error) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-[var(--border)] w-full max-w-md space-y-5 p-6">

        <div>
          <h2 className="text-lg font-bold text-foreground">Segment column detected</h2>
          <p className="text-sm text-[var(--foreground-muted)] mt-1">
            Your CSV has {segments.length} unique segment values. Give this cohort dimension a name so the AI can compare across groups.
          </p>
        </div>

        <div>
          <label className="text-xs font-semibold text-[var(--foreground-subtle)] uppercase tracking-wider">
            Dimension name
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && void handleSave()}
            placeholder="e.g. Platform, Plan tier, Region…"
            autoFocus
            className="mt-1.5 w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm text-foreground placeholder:text-[var(--foreground-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)]"
          />
        </div>

        <div>
          <p className="text-xs font-semibold text-[var(--foreground-subtle)] uppercase tracking-wider mb-2">
            Segments ({segments.length})
          </p>
          <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
            {segments.map(seg => (
              <span
                key={seg}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--forest-50)] text-[var(--forest-700)] border border-[var(--forest-200)]"
              >
                {seg}
              </span>
            ))}
          </div>
        </div>

        {error && <p className="text-sm text-[var(--rose-600)]">{error}</p>}

        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={() => void handleSave()}
            disabled={saving || !name.trim()}
            className="flex-1 h-9 rounded-full bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-40 hover:bg-[var(--primary-hover)] transition-colors"
          >
            {saving ? 'Saving…' : 'Save dimension'}
          </button>
          <button
            onClick={onClose}
            disabled={saving}
            className="h-9 px-4 rounded-full border border-[var(--border)] text-sm font-medium text-[var(--foreground-muted)] hover:bg-[var(--surface)] transition-colors"
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  )
}
