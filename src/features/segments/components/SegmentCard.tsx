'use client'

import { useState } from 'react'
import type { UserSegment, SegmentDimensions } from '../types'
import { deleteSegment } from '../actions'

const LOGO_DEV_KEY = 'pk_Qzx_5yxSQ06xtnVRtd6ptQ'

const SOURCE_META: Record<string, { label: string; domain: string; color: string }> = {
  manual:     { label: 'Manual',    domain: '',                   color: '#64748b' },
  mixpanel:   { label: 'Mixpanel',  domain: 'mixpanel.com',       color: '#7856ff' },
  amplitude:  { label: 'Amplitude', domain: 'amplitude.com',      color: '#1da4b5' },
  ga4:        { label: 'GA4',       domain: 'analytics.google.com', color: '#e37400' },
  posthog:    { label: 'PostHog',   domain: 'posthog.com',         color: '#f54e00' },
  heap:       { label: 'Heap',      domain: 'heap.io',             color: '#6f42c1' },
  segment_io: { label: 'Segment',   domain: 'segment.com',         color: '#52bd94' },
  pendo:      { label: 'Pendo',     domain: 'pendo.io',            color: '#ff4876' },
}

const DIM_LABELS: Record<keyof SegmentDimensions, string> = {
  device:              'Device',
  acquisition_channel: 'Channel',
  geography:           'Geography',
  plan_tier:           'Plan',
  behaviour:           'Behaviour',
  demographics:        'Demographics',
  lifecycle:           'Lifecycle',
}

function dimensionSummary(dims: Partial<SegmentDimensions>): string[] {
  const pills: string[] = []
  for (const key of Object.keys(dims) as Array<keyof SegmentDimensions>) {
    const val = dims[key]
    if (!val) continue
    if (Array.isArray(val) && val.length > 0) {
      pills.push(`${DIM_LABELS[key]}: ${val.slice(0, 2).join(', ')}${val.length > 2 ? ` +${val.length - 2}` : ''}`)
    } else if (typeof val === 'object' && !Array.isArray(val)) {
      pills.push(`Demographics: ${val.age_min}–${val.age_max}`)
    }
  }
  return pills
}

interface Props {
  segment: UserSegment
  projectId: string
  onEdit: (segment: UserSegment) => void
}

export function SegmentCard({ segment, projectId, onEdit }: Props) {
  const [deleting, setDeleting] = useState(false)
  const meta = SOURCE_META[segment.source] ?? SOURCE_META.manual
  const pills = dimensionSummary(segment.dimensions)
  const [logoFailed, setLogoFailed] = useState(false)

  async function handleDelete() {
    if (!confirm(`Delete "${segment.name}"?`)) return
    setDeleting(true)
    await deleteSegment(segment.id, projectId)
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 px-5 py-4 flex items-start gap-4">
      {/* Source icon */}
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
        style={{ backgroundColor: `${meta.color}18` }}
      >
        {segment.source === 'manual' || !meta.domain || logoFailed ? (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: meta.color }}>
            <circle cx="8" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.4"/>
            <path d="M2 13.5c0-2.5 2.5-4 6-4s6 1.5 6 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`https://img.logo.dev/${meta.domain}?token=${LOGO_DEV_KEY}&size=32&format=png`}
            alt={meta.label}
            width={20}
            height={20}
            className="w-5 h-5 object-contain"
            onError={() => setLogoFailed(true)}
          />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-semibold text-slate-900">{segment.name}</p>
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: `${meta.color}15`, color: meta.color }}
          >
            {meta.label}
          </span>
        </div>

        {segment.description && (
          <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{segment.description}</p>
        )}

        {/* User count */}
        {segment.user_count != null && (
          <div className="flex items-center gap-1 mt-1.5">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-slate-400 shrink-0">
              <circle cx="4.5" cy="4" r="1.75" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M1 10c0-2 1.5-3 3.5-3s3.5 1 3.5 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              <circle cx="9" cy="3.5" r="1.5" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M8 9.5c0-1 .7-2 2-2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            <span className="text-xs font-medium text-slate-600">
              {segment.user_count.toLocaleString()} users
            </span>
          </div>
        )}

        {/* Dimension pills */}
        {pills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {pills.map((pill, i) => (
              <span key={i} className="text-[11px] bg-slate-50 border border-slate-200 text-slate-500 px-2 py-0.5 rounded-full">
                {pill}
              </span>
            ))}
          </div>
        )}

        {/* Last synced */}
        {segment.last_synced_at && segment.source !== 'manual' && (
          <p className="text-[10px] text-slate-400 mt-2">
            Synced {new Date(segment.last_synced_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => onEdit(segment)}
          className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors text-xs font-medium"
          title="Edit"
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M9 2l2 2-7 7H2v-2l7-7z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
          </svg>
        </button>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
          title="Delete"
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M2 3.5h9M5 3.5V2.5a.5.5 0 01.5-.5h2a.5.5 0 01.5.5v1M10.5 3.5l-.5 7a1 1 0 01-1 1h-5a1 1 0 01-1-1l-.5-7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
