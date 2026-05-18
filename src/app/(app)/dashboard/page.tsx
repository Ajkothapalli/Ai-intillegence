import Link from 'next/link'
import { listProjects } from '@/features/projects/queries'

export default async function DashboardPage() {
  const projects = await listProjects()

  return (
    <div className="max-w-4xl mx-auto px-6 lg:px-8 py-8">

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Projects</h1>
        <p className="text-sm text-[var(--foreground-muted)] mt-1">
          Each project holds your data, uploads, and AI-generated experiment recommendations.
        </p>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-[var(--border)]">
          <div className="w-12 h-12 rounded-xl bg-[var(--forest-50)] flex items-center justify-center mx-auto mb-4">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
              <rect x="2" y="2" width="8" height="8" rx="2" fill="var(--forest-200)" />
              <rect x="12" y="2" width="8" height="8" rx="2" fill="var(--forest-200)" />
              <rect x="2" y="12" width="8" height="8" rx="2" fill="var(--forest-200)" />
              <rect x="12" y="12" width="8" height="8" rx="2" fill="var(--forest-200)" />
            </svg>
          </div>
          <p className="text-sm font-medium text-foreground">No projects yet</p>
          <p className="text-xs text-[var(--foreground-muted)] mt-1 mb-4">
            Create your first project to get started
          </p>
          <Link
            href="/projects/new"
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground transition-all hover:bg-[var(--primary-hover)] shadow-[var(--shadow-sm)]"
          >
            Create first project
          </Link>
        </div>
      ) : (
        <div className="grid gap-3">
          {projects.map(project => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="group block bg-white rounded-xl border border-[var(--border)] px-6 py-5 transition-all hover:border-[var(--primary)]/40 hover:shadow-[var(--shadow-md)] hover:-translate-y-px"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-foreground group-hover:text-[var(--primary)] transition-colors">
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
                <div className="flex items-center gap-3 ml-4 shrink-0">
                  <span className="text-xs text-[var(--foreground-subtle)] whitespace-nowrap">
                    {new Date(project.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="text-[var(--foreground-subtle)] group-hover:text-[var(--primary)] transition-colors">
                    <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
