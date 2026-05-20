import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProject } from '@/features/projects/queries'
import { getAnalysisHistory, getAnalysisWithRecommendations } from '@/features/analysis/queries'
import { AnalysisComparison } from '@/features/analysis/components/AnalysisComparison'
import { HistoryClient } from './HistoryClient'

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ compare?: string }>
}

const STATUS_STYLES: Record<string, string> = {
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  running:   'bg-amber-50 text-amber-700 border-amber-200',
  pending:   'bg-sky-50 text-sky-700 border-sky-200',
  failed:    'bg-red-50 text-red-600 border-red-200',
}

export default async function AnalysisHistoryPage({ params, searchParams }: Props) {
  const { id } = await params
  const { compare } = await searchParams

  const [project, history] = await Promise.all([
    getProject(id),
    getAnalysisHistory(id),
  ])
  if (!project) notFound()

  // Resolve comparison if requested
  type ComparisonResult = {
    analysis: NonNullable<Awaited<ReturnType<typeof getAnalysisWithRecommendations>>>['analysis']
    recommendations: NonNullable<Awaited<ReturnType<typeof getAnalysisWithRecommendations>>>['recommendations']
  }
  let comparisonData: { a: ComparisonResult; b: ComparisonResult } | null = null

  if (compare) {
    const [idA, idB] = compare.split(',')
    if (idA && idB) {
      const [a, b] = await Promise.all([
        getAnalysisWithRecommendations(idA),
        getAnalysisWithRecommendations(idB),
      ])
      if (a && b) comparisonData = { a, b }
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-[var(--border)] bg-[var(--surface)] px-8 py-4 flex items-center justify-between">
        <Link href={`/projects/${id}/analysis`} className="text-sm text-[var(--foreground-muted)] hover:text-foreground transition-colors">
          ← AI Analysis
        </Link>
      </header>

      <div className="max-w-3xl mx-auto px-8 py-10 space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analysis History</h1>
          <p className="text-sm text-[var(--foreground-muted)] mt-1">
            {history.length} {history.length === 1 ? 'analysis' : 'analyses'} for {project.name}. Select two to compare.
          </p>
        </div>

        {history.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-[var(--border)]">
            <p className="text-sm text-slate-500">No analyses yet.</p>
            <Link href={`/projects/${id}/analysis`} className="mt-3 inline-block text-sm text-[var(--primary)] hover:underline">
              Run your first analysis →
            </Link>
          </div>
        ) : (
          <HistoryClient
            projectId={id}
            history={history.map(a => ({
              id: a.id,
              status: a.status,
              model: a.model,
              created_at: a.created_at,
              completed_at: a.completed_at,
              recommendation_count: a.recommendation_count,
            }))}
            statusStyles={STATUS_STYLES}
          />
        )}

        {/* Comparison view */}
        {comparisonData && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-foreground">Comparison</h2>
              <Link
                href={`/projects/${id}/analysis/history`}
                className="text-xs text-[var(--foreground-muted)] hover:text-foreground transition-colors"
              >
                Clear ×
              </Link>
            </div>
            <AnalysisComparison
              analysisA={comparisonData.a.analysis}
              analysisB={comparisonData.b.analysis}
              recommendationsA={comparisonData.a.recommendations}
              recommendationsB={comparisonData.b.recommendations}
            />
          </div>
        )}
      </div>
    </main>
  )
}
