import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProject } from '@/features/projects/queries'
import { getAnalysisByProject } from '@/features/analysis/queries'
import { Badge } from '@/components/ui/badge'

type Props = { params: Promise<{ id: string }> }

const statusLabel: Record<string, string> = {
  pending: 'Pending',
  running: 'Running…',
  completed: 'Completed',
  failed: 'Failed',
}
const statusVariant: Record<string, 'pending' | 'running' | 'completed' | 'failed'> = {
  pending: 'pending',
  running: 'running',
  completed: 'completed',
  failed: 'failed',
}

export default async function ProjectPage({ params }: Props) {
  const { id } = await params
  const [project, analysis] = await Promise.all([getProject(id), getAnalysisByProject(id)])
  if (!project) notFound()

  const status = analysis?.status ?? null

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-[var(--border)] bg-[var(--surface)] px-8 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="text-sm text-[var(--foreground-muted)] hover:text-foreground transition-colors">
          ← Dashboard
        </Link>
      </header>

      <div className="max-w-4xl mx-auto px-8 py-10 space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{project.name}</h1>
          {project.description && (
            <p className="text-[var(--foreground-muted)] mt-2">{project.description}</p>
          )}
          <div className="flex flex-wrap gap-2 mt-4">
            {project.primary_metric && (
              <Badge variant="info">Metric: {project.primary_metric}</Badge>
            )}
            {project.target_audience && (
              <Badge variant="outline">{project.target_audience}</Badge>
            )}
            {project.funnel_stages && project.funnel_stages.map(stage => (
              <Badge key={stage} variant="muted">{stage}</Badge>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href={`/projects/${id}/uploads`}
            className="bg-[var(--surface)] rounded-xl border border-[var(--border)] p-6 motion-lift hover:border-[var(--forest-600)] hover:shadow-[var(--shadow-md)] active:translate-y-0"
          >
            <div className="text-2xl mb-2">📁</div>
            <h3 className="font-semibold text-foreground text-sm">Upload data</h3>
            <p className="text-xs text-[var(--foreground-muted)] mt-1">Add CSVs and screenshots for analysis</p>
          </Link>

          <Link
            href={`/projects/${id}/analysis`}
            className="bg-[var(--surface)] rounded-xl border border-[var(--border)] p-6 motion-lift hover:border-[var(--primary)] hover:shadow-[var(--shadow-md)] active:translate-y-0"
          >
            <div className="text-2xl mb-2">🤖</div>
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-semibold text-foreground text-sm">Run analysis</h3>
              {status && (
                <Badge variant={statusVariant[status] ?? 'pending'} className="text-[10px] px-1.5 py-0">
                  {statusLabel[status] ?? status}
                </Badge>
              )}
            </div>
            <p className="text-xs text-[var(--foreground-muted)] mt-1">AI generates experiment recommendations</p>
          </Link>

          <Link
            href={`/projects/${id}/recommendations`}
            className="bg-[var(--surface)] rounded-xl border border-[var(--border)] p-6 motion-lift hover:border-[var(--ember-500)] hover:shadow-[var(--shadow-md)] active:translate-y-0"
          >
            <div className="text-2xl mb-2">💡</div>
            <h3 className="font-semibold text-foreground text-sm">Recommendations</h3>
            <p className="text-xs text-[var(--foreground-muted)] mt-1">View prioritized experiment hypotheses</p>
          </Link>
        </div>

        {status === 'completed' && (
          <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Analysis complete</p>
              {analysis?.completed_at && (
                <p className="text-xs text-[var(--foreground-subtle)] mt-0.5">
                  {new Date(analysis.completed_at).toLocaleString()} · {analysis.model}
                </p>
              )}
            </div>
            <Link
              href={`/projects/${id}/recommendations`}
              className="inline-flex h-9 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-all hover:bg-[var(--primary-hover)]"
            >
              View recommendations →
            </Link>
          </div>
        )}

        {project.business_goal && (
          <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] p-6">
            <h2 className="text-sm font-semibold text-[var(--foreground-muted)] mb-2 uppercase tracking-wider">Business goal</h2>
            <p className="text-sm text-foreground">{project.business_goal}</p>
          </div>
        )}
      </div>
    </main>
  )
}
