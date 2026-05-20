import type { SupabaseClient } from '@supabase/supabase-js'
import { getDemoData } from './demoData'

export type SeedResult = {
  projectId: string
  analysisId: string
  recommendationId: string
}

export async function seedDemoProject(
  supabase: SupabaseClient,
  userId: string,
  industry: string,
): Promise<SeedResult | null> {
  try {
    const demo = getDemoData(industry)

    // Create demo project
    const { data: project, error: projectErr } = await supabase
      .from('projects')
      .insert({
        user_id:        userId,
        name:           demo.name,
        description:    demo.description,
        app_url:        demo.app_url,
        target_audience: demo.target_audience,
        funnel_stages:  demo.funnel_stages,
        primary_metric: demo.primary_metric,
        business_goal:  demo.business_goal,
        is_demo:        true,
      })
      .select('id')
      .single()

    if (projectErr || !project) return null

    const projectId = project.id as string

    // Create demo analysis
    const now = new Date().toISOString()
    const { data: analysis, error: analysisErr } = await supabase
      .from('analyses')
      .insert({
        project_id:   projectId,
        user_id:      userId,
        status:       'completed',
        model:        'demo',
        is_demo:      true,
        started_at:   now,
        completed_at: now,
      })
      .select('id')
      .single()

    if (analysisErr || !analysis) return null

    const analysisId = analysis.id as string
    const rec = demo.recommendation

    // Create demo recommendation
    const { data: recommendation, error: recErr } = await supabase
      .from('recommendations')
      .insert({
        analysis_id:     analysisId,
        project_id:      projectId,
        user_id:         userId,
        priority:        rec.priority,
        hypothesis:      rec.hypothesis,
        experiment_type: rec.experiment_type,
        confidence:      rec.confidence,
        evidence:        rec.evidence,
        rationale:       rec.rationale,
        pm_summary:      rec.pm_summary,
        target_segments: null,
        estimated_reach: null,
      })
      .select('id')
      .single()

    if (recErr || !recommendation) return null

    return {
      projectId,
      analysisId,
      recommendationId: recommendation.id as string,
    }
  } catch {
    return null
  }
}
