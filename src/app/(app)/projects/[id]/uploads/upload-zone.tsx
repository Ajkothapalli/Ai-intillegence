'use client'

import { useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { uploadFile } from '@/features/projects/actions'
import { Alert } from '@/components/ui/alert'

interface UploadZoneProps {
  projectId: string
  fileType: 'csv' | 'screenshot'
  disabled?: boolean
}

const config = {
  csv: {
    accept: '.csv,text/csv,application/vnd.ms-excel',
    hint: 'CSV or Excel file · Max 10 MB',
    icon: '📊',
  },
  screenshot: {
    accept: 'image/png,image/jpeg,image/webp',
    hint: 'PNG, JPEG, or WebP · Max 10 MB',
    icon: '🖼️',
  },
}

export function UploadZone({ projectId, fileType, disabled }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { accept, hint, icon } = config[fileType]

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    setError(null)

    for (const file of Array.from(files)) {
      const fd = new FormData()
      fd.append('file', file)
      const result = await uploadFile(projectId, fd)
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
    if (disabled) return
    startTransition(() => { void handleFiles(e.dataTransfer.files) })
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    startTransition(() => { void handleFiles(e.target.files) })
  }

  if (disabled) {
    return (
      <div className="rounded-xl border-2 border-dashed border-[var(--border)] p-8 text-center opacity-40 cursor-not-allowed">
        <div className="text-2xl mb-2">{icon}</div>
        <p className="text-xs text-[var(--foreground-subtle)]">Limit reached</p>
      </div>
    )
  }

  return (
    <div>
      <div
        onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={[
          'cursor-pointer rounded-xl border-2 border-dashed p-10 text-center',
          'transition-[border-color,background-color] duration-150',
          isDragging
            ? 'border-[var(--forest-600)] bg-[var(--forest-50)]'
            : 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--forest-600)] hover:bg-[var(--background-elevated)]',
          isPending ? 'opacity-60 pointer-events-none' : '',
        ].join(' ')}
      >
        <input
          ref={inputRef}
          type="file"
          multiple={fileType === 'screenshot'}
          accept={accept}
          onChange={onInputChange}
          className="hidden"
        />
        <div className="text-2xl mb-2">{icon}</div>
        <p className="text-sm font-medium text-foreground">
          {isPending ? 'Uploading…' : 'Drop file here or click to browse'}
        </p>
        <p className="text-xs text-[var(--foreground-subtle)] mt-1">{hint}</p>
      </div>

      {error && (
        <div className="mt-3">
          <Alert variant="destructive">{error}</Alert>
        </div>
      )}
    </div>
  )
}
