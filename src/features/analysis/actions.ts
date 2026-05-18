'use server'

import { createServerClient } from '@/lib/supabase/server'
import { getProject } from '@/features/projects/queries'
import { runAnalysis } from '@/lib/ai/analyze'
import { revalidatePath } from 'next/cache'

type RunAnalysisResult = { success: true; analysisId: string } | { success: false; error: string }

export async function runProjectAnalysis(
  projectId: string,
  useDeepModel = false
): Promise<RunAnalysisResult> {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const project = await getProject(projectId)
  if (!project) return { success: false, error: 'Project not found' }

  // Create analysis record
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

  try {
    // Fetch uploads and their content (CSV text only)
    const { data: uploads } = await supabase
      .from('uploads')
      .select('file_name, file_type, storage_path')
      .eq('project_id', projectId)

    const uploadsWithContent = await Promise.all(
      (uploads ?? []).map(async upload => {
        if (upload.file_type !== 'csv') {
          return { file_name: upload.file_name, file_type: upload.file_type as 'csv' | 'screenshot' }
        }
        try {
          const { data } = await supabase.storage
            .from('uploads')
            .download(upload.storage_path)
          const text = data ? await data.text() : undefined
          // Truncate to 50K chars to fit context
          return {
            file_name: upload.file_name,
            file_type: 'csv' as const,
            content: text?.slice(0, 50_000),
          }
        } catch {
          return { file_name: upload.file_name, file_type: 'csv' as const }
        }
      })
    )

    const output = await runAnalysis(project, uploadsWithContent, useDeepModel)

    // Store recommendations
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
    }))

    await supabase.from('recommendations').insert(rows)

    // Mark completed
    await supabase
      .from('analyses')
      .update({ status: 'completed', completed_at: new Date().toISOString() })
      .eq('id', analysis.id)

    revalidatePath(`/projects/${projectId}`)
    revalidatePath(`/projects/${projectId}/recommendations`)

    return { success: true, analysisId: analysis.id }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    await supabase
      .from('analyses')
      .update({ status: 'failed', error_message: msg })
      .eq('id', analysis.id)

    return { success: false, error: msg }
  }
}
