import { createServerClient } from '@/lib/supabase/server'
import type { Analysis, DbRecommendation } from './types'

export async function getAnalysisByProject(projectId: string): Promise<Analysis | null> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('analyses')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) throw new Error(error.message)
  return data
}

export async function getRecommendationsByAnalysis(analysisId: string): Promise<DbRecommendation[]> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('recommendations')
    .select('*')
    .eq('analysis_id', analysisId)
    .order('priority', { ascending: true })

  if (error) throw new Error(error.message)
  return data ?? []
}

export async function getProjectRecommendations(projectId: string): Promise<DbRecommendation[]> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('recommendations')
    .select('*')
    .eq('project_id', projectId)
    .order('priority', { ascending: true })

  if (error) throw new Error(error.message)
  return data ?? []
}
