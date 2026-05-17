'use client'

import { useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { uploadFile } from '@/features/projects/upload-actions'
import { Alert } from '@/components/ui/alert'

export function UploadZone({ projectId }: { projectId: string }) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    setError(null)

    for (const file of Array.from(files)) {
      const formData = new FormData()
      formData.append('file', file)
      const result = await uploadFile(projectId, formData)
      if (!result.success) {
        setError(result.error)
        return
      }
    }
    router.refresh()
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    startTransition(() => { void handleFiles(e.dataTransfer.files) })
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    startTransition(() => { void handleFiles(e.target.files) })
  }

  return (
    <div>
      <div
        onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={[
          'cursor-pointer rounded-xl border-2 border-dashed p-12 text-center transition-all',
          isDragging
            ? 'border-[var(--forest-600)] bg-[var(--forest-50)]'
            : 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--forest-600)] hover:bg-[var(--background-elevated)]',
          isPending ? 'opacity-60 pointer-events-none' : '',
        ].join(' ')}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".csv,text/csv,image/png,image/jpeg,image/webp,image/gif"
          onChange={onInputChange}
          className="hidden"
        />
        <div className="text-3xl mb-3">📤</div>
        <p className="text-sm font-medium text-foreground">
          {isPending ? 'Uploading…' : 'Drop files here or click to browse'}
        </p>
        <p className="text-xs text-[var(--foreground-subtle)] mt-1">CSV analytics exports and screenshots · Max 10 MB each</p>
      </div>

      {error && (
        <div className="mt-3">
          <Alert variant="destructive">{error}</Alert>
        </div>
      )}
    </div>
  )
}
