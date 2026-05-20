import { createServerClient } from '@/lib/supabase/server'
import type { OnboardingProgress } from './types'

export async function getOnboardingProgress(): Promise<OnboardingProgress | null> {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('onboarding_progress')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  return data as OnboardingProgress | null
}
