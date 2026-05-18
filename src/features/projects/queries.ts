import { createServerClient } from '@/lib/supabase/server'
import type { Project, Upload } from './types'

export async function listProjects(): Promise<Project[]> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data ?? []
}

export async function getProject(id: string): Promise<Project | null> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return data
}

export async function getUploadsByProject(projectId: string): Promise<Upload[]> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('uploads')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data ?? []) as Upload[]
}
