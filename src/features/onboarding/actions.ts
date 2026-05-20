'use server'

import { createServerClient } from '@/lib/supabase/server'
import { ALL_ONBOARDING_STEPS } from './types'
import type { OnboardingStep } from './types'

export async function markDemoRecommendationViewed(): Promise<void> {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  if (user.user_metadata?.['hasViewedDemoRec'] === true) return
  await supabase.auth.updateUser({ data: { hasViewedDemoRec: true } })
}

export async function completeOnboardingStep(step: OnboardingStep): Promise<void> {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { data: existing } = await supabase
    .from('onboarding_progress')
    .select('steps_completed')
    .eq('user_id', user.id)
    .maybeSingle()

  const current: OnboardingStep[] = (existing?.steps_completed ?? []) as OnboardingStep[]
  if (current.includes(step)) return

  const updated = [...current, step] as OnboardingStep[]
  const allDone = ALL_ONBOARDING_STEPS.every(s => updated.includes(s))

  await supabase.from('onboarding_progress').upsert({
    user_id: user.id,
    steps_completed: updated,
    completed_at: allDone ? new Date().toISOString() : null,
  }, { onConflict: 'user_id' })
}
