'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createServerClient } from '@/lib/supabase/server'
import { completeOnboardingStep } from '@/features/onboarding/actions'
import { completeRingAction } from '@/features/onboarding/rings'
import {
  createProjectSchema,
  updateProjectSchema,
  type CreateProjectInput,
  type UpdateProjectInput,
  uploadFileSchema,
  ALLOWED_CSV_MIME_TYPES,
  ALLOWED_SCREENSHOT_MIME_TYPES,
  ALLOWED_USER_RESEARCH_MIME_TYPES,
  MAX_FILE_SIZE_BYTES,
  MAX_USER_RESEARCH_FILE_SIZE_BYTES,
  MAX_CSV_COUNT,
  MAX_SCREENSHOT_COUNT,
  MAX_USER_RESEARCH_COUNT,
} from './schema'

export type ProjectActionResult = { success: true; id: string } | { success: false; error: string }
export type UploadResult =
  | { success: true; segmented: true; uploadId: string; segments: string[] }
  | { success: true; segmented: false }
  | { success: false; error: string }

const STORAGE_BUCKET = 'uploads'

// ── CSV segment detection ───────────────────────────────────

function parseCSVRow(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false
  for (const ch of line) {
    if (ch === '"') { inQuotes = !inQuotes }
    else if (ch === ',' && !inQuotes) { result.push(current.trim()); current = '' }
    else { current += ch }
  }
  result.push(current.trim())
  return result
}

function detectCSVSegments(csvText: string): string[] | null {
  const lines = csvText.trim().split('\n').filter(l => l.trim())
  if (lines.length < 2) return null

  const SEGMENT_HEADERS = ['segment', 'segments', 'cohort', 'group', 'user_segment', 'tier', 'plan']
  const headers = parseCSVRow(lines[0]).map(h => h.toLowerCase().replace(/['"]/g, ''))
  const colIdx = headers.findIndex(h => SEGMENT_HEADERS.includes(h))
  if (colIdx === -1) return null

  const values = new Set<string>()
  for (let i = 1; i < lines.length; i++) {
    const val = parseCSVRow(lines[i])[colIdx]?.replace(/['"]/g, '').trim()
    if (val) values.add(val)
  }
  return values.size > 0 ? Array.from(values).sort() : null
}

// ── Project ────────────────────────────────────────────────

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

  await completeOnboardingStep('create_project')
  void completeRingAction('experiments', 'create_project')
  redirect(`/projects/${row.id}?from=new`)
}

// ── Uploads ────────────────────────────────────────────────

export async function uploadFile(projectId: string, formData: FormData): Promise<UploadResult> {
  const file = formData.get('file') as File | null
  if (!file || file.size === 0) return { success: false, error: 'No file provided' }

  // Schema validation: size + name
  const schemaResult = uploadFileSchema.safeParse({
    mimeType: file.type,
    fileSize: file.size,
    fileName: file.name,
  })
  if (!schemaResult.success) {
    return { success: false, error: schemaResult.error.issues[0].message }
  }

  // MIME type determines file type — server is authoritative
  const mimeType = file.type
  const csvMimes: readonly string[] = ALLOWED_CSV_MIME_TYPES
  const screenshotMimes: readonly string[] = ALLOWED_SCREENSHOT_MIME_TYPES
  const researchMimes: readonly string[] = ALLOWED_USER_RESEARCH_MIME_TYPES

  const isCSV        = csvMimes.includes(mimeType) || file.name.toLowerCase().endsWith('.csv')
  const isScreenshot = screenshotMimes.includes(mimeType)
  const isResearch   = !isCSV && !isScreenshot && researchMimes.includes(mimeType)

  if (!isCSV && !isScreenshot && !isResearch) {
    return {
      success: false,
      error: 'Unsupported file type. Allowed: CSV, PNG, JPEG, WebP, PDF, TXT, MP4, MOV, MP3, M4A',
    }
  }

  const fileType = isCSV ? 'csv' : isScreenshot ? 'screenshot' : 'user_research'

  // Per-type size limits
  const sizeLimit = fileType === 'user_research' ? MAX_USER_RESEARCH_FILE_SIZE_BYTES : MAX_FILE_SIZE_BYTES
  if (file.size > sizeLimit) {
    const mb = sizeLimit / (1024 * 1024)
    return { success: false, error: `File must be under ${mb} MB` }
  }

  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  // Enforce per-project limits
  const { count, error: countError } = await supabase
    .from('uploads')
    .select('*', { count: 'exact', head: true })
    .eq('project_id', projectId)
    .eq('file_type', fileType)

  if (countError) return { success: false, error: countError.message }

  const current = count ?? 0
  if (fileType === 'csv' && current >= MAX_CSV_COUNT) {
    return { success: false, error: 'Only 1 CSV file allowed per project. Delete the existing one first.' }
  }
  if (fileType === 'screenshot' && current >= MAX_SCREENSHOT_COUNT) {
    return { success: false, error: `Maximum ${MAX_SCREENSHOT_COUNT} screenshots per project.` }
  }
  if (fileType === 'user_research' && current >= MAX_USER_RESEARCH_COUNT) {
    return { success: false, error: `Maximum ${MAX_USER_RESEARCH_COUNT} user research files per project.` }
  }

  // Storage path: {userId}/{projectId}/{timestamp}-{filename}
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const storagePath = `${user.id}/${projectId}/${Date.now()}-${safeName}`

  const { error: storageError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(storagePath, file, { contentType: mimeType, upsert: false })

  if (storageError) {
    console.error('[uploadFile] storage error:', storageError)
    return { success: false, error: storageError.message }
  }

  const { error: dbError } = await supabase.from('uploads').insert({
    project_id: projectId,
    user_id: user.id,
    file_name: file.name,
    file_type: fileType,
    mime_type: mimeType,
    file_size_bytes: file.size,
    storage_path: storagePath,
  })

  if (dbError) {
    console.error('[uploadFile] db error:', dbError)
    await supabase.storage.from(STORAGE_BUCKET).remove([storagePath])
    return { success: false, error: dbError.message }
  }

  revalidatePath(`/projects/${projectId}/uploads`)
  void completeOnboardingStep('upload_data')
  void completeRingAction('data', fileType === 'csv' ? 'upload_csv' : 'upload_screenshot')

  // Detect cohort segments in CSV uploads
  if (fileType === 'csv') {
    try {
      const text = await file.text()
      const segments = detectCSVSegments(text)
      if (segments) {
        const { data: inserted } = await supabase
          .from('uploads')
          .select('id')
          .eq('storage_path', storagePath)
          .single()
        if (inserted) {
          return { success: true, segmented: true, uploadId: inserted.id, segments }
        }
      }
    } catch {
      // segment detection is best-effort — fall through
    }
  }

  return { success: true, segmented: false }
}

export async function saveCohortDimension(
  projectId: string,
  uploadId: string,
  dimensionName: string,
  segments: string[],
): Promise<{ success: true } | { success: false; error: string }> {
  if (!dimensionName.trim()) return { success: false, error: 'Dimension name is required' }

  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const { data: dimension, error: dimError } = await supabase
    .from('cohort_dimensions')
    .insert({ project_id: projectId, user_id: user.id, name: dimensionName.trim(), values: segments })
    .select('id')
    .single()

  if (dimError) return { success: false, error: dimError.message }

  const rows = segments.map(seg => ({
    upload_id: uploadId,
    dimension_id: dimension.id,
    segment_value: seg,
  }))

  const { error: cuError } = await supabase.from('cohort_uploads').insert(rows)
  if (cuError) return { success: false, error: cuError.message }

  revalidatePath(`/projects/${projectId}/uploads`)
  return { success: true }
}

export async function deleteUpload(uploadId: string, projectId: string): Promise<{ success: true } | { success: false; error: string }> {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const { data: upload, error: fetchError } = await supabase
    .from('uploads')
    .select('storage_path')
    .eq('id', uploadId)
    .eq('user_id', user.id)
    .single()

  if (fetchError || !upload) return { success: false, error: 'Upload not found' }

  await supabase.storage.from(STORAGE_BUCKET).remove([upload.storage_path])

  const { error } = await supabase.from('uploads').delete().eq('id', uploadId)
  if (error) return { success: false, error: error.message }

  revalidatePath(`/projects/${projectId}/uploads`)
  return { success: true }
}

// ── Project update / delete ─────────────────────────────────

export async function updateProject(
  id: string,
  data: UpdateProjectInput,
): Promise<{ success: true } | { success: false; error: string }> {
  const parsed = updateProjectSchema.safeParse(data)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message }

  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const funnelStages = parsed.data.funnel_stages
    ? parsed.data.funnel_stages.split(',').map(s => s.trim()).filter(Boolean)
    : null

  const { error } = await supabase
    .from('projects')
    .update({
      name: parsed.data.name,
      description: parsed.data.description || null,
      app_url: parsed.data.app_url || null,
      target_audience: parsed.data.target_audience || null,
      funnel_stages: funnelStages,
      primary_metric: parsed.data.primary_metric || null,
      business_goal: parsed.data.business_goal || null,
    })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { success: false, error: error.message }

  revalidatePath(`/projects/${id}`)
  revalidatePath(`/projects/${id}/settings`)
  return { success: true }
}

export async function saveFunnelMapping(
  projectId: string,
  templateId: string,
  stageMappings: Record<string, string>,
): Promise<{ success: true } | { success: false; error: string }> {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  // Verify project ownership
  const { data: project } = await supabase
    .from('projects')
    .select('id')
    .eq('id', projectId)
    .eq('user_id', user.id)
    .single()
  if (!project) return { success: false, error: 'Project not found' }

  const { error } = await supabase
    .from('user_funnel_mappings')
    .upsert({ project_id: projectId, template_id: templateId, stage_mappings: stageMappings },
             { onConflict: 'project_id' })
  if (error) return { success: false, error: error.message }

  revalidatePath(`/projects/${projectId}`)
  return { success: true }
}

export async function deleteProject(
  id: string,
): Promise<{ success: true } | { success: false; error: string }> {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { success: false, error: error.message }

  redirect('/experiments?deleted=1')
}
