'use server'

import { createServerClient } from '@/lib/supabase/server'
import { getProject } from '@/features/projects/queries'
import { runAnalysis } from '@/lib/ai/analyze'
import type { ScreenshotInput, FunnelContext } from '@/lib/ai/analyze'
import { getBenchmarksForAnalysis } from '@/lib/ai/benchmarks'
import type { BenchmarkResult } from '@/lib/ai/benchmarks'
import { generateWireframe } from '@/lib/ai/wireframe'
import { revalidatePath } from 'next/cache'
import { getSegmentsByProject } from '@/features/segments/queries'
import { checkAnalysisRateLimit } from '@/lib/rateLimit'
import { completeOnboardingStep } from '@/features/onboarding/actions'
import { completeRingAction } from '@/features/onboarding/rings'
import { touchStreak } from '@/features/onboarding/streaks'

type RunAnalysisResult = { success: true; analysisId: string } | { success: false; error: string }
type WireframeResult = { success: true; wireframeId: string } | { success: false; error: string }
type ShareLinkResult = { success: true; url: string } | { success: false; error: string }

function parseAnthropicError(raw: string): string {
  const jsonStart = raw.indexOf('{')
  if (jsonStart !== -1) {
    try {
      const parsed = JSON.parse(raw.slice(jsonStart)) as { error?: { message?: string } }
      if (parsed?.error?.message) return parsed.error.message
    } catch { /* fall through */ }
  }
  return raw
}

export async function runProjectAnalysis(
  projectId: string,
  useDeepModel = false
): Promise<RunAnalysisResult> {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  // Rate limit: 10 analyses per user per 24 hours
  const rateLimit = await checkAnalysisRateLimit(user.id)
  if (!rateLimit.allowed) {
    return {
      success: false,
      error: `Analysis limit reached. Resets at ${rateLimit.resetAt.toLocaleString()}.`,
    }
  }

  const project = await getProject(projectId)
  if (!project) return { success: false, error: 'Project not found' }

  const { data: analysis, error: createError } = await supabase
    .from('analyses')
    .insert({
      project_id: projectId,
      user_id: user.id,
      status: 'running',
      model: useDeepModel ? 'claude-opus-4-7' : 'claude-sonnet-4-6',
      started_at: new Date().toISOString(),
    })
    .select('id')
    .single()
  if (createError) return { success: false, error: createError.message }

  void completeOnboardingStep('run_analysis')
  void completeRingAction('analysis', 'run_analysis')
  void touchStreak(supabase, user.id)

  try {
    const { data: uploads } = await supabase
      .from('uploads')
      .select('id, file_name, file_type, mime_type, storage_path')
      .eq('project_id', projectId)

    const BINARY_MIME_PREFIXES = ['video/', 'audio/']
    const isBinary = (mime: string) => BINARY_MIME_PREFIXES.some(p => mime.startsWith(p))

    const uploadsWithContent = await Promise.all(
      (uploads ?? []).map(async upload => {
        if (upload.file_type === 'screenshot') {
          return { file_name: upload.file_name, file_type: 'screenshot' as const }
        }
        if (upload.file_type === 'user_research' && isBinary(upload.mime_type)) {
          return { file_name: upload.file_name, file_type: 'user_research' as const }
        }
        try {
          const { data } = await supabase.storage.from('uploads').download(upload.storage_path)
          const text = data ? await data.text() : undefined
          return {
            file_name: upload.file_name,
            file_type: upload.file_type as 'csv' | 'user_research',
            content: text?.slice(0, 50_000),
          }
        } catch {
          return { file_name: upload.file_name, file_type: upload.file_type as 'csv' | 'user_research' }
        }
      })
    )

    const researchUploads = uploadsWithContent.filter(u => u.file_type === 'user_research')
    const binaryCount = (uploads ?? []).filter(
      u => u.file_type === 'user_research' && isBinary(u.mime_type)
    ).length
    let userResearchSummary: string | undefined
    if (researchUploads.length > 0) {
      const parts = researchUploads.filter(u => u.content).map(u => `### ${u.file_name}\n${u.content}`)
      if (binaryCount > 0) parts.push(`(${binaryCount} video/audio file${binaryCount > 1 ? 's' : ''} available)`)
      if (parts.length > 0) userResearchSummary = parts.join('\n\n')
    }

    const screenshotUploads = (uploads ?? []).filter(u => u.file_type === 'screenshot')
    const screenshotUrls: string[] = (
      await Promise.all(
        screenshotUploads.map(async u => {
          const { data } = await supabase.storage.from('uploads').createSignedUrl(u.storage_path, 300)
          return data?.signedUrl ?? null
        })
      )
    ).filter((url): url is string => url !== null)

    // Download screenshot buffers for vision pre-analysis
    const screenshotInputs: ScreenshotInput[] = (
      await Promise.all(
        screenshotUploads.map(async (u): Promise<ScreenshotInput | null> => {
          try {
            const { data: blob } = await supabase.storage.from('uploads').download(u.storage_path)
            if (!blob) return null
            const bytes = await blob.arrayBuffer()
            return { id: u.id, buffer: Buffer.from(bytes), mimeType: u.mime_type }
          } catch {
            return null
          }
        })
      )
    ).flatMap(s => (s ? [s] : []))

    const segments = await getSegmentsByProject(projectId)

    // Fetch funnel mapping for this project
    let funnelContext: FunnelContext | undefined
    const { data: mappingRow } = await supabase
      .from('user_funnel_mappings')
      .select('template_id')
      .eq('project_id', projectId)
      .maybeSingle()
    if (mappingRow?.template_id) {
      const { data: tpl } = await supabase
        .from('funnel_templates')
        .select('category, stages, industry_median_drop_off')
        .eq('id', mappingRow.template_id)
        .single()
      if (tpl) {
        funnelContext = {
          category: String(tpl.category),
          stages: (tpl.stages as string[]) ?? [],
          medians: (tpl.industry_median_drop_off as Record<string, number>) ?? {},
        }
      }
    }

    // Pre-fetch benchmarks for all hypothesis types relevant to this industry
    const industryCategory = funnelContext?.category
    const hypothesisTypes = ['copy', 'layout', 'flow', 'incentive', 'social_proof', 'friction_removal']
    const benchmarkEntries = await Promise.all(
      hypothesisTypes.map(async (ht) => {
        const b = await getBenchmarksForAnalysis(ht, industryCategory)
        return [ht, b] as [string, BenchmarkResult | null]
      })
    )
    const benchmarks = new Map<string, BenchmarkResult>(
      benchmarkEntries.filter((e): e is [string, BenchmarkResult] => e[1] !== null)
    )

    const output = await runAnalysis(
      project,
      uploadsWithContent,
      useDeepModel,
      userResearchSummary,
      screenshotUrls.length > 0 ? screenshotUrls : undefined,
      screenshotInputs.length > 0 ? screenshotInputs : undefined,
      segments.length > 0 ? segments : undefined,
      funnelContext,
      benchmarks.size > 0 ? benchmarks : undefined,
    )


    const rows = output.recommendations.map(r => ({
      analysis_id: analysis.id,
      project_id: projectId,
      user_id: user.id,
      priority: r.priority,
      hypothesis: r.hypothesis,
      experiment_type: r.experiment_type,
      confidence: r.confidence,
      evidence: r.evidence,
      rationale: r.rationale ?? null,
      screenshot_annotation: r.screenshot_annotation ?? null,
      target_element: r.target_element ?? null,
      screenshot_id: r.screenshot_id ?? null,
      pm_summary: r.pm_summary ?? null,
      target_segments: r.target_segments ?? null,
      estimated_reach: r.estimated_reach ?? null,
    }))

    await supabase.from('recommendations').insert(rows)
    await supabase.from('analyses').update({ status: 'completed', completed_at: new Date().toISOString() }).eq('id', analysis.id)

    revalidatePath(`/projects/${projectId}`)
    revalidatePath(`/projects/${projectId}/recommendations`)
    return { success: true, analysisId: analysis.id }
  } catch (err) {
    const raw = err instanceof Error ? err.message : 'Unknown error'
    const msg = parseAnthropicError(raw)
    await supabase.from('analyses').update({ status: 'failed', error_message: msg }).eq('id', analysis.id)
    return { success: false, error: msg }
  }
}

export async function generateWireframeForRecommendation(
  recommendationId: string,
  projectId: string,
): Promise<WireframeResult> {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const { data: rec } = await supabase
    .from('recommendations')
    .select('id, hypothesis, experiment_type, rationale, target_element, project_id')
    .eq('id', recommendationId)
    .eq('project_id', projectId)
    .single()
  if (!rec) return { success: false, error: 'Recommendation not found' }

  const project = await getProject(projectId)
  if (!project) return { success: false, error: 'Project not found' }

  // Check if wireframe already exists
  const { data: existing } = await supabase
    .from('wireframes')
    .select('id')
    .eq('recommendation_id', recommendationId)
    .maybeSingle()
  if (existing) return { success: true, wireframeId: existing.id }

  try {
    const output = await generateWireframe(
      { hypothesis: rec.hypothesis, experiment_type: rec.experiment_type, rationale: rec.rationale ?? null },
      rec.target_element ?? null,
      { name: project.name, description: project.description ?? null },
    )
    const { data: wireframe, error } = await supabase
      .from('wireframes')
      .insert({ recommendation_id: recommendationId, html: output.html, description: output.description })
      .select('id')
      .single()
    if (error) return { success: false, error: error.message }
    return { success: true, wireframeId: wireframe.id }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

export async function createShareLink(recommendationId: string): Promise<ShareLinkResult> {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  // Verify ownership via project
  const { data: rec } = await supabase
    .from('recommendations')
    .select('id, project_id')
    .eq('id', recommendationId)
    .eq('user_id', user.id)
    .single()
  if (!rec) return { success: false, error: 'Recommendation not found' }

  const { data: existing } = await supabase
    .from('share_links')
    .select('token')
    .eq('recommendation_id', recommendationId)
    .gt('expires_at', new Date().toISOString())
    .maybeSingle()

  const token = existing?.token ?? null
  if (token) {
    const base = process.env.NEXT_PUBLIC_APP_URL ?? ''
    return { success: true, url: `${base}/share/${token}` }
  }

  const { data: link, error } = await supabase
    .from('share_links')
    .insert({ recommendation_id: recommendationId })
    .select('token')
    .single()
  if (error) return { success: false, error: error.message }
  const base = process.env.NEXT_PUBLIC_APP_URL ?? ''
  return { success: true, url: `${base}/share/${link.token}` }
}

type ExperimentRunResult = { success: true; runId: string } | { success: false; error: string }

export async function createExperimentRun(
  projectId: string,
  data: {
    name: string
    hypothesis?: string
    recommendation_id?: string
    segment_id?: string
  },
): Promise<ExperimentRunResult> {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  // Snapshot the segment dimensions at time of run
  let segmentSnapshot = null
  if (data.segment_id) {
    const { data: seg } = await supabase
      .from('user_segments')
      .select('*')
      .eq('id', data.segment_id)
      .eq('user_id', user.id)
      .single()
    segmentSnapshot = seg ?? null
  }

  const { data: run, error } = await supabase
    .from('experiment_runs')
    .insert({
      project_id:       projectId,
      user_id:          user.id,
      name:             data.name,
      hypothesis:       data.hypothesis ?? null,
      recommendation_id: data.recommendation_id ?? null,
      segment_id:       data.segment_id ?? null,
      segment_snapshot: segmentSnapshot,
      status:           'planned',
    })
    .select('id')
    .single()
  if (error) return { success: false, error: error.message }

  revalidatePath(`/projects/${projectId}/experiments`)
  return { success: true, runId: run.id }
}

type LogOutcomeResult = { success: true } | { success: false; error: string }

export async function logOutcome(
  runId: string,
  projectId: string,
  outcome: 'won' | 'lost' | 'inconclusive',
  liftPercent: number | null,
  notes: string | null,
): Promise<LogOutcomeResult> {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const { data: run, error: fetchErr } = await supabase
    .from('experiment_runs')
    .select('experiment_type, recommendation_id')
    .eq('id', runId)
    .eq('user_id', user.id)
    .single()
  if (fetchErr || !run) return { success: false, error: 'Run not found' }

  const { error } = await supabase
    .from('experiment_runs')
    .update({
      outcome,
      lift_percent: liftPercent,
      outcome_notes: notes,
      status: 'completed',
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', runId)
    .eq('user_id', user.id)
  if (error) return { success: false, error: error.message }

  // Fire-and-forget benchmark update
  const experimentType: string = (run.experiment_type as string | null) ?? 'A/B Test'
  void (async () => {
    const { updateBenchmarkFromOutcome } = await import('@/lib/benchmarks/updateFromOutcome')
    await updateBenchmarkFromOutcome(supabase, {
      userId: user.id,
      projectId,
      experimentType,
      won: outcome === 'won',
      liftPercent,
    })
  })()

  revalidatePath(`/projects/${projectId}/experiments`)
  return { success: true }
}

export async function revokeShareLink(linkId: string, projectId: string): Promise<{ success: true } | { success: false; error: string }> {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  // Verify ownership: share_link → recommendation → project → user
  const { data: link } = await supabase
    .from('share_links')
    .select('id, recommendations(project_id, user_id)')
    .eq('id', linkId)
    .single()

  if (!link) return { success: false, error: 'Link not found' }

  const rec = (link.recommendations as unknown as { project_id: string; user_id: string } | null)
  if (!rec || rec.user_id !== user.id) return { success: false, error: 'Not authorised' }

  const { error } = await supabase.from('share_links').delete().eq('id', linkId)
  if (error) return { success: false, error: error.message }

  revalidatePath(`/projects/${projectId}/share-links`)
  return { success: true }
}

type ScheduleFrequency = 'daily' | 'weekly' | 'monthly'
type ScheduleResult = { success: true } | { success: false; error: string }

function nextRunDate(frequency: ScheduleFrequency): Date {
  const d = new Date()
  if (frequency === 'daily')   d.setDate(d.getDate() + 1)
  if (frequency === 'weekly')  d.setDate(d.getDate() + 7)
  if (frequency === 'monthly') d.setMonth(d.getMonth() + 1)
  return d
}

export async function createSchedule(
  projectId: string,
  frequency: ScheduleFrequency,
  useDeepModel: boolean,
): Promise<ScheduleResult> {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const { data: project } = await supabase.from('projects').select('id').eq('id', projectId).eq('user_id', user.id).single()
  if (!project) return { success: false, error: 'Project not found' }

  const { error } = await supabase.from('analysis_schedules').upsert({
    project_id: projectId,
    frequency,
    enabled: true,
    use_deep_model: useDeepModel,
    next_run_at: nextRunDate(frequency).toISOString(),
    updated_at: new Date().toISOString(),
  }, { onConflict: 'project_id' })

  if (error) return { success: false, error: error.message }
  revalidatePath(`/projects/${projectId}/settings`)
  return { success: true }
}

export async function updateSchedule(
  projectId: string,
  patch: Partial<{ frequency: ScheduleFrequency; enabled: boolean; use_deep_model: boolean }>,
): Promise<ScheduleResult> {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const updates: Record<string, unknown> = { ...patch, updated_at: new Date().toISOString() }
  if (patch.frequency) updates.next_run_at = nextRunDate(patch.frequency).toISOString()

  const { error } = await supabase.from('analysis_schedules')
    .update(updates)
    .eq('project_id', projectId)
    .eq('projects.user_id', user.id)

  if (error) return { success: false, error: error.message }
  revalidatePath(`/projects/${projectId}/settings`)
  return { success: true }
}

export async function deleteSchedule(projectId: string): Promise<ScheduleResult> {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const { error } = await supabase.from('analysis_schedules')
    .delete()
    .eq('project_id', projectId)

  if (error) return { success: false, error: error.message }
  revalidatePath(`/projects/${projectId}/settings`)
  return { success: true }
}
