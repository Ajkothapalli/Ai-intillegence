import { createServerClient } from '@/lib/supabase/server'
import type { UserSegment } from './types'

export async function getSegmentsByProject(projectId: string): Promise<UserSegment[]> {
  const supabase = await createServerClient()
  const { data } = await supabase
    .from('user_segments')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })
  return (data ?? []) as UserSegment[]
}

export async function getSegmentById(id: string): Promise<UserSegment | null> {
  const supabase = await createServerClient()
  const { data } = await supabase
    .from('user_segments')
    .select('*')
    .eq('id', id)
    .maybeSingle()
  return data as UserSegment | null
}
