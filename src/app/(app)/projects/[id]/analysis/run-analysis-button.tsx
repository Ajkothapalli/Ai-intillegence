'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { runProjectAnalysis } from '@/features/analysis/actions'
import { Button } from '@/components/ui/button'
import { Alert } from '@/components/ui/alert'

export function RunAnalysisButton({ projectId }: { projectId: string }) {
  const [error, setError] = useState<string | null>(null)
  const [useDeep, setUseDeep] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleRun() {
    setError(null)
    toast.info('Analysis started — this takes about 30 seconds')
    startTransition(async () => {
      const result = await runProjectAnalysis(projectId, useDeep)
      if (!result.success) {
        toast.error(result.error)
        setError(result.error)
      } else {
        router.push(`/projects/${projectId}`)
      }
    })
  }

  return (
    <div className="space-y-4">
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={useDeep}
          onChange={e => setUseDeep(e.target.checked)}
          disabled={isPending}
          className="rounded border-[var(--border)] bg-[var(--input)] text-[var(--cobalt-500)] focus:ring-[var(--cobalt-500)]"
        />
        <span className="text-sm text-[var(--foreground-muted)]">
          Use deep model (claude-opus-4-7) — slower but more thorough
        </span>
      </label>

      <Button onClick={handleRun} disabled={isPending} size="lg" variant="default">
        {isPending ? (
          <span className="flex items-center gap-2">
            <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            Analyzing…
          </span>
        ) : (
          '🤖 Run analysis'
        )}
      </Button>

      {error && (
        <Alert variant="destructive">{error}</Alert>
      )}
    </div>
  )
}
