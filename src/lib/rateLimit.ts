import { createServerClient } from '@/lib/supabase/server'

const WINDOW_HOURS = 24
const MAX_ANALYSES = 10

export type RateLimitStatus = {
  allowed: boolean
  remaining: number
  resetAt: Date
}

// Read-only — call from server components to display status without side effects
export async function getRateLimitStatus(userId: string): Promise<RateLimitStatus> {
  const supabase = await createServerClient()
  const windowCutoff = new Date(Date.now() - WINDOW_HOURS * 3_600_000)

  const { data } = await supabase
    .from('analysis_rate_limits')
    .select('window_start, count')
    .eq('user_id', userId)
    .maybeSingle()

  if (!data || new Date(data.window_start) < windowCutoff) {
    return {
      allowed: true,
      remaining: MAX_ANALYSES,
      resetAt: new Date(Date.now() + WINDOW_HOURS * 3_600_000),
    }
  }

  const resetAt = new Date(new Date(data.window_start).getTime() + WINDOW_HOURS * 3_600_000)
  const count: number = data.count

  if (count >= MAX_ANALYSES) return { allowed: false, remaining: 0, resetAt }
  return { allowed: true, remaining: MAX_ANALYSES - count, resetAt }
}

// Read-write — call from server actions; increments count when allowed
export async function checkAnalysisRateLimit(userId: string): Promise<RateLimitStatus> {
  const supabase = await createServerClient()
  const windowCutoff = new Date(Date.now() - WINDOW_HOURS * 3_600_000)

  const { data: existing } = await supabase
    .from('analysis_rate_limits')
    .select('id, window_start, count')
    .eq('user_id', userId)
    .maybeSingle()

  const newWindowStart = new Date()
  const resetAt = new Date(newWindowStart.getTime() + WINDOW_HOURS * 3_600_000)

  // No row or window expired — start a fresh window
  if (!existing || new Date(existing.window_start) < windowCutoff) {
    await supabase
      .from('analysis_rate_limits')
      .upsert(
        { user_id: userId, window_start: newWindowStart.toISOString(), count: 1 },
        { onConflict: 'user_id' },
      )
    return { allowed: true, remaining: MAX_ANALYSES - 1, resetAt }
  }

  const count: number = existing.count
  const existingResetAt = new Date(
    new Date(existing.window_start).getTime() + WINDOW_HOURS * 3_600_000,
  )

  if (count >= MAX_ANALYSES) {
    return { allowed: false, remaining: 0, resetAt: existingResetAt }
  }

  await supabase
    .from('analysis_rate_limits')
    .update({ count: count + 1 })
    .eq('id', existing.id)

  return { allowed: true, remaining: MAX_ANALYSES - count - 1, resetAt: existingResetAt }
}
