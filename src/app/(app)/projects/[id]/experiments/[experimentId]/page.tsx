import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { getProject } from '@/features/projects/queries'
import { ExperimentDetail } from './ExperimentDetail'

type Props = {
  params: Promise<{ id: string; experimentId: string }>
  searchParams: Promise<{ created?: string }>
}

export default async function ExperimentDetailPage({ params, searchParams }: Props) {
  const { id, experimentId } = await params
  const { created } = await searchParams
  const [project, supabase] = await Promise.all([getProject(id), createServerClient()])
  if (!project) notFound()

  const { data: exp } = await supabase
    .from('experiment_runs')
    .select('*')
    .eq('id', experimentId)
    .eq('project_id', id)
    .single()

  if (!exp) notFound()

  // Load linked segment name
  let segmentName: string | null = null
  if (exp.segment_id) {
    const { data: seg } = await supabase
      .from('user_segments')
      .select('name')
      .eq('id', exp.segment_id)
      .single()
    segmentName = seg?.name ?? null
  }

  // Load linked recommendation
  let recHypothesis: string | null = null
  if (exp.recommendation_id) {
    const { data: rec } = await supabase
      .from('recommendations')
      .select('hypothesis')
      .eq('id', exp.recommendation_id)
      .single()
    recHypothesis = rec?.hypothesis ?? null
  }

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-[var(--border)] bg-white px-8 py-4 flex items-center justify-between">
        <Link href={`/projects/${id}/experiments`} className="text-sm text-[var(--foreground-muted)] hover:text-foreground transition-colors">
          ← {project.name} / Experiments
        </Link>
      </header>
      <ExperimentDetail
        exp={exp as Record<string, unknown>}
        projectId={id}
        segmentName={segmentName}
        recHypothesis={recHypothesis}
        justCreated={created === '1'}
      />
    </main>
  )
}
