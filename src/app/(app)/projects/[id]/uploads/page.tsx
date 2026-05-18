import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProject, getUploadsByProject } from '@/features/projects/queries'
import { MAX_CSV_COUNT, MAX_SCREENSHOT_COUNT } from '@/features/projects/schema'
import type { Upload } from '@/features/projects/types'
import { UploadZone } from './upload-zone'
import { DeleteButton } from './delete-button'

type Props = { params: Promise<{ id: string }> }

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function FileRow({ upload, projectId }: { upload: Upload; projectId: string }) {
  return (
    <div className="px-5 py-3.5 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-base shrink-0">{upload.file_type === 'csv' ? '📊' : '🖼️'}</span>
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground truncate">{upload.file_name}</p>
          <p className="text-xs text-[var(--foreground-subtle)]">
            {formatBytes(upload.file_size_bytes)} · {new Date(upload.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>
      <DeleteButton uploadId={upload.id} projectId={projectId} />
    </div>
  )
}

export default async function UploadsPage({ params }: Props) {
  const { id } = await params
  const [project, uploads] = await Promise.all([getProject(id), getUploadsByProject(id)])
  if (!project) notFound()

  const csvUploads = uploads.filter(u => u.file_type === 'csv')
  const screenshotUploads = uploads.filter(u => u.file_type === 'screenshot')

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-[var(--border)] bg-[var(--surface)] px-8 py-4">
        <Link href={`/projects/${id}`} className="text-sm text-[var(--foreground-muted)] hover:text-foreground transition-colors">
          ← {project.name}
        </Link>
      </header>

      <div className="max-w-3xl mx-auto px-8 py-10 space-y-10">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Upload data</h1>
          <p className="text-sm text-[var(--foreground-muted)] mt-1">
            Add analytics CSV exports and onboarding screenshots. The AI reads these to generate experiment recommendations.
          </p>
        </div>

        {/* ── CSV section ── */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-foreground">Analytics data</h2>
              <p className="text-xs text-[var(--foreground-muted)] mt-0.5">
                Funnel drop-off, cohort retention, event counts — any CSV export from your analytics tool.
              </p>
            </div>
            <span className="text-xs font-medium tabular-nums text-[var(--foreground-subtle)]">
              {csvUploads.length} / {MAX_CSV_COUNT}
            </span>
          </div>

          <UploadZone
            projectId={id}
            fileType="csv"
            disabled={csvUploads.length >= MAX_CSV_COUNT}
          />

          {csvUploads.length > 0 && (
            <div className="rounded-xl border border-[var(--border)] bg-white divide-y divide-[var(--border)]">
              {csvUploads.map(u => <FileRow key={u.id} upload={u} projectId={id} />)}
            </div>
          )}
        </section>

        {/* ── Screenshots section ── */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-foreground">Screenshots</h2>
              <p className="text-xs text-[var(--foreground-muted)] mt-0.5">
                Onboarding flows, signup screens, key product moments.
              </p>
            </div>
            <span className="text-xs font-medium tabular-nums text-[var(--foreground-subtle)]">
              {screenshotUploads.length} / {MAX_SCREENSHOT_COUNT}
            </span>
          </div>

          <UploadZone
            projectId={id}
            fileType="screenshot"
            disabled={screenshotUploads.length >= MAX_SCREENSHOT_COUNT}
          />

          {screenshotUploads.length > 0 && (
            <div className="rounded-xl border border-[var(--border)] bg-white divide-y divide-[var(--border)]">
              {screenshotUploads.map(u => <FileRow key={u.id} upload={u} projectId={id} />)}
            </div>
          )}
        </section>

        {/* Next step nudge */}
        {uploads.length > 0 && (
          <div className="pt-2 border-t border-[var(--border)]">
            <Link
              href={`/projects/${id}/analysis`}
              className="inline-flex h-9 items-center gap-1.5 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-sm)] transition-all hover:bg-[var(--primary-hover)] hover:-translate-y-px"
            >
              Run AI analysis →
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
