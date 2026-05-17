import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProject } from '@/features/projects/queries'
import { listUploads } from '@/features/projects/upload-actions'
import { UploadZone } from './upload-zone'

type Props = { params: Promise<{ id: string }> }

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default async function UploadsPage({ params }: Props) {
  const { id } = await params
  const [project, uploads] = await Promise.all([getProject(id), listUploads(id)])
  if (!project) notFound()

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-[var(--border)] bg-[var(--surface)] px-8 py-4 flex items-center gap-4">
        <Link href={`/projects/${id}`} className="text-sm text-[var(--foreground-muted)] hover:text-foreground transition-colors">
          ← {project.name}
        </Link>
      </header>

      <div className="max-w-3xl mx-auto px-8 py-10 space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Upload data</h1>
          <p className="text-sm text-[var(--foreground-muted)] mt-1">Add CSV analytics exports and onboarding screenshots. Max 10 MB per file.</p>
        </div>

        <UploadZone projectId={id} />

        {uploads.length > 0 && (
          <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] divide-y divide-[var(--border)]">
            <div className="px-6 py-4">
              <h2 className="text-sm font-semibold text-[var(--foreground-muted)]">Uploaded files ({uploads.length})</h2>
            </div>
            {uploads.map(upload => (
              <div key={upload.id} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{upload.file_type === 'csv' ? '📊' : '🖼️'}</span>
                  <div>
                    <p className="text-sm font-medium text-foreground">{upload.file_name}</p>
                    <p className="text-xs text-[var(--foreground-subtle)]">
                      {upload.file_type.toUpperCase()} · {formatBytes(upload.file_size_bytes)} ·{' '}
                      {new Date(upload.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {uploads.length === 0 && (
          <p className="text-center text-sm text-[var(--foreground-subtle)] py-4">No files uploaded yet.</p>
        )}
      </div>
    </main>
  )
}
