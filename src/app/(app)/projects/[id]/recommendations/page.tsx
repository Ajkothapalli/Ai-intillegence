import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProject, getUploadsByProject } from '@/features/projects/queries'
import { getAnalysisByProject, getRecommendationsByAnalysis } from '@/features/analysis/queries'
import { getSegmentsByProject } from '@/features/segments/queries'
import { Alert } from '@/components/ui/alert'
import { createServerClient } from '@/lib/supabase/server'
import { RecommendationsView } from '@/features/analysis/components/RecommendationsView'
import { ExportMenu } from '@/features/analysis/components/ExportMenu'
import { completeOnboardingStep, markDemoRecommendationViewed } from '@/features/onboarding/actions'
import { SegmentComparisonChart } from '@/features/analysis/components/SegmentComparisonChart'
import type { SegmentData } from '@/features/analysis/components/SegmentComparisonChart'
import { OnboardingComplete } from '@/features/onboarding/components/OnboardingComplete'

type Props = { params: Promise<{ id: string }> }

export default async function RecommendationsPage({ params }: Props) {
  const { id } = await params
  void completeOnboardingStep('view_recommendations')
  void markDemoRecommendationViewed()
  const [project, analysis, uploads, segments, supabase] = await Promise.all([
    getProject(id),
    getAnalysisByProject(id),
    getUploadsByProject(id),
    getSegmentsByProject(id),
    createServerClient(),
  ])
  if (!project) notFound()

  // Fetch cohort dimensions for segment comparison chart
  const { data: cohortDimensions } = await supabase
    .from('cohort_dimensions')
    .select('id, name, values')
    .eq('project_id', id)

  // Build segment comparison data from cohort dimensions + project funnel stages
  const funnelStages = project.funnel_stages ?? []
  const segmentChartData: SegmentData[] = (cohortDimensions ?? []).flatMap(dim => {
    const values = (dim.values as string[]) ?? []
    return values.slice(0, 5).map(val => ({
      dimension: String(dim.name),
      value: val,
      stages: funnelStages.map(stage => ({
        name: stage,
        drop_off_rate: 0, // placeholder — populated from CSV analysis when available
      })),
    }))
  }).slice(0, 5)

  const recommendations = analysis ? await getRecommendationsByAnalysis(analysis.id) : []

  const screenshotUploads = uploads.filter(u => u.file_type === 'screenshot')
  const screenshotUrlMap: Record<string, string> = {}
  await Promise.all(
    screenshotUploads.map(async u => {
      const { data } = await supabase.storage.from('uploads').createSignedUrl(u.storage_path, 3600)
      if (data?.signedUrl) screenshotUrlMap[u.id] = data.signedUrl
    })
  )

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-[var(--border)] bg-[var(--surface)] px-8 py-4 flex items-center justify-between">
        <Link href={`/projects/${id}`} className="text-sm text-[var(--foreground-muted)] hover:text-foreground transition-colors">
          ← {project.name}
        </Link>
        <div className="flex items-center gap-3">
          {analysis?.status === 'completed' && <ExportMenu analysisId={analysis.id} />}
          <Link href={`/projects/${id}/analysis`} className="text-sm text-[var(--primary)] hover:underline font-medium">
            Run new analysis
          </Link>
        </div>
      </header>

      <div className="px-6 lg:px-8 xl:px-10 py-8 space-y-8">

        {project.is_demo && (
          <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800">
            <span className="shrink-0 inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-200 px-2 py-0.5 rounded-full uppercase tracking-wide">
              Demo
            </span>
            <span>
              This is a demo project with AI-generated recommendations based on typical industry patterns.{' '}
              <Link href="/experiments/new" className="font-semibold underline underline-offset-2 hover:text-amber-900">
                Create your own project
              </Link>{' '}
              to analyze your real data.
            </span>
          </div>
        )}

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

        {recommendations.length > 0 && segments.length === 0 && (
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3.5 text-sm text-amber-800">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 mt-0.5 text-amber-500" aria-hidden="true">
              <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.4"/>
              <path d="M8 5v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              <circle cx="8" cy="11" r="0.75" fill="currentColor"/>
            </svg>
            <span>
              No audience segments defined — recommendations apply to all users.{' '}
              <Link href={`/projects/${id}/segments`} className="font-semibold underline underline-offset-2 hover:text-amber-900">
                Add segments
              </Link>{' '}
              to target specific user groups.
            </span>
          </div>
        )}

        {segmentChartData.length > 1 && (
          <SegmentComparisonChart segments={segmentChartData} />
        )}

        {recommendations.length > 0 && (
          <RecommendationsView
            recommendations={recommendations}
            segments={segments}
            screenshotUrlMap={screenshotUrlMap}
            projectId={id}
            hasProjectSegments={segments.length > 0}
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

        {/* Conversion panel — shown after demo recommendations */}
        {project.is_demo && recommendations.length > 0 && (
          <div className="rounded-2xl bg-gradient-to-br from-violet-600 to-[#196262] p-8 text-white text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mx-auto">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Ready to analyze your own product?</h2>
              <p className="text-sm text-white/80 mt-2 max-w-md mx-auto">
                Upload your funnel CSV and screenshots. Our AI will generate prioritized, evidence-backed experiment recommendations tailored to your actual data.
              </p>
            </div>
            <Link
              href="/experiments/new"
              className="inline-flex items-center gap-2 bg-white text-violet-700 font-semibold text-sm px-6 py-3 rounded-full hover:bg-violet-50 transition-colors shadow"
            >
              Create your first real project →
            </Link>
          </div>
        )}
      </div>
      {project.is_demo && recommendations.length > 0 && <OnboardingComplete />}
    </main>
  )
}
