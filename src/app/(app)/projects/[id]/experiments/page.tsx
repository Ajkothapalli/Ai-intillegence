import { notFound } from 'next/navigation'
import { getProject } from '@/features/projects/queries'
import { getSegmentsByProject } from '@/features/segments/queries'
import { createServerClient } from '@/lib/supabase/server'
import { ExperimentsClient } from './ExperimentsClient'
import type { DbRecommendation } from '@/features/analysis/types'
import type { UserSegment } from '@/features/segments/types'

type ExperimentRun = {
  id: string
  name: string
  hypothesis: string | null
  status: string
  segment_id: string | null
  segment_snapshot: UserSegment | null
  outcome: string | null
  lift_percent: number | null
  outcome_notes: string | null
  started_at: string | null
  completed_at: string | null
  created_at: string
  recommendation_id: string | null
}

type Props = { params: Promise<{ id: string }> }

export default async function ExperimentsPage({ params }: Props) {
  const { id } = await params
  const [project, segments, supabase] = await Promise.all([
    getProject(id),
    getSegmentsByProject(id),
    createServerClient(),
  ])
  if (!project) notFound()

  const { data: runs } = await supabase
    .from('experiment_runs')
    .select('*')
    .eq('project_id', id)
    .order('created_at', { ascending: false })

  const { data: recs } = await supabase
    .from('recommendations')
    .select('id, hypothesis, experiment_type, priority')
    .eq('project_id', id)
    .order('priority', { ascending: true })

  return (
    <ExperimentsClient
      projectId={id}
      projectName={project.name}
      runs={(runs ?? []) as ExperimentRun[]}
      segments={segments}
      recommendations={(recs ?? []) as Pick<DbRecommendation, 'id' | 'hypothesis' | 'experiment_type' | 'priority'>[]}
    />
  )
}
