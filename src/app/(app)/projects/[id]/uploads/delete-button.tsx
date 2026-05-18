'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { deleteUpload } from '@/features/projects/actions'

export function DeleteButton({ uploadId, projectId }: { uploadId: string; projectId: string }) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  function handleDelete() {
    setError(null)
    startTransition(async () => {
      const result = await deleteUpload(uploadId, projectId)
      if (!result.success) {
        setError(result.error)
      } else {
        router.refresh()
      }
    })
  }

  return (
    <div>
      <button
        onClick={handleDelete}
        disabled={isPending}
        className="text-xs text-[var(--rose-600)] hover:text-[var(--rose-700)] hover:underline disabled:opacity-40 transition-colors"
      >
        {isPending ? 'Deleting…' : 'Delete'}
      </button>
      {error && <p className="text-xs text-[var(--rose-600)] mt-1">{error}</p>}
    </div>
  )
}
