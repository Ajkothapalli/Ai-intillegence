'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'

interface Props {
  analysisId: string
  initialStatus: 'pending' | 'running' | 'completed' | 'failed'
  projectId: string
}

type PollStatus = 'pending' | 'running' | 'completed' | 'failed'

export function AnalysisPoller({ analysisId, initialStatus, projectId }: Props) {
  const [status, setStatus] = useState<PollStatus>(initialStatus)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const router = useRouter()
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const doneRef = useRef(false)

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const poll = useCallback(async () => {
    if (doneRef.current) return
    try {
      const res = await fetch(`/api/analysis/${analysisId}/status`)
      if (!res.ok) return
      const json = await res.json() as { status: PollStatus; error_message?: string | null }
      setStatus(json.status)

      if (json.status === 'completed') {
        doneRef.current = true
        stopPolling()
        toast.success('Analysis complete — recommendations ready')
        router.refresh()
      } else if (json.status === 'failed') {
        doneRef.current = true
        stopPolling()
        const msg = json.error_message ?? 'Analysis failed. Please try again.'
        toast.error('Analysis failed — please try again')
        setErrorMsg(msg)
      }
    } catch {
      // network error — keep polling
    }
  }, [analysisId, stopPolling, router])

  useEffect(() => {
    if (status === 'completed' || status === 'failed') return

    // eslint-disable-next-line react-hooks/set-state-in-effect
    void poll()
    intervalRef.current = setInterval(() => { void poll() }, 4000)
    return () => stopPolling()
  }, [poll, status, stopPolling])

  if (status === 'completed') {
    return (
      <div className="rounded-xl border border-[var(--forest-200)] bg-[var(--forest-50)] p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[var(--forest-500)] flex items-center justify-center shrink-0">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2.5 7.5l3 3 6-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-foreground">Analysis complete — recommendations ready</p>
        </div>
        <Link
          href={`/projects/${projectId}/recommendations`}
          className="text-sm font-semibold text-[var(--primary)] hover:underline shrink-0"
        >
          View →
        </Link>
      </div>
    )
  }

  if (status === 'failed') {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-5 space-y-3">
        <p className="text-sm font-semibold text-red-700">Analysis failed</p>
        {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}
        <Link
          href={`/projects/${projectId}/analysis`}
          className="inline-flex h-8 items-center gap-1.5 rounded-full bg-red-600 px-4 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
        >
          Try again
        </Link>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <div className="flex items-center gap-4">
        <div className="relative w-8 h-8 shrink-0">
          <div className="absolute inset-0 rounded-full border-2 border-[var(--primary)]/20" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[var(--primary)] animate-spin" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">AI is analysing your data…</p>
          <p className="text-xs text-[var(--foreground-muted)] mt-0.5">This usually takes 30–60 seconds</p>
        </div>
      </div>
      <div className="mt-4 h-1 w-full bg-[var(--border)] rounded-full overflow-hidden">
        <div className="h-full w-1/2 bg-primary rounded-full animate-pulse" />
      </div>
    </div>
  )
}
