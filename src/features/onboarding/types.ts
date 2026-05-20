export type OnboardingStep =
  | 'create_project'
  | 'connect_integration'
  | 'upload_data'
  | 'run_analysis'
  | 'view_recommendations'

export const ALL_ONBOARDING_STEPS: OnboardingStep[] = [
  'create_project',
  'connect_integration',
  'upload_data',
  'run_analysis',
  'view_recommendations',
]

export type OnboardingProgress = {
  id: string
  user_id: string
  steps_completed: OnboardingStep[]
  completed_at: string | null
  created_at: string
}
