import type { SupabaseClient } from '@supabase/supabase-js'
import { normalisedFunnelDataToCSV } from '@/lib/integrations/normalise'

type SyncResult = { rowsFetched: number }

const ANALYTICS_PLATFORMS = ['mixpanel', 'amplitude', 'ga4', 'posthog', 'heap', 'segment', 'pendo'] as const
type AnalyticsPlatform = typeof ANALYTICS_PLATFORMS[number]

function isAnalyticsPlatform(platform: string): platform is AnalyticsPlatform {
  return (ANALYTICS_PLATFORMS as readonly string[]).includes(platform)
}

export async function runAnalyticsSync(
  platform: string,
  credentials: Record<string, string>,
  projectId: string,
  userId: string,
  supabase: SupabaseClient,
): Promise<SyncResult> {
  if (!isAnalyticsPlatform(platform)) {
    throw new Error(`Platform "${platform}" does not support analytics sync`)
  }

  // Dynamic import — keeps each connector server-side
  const connector = await import(`./${platform}`) as {
    fetchFunnelData: (creds: Record<string, string>) => Promise<import('./types').NormalisedFunnelData>
  }
  const funnelData = await connector.fetchFunnelData(credentials)
  const csv = normalisedFunnelDataToCSV(funnelData)
  const csvBytes = Buffer.from(csv, 'utf-8')

  const fileName = `${platform}_funnel_${new Date().toISOString().slice(0, 10)}.csv`
  const storagePath = `${userId}/${projectId}/${fileName}`

  // Upload CSV to Supabase Storage
  const { error: storageErr } = await supabase.storage
    .from('uploads')
    .upload(storagePath, csvBytes, {
      contentType: 'text/csv',
      upsert: true,
    })
  if (storageErr) throw new Error(`Storage upload failed: ${storageErr.message}`)

  // Insert upload record
  const { error: dbErr } = await supabase.from('uploads').upsert({
    project_id: projectId,
    user_id: userId,
    file_name: fileName,
    file_type: 'csv',
    mime_type: 'text/csv',
    file_size_bytes: csvBytes.length,
    storage_path: storagePath,
    source: 'integration',
    tool: platform,
  }, { onConflict: 'storage_path' })
  if (dbErr) throw new Error(`DB insert failed: ${dbErr.message}`)

  return { rowsFetched: funnelData.stages.length }
}
