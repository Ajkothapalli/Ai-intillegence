import { createServerClient } from '@/lib/supabase/server'

export type RingName = 'data' | 'analysis' | 'experiments' | 'segments' | 'integrations'

// 4 actions per ring = 100%
const RING_ACTIONS: Record<RingName, string[]> = {
  data:         ['upload_csv', 'upload_screenshot', 'add_metadata', 'set_funnel'],
  analysis:     ['run_analysis', 'view_recommendations', 'export_analysis', 'run_deep_analysis'],
  experiments:  ['create_project', 'add_hypothesis', 'set_primary_metric', 'set_business_goal'],
  segments:     ['create_segment', 'add_dimension', 'run_segment_analysis', 'view_segment_chart'],
  integrations: ['connect_integration', 'enable_scheduled', 'generate_wireframe', 'share_link'],
}

export type RingProgress = {
  name: RingName
  label: string
  completed: number
  total: number
  pct: number
  actions: string[]
  completedActions: string[]
}

const RING_LABELS: Record<RingName, string> = {
  data:         'Data',
  analysis:     'Analysis',
  experiments:  'Experiments',
  segments:     'Segments',
  integrations: 'Integrations',
}

export async function getRingProgress(): Promise<RingProgress[]> {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from('ring_actions')
    .select('ring, action')
    .eq('user_id', user.id)

  const completed = new Map<string, Set<string>>()
  for (const row of data ?? []) {
    if (!completed.has(row.ring)) completed.set(row.ring, new Set())
    completed.get(row.ring)!.add(row.action)
  }

  return (Object.keys(RING_ACTIONS) as RingName[]).map(name => {
    const actions = RING_ACTIONS[name]
    const done = completed.get(name) ?? new Set<string>()
    const completedActions = actions.filter(a => done.has(a))
    return {
      name,
      label: RING_LABELS[name],
      completed: completedActions.length,
      total: actions.length,
      pct: Math.round((completedActions.length / actions.length) * 100),
      actions,
      completedActions,
    }
  })
}

export async function completeRingAction(ring: RingName, action: string): Promise<void> {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase.from('ring_actions').upsert({
    user_id: user.id,
    ring,
    action,
    completed_at: new Date().toISOString(),
  }, { onConflict: 'user_id,ring,action', ignoreDuplicates: true })
}
