import { createServerClient } from '@/lib/supabase/server'

export type ExperimentAutofill = {
  suggestedName: string
  hypothesis: string
  experiment_type: string
  success_metric: string
  segment_id: string | null
  start_date: string
  end_date: string
  sample_size_goal: number
  recommendation_id: string | null
}

function toDateStr(d: Date): string {
  return d.toISOString().split('T')[0]
}

export async function getExperimentAutofill(projectId: string): Promise<ExperimentAutofill> {
  const supabase = await createServerClient()

  const [projectRes, analysisRes, segmentsRes] = await Promise.all([
    supabase.from('projects').select('primary_metric, funnel_stages').eq('id', projectId).single(),
    supabase.from('analyses').select('id').eq('project_id', projectId).eq('status', 'completed').order('created_at', { ascending: false }).limit(1),
    supabase.from('user_segments').select('id').eq('project_id', projectId).limit(1),
  ])

  const project = projectRes.data
  const analysisId = analysisRes.data?.[0]?.id ?? null

  let topRec: { id: string; hypothesis: string | null; experiment_type: string | null } | null = null
  if (analysisId) {
    const recRes = await supabase
      .from('recommendations')
      .select('id, hypothesis, experiment_type')
      .eq('analysis_id', analysisId)
      .order('priority', { ascending: true })
      .limit(1)
    topRec = recRes.data?.[0] ?? null
  }

  const now = new Date()
  const twoWeeksOut = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000)
  const month = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  const experimentType = topRec?.experiment_type ?? 'A/B Test'
  const funnelStage = (project?.funnel_stages as string[] | null)?.[0] ?? 'key step'

  return {
    suggestedName: `${experimentType} on ${funnelStage} — ${month}`,
    hypothesis:    topRec?.hypothesis ?? '',
    experiment_type: experimentType,
    success_metric: project?.primary_metric ?? '',
    segment_id:    segmentsRes.data?.[0]?.id ?? null,
    start_date:    toDateStr(now),
    end_date:      toDateStr(twoWeeksOut),
    sample_size_goal: 1000,
    recommendation_id: topRec?.id ?? null,
  }
}
