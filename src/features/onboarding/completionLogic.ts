import { createServerClient } from '@/lib/supabase/server'

export type OnboardingState =
  | 'first_run'       // only demo project
  | 'has_real'        // has real project(s)
  | 'has_analysis'    // has completed real analysis
  | 'complete'        // viewed recommendations on real project

export async function getOnboardingState(): Promise<OnboardingState> {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return 'first_run'

  const [projectsRes, analysesRes, onboardingRes] = await Promise.all([
    supabase.from('projects').select('id, is_demo').eq('user_id', user.id),
    supabase.from('analyses').select('id, status, project_id').eq('status', 'completed'),
    supabase.from('onboarding_progress').select('steps_completed').eq('user_id', user.id).maybeSingle(),
  ])

  const projects = projectsRes.data ?? []
  const analyses = analysesRes.data ?? []
  const stepsCompleted: string[] = (onboardingRes.data?.steps_completed as string[] | null) ?? []

  const realProjects = projects.filter(p => !p.is_demo)
  if (realProjects.length === 0) return 'first_run'

  const realIds = new Set(realProjects.map(p => p.id))
  const hasRealAnalysis = analyses.some(a => realIds.has(a.project_id))
  if (!hasRealAnalysis) return 'has_real'

  if (stepsCompleted.includes('view_recommendations')) return 'complete'
  return 'has_analysis'
}
