'use server'

import { revalidatePath } from 'next/cache'
import { createServerClient } from '@/lib/supabase/server'
import { platformCredentialSchemas } from './schema'
import type { Platform } from './types'

type ActionResult = { success: true } | { success: false; error: string }

export async function createIntegration(
  projectId: string,
  platform: Platform,
  credentials: Record<string, string>,
): Promise<ActionResult> {
  const schema = platformCredentialSchemas[platform]
  const parsed = schema.safeParse(credentials)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message }

  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const { error } = await supabase.from('integrations').insert({
    project_id: projectId,
    user_id: user.id,
    platform,
    credentials: parsed.data,
    status: 'connected',
  })
  if (error) return { success: false, error: error.message }

  revalidatePath(`/projects/${projectId}/integrations`)
  return { success: true }
}

export async function deleteIntegration(integrationId: string, projectId: string): Promise<ActionResult> {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const { error } = await supabase.from('integrations').delete()
    .eq('id', integrationId).eq('user_id', user.id)
  if (error) return { success: false, error: error.message }

  revalidatePath(`/projects/${projectId}/integrations`)
  return { success: true }
}

export async function validateIntegrationCredentials(
  platform: Platform,
  credentials: Record<string, string>,
): Promise<ActionResult> {
  const schema = platformCredentialSchemas[platform]
  const parsed = schema.safeParse(credentials)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message }

  // For analytics platforms, attempt a lightweight validation call
  const analyticsPlat = ['mixpanel', 'amplitude', 'ga4', 'posthog', 'heap', 'segment', 'pendo'] as const
  type AnalyticsPlatform = typeof analyticsPlat[number]
  const isAnalytics = (analyticsPlat as readonly string[]).includes(platform)

  if (isAnalytics) {
    try {
      const { validateCredentials } = await import(`@/lib/integrations/analytics/${platform === 'ga4' ? 'ga4' : platform}`)
      const valid = await validateCredentials(parsed.data as Record<string, string>)
      if (!valid) return { success: false, error: 'Credentials validation failed — check your keys and try again' }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Validation failed'
      return { success: false, error: message }
    }
  }

  // For file-based platforms (session/document), credentials are always valid (empty)
  const _unused: AnalyticsPlatform | undefined = undefined
  void _unused
  return { success: true }
}

export async function triggerSync(integrationId: string, projectId: string): Promise<ActionResult> {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  // Fetch integration with credentials (server-side only)
  const { data: integration, error: fetchErr } = await supabase
    .from('integrations')
    .select('*')
    .eq('id', integrationId)
    .eq('user_id', user.id)
    .single()
  if (fetchErr || !integration) return { success: false, error: 'Integration not found' }

  // Create sync row
  const { data: syncRow, error: syncErr } = await supabase
    .from('integration_syncs')
    .insert({ integration_id: integrationId, status: 'running' })
    .select('id')
    .single()
  if (syncErr || !syncRow) return { success: false, error: 'Failed to create sync record' }

  try {
    // Dynamic import to keep connectors server-side
    const { runAnalyticsSync } = await import('@/lib/integrations/analytics/runner')
    const result = await runAnalyticsSync(
      integration.platform as string,
      integration.credentials as Record<string, string>,
      projectId,
      user.id,
      supabase,
    )

    await supabase.from('integration_syncs').update({
      status: 'complete',
      rows_fetched: result.rowsFetched,
    }).eq('id', syncRow.id)

    await supabase.from('integrations').update({
      status: 'connected',
      last_synced_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }).eq('id', integrationId)

    revalidatePath(`/projects/${projectId}/integrations`)
    return { success: true }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Sync failed'
    await supabase.from('integration_syncs').update({
      status: 'failed',
      error_message: message,
    }).eq('id', syncRow.id)
    await supabase.from('integrations').update({
      status: 'error',
      updated_at: new Date().toISOString(),
    }).eq('id', integrationId)
    return { success: false, error: message }
  }
}
