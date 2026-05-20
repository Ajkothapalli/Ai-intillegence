import { notFound } from 'next/navigation'
import { getProject } from '@/features/projects/queries'
import { createServerClient } from '@/lib/supabase/server'
import { SettingsForm } from './settings-form'

type Props = { params: Promise<{ id: string }> }

type AnalysisSchedule = {
  id: string
  frequency: 'daily' | 'weekly' | 'monthly'
  enabled: boolean
  use_deep_model: boolean
  next_run_at: string
}

export default async function SettingsPage({ params }: Props) {
  const { id } = await params
  const [project, supabase] = await Promise.all([getProject(id), createServerClient()])
  if (!project) notFound()

  const { data: schedule } = await supabase
    .from('analysis_schedules')
    .select('id, frequency, enabled, use_deep_model, next_run_at')
    .eq('project_id', id)
    .maybeSingle()

  return <SettingsForm project={project} schedule={schedule as AnalysisSchedule | null} />
}
