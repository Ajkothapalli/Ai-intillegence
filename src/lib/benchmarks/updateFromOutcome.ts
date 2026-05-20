import type { SupabaseClient } from '@supabase/supabase-js'

interface OutcomeInput {
  userId: string
  projectId: string
  experimentType: string
  won: boolean
  liftPercent: number | null
}

export async function updateBenchmarkFromOutcome(
  supabase: SupabaseClient,
  input: OutcomeInput,
): Promise<void> {
  const { userId, projectId, experimentType, won, liftPercent } = input

  const { data: existing } = await supabase
    .from('experiment_benchmarks')
    .select('*')
    .eq('user_id', userId)
    .eq('experiment_type', experimentType)
    .eq('project_id', projectId)
    .maybeSingle()

  const n = (existing?.sample_size ?? 0) + 1
  const prevWinRate = existing?.win_rate ?? 0
  const prevMedianLift = existing?.median_lift_percent ?? 0

  // Rolling average for win_rate
  const newWinRate = (prevWinRate * (n - 1) + (won ? 1 : 0)) / n

  // Rolling average for lift (only include runs where lift was measured)
  const lift = liftPercent ?? 0
  const newMedianLift = (prevMedianLift * (n - 1) + lift) / n

  await supabase.from('experiment_benchmarks').upsert({
    user_id: userId,
    project_id: projectId,
    experiment_type: experimentType,
    sample_size: n,
    win_rate: newWinRate,
    median_lift_percent: newMedianLift,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id,experiment_type,project_id' })
}
