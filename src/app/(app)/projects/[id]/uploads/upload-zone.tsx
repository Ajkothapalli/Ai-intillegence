'use client'

import { useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { uploadFile, deleteUpload } from '@/features/projects/actions'
import { CohortDimensionModal } from '@/features/projects/components/CohortDimensionModal'
import type { Upload } from '@/features/projects/types'

// ── Types ─────────────────────────────────────────────────────────────────────

export type UploadWithUrl = Upload & { signedUrl: string | null }

interface PendingFile {
  localId: string
  file: File
  preview: string | null   // object URL for images, null for CSV
  progress: number         // 0–100
  status: 'uploading' | 'success' | 'error'
  error?: string
}

export interface CohortDimensionInfo {
  name: string
  segments: string[]
}

interface Props {
  projectId: string
  fileType: 'csv' | 'screenshot' | 'user_research'
  uploads: UploadWithUrl[]
  maxCount: number
  cohortDimension?: CohortDimensionInfo
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1_048_576) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1_048_576).toFixed(1)} MB`
}

const ACCEPT = {
  csv: '.csv,text/csv,application/vnd.ms-excel',
  screenshot: 'image/png,image/jpeg,image/webp',
  user_research: 'text/plain,application/pdf,video/mp4,video/quicktime,audio/mpeg,audio/mp4,application/vnd.ms-excel,text/csv',
}

const HINT = {
  csv: 'CSV file · Max 10 MB',
  screenshot: 'PNG, JPEG, or WebP · Max 10 MB',
  user_research: 'PDF, TXT, MP4, MOV, MP3, CSV · Max 50 MB',
}

// ── Progress bar ──────────────────────────────────────────────────────────────

function ProgressBar({ progress, status }: { progress: number; status: PendingFile['status'] }) {
  const isError   = status === 'error'
  const isSuccess = status === 'success'

  return (
    <div className="space-y-1.5 mt-3">
      <div className="flex items-center justify-between">
        <span className={cn(
          'text-[11px] font-medium',
          isError ? 'text-[var(--rose-600)]' : isSuccess ? 'text-[var(--forest-600)]' : 'text-[var(--foreground-muted)]',
        )}>
          {isError ? '✕ Upload failed' : isSuccess ? '✓ Uploaded successfully' : progress >= 88 ? 'Almost there…' : 'Uploading…'}
        </span>
        {!isSuccess && !isError && progress < 88 && (
          <span className="text-[11px] tabular-nums text-[var(--foreground-subtle)]">{progress}%</span>
        )}
      </div>
      <div className="h-1.5 w-full bg-[var(--border)] rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full',
            isError ? 'bg-[var(--rose-500)]' : isSuccess ? 'bg-[var(--forest-500)]' : 'bg-primary',
            !isError && !isSuccess && progress >= 88 ? 'animate-pulse transition-none' : 'transition-[width] duration-200',
          )}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

// ── Drop zone chrome ──────────────────────────────────────────────────────────

function DropArea({
  icon,
  hint,
  isDragging,
  onClick,
  onDragOver,
  onDragLeave,
  onDrop,
  inputRef,
  accept,
  multiple = false,
}: {
  icon: React.ReactNode
  hint: string
  isDragging: boolean
  onClick: () => void
  onDragOver: (e: React.DragEvent) => void
  onDragLeave: () => void
  onDrop: (e: React.DragEvent) => void
  inputRef: React.RefObject<HTMLInputElement | null>
  accept: string
  multiple?: boolean
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Upload file — click or drag and drop"
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onClick()}
      onClick={onClick}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={cn(
        'cursor-pointer rounded-xl border-2 border-dashed py-10 text-center',
        'transition-[border-color,background-color] duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]/30',
        isDragging
          ? 'border-primary bg-[var(--forest-50)]'
          : 'border-[var(--border)] hover:border-[var(--primary)]/50 hover:bg-[var(--forest-50)]',
      )}
    >
      <input
        ref={inputRef}
        type="file"
        multiple={multiple}
        accept={accept}
        className="hidden"
        aria-hidden="true"
      />
      <div className="flex flex-col items-center gap-2">
        {icon}
        <div>
          <p className="text-sm font-medium text-foreground">Drop file here or click to browse</p>
          <p className="text-xs text-[var(--foreground-subtle)] mt-0.5">{hint}</p>
        </div>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function UploadZone({ projectId, fileType, uploads, maxCount, cohortDimension }: Props) {
  const [isDragging, setIsDragging] = useState(false)
  const [pending, setPending]       = useState<PendingFile[]>([])
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [cohortModal, setCohortModal] = useState<{ uploadId: string; segments: string[] } | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router   = useRouter()

  const activeUploads = pending.filter(p => p.status !== 'error')
  const isFull        = uploads.length + activeUploads.length >= maxCount
  const canAddMore    = !isFull

  const modal = cohortModal && (
    <CohortDimensionModal
      projectId={projectId}
      uploadId={cohortModal.uploadId}
      segments={cohortModal.segments}
      onClose={() => { setCohortModal(null); router.refresh() }}
    />
  )

  // ── Upload logic ────────────────────────────────────────────────────────────

  const startUpload = useCallback(async (file: File) => {
    const localId = `${Date.now()}-${Math.random()}`
    const preview = file.type.startsWith('image/') ? URL.createObjectURL(file) : null

    setPending(prev => [...prev, { localId, file, preview, progress: 0, status: 'uploading' }])

    // Simulate realistic progress: fast start, slow middle, holds at 88% waiting for server
    const interval = setInterval(() => {
      setPending(prev => prev.map(u => {
        if (u.localId !== localId || u.status !== 'uploading') return u
        const inc = u.progress < 30 ? 10 : u.progress < 60 ? 5 : u.progress < 80 ? 3 : 1
        return { ...u, progress: Math.min(u.progress + inc, 88) }
      }))
    }, 160)

    const fd = new FormData()
    fd.append('file', file)

    let result: Awaited<ReturnType<typeof uploadFile>>
    try {
      result = await uploadFile(projectId, fd)
    } catch (e) {
      clearInterval(interval)
      const msg = e instanceof Error ? e.message : 'Upload failed'
      setPending(prev => prev.map(u =>
        u.localId === localId ? { ...u, status: 'error', error: msg } : u,
      ))
      return
    }
    clearInterval(interval)

    if (result.success) {
      toast.success('File uploaded')
      setPending(prev => prev.map(u =>
        u.localId === localId ? { ...u, progress: 100, status: 'success' } : u,
      ))
      if (result.segmented) {
        setCohortModal({ uploadId: result.uploadId, segments: result.segments })
      }
      setTimeout(() => {
        if (preview) URL.revokeObjectURL(preview)
        setPending(prev => prev.filter(u => u.localId !== localId))
        router.refresh()
      }, 1400)
    } else {
      toast.error(result.error)
      setPending(prev => prev.map(u =>
        u.localId === localId ? { ...u, status: 'error', error: result.error } : u,
      ))
    }
  }, [projectId, router])

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return
    Array.from(files).forEach(file => {
      if (uploads.length + pending.filter(p => p.status !== 'error').length < maxCount) {
        void startUpload(file)
      }
    })
  }, [uploads.length, pending, maxCount, startUpload])

  // ── Drag handlers ───────────────────────────────────────────────────────────

  const onDragOver  = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true) }
  const onDragLeave = () => setIsDragging(false)
  const onDrop      = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (!canAddMore) return
    handleFiles(e.dataTransfer.files)
  }

  const openPicker = () => inputRef.current?.click()

  // Attach onChange directly to the input element
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files)
    e.target.value = ''   // allow re-selecting the same file
  }

  // ── Delete ──────────────────────────────────────────────────────────────────

  const handleDelete = async (uploadId: string) => {
    setDeletingId(uploadId)
    await deleteUpload(uploadId, projectId)
    setDeletingId(null)
    router.refresh()
  }

  const dismissError = (localId: string) => {
    setPending(prev => prev.filter(u => u.localId !== localId))
  }

  // ════════════════════════════════════════════════════════════════════════════
  // CSV LAYOUT
  // ════════════════════════════════════════════════════════════════════════════

  if (fileType === 'csv') {
    const existing = uploads[0]
    const inFlight = pending[0]

    // State A — file is uploading / just uploaded
    if (inFlight) {
      return (
        <>
          {modal}
          <div className="rounded-xl border border-[var(--border)] bg-white p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-[var(--forest-50)] flex items-center justify-center shrink-0">
                <CsvIcon />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{inFlight.file.name}</p>
                <p className="text-xs text-[var(--foreground-subtle)] mt-0.5">{formatBytes(inFlight.file.size)}</p>
                <ProgressBar progress={inFlight.progress} status={inFlight.status} />
                {inFlight.error && (
                  <p className="text-xs text-[var(--rose-600)] mt-1.5">{inFlight.error}</p>
                )}
              </div>
              {inFlight.status === 'error' && (
                <button
                  onClick={() => dismissError(inFlight.localId)}
                  className="text-[var(--foreground-subtle)] hover:text-foreground transition-colors"
                  aria-label="Dismiss"
                >
                  <CloseIcon />
                </button>
              )}
            </div>
          </div>
        </>
      )
    }

    // State B — file uploaded, show it inside the zone
    if (existing) {
      return (
        <>
          {modal}
          <div className="rounded-xl border border-[var(--border)] bg-white p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[var(--forest-50)] flex items-center justify-center shrink-0">
                <CsvIcon />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{existing.file_name}</p>
                <p className="text-xs text-[var(--foreground-subtle)] mt-0.5">
                  {formatBytes(existing.file_size_bytes)} · {new Date(existing.created_at).toLocaleDateString('en-US')}
                </p>
              </div>
              <button
                onClick={() => handleDelete(existing.id)}
                disabled={deletingId === existing.id}
                className="text-xs font-medium text-[var(--rose-600)] hover:text-[var(--rose-700)] disabled:opacity-40 transition-colors shrink-0 ml-2"
              >
                {deletingId === existing.id ? 'Deleting…' : 'Delete'}
              </button>
            </div>
            {cohortDimension && (
              <div className="border-t border-[var(--border)] pt-3">
                <p className="text-[11px] font-semibold text-[var(--foreground-subtle)] uppercase tracking-wider mb-2">
                  Segmented by {cohortDimension.name}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {cohortDimension.segments.map(seg => (
                    <span
                      key={seg}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--forest-50)] text-[var(--forest-700)] border border-[var(--forest-200)]"
                    >
                      {seg}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )
    }

    // State C — empty, show drop zone
    return (
      <div>
        <DropArea
          icon={<CsvIcon size={28} />}
          hint={HINT.csv}
          isDragging={isDragging}
          onClick={openPicker}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          inputRef={inputRef}
          accept={ACCEPT.csv}
        />
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT.csv}
          className="hidden"
          onChange={onInputChange}
          aria-hidden="true"
        />
      </div>
    )
  }

  // ════════════════════════════════════════════════════════════════════════════
  // USER RESEARCH LAYOUT
  // ════════════════════════════════════════════════════════════════════════════

  if (fileType === 'user_research') {
    return (
      <div
        className={cn(
          'rounded-xl border-2 transition-[border-color,background-color] duration-150',
          isDragging ? 'border-primary bg-[var(--forest-50)]' : 'border-[var(--border)] bg-white',
        )}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT.user_research}
          multiple
          className="hidden"
          onChange={onInputChange}
          aria-hidden="true"
        />

        {/* Existing uploads */}
        {uploads.map(u => (
          <ResearchFileRow
            key={u.id}
            name={u.file_name}
            meta={`${formatBytes(u.file_size_bytes)} · ${new Date(u.created_at).toLocaleDateString('en-US')}`}
            onDelete={() => handleDelete(u.id)}
            deleting={deletingId === u.id}
          />
        ))}

        {/* In-flight uploads */}
        {pending.map(p => (
          <div key={p.localId} className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)] last:border-0">
            <div className="w-8 h-8 rounded-md bg-[var(--forest-50)] flex items-center justify-center shrink-0">
              <FileIcon />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{p.file.name}</p>
              <ProgressBar progress={p.progress} status={p.status} />
              {p.status === 'error' && p.error && (
                <p className="text-xs text-[var(--rose-600)] mt-0.5">{p.error}</p>
              )}
            </div>
            {p.status === 'error' && (
              <button onClick={() => dismissError(p.localId)} className="text-[var(--foreground-subtle)] hover:text-foreground transition-colors shrink-0">
                <CloseIcon />
              </button>
            )}
          </div>
        ))}

        {/* Drop / add more zone */}
        {canAddMore && (
          <button
            type="button"
            onClick={openPicker}
            className={cn(
              'w-full flex items-center justify-center gap-2 py-4 text-sm text-[var(--foreground-subtle)]',
              'hover:text-[var(--primary)] hover:bg-[var(--forest-50)] transition-colors rounded-b-xl',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]/30',
              uploads.length === 0 && pending.length === 0 ? 'py-10 rounded-xl' : 'border-t border-[var(--border)]',
            )}
            aria-label="Add research files"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span className="font-medium">
              {uploads.length === 0 && pending.length === 0
                ? 'Drop files here or click to browse'
                : 'Add more files'}
            </span>
            {uploads.length === 0 && pending.length === 0 && (
              <span className="text-xs text-[var(--foreground-subtle)]">· {HINT.user_research}</span>
            )}
          </button>
        )}
      </div>
    )
  }

  // ════════════════════════════════════════════════════════════════════════════
  // SCREENSHOT LAYOUT
  // ════════════════════════════════════════════════════════════════════════════

  const hasContent = uploads.length > 0 || pending.length > 0

  if (!hasContent) {
    return (
      <div>
        <DropArea
          icon={<ImageIcon size={28} />}
          hint={HINT.screenshot}
          isDragging={isDragging}
          onClick={openPicker}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          inputRef={inputRef}
          accept={ACCEPT.screenshot}
          multiple
        />
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT.screenshot}
          multiple
          className="hidden"
          onChange={onInputChange}
          aria-hidden="true"
        />
      </div>
    )
  }

  // Has screenshots — render grid inside the zone
  return (
    <div
      className={cn(
        'rounded-xl border-2 p-4 transition-[border-color,background-color] duration-150',
        isDragging
          ? 'border-primary bg-[var(--forest-50)]'
          : 'border-[var(--border)] bg-white',
      )}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT.screenshot}
        multiple
        className="hidden"
        onChange={onInputChange}
        aria-hidden="true"
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {/* ── Existing server uploads ─────────────────────── */}
        {uploads.map(u => (
          <div
            key={u.id}
            className="group relative aspect-video rounded-lg overflow-hidden bg-[var(--forest-50)] border border-[var(--border)]"
          >
            {u.signedUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={u.signedUrl}
                alt={u.file_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-1 p-2">
                <ImageIcon size={22} className="text-[var(--foreground-subtle)]" />
                <span className="text-[10px] text-[var(--foreground-subtle)] text-center truncate w-full">
                  {u.file_name}
                </span>
              </div>
            )}

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/45 transition-colors duration-150 flex items-center justify-center">
              <button
                onClick={() => handleDelete(u.id)}
                disabled={deletingId === u.id}
                className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 text-[var(--rose-600)] text-xs font-semibold px-3 py-1 rounded-full shadow"
                aria-label={`Delete ${u.file_name}`}
              >
                {deletingId === u.id ? 'Deleting…' : 'Delete'}
              </button>
            </div>

            {/* File name bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-2 pb-1.5 pt-5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <p className="text-[10px] text-white truncate">{u.file_name}</p>
            </div>
          </div>
        ))}

        {/* ── Pending / in-progress uploads ───────────────── */}
        {pending.map(p => (
          <div
            key={p.localId}
            className="relative aspect-video rounded-lg overflow-hidden border border-[var(--border)] bg-[var(--forest-50)]"
          >
            {/* Image preview (dimmed while uploading) */}
            {p.preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={p.preview}
                alt={p.file.name}
                className={cn(
                  'w-full h-full object-cover transition-opacity duration-300',
                  p.status === 'success' ? 'opacity-100' : 'opacity-40',
                )}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <ImageIcon size={22} className="text-[var(--foreground-subtle)]" />
              </div>
            )}

            {/* Progress overlay */}
            {p.status !== 'success' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/35 px-4 gap-2">
                <span className={cn(
                  'text-xs font-semibold',
                  p.status === 'error' ? 'text-[var(--rose-300)]' : 'text-white',
                )}>
                  {p.status === 'error' ? '✕ Failed' : p.progress >= 88 ? 'Uploading…' : `${p.progress}%`}
                </span>
                <div className="w-full h-1 bg-white/30 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full',
                      p.status === 'error' ? 'bg-[var(--rose-400)]' : 'bg-white',
                      p.progress >= 88 && p.status === 'uploading'
                        ? 'animate-pulse transition-none'
                        : 'transition-[width] duration-200',
                    )}
                    style={{ width: `${p.progress}%` }}
                  />
                </div>
                {p.status === 'error' && (
                  <>
                    {p.error && (
                      <p className="text-[10px] text-white/80 text-center leading-tight">{p.error}</p>
                    )}
                    <button
                      onClick={() => dismissError(p.localId)}
                      className="text-[10px] text-white/70 hover:text-white underline"
                    >
                      Dismiss
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Success checkmark */}
            {p.status === 'success' && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <div className="w-8 h-8 rounded-full bg-[var(--forest-500)] flex items-center justify-center shadow">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M2.5 7.5l3 3 6-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* ── Add more cell ────────────────────────────────── */}
        {canAddMore && (
          <button
            type="button"
            onClick={openPicker}
            className="aspect-video rounded-lg border-2 border-dashed border-[var(--border)] flex flex-col items-center justify-center gap-1.5 text-[var(--foreground-subtle)] hover:border-[var(--primary)]/50 hover:text-[var(--primary)] hover:bg-[var(--forest-50)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]/30"
            aria-label="Add more screenshots"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span className="text-[11px] font-medium">Add more</span>
          </button>
        )}
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// USER RESEARCH LAYOUT
// ════════════════════════════════════════════════════════════════════════════

function ResearchFileRow({
  name,
  meta,
  onDelete,
  deleting,
}: {
  name: string
  meta: string
  onDelete: () => void
  deleting: boolean
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)] last:border-0">
      <div className="w-8 h-8 rounded-md bg-[var(--forest-50)] flex items-center justify-center shrink-0">
        <FileIcon />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{name}</p>
        <p className="text-xs text-[var(--foreground-subtle)] mt-0.5">{meta}</p>
      </div>
      <button
        onClick={onDelete}
        disabled={deleting}
        className="text-xs font-medium text-[var(--rose-600)] hover:text-[var(--rose-700)] disabled:opacity-40 transition-colors shrink-0"
      >
        {deleting ? 'Deleting…' : 'Delete'}
      </button>
    </div>
  )
}

// ── Icon helpers ──────────────────────────────────────────────────────────────

function CsvIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="3" y="2" width="14" height="16" rx="2" stroke="#196262" strokeWidth="1.4" />
      <path d="M7 7h6M7 10h6M7 13h4" stroke="#196262" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function ImageIcon({ size = 20, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
      <rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="7.5" cy="8.5" r="1.5" fill="currentColor" />
      <path d="M2 13l4-3 3 3 3-2 4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function FileIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="2" y="1" width="10" height="14" rx="1.5" stroke="#196262" strokeWidth="1.3" />
      <path d="M5 5h6M5 8h6M5 11h3" stroke="#196262" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M9 1v4h4" stroke="#196262" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}
