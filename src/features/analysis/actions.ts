'use server'

import { createServerClient } from '@/lib/supabase/server'
import { getProject } from '@/features/projects/queries'
import { runAnalysis } from '@/lib/ai/analyze'
import { revalidatePath } from 'next/cache'

type RunAnalysisResult = { success: true; analysisId: string } | { success: false; error: string }

function parseAnthropicError(raw: string): string {
  // Anthropic SDK errors look like: "400 {\"type\":\"error\",\"error\":{\"message\":\"...\"}}"
  const jsonStart = raw.indexOf('{')
  if (jsonStart !== -1) {
    try {
      const parsed = JSON.parse(raw.slice(jsonStart)) as {
        error?: { message?: string }
      }
      if (parsed?.error?.message) return parsed.error.message
    } catch {
      // fall through to raw
    }
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
      .select('file_name, file_type, mime_type, storage_path')
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
        // Read text content for csv and text-based user_research
        try {
          const { data } = await supabase.storage
            .from('uploads')
            .download(upload.storage_path)
          const text = data ? await data.text() : undefined
          return {
            file_name: upload.file_name,
            file_type: upload.file_type as 'csv' | 'user_research',
            content: text?.slice(0, 50_000),
          }
        } catch {
          return {
            file_name: upload.file_name,
            file_type: upload.file_type as 'csv' | 'user_research',
          }
        }
      })
    )

    // Build user research summary: text content + note binary files
    const researchUploads = uploadsWithContent.filter(u => u.file_type === 'user_research')
    const binaryCount = (uploads ?? []).filter(
      u => u.file_type === 'user_research' && isBinary(u.mime_type)
    ).length

    let userResearchSummary: string | undefined
    if (researchUploads.length > 0) {
      const parts: string[] = researchUploads
        .filter(u => u.content)
        .map(u => `### ${u.file_name}\n${u.content}`)
      if (binaryCount > 0) {
        parts.push(`(${binaryCount} video/audio file${binaryCount > 1 ? 's' : ''} available — content not extracted)`)
      }
      if (parts.length > 0) userResearchSummary = parts.join('\n\n')
    }

    // Generate short-lived signed URLs for screenshots to pass as vision images
    const screenshotUploads = (uploads ?? []).filter(u => u.file_type === 'screenshot')
    const screenshotUrls: string[] = (
      await Promise.all(
        screenshotUploads.map(async u => {
          const { data } = await supabase.storage
            .from('uploads')
            .createSignedUrl(u.storage_path, 300) // 5-min TTL — only needs to last for the API call
          return data?.signedUrl ?? null
        })
      )
    ).filter((url): url is string => url !== null)

    const output = await runAnalysis(
      project,
      uploadsWithContent,
      useDeepModel,
      userResearchSummary,
      screenshotUrls.length > 0 ? screenshotUrls : undefined,
    )

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
      screenshot_annotation: r.screenshot_annotation ?? null,
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
    const raw = err instanceof Error ? err.message : 'Unknown error'
    const msg = parseAnthropicError(raw)
    await supabase
      .from('analyses')
      .update({ status: 'failed', error_message: msg })
      .eq('id', analysis.id)

    return { success: false, error: msg }
  }
}
