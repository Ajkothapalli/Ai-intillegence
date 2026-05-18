import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProject } from '@/features/projects/queries'
import { getAnalysisByProject } from '@/features/analysis/queries'
import { RunAnalysisButton } from './run-analysis-button'
import { Badge } from '@/components/ui/badge'
import { Alert } from '@/components/ui/alert'

type Props = { params: Promise<{ id: string }> }

export default async function AnalysisPage({ params }: Props) {
  const { id } = await params
  const [project, analysis] = await Promise.all([getProject(id), getAnalysisByProject(id)])
  if (!project) notFound()

  const status = analysis?.status ?? null

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-[var(--border)] bg-[var(--surface)] px-8 py-4">
        <Link href={`/projects/${id}`} className="text-sm text-[var(--foreground-muted)] hover:text-foreground transition-colors">
          ← {project.name}
        </Link>
      </header>

      <div className="max-w-3xl mx-auto px-8 py-10 space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">AI Analysis</h1>
          <p className="text-sm text-[var(--foreground-muted)] mt-1">
            The AI reads your uploaded data and generates prioritized experiment recommendations with evidence citations.
          </p>
        </div>

        <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] p-8 space-y-6">
          <div>
            <h2 className="text-xs font-semibold text-[var(--foreground-subtle)] uppercase tracking-wider mb-1">Model</h2>
            <p className="text-sm text-[var(--foreground-muted)]">claude-sonnet-4-6 (standard) · claude-opus-4-7 (deep analysis)</p>
          </div>

          <RunAnalysisButton projectId={id} />

          {analysis && (
            <div className="mt-4 p-4 rounded-lg border border-[var(--border)] bg-[var(--background-elevated)]">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">Latest analysis</p>
                <Badge variant={status === 'completed' ? 'completed' : status === 'running' ? 'running' : status === 'failed' ? 'failed' : 'pending'}>
                  {status === 'running' ? 'Running…' : status === 'completed' ? 'Completed' : status === 'failed' ? 'Failed' : 'Pending'}
                </Badge>
              </div>
              {analysis.started_at && (
                <p className="text-xs text-[var(--foreground-subtle)] mt-2">
                  Started: {new Date(analysis.started_at).toLocaleString()}
                </p>
              )}
              {analysis.completed_at && (
                <p className="text-xs text-[var(--foreground-subtle)]">
                  Completed: {new Date(analysis.completed_at).toLocaleString()}
                </p>
              )}
              {analysis.error_message && (
                <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                  <p className="text-sm font-medium text-red-700">Analysis failed</p>
                  <p className="text-sm text-red-600 mt-0.5">{analysis.error_message}</p>
                  {analysis.error_message.toLowerCase().includes('credit') && (
                    <a
                      href="https://console.anthropic.com/settings/billing"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block text-xs font-medium text-red-700 underline underline-offset-2 hover:text-red-900"
                    >
                      Add credits at console.anthropic.com →
                    </a>
                  )}
                </div>
              )}
              {status === 'completed' && (
                <Link
                  href={`/projects/${id}/recommendations`}
                  className="mt-3 inline-block text-sm text-[var(--link)] hover:underline font-medium"
                >
                  View recommendations →
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
