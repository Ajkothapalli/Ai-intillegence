import { createServerClient } from '@/lib/supabase/server'

export type SpotlightDef = {
  id: string
  target: string // data-spotlight-target value
  heading: string
  body: string
  cta?: { label: string; href: string }
  placement: 'below' | 'above' | 'left' | 'right'
}

const SPOTLIGHTS: SpotlightDef[] = [
  {
    id: 'create_first_project',
    target: 'new-experiment',
    heading: 'Create your first real experiment',
    body: "You've explored the demo. Now upload your own funnel data and let AI surface what to test next.",
    cta: { label: 'New experiment', href: '/experiments/new' },
    placement: 'below',
  },
  {
    id: 'run_first_analysis',
    target: 'run-analysis',
    heading: 'Run your first AI analysis',
    body: "Upload a funnel CSV or onboarding screenshot. Our AI will generate prioritized, evidence-backed hypotheses in minutes.",
    placement: 'below',
  },
  {
    id: 'view_recommendations',
    target: 'view-recommendations',
    heading: 'Your recommendations are ready',
    body: 'See the AI-generated experiment hypotheses with confidence scores and supporting evidence.',
    placement: 'below',
  },
]

export async function getNextSpotlight(): Promise<SpotlightDef | null> {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const [projectsRes, analysesRes] = await Promise.all([
    supabase.from('projects').select('id, is_demo').eq('user_id', user.id),
    supabase.from('analyses').select('id, status, project_id').eq('status', 'completed'),
  ])

  const projects = projectsRes.data ?? []
  const analyses = analysesRes.data ?? []

  const realProjects = projects.filter(p => !p.is_demo)

  if (realProjects.length === 0) {
    return SPOTLIGHTS.find(s => s.id === 'create_first_project') ?? null
  }

  const realProjectIds = new Set(realProjects.map(p => p.id))
  const hasCompletedAnalysis = analyses.some(a => realProjectIds.has(a.project_id))

  if (!hasCompletedAnalysis) {
    return SPOTLIGHTS.find(s => s.id === 'run_first_analysis') ?? null
  }

  return null
}
