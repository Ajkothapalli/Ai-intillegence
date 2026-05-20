'use server'

import { revalidatePath } from 'next/cache'
import { createServerClient } from '@/lib/supabase/server'
import { fullExperimentSchema } from './schema'
import { completeRingAction } from '@/features/onboarding/rings'

export type ExperimentResult =
  | { success: true; id: string }
  | { success: false; error: string }

export async function createExperimentRun(
  projectId: string,
  raw: unknown,
): Promise<ExperimentResult> {
  const parsed = fullExperimentSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const d = parsed.data

  if (d.end_date <= d.start_date) {
    return { success: false, error: 'End date must be after start date' }
  }

  const { data, error } = await supabase
    .from('experiment_runs')
    .insert({
      project_id:       projectId,
      user_id:          user.id,
      name:             d.name,
      hypothesis:       d.hypothesis,
      experiment_type:  d.experiment_type,
      segment_id:       d.segment_id ?? null,
      segment_rationale: d.segment_rationale ?? null,
      success_metric:   d.success_metric,
      start_date:       d.start_date,
      end_date:         d.end_date,
      sample_size_goal: typeof d.sample_size_goal === 'number' ? d.sample_size_goal : null,
      owner_name:       d.owner_name ?? null,
      owner_role:       d.owner_role ?? null,
      notes:            d.notes ?? null,
      recommendation_id: d.recommendation_id ?? null,
      status:           'planned',
    })
    .select('id')
    .single()

  if (error) return { success: false, error: error.message }

  void completeRingAction('experiments', 'add_hypothesis')
  revalidatePath(`/projects/${projectId}/experiments`)

  return { success: true, id: data.id }
}

export async function updateExperimentStatus(
  experimentId: string,
  projectId: string,
  status: 'planned' | 'running' | 'completed' | 'failed',
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const updates: Record<string, unknown> = { status, updated_at: new Date().toISOString() }
  if (status === 'running') updates.started_at = new Date().toISOString()
  if (status === 'completed' || status === 'failed') updates.completed_at = new Date().toISOString()

  const { error } = await supabase
    .from('experiment_runs')
    .update(updates)
    .eq('id', experimentId)
    .eq('user_id', user.id)

  if (error) return { success: false, error: error.message }

  revalidatePath(`/projects/${projectId}/experiments`)
  revalidatePath(`/projects/${projectId}/experiments/${experimentId}`)
  return { success: true }
}

export async function logExperimentOutcome(
  experimentId: string,
  projectId: string,
  outcome: string,
  liftPercent: number | null,
  outcomeNotes: string,
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const { error } = await supabase
    .from('experiment_runs')
    .update({
      outcome,
      lift_percent: liftPercent,
      outcome_notes: outcomeNotes,
      status: 'completed',
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', experimentId)
    .eq('user_id', user.id)

  if (error) return { success: false, error: error.message }

  revalidatePath(`/projects/${projectId}/experiments`)
  revalidatePath(`/projects/${projectId}/experiments/${experimentId}`)
  return { success: true }
}
