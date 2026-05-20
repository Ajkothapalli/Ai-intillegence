'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface HistoryRow {
  id: string
  status: string
  model: string
  created_at: string
  completed_at: string | null
  recommendation_count: number
}

interface Props {
  projectId: string
  history: HistoryRow[]
  statusStyles: Record<string, string>
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export function HistoryClient({ projectId, history, statusStyles }: Props) {
  const router = useRouter()
  const [selected, setSelected] = useState<string[]>([])

  function toggle(id: string) {
    setSelected(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id)
      if (prev.length >= 2) return [...prev.slice(1), id]
      return [...prev, id]
    })
  }

  function handleCompare() {
    if (selected.length !== 2) return
    // Put older analysis first
    const sorted = [...selected].sort((a, b) => {
      const dateA = history.find(h => h.id === a)?.created_at ?? ''
      const dateB = history.find(h => h.id === b)?.created_at ?? ''
      return dateA < dateB ? -1 : 1
    })
    router.push(`/projects/${projectId}/analysis/history?compare=${sorted[0]},${sorted[1]}`)
  }

  return (
    <div className="space-y-4">
      {selected.length > 0 && (
        <div className="flex items-center justify-between bg-violet-50 border border-violet-200 rounded-xl px-4 py-3">
          <p className="text-sm text-violet-700 font-medium">
            {selected.length === 2 ? 'Ready to compare' : 'Select one more analysis to compare'}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelected([])}
              className="text-xs text-violet-500 hover:text-violet-700"
            >
              Clear
            </button>
            {selected.length === 2 && (
              <button
                onClick={handleCompare}
                className="h-7 px-3 rounded-full bg-violet-600 text-xs font-semibold text-white hover:bg-violet-700 transition-colors"
              >
                Compare selected
              </button>
            )}
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-[var(--border)] overflow-hidden">
        {history.map((item, i) => {
          const isSelected = selected.includes(item.id)
          const statusStyle = statusStyles[item.status] ?? 'bg-slate-50 text-slate-500 border-slate-200'
          return (
            <div
              key={item.id}
              className={`flex items-center gap-4 px-5 py-4 ${i > 0 ? 'border-t border-[var(--border)]' : ''} ${isSelected ? 'bg-violet-50/50' : 'hover:bg-slate-50/50'} transition-colors`}
            >
              {/* Compare checkbox */}
              <button
                onClick={() => toggle(item.id)}
                className={`shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                  isSelected ? 'bg-violet-600 border-violet-600' : 'border-slate-300 hover:border-violet-400'
                }`}
                aria-label="Select for comparison"
              >
                {isSelected && (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5l2.5 2.5 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>

              {/* Date + model */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {formatDate(item.created_at)}
                </p>
                <p className="text-[11px] text-[var(--foreground-muted)] mt-0.5 font-mono">{item.model}</p>
              </div>

              {/* Status */}
              <span className={`shrink-0 text-[10px] font-semibold px-2.5 py-0.5 rounded-full border capitalize ${statusStyle}`}>
                {item.status}
              </span>

              {/* Rec count */}
              {item.recommendation_count > 0 && (
                <span className="shrink-0 text-[11px] font-semibold text-violet-700 bg-violet-50 px-2 py-0.5 rounded-full">
                  {item.recommendation_count} recs
                </span>
              )}

              {/* View button */}
              {item.status === 'completed' && (
                <Link
                  href={`/projects/${projectId}/analysis/history/${item.id}`}
                  className="shrink-0 h-7 px-3 rounded-full border border-[var(--border)] text-xs font-medium text-[var(--foreground-muted)] hover:text-foreground hover:bg-slate-50 transition-colors"
                >
                  View
                </Link>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
