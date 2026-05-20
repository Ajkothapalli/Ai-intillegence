import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { runProjectAnalysis } from '@/features/analysis/actions'

export const runtime = 'nodejs'
export const maxDuration = 300

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  const now = new Date().toISOString()
  const { data: schedules, error } = await supabase
    .from('analysis_schedules')
    .select('id, project_id, frequency, use_deep_model')
    .eq('enabled', true)
    .lte('next_run_at', now)
    .limit(10)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!schedules || schedules.length === 0) {
    return NextResponse.json({ ran: 0 })
  }

  const results: Array<{ projectId: string; success: boolean }> = []

  for (const schedule of schedules) {
    try {
      await runProjectAnalysis(schedule.project_id, schedule.use_deep_model)
      const freq = schedule.frequency as 'daily' | 'weekly' | 'monthly'
      const nextRun = new Date()
      if (freq === 'daily')   nextRun.setDate(nextRun.getDate() + 1)
      if (freq === 'weekly')  nextRun.setDate(nextRun.getDate() + 7)
      if (freq === 'monthly') nextRun.setMonth(nextRun.getMonth() + 1)

      await supabase.from('analysis_schedules').update({
        last_run_at: now,
        next_run_at: nextRun.toISOString(),
        updated_at: now,
      }).eq('id', schedule.id)

      results.push({ projectId: schedule.project_id, success: true })
    } catch {
      results.push({ projectId: schedule.project_id, success: false })
    }
  }

  return NextResponse.json({ ran: results.length, results })
}
