import { createServerClient } from '@/lib/supabase/server'
import type { Analysis, DbRecommendation } from './types'

export type AnalysisHistoryItem = Analysis & { recommendation_count: number }

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

export async function getAnalysisHistory(projectId: string): Promise<AnalysisHistoryItem[]> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('analyses')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  const analyses = (data ?? []) as Analysis[]

  const counts = await Promise.all(
    analyses.map(a =>
      supabase
        .from('recommendations')
        .select('*', { count: 'exact', head: true })
        .eq('analysis_id', a.id)
        .then(r => r.count ?? 0)
    )
  )

  return analyses.map((a, i) => ({ ...a, recommendation_count: counts[i] }))
}

export async function getAnalysisWithRecommendations(
  analysisId: string,
): Promise<{ analysis: Analysis; recommendations: DbRecommendation[] } | null> {
  const supabase = await createServerClient()
  const [{ data: analysis }, { data: recs }] = await Promise.all([
    supabase.from('analyses').select('*').eq('id', analysisId).single(),
    supabase.from('recommendations').select('*').eq('analysis_id', analysisId).order('priority', { ascending: true }),
  ])
  if (!analysis) return null
  return { analysis: analysis as Analysis, recommendations: (recs ?? []) as DbRecommendation[] }
}
