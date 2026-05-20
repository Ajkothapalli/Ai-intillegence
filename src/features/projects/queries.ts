import { createServerClient } from '@/lib/supabase/server'
import type { Project, Upload } from './types'

export type CohortInfo = {
  uploadId: string
  dimensionName: string
  segments: string[]
}

export type ActivityDay = {
  date: string
  experiments: number
  recommendations: number
}

export type FeedItem = {
  id: string
  name: string
  primaryMetric: string | null
  analysisStatus: 'pending' | 'running' | 'completed' | 'failed' | null
  recommendationCount: number
  createdAt: string
  isDemo: boolean
}

export type DashboardStats = {
  totalProjects: number
  totalCompletedAnalyses: number
  totalRecommendations: number
  avgConfidence: number
  projectsDelta: number
  analysesDelta: number
  recommendationsDelta: number
  confidenceDelta: number
  activityData: ActivityDay[]
  feed: FeedItem[]
  demoProject: FeedItem | null
  hasRealProject: boolean
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createServerClient()

  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString()

  function pct(curr: number, prev: number) {
    if (prev === 0) return curr > 0 ? 100 : 0
    return Math.round(((curr - prev) / prev) * 100)
  }
  function avgConf(rows: { confidence: number }[]) {
    if (!rows.length) return 0
    return Math.round(rows.reduce((s, r) => s + r.confidence, 0) / rows.length)
  }

  const [
    totalProjectsRes,
    totalAnalysesRes,
    totalRecsRes,
    currProjectsRes, prevProjectsRes,
    currAnalysesRes, prevAnalysesRes,
    currRecsRes, prevRecsRes,
    currConfRes, prevConfRes,
    chartProjectsRes, chartRecsRes,
    feedProjectsRes,
  ] = await Promise.all([
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('analyses').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
    supabase.from('recommendations').select('*', { count: 'exact', head: true }),
    supabase.from('projects').select('*', { count: 'exact', head: true }).gte('created_at', thirtyDaysAgo),
    supabase.from('projects').select('*', { count: 'exact', head: true }).gte('created_at', sixtyDaysAgo).lt('created_at', thirtyDaysAgo),
    supabase.from('analyses').select('*', { count: 'exact', head: true }).eq('status', 'completed').gte('created_at', thirtyDaysAgo),
    supabase.from('analyses').select('*', { count: 'exact', head: true }).eq('status', 'completed').gte('created_at', sixtyDaysAgo).lt('created_at', thirtyDaysAgo),
    supabase.from('recommendations').select('*', { count: 'exact', head: true }).gte('created_at', thirtyDaysAgo),
    supabase.from('recommendations').select('*', { count: 'exact', head: true }).gte('created_at', sixtyDaysAgo).lt('created_at', thirtyDaysAgo),
    supabase.from('recommendations').select('confidence').gte('created_at', thirtyDaysAgo),
    supabase.from('recommendations').select('confidence').gte('created_at', sixtyDaysAgo).lt('created_at', thirtyDaysAgo),
    supabase.from('projects').select('created_at').gte('created_at', thirtyDaysAgo),
    supabase.from('recommendations').select('created_at').gte('created_at', thirtyDaysAgo),
    supabase.from('projects').select('id, name, created_at, primary_metric, is_demo').order('created_at', { ascending: false }).limit(8),
  ])

  // Activity chart — 30 days
  const projByDay = new Map<string, number>()
  for (const p of chartProjectsRes.data ?? []) {
    const key = p.created_at.split('T')[0]
    projByDay.set(key, (projByDay.get(key) ?? 0) + 1)
  }
  const recByDay = new Map<string, number>()
  for (const r of chartRecsRes.data ?? []) {
    const key = r.created_at.split('T')[0]
    recByDay.set(key, (recByDay.get(key) ?? 0) + 1)
  }
  const activityData: ActivityDay[] = []
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
    const key = d.toISOString().split('T')[0]
    activityData.push({
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      experiments: projByDay.get(key) ?? 0,
      recommendations: recByDay.get(key) ?? 0,
    })
  }

  // Feed enrichment
  const feedIds = (feedProjectsRes.data ?? []).map(p => p.id)
  const [analysesForFeed, recsForFeed] = await Promise.all([
    feedIds.length
      ? supabase.from('analyses').select('project_id, status, created_at').in('project_id', feedIds).order('created_at', { ascending: false })
      : Promise.resolve({ data: [] as { project_id: string; status: string; created_at: string }[] }),
    feedIds.length
      ? supabase.from('recommendations').select('project_id').in('project_id', feedIds)
      : Promise.resolve({ data: [] as { project_id: string }[] }),
  ])

  const latestStatus = new Map<string, FeedItem['analysisStatus']>()
  for (const a of (analysesForFeed.data ?? []) as { project_id: string; status: FeedItem['analysisStatus'] }[]) {
    if (!latestStatus.has(a.project_id)) latestStatus.set(a.project_id, a.status)
  }
  const recCount = new Map<string, number>()
  for (const r of (recsForFeed.data ?? []) as { project_id: string }[]) {
    recCount.set(r.project_id, (recCount.get(r.project_id) ?? 0) + 1)
  }

  const feed: FeedItem[] = (feedProjectsRes.data ?? []).map(p => ({
    id: p.id,
    name: p.name,
    primaryMetric: p.primary_metric ?? null,
    analysisStatus: latestStatus.get(p.id) ?? null,
    recommendationCount: recCount.get(p.id) ?? 0,
    createdAt: p.created_at,
    isDemo: (p.is_demo as boolean | null) ?? false,
  }))

  const currConf = avgConf(currConfRes.data ?? [])
  const prevConf = avgConf(prevConfRes.data ?? [])

  const demoProject = feed.find(f => f.isDemo) ?? null
  const hasRealProject = feed.some(f => !f.isDemo)

  return {
    totalProjects: totalProjectsRes.count ?? 0,
    totalCompletedAnalyses: totalAnalysesRes.count ?? 0,
    totalRecommendations: totalRecsRes.count ?? 0,
    avgConfidence: currConf,
    projectsDelta: pct(currProjectsRes.count ?? 0, prevProjectsRes.count ?? 0),
    analysesDelta: pct(currAnalysesRes.count ?? 0, prevAnalysesRes.count ?? 0),
    recommendationsDelta: pct(currRecsRes.count ?? 0, prevRecsRes.count ?? 0),
    confidenceDelta: currConf - prevConf,
    activityData,
    feed,
    demoProject,
    hasRealProject,
  }
}

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

export async function getCohortDataByProject(projectId: string): Promise<CohortInfo[]> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('cohort_dimensions')
    .select('id, name, values, cohort_uploads(upload_id)')
    .eq('project_id', projectId)

  if (error || !data) return []

  return data.map(d => {
    const cu = d.cohort_uploads as { upload_id: string }[]
    return {
      uploadId: cu[0]?.upload_id ?? '',
      dimensionName: d.name,
      segments: (d.values ?? []) as string[],
    }
  })
}
