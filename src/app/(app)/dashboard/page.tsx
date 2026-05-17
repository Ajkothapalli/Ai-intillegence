import Link from 'next/link'
import { listProjects } from '@/features/projects/queries'
import { signOut } from '@/features/auth/actions'

export default async function DashboardPage() {
  const projects = await listProjects()

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-[var(--border)] bg-[var(--surface)] px-8 py-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-foreground">Experiment Intelligence</h1>
        <form action={signOut}>
          <button type="submit" className="text-sm text-[var(--foreground-muted)] hover:text-foreground transition-colors">
            Sign out
          </button>
        </form>
      </header>

      <div className="max-w-4xl mx-auto px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Projects</h2>
            <p className="text-sm text-[var(--foreground-muted)] mt-1">
              Each project holds your data, uploads, and AI-generated experiment recommendations.
            </p>
          </div>
          <Link
            href="/projects/new"
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground transition-all hover:bg-[var(--primary-hover)] shadow-[var(--shadow-sm)]"
          >
            New project
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-20 bg-[var(--surface)] rounded-xl border border-dashed border-[var(--border)]">
            <p className="text-[var(--foreground-muted)] text-sm">No projects yet.</p>
            <Link
              href="/projects/new"
              className="mt-3 inline-block text-sm text-[var(--forest-400)] hover:underline font-medium"
            >
              Create your first project →
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {projects.map(project => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="block bg-[var(--surface)] rounded-xl border border-[var(--border)] px-6 py-5 motion-lift hover:border-[var(--forest-600)] hover:shadow-[var(--shadow-md)]"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">{project.name}</h3>
                    {project.description && (
                      <p className="text-sm text-[var(--foreground-muted)] mt-1 line-clamp-2">{project.description}</p>
                    )}
                    {project.primary_metric && (
                      <p className="text-xs text-[var(--forest-400)] mt-2">Metric: {project.primary_metric}</p>
                    )}
                  </div>
                  <span className="text-xs text-[var(--foreground-subtle)] whitespace-nowrap ml-4">
                    {new Date(project.created_at).toLocaleDateString()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
