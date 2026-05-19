import Link from 'next/link'
import Image from 'next/image'
import { listProjects } from '@/features/projects/queries'
import { createServerClient } from '@/lib/supabase/server'
import { ToastOnMount } from '@/components/ui/toast-on-mount'

type Props = { searchParams: Promise<{ deleted?: string }> }

export default async function ExperimentsPage({ searchParams }: Props) {
  const { deleted } = await searchParams
  const [projects, supabase] = await Promise.all([listProjects(), createServerClient()])

  // Fetch first screenshot per project in parallel
  const thumbnails = await Promise.all(
    projects.map(async p => {
      const { data: rows } = await supabase
        .from('uploads')
        .select('storage_path')
        .eq('project_id', p.id)
        .eq('file_type', 'screenshot')
        .order('created_at', { ascending: true })
        .limit(1)

      if (!rows?.[0]) return { id: p.id, url: null }
      const { data: signed } = await supabase.storage
        .from('uploads')
        .createSignedUrl(rows[0].storage_path, 3600)
      return { id: p.id, url: signed?.signedUrl ?? null }
    }),
  )
  const thumbMap = new Map(thumbnails.map(t => [t.id, t.url]))

  return (
    <div className="max-w-4xl mx-auto px-6 lg:px-8 py-8">
      {deleted === '1' && <ToastOnMount message="Experiment deleted" type="success" />}

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Experiments</h1>
        <p className="text-sm text-[var(--foreground-muted)] mt-1">
          Each experiment holds your data, uploads, and AI-generated recommendations.
        </p>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-[var(--border)]">
          <div className="w-12 h-12 rounded-xl bg-[var(--forest-50)] flex items-center justify-center mx-auto mb-4">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
              <path d="M7 2v6.5L3 15a1 1 0 00.9 1.5h14.2A1 1 0 0019 15l-4-6.5V2" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M5.5 2h11" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <p className="text-sm font-medium text-foreground">No experiments yet</p>
          <p className="text-xs text-[var(--foreground-muted)] mt-1 mb-4">
            Create your first experiment to get AI-generated recommendations
          </p>
          <Link
            href="/projects/new"
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground transition-all hover:bg-[var(--primary-hover)] shadow-[var(--shadow-sm)]"
          >
            Create first experiment
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {projects.map(project => {
            const thumb = thumbMap.get(project.id) ?? null
            return (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="group flex items-center gap-5 bg-white rounded-xl border border-[var(--border)] p-4 transition-all hover:border-[var(--primary)]/40 hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:-translate-y-px"
              >
                {/* Thumbnail — inset, fixed size, rounded */}
                <div className="w-36 h-24 shrink-0 relative rounded-lg overflow-hidden bg-[var(--forest-50)] border border-[var(--border)]">
                  {thumb ? (
                    <Image
                      src={thumb}
                      alt={`${project.name} screenshot`}
                      fill
                      className="object-cover"
                      sizes="144px"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-[var(--primary)]/25">
                        <path d="M8 3v8L4 18a1 1 0 00.9 1.5h14.2A1 1 0 0020 18l-4-7V3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M6.5 3h11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-foreground group-hover:text-[var(--primary)] transition-colors truncate">
                    {project.name}
                  </h2>
                  {project.description && (
                    <p className="text-sm text-[var(--foreground-muted)] mt-1 line-clamp-2">
                      {project.description}
                    </p>
                  )}
                  {project.primary_metric && (
                    <p className="text-xs text-[var(--foreground-subtle)] mt-2">
                      Metric: <span className="text-[var(--primary)] font-medium">{project.primary_metric}</span>
                    </p>
                  )}
                </div>

                {/* Right meta */}
                <div className="flex items-center gap-3 ml-2 shrink-0">
                  <span className="text-xs text-[var(--foreground-subtle)] whitespace-nowrap">
                    {new Date(project.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="text-[var(--foreground-subtle)] group-hover:text-[var(--primary)] transition-colors">
                    <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
