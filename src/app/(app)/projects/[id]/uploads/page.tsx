import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProject, getUploadsByProject } from '@/features/projects/queries'
import { createServerClient } from '@/lib/supabase/server'
import { MAX_CSV_COUNT, MAX_SCREENSHOT_COUNT, MAX_USER_RESEARCH_COUNT } from '@/features/projects/schema'
import { UploadZone } from './upload-zone'

type Props = { params: Promise<{ id: string }> }

export default async function UploadsPage({ params }: Props) {
  const { id } = await params

  const [project, uploads, supabase] = await Promise.all([
    getProject(id),
    getUploadsByProject(id),
    createServerClient(),
  ])
  if (!project) notFound()

  // Generate 1-hour signed URLs for screenshot thumbnails
  const uploadsWithUrls = await Promise.all(
    uploads.map(async u => {
      if (u.file_type !== 'screenshot') return { ...u, signedUrl: null }
      const { data } = await supabase.storage
        .from('uploads')
        .createSignedUrl(u.storage_path, 3600)
      return { ...u, signedUrl: data?.signedUrl ?? null }
    }),
  )

  const csvUploads          = uploadsWithUrls.filter(u => u.file_type === 'csv')
  const screenshotUploads   = uploadsWithUrls.filter(u => u.file_type === 'screenshot')
  const userResearchUploads = uploadsWithUrls.filter(u => u.file_type === 'user_research')

  return (
    <div className="max-w-2xl mx-auto px-6 lg:px-8 py-8 space-y-10">

      <div>
        <Link
          href={`/projects/${id}`}
          className="inline-flex items-center gap-1 text-sm text-[var(--foreground-muted)] hover:text-foreground transition-colors mb-6"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M9 11L5 7l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {project.name}
        </Link>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Upload data</h1>
        <p className="text-sm text-[var(--foreground-muted)] mt-1">
          Add analytics CSVs, screenshots, and user research. The AI reads these to generate experiment recommendations.
        </p>
      </div>

      {/* ── CSV section ─────────────────────────────────────── */}
      <section aria-labelledby="csv-heading">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 id="csv-heading" className="text-base font-semibold text-foreground">Analytics data</h2>
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
          uploads={csvUploads}
          maxCount={MAX_CSV_COUNT}
        />
      </section>

      {/* ── Screenshots section ─────────────────────────────── */}
      <section aria-labelledby="screenshots-heading">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 id="screenshots-heading" className="text-base font-semibold text-foreground">Screenshots</h2>
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
          uploads={screenshotUploads}
          maxCount={MAX_SCREENSHOT_COUNT}
        />
      </section>

      {/* ── User Research section ──────────────────────────── */}
      <section aria-labelledby="research-heading">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 id="research-heading" className="text-base font-semibold text-foreground">User Research</h2>
            <p className="text-xs text-[var(--foreground-muted)] mt-0.5">
              Survey exports, interview recordings, raw notes — any format.
            </p>
          </div>
          <span className="text-xs font-medium tabular-nums text-[var(--foreground-subtle)]">
            {userResearchUploads.length} / {MAX_USER_RESEARCH_COUNT}
          </span>
        </div>

        <UploadZone
          projectId={id}
          fileType="user_research"
          uploads={userResearchUploads}
          maxCount={MAX_USER_RESEARCH_COUNT}
        />
      </section>

      {/* ── Next step ───────────────────────────────────────── */}
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
  )
}
