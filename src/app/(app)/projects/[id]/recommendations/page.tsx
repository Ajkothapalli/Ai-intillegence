import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProject, getUploadsByProject } from '@/features/projects/queries'
import { getAnalysisByProject, getRecommendationsByAnalysis } from '@/features/analysis/queries'
import { AnnotatedRecommendations } from '@/features/analysis/components/AnnotatedRecommendations'
import { ConfidenceChart } from '@/features/analysis/components/ConfidenceChart'
import { Alert } from '@/components/ui/alert'
import { createServerClient } from '@/lib/supabase/server'

type Props = { params: Promise<{ id: string }> }

export default async function RecommendationsPage({ params }: Props) {
  const { id } = await params
  const [project, analysis, uploads, supabase] = await Promise.all([
    getProject(id),
    getAnalysisByProject(id),
    getUploadsByProject(id),
    createServerClient(),
  ])
  if (!project) notFound()

  const recommendations = analysis ? await getRecommendationsByAnalysis(analysis.id) : []

  // Generate signed URLs for screenshots to pass to the annotated view
  const screenshotUploads = uploads.filter(u => u.file_type === 'screenshot')
  const screenshots = await Promise.all(
    screenshotUploads.map(async u => {
      const { data } = await supabase.storage
        .from('uploads')
        .createSignedUrl(u.storage_path, 3600)
      return { signedUrl: data?.signedUrl ?? null, file_name: u.file_name }
    }),
  ).then(list => list.filter((s): s is { signedUrl: string; file_name: string } => s.signedUrl !== null))

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-[var(--border)] bg-[var(--surface)] px-8 py-4 flex items-center justify-between">
        <Link href={`/projects/${id}`} className="text-sm text-[var(--foreground-muted)] hover:text-foreground transition-colors">
          ← {project.name}
        </Link>
        <Link href={`/projects/${id}/analysis`} className="text-sm text-[var(--primary)] hover:underline font-medium">
          Run new analysis
        </Link>
      </header>

      <div className="max-w-5xl mx-auto px-8 py-10 space-y-8">

        {/* Page heading */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Recommendations</h1>
          <p className="text-sm text-[var(--foreground-muted)] mt-1">
            {recommendations.length > 0
              ? `${recommendations.length} prioritized experiment ${recommendations.length === 1 ? 'hypothesis' : 'hypotheses'}, ranked by impact and evidence strength.`
              : 'AI-generated experiment recommendations will appear here after analysis.'}
          </p>
          {analysis?.completed_at && (
            <p className="text-xs text-[var(--foreground-subtle)] mt-1">
              Last analysis: {new Date(analysis.completed_at).toLocaleString('en-US')} · {analysis.model}
            </p>
          )}
        </div>

        {analysis?.status === 'running' && (
          <Alert variant="info">
            <span className="flex items-center gap-2">
              <span className="animate-spin inline-block w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full" />
              Analysis is running… refresh to see results.
            </span>
          </Alert>
        )}

        {analysis?.status === 'failed' && (
          <Alert variant="destructive" title="Analysis failed">
            {analysis.error_message ?? 'An unknown error occurred.'}
            <div className="mt-2">
              <Link href={`/projects/${id}/analysis`} className="text-sm underline font-medium">Try again →</Link>
            </div>
          </Alert>
        )}

        {recommendations.length > 0 && (
          <ConfidenceChart recommendations={recommendations} />
        )}

        {recommendations.length > 0 && (
          <AnnotatedRecommendations
            recommendations={recommendations}
            screenshots={screenshots}
          />
        )}

        {recommendations.length === 0 && !analysis && (
          <div className="text-center pt-4">
            <Link
              href={`/projects/${id}/analysis`}
              className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-base font-semibold text-primary-foreground transition-all hover:bg-[var(--primary-hover)] shadow-[var(--shadow-sm)]"
            >
              Run first analysis →
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
