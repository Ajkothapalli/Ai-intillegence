'use server'

import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { createProjectSchema, type CreateProjectInput } from './schema'

export type ProjectActionResult = { success: true; id: string } | { success: false; error: string }

export async function createProject(data: CreateProjectInput): Promise<ProjectActionResult> {
  const parsed = createProjectSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const funnelStages = parsed.data.funnel_stages
    ? parsed.data.funnel_stages.split(',').map(s => s.trim()).filter(Boolean)
    : null

  const { data: row, error } = await supabase
    .from('projects')
    .insert({
      user_id: user.id,
      name: parsed.data.name,
      description: parsed.data.description || null,
      app_url: parsed.data.app_url || null,
      target_audience: parsed.data.target_audience || null,
      funnel_stages: funnelStages,
      primary_metric: parsed.data.primary_metric || null,
      business_goal: parsed.data.business_goal || null,
    })
    .select('id')
    .single()

  if (error) return { success: false, error: error.message }

  redirect(`/projects/${row.id}`)
}
