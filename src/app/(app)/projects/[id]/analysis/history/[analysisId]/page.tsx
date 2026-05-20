import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProject } from '@/features/projects/queries'
import { getAnalysisWithRecommendations } from '@/features/analysis/queries'
import { RecommendationCard } from '@/features/analysis/components/RecommendationCard'

type Props = { params: Promise<{ id: string; analysisId: string }> }

export default async function HistoricalAnalysisPage({ params }: Props) {
  const { id, analysisId } = await params
  const [project, result] = await Promise.all([
    getProject(id),
    getAnalysisWithRecommendations(analysisId),
  ])
  if (!project || !result) notFound()

  const { analysis, recommendations } = result
  const dateStr = (analysis.completed_at ?? analysis.created_at)
    ? new Date(analysis.completed_at ?? analysis.created_at).toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : 'Unknown date'

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-[var(--border)] bg-[var(--surface)] px-8 py-4 flex items-center justify-between">
        <Link href={`/projects/${id}/analysis/history`} className="text-sm text-[var(--foreground-muted)] hover:text-foreground transition-colors">
          ← History
        </Link>
        <span className="text-xs text-[var(--foreground-muted)] bg-slate-100 px-3 py-1 rounded-full">
          Read-only — historical analysis
        </span>
      </header>

      <div className="max-w-3xl mx-auto px-8 py-10 space-y-8">
        <div>
          <h1 className="text-xl font-bold text-foreground">{dateStr}</h1>
          <p className="text-sm text-[var(--foreground-muted)] mt-1">
            {recommendations.length} recommendations · {analysis.model}
          </p>
        </div>

        <div className="space-y-6">
          {recommendations.map(rec => (
            <RecommendationCard key={rec.id} rec={rec} />
          ))}
          {recommendations.length === 0 && (
            <p className="text-sm text-slate-500 text-center py-8">No recommendations in this analysis.</p>
          )}
        </div>
      </div>
    </main>
  )
}
