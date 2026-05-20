'use server'

import { revalidatePath } from 'next/cache'
import { createServerClient } from '@/lib/supabase/server'
import { CreateSegmentSchema, UpdateSegmentSchema } from './schema'
import type { SegmentSource, SegmentDimensions, ExternalCohort } from './types'
import type { Platform } from '@/features/integrations/types'

type ActionResult = { success: true } | { success: false; error: string }
type CohortsResult =
  | { success: true; cohorts: ExternalCohort[] }
  | { success: false; error: string }
type SyncResult =
  | { success: true; count: number }
  | { success: false; error: string }

export async function createSegment(
  projectId: string,
  data: {
    name: string
    description?: string
    source: SegmentSource
    external_cohort_id?: string
    dimensions: Partial<SegmentDimensions>
    user_count?: number | null
  },
): Promise<ActionResult> {
  const parsed = CreateSegmentSchema.safeParse(data)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message }

  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const { error } = await supabase.from('user_segments').insert({
    project_id:         projectId,
    user_id:            user.id,
    name:               parsed.data.name,
    description:        parsed.data.description ?? null,
    source:             parsed.data.source,
    external_cohort_id: parsed.data.external_cohort_id ?? null,
    dimensions:         parsed.data.dimensions,
    user_count:         parsed.data.user_count ?? null,
    last_synced_at:     parsed.data.source !== 'manual' ? new Date().toISOString() : null,
  })
  if (error) return { success: false, error: error.message }

  revalidatePath(`/projects/${projectId}/segments`)
  return { success: true }
}

export async function updateSegment(
  segmentId: string,
  projectId: string,
  data: {
    name?: string
    description?: string
    dimensions?: Partial<SegmentDimensions>
    user_count?: number | null
  },
): Promise<ActionResult> {
  const parsed = UpdateSegmentSchema.safeParse(data)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message }

  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const { error } = await supabase.from('user_segments')
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq('id', segmentId)
    .eq('user_id', user.id)
  if (error) return { success: false, error: error.message }

  revalidatePath(`/projects/${projectId}/segments`)
  return { success: true }
}

export async function deleteSegment(segmentId: string, projectId: string): Promise<ActionResult> {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const { error } = await supabase.from('user_segments')
    .delete()
    .eq('id', segmentId)
    .eq('user_id', user.id)
  if (error) return { success: false, error: error.message }

  revalidatePath(`/projects/${projectId}/segments`)
  return { success: true }
}

// Fetch cohorts from a specific integration (credentials stay server-side)
export async function fetchCohortsAction(integrationId: string): Promise<CohortsResult> {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const { data: integration } = await supabase
    .from('integrations')
    .select('platform, credentials')
    .eq('id', integrationId)
    .eq('user_id', user.id)
    .single()
  if (!integration) return { success: false, error: 'Integration not found' }

  const COHORT_PLATFORMS = ['mixpanel', 'amplitude', 'ga4', 'posthog', 'heap', 'segment_io', 'pendo']
  const platform = integration.platform as Platform
  const platformKey = platform === 'segment' ? 'segment_io' : platform

  if (!COHORT_PLATFORMS.includes(platformKey)) {
    return { success: false, error: 'This platform does not support cohort pulling' }
  }

  try {
    const { fetchCohorts } = await import('@/lib/integrations/analytics/cohorts')
    const cohorts = await fetchCohorts(
      platformKey as Parameters<typeof fetchCohorts>[0],
      integration.credentials as Record<string, string>,
    )
    return { success: true, cohorts }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to fetch cohorts' }
  }
}

// Sync cohorts from all connected analytics integrations into user_segments
export async function syncSegmentsFromIntegration(projectId: string): Promise<SyncResult> {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const { data: integrations } = await supabase
    .from('integrations')
    .select('id, platform, credentials')
    .eq('project_id', projectId)
    .eq('user_id', user.id)
    .eq('status', 'connected')
  if (!integrations || integrations.length === 0) {
    return { success: false, error: 'No connected integrations found' }
  }

  const { fetchCohorts } = await import('@/lib/integrations/analytics/cohorts')
  const COHORT_PLATFORMS = ['mixpanel', 'posthog']

  let totalCount = 0

  for (const integration of integrations) {
    const platform = integration.platform as Platform
    const platformKey = platform === 'segment' ? 'segment_io' : platform

    if (!COHORT_PLATFORMS.includes(platformKey)) continue

    try {
      const cohorts = await fetchCohorts(
        platformKey as Parameters<typeof fetchCohorts>[0],
        integration.credentials as Record<string, string>,
      )

      for (const cohort of cohorts) {
        await supabase.from('user_segments').upsert(
          {
            project_id:         projectId,
            user_id:            user.id,
            name:               cohort.name,
            description:        cohort.description,
            source:             platformKey as SegmentSource,
            external_cohort_id: cohort.id,
            dimensions:         cohort.dimensions,
            user_count:         cohort.user_count,
            last_synced_at:     new Date().toISOString(),
            updated_at:         new Date().toISOString(),
          },
          { onConflict: 'project_id,source,external_cohort_id', ignoreDuplicates: false },
        )
        totalCount++
      }
    } catch {
      // Skip failed integrations, keep processing others
    }
  }

  revalidatePath(`/projects/${projectId}/segments`)
  return { success: true, count: totalCount }
}
