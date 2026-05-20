import { createServerClient } from '@/lib/supabase/server'

export type FTUEStage =
  | 'just_signed_up'
  | 'seen_demo'
  | 'uploaded_data'
  | 'analysis_done'
  | 'experiment_started'

export type UserState =
  | { experience: 'ftue'; stage: FTUEStage }
  | { experience: 'rtue' }

export async function getUserExperienceState(userId: string): Promise<UserState> {
  const supabase = await createServerClient()

  const [progressRes, realProjectsRes, experimentCountRes] = await Promise.all([
    supabase
      .from('onboarding_progress')
      .select('steps_completed, completed_at')
      .eq('user_id', userId)
      .maybeSingle(),
    supabase
      .from('projects')
      .select('id')
      .eq('is_demo', false),
    supabase
      .from('experiment_runs')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId),
  ])

  if (progressRes.data?.completed_at) return { experience: 'rtue' }
  if ((experimentCountRes.count ?? 0) > 0) return { experience: 'rtue' }

  const realProjectIds = (realProjectsRes.data ?? []).map(p => p.id)
  const steps = (progressRes.data?.steps_completed ?? []) as string[]

  if (realProjectIds.length > 0) {
    const [analysesRes, uploadsRes] = await Promise.all([
      supabase
        .from('analyses')
        .select('*', { count: 'exact', head: true })
        .in('project_id', realProjectIds)
        .eq('status', 'completed'),
      supabase
        .from('uploads')
        .select('*', { count: 'exact', head: true })
        .in('project_id', realProjectIds),
    ])

    // Real project + completed analysis → RTUE
    if ((analysesRes.count ?? 0) > 0) return { experience: 'rtue' }

    // Real project + uploads but no completed analysis → FTUE uploaded_data
    if ((uploadsRes.count ?? 0) > 0) return { experience: 'ftue', stage: 'uploaded_data' }
  }

  if (steps.includes('view_recommendations')) return { experience: 'ftue', stage: 'seen_demo' }

  return { experience: 'ftue', stage: 'just_signed_up' }
}
