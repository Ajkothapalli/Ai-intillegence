import type { SupabaseClient } from '@supabase/supabase-js'

function isoWeek(date: Date): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  // ISO week: Thursday rule
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7))
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  const week = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, '0')}`
}

export async function touchStreak(supabase: SupabaseClient, userId: string): Promise<void> {
  const thisWeek = isoWeek(new Date())

  const { data: existing } = await supabase
    .from('user_streaks')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()

  if (!existing) {
    await supabase.from('user_streaks').insert({
      user_id: userId,
      current_streak: 1,
      longest_streak: 1,
      last_active_week: thisWeek,
    })
    return
  }

  if (existing.last_active_week === thisWeek) return

  // Check if last week was the previous week (consecutive)
  const lastDate = new Date()
  lastDate.setDate(lastDate.getDate() - 7)
  const prevWeek = isoWeek(lastDate)
  const isConsecutive = existing.last_active_week === prevWeek

  const newStreak = isConsecutive ? existing.current_streak + 1 : 1
  const newLongest = Math.max(existing.longest_streak, newStreak)

  await supabase.from('user_streaks').update({
    current_streak: newStreak,
    longest_streak: newLongest,
    last_active_week: thisWeek,
    updated_at: new Date().toISOString(),
  }).eq('user_id', userId)
}

export async function getStreak(supabase: SupabaseClient, userId: string): Promise<{ current: number; longest: number; activeThisWeek: boolean }> {
  const { data } = await supabase
    .from('user_streaks')
    .select('current_streak, longest_streak, last_active_week')
    .eq('user_id', userId)
    .maybeSingle()

  const thisWeek = isoWeek(new Date())
  return {
    current: data?.current_streak ?? 0,
    longest: data?.longest_streak ?? 0,
    activeThisWeek: data?.last_active_week === thisWeek,
  }
}
