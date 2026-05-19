import { createServerClient } from '@/lib/supabase/server'
import type { SafeIntegration, IntegrationSync } from './types'

export async function getIntegrationsByProject(projectId: string): Promise<SafeIntegration[]> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('integrations')
    .select('id, project_id, user_id, platform, status, last_synced_at, created_at, updated_at')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []) as SafeIntegration[]
}

export async function getIntegrationById(id: string): Promise<SafeIntegration | null> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('integrations')
    .select('id, project_id, user_id, platform, status, last_synced_at, created_at, updated_at')
    .eq('id', id)
    .maybeSingle()
  if (error) return null
  return data as SafeIntegration | null
}

export async function getSyncsByIntegration(integrationId: string): Promise<IntegrationSync[]> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('integration_syncs')
    .select('*')
    .eq('integration_id', integrationId)
    .order('created_at', { ascending: false })
    .limit(5)
  if (error) return []
  return (data ?? []) as IntegrationSync[]
}
