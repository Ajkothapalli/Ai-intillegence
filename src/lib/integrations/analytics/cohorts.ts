import type { ExternalCohort, SegmentDimensions } from '@/features/segments/types'

export type CohortPlatform =
  | 'mixpanel' | 'amplitude' | 'ga4' | 'posthog' | 'heap' | 'segment_io' | 'pendo'

// Platforms that support cohort pulling via API
const SUPPORTED_PLATFORMS: CohortPlatform[] = ['mixpanel', 'posthog']

export async function fetchCohorts(
  platform: CohortPlatform,
  credentials: Record<string, string>,
): Promise<ExternalCohort[]> {
  if (!SUPPORTED_PLATFORMS.includes(platform)) return []
  switch (platform) {
    case 'mixpanel': return fetchMixpanelCohorts(credentials)
    case 'posthog':  return fetchPostHogCohorts(credentials)
    default:         return []
  }
}

async function fetchMixpanelCohorts(creds: Record<string, string>): Promise<ExternalCohort[]> {
  const { project_id, service_account_username, service_account_secret } = creds
  if (!project_id || !service_account_username || !service_account_secret) return []

  const token = Buffer.from(`${service_account_username}:${service_account_secret}`).toString('base64')
  const res = await fetch(
    `https://mixpanel.com/api/2.0/cohorts/list?project_id=${encodeURIComponent(project_id)}`,
    {
      headers: { Authorization: `Basic ${token}`, Accept: 'application/json' },
      next: { revalidate: 3600 },
    },
  )
  if (!res.ok) return []

  type MixpanelCohort = { id: number; name: string; count: number; description?: string }
  const json = await res.json() as { results?: MixpanelCohort[] }
  return (json.results ?? []).map(c => ({
    id:          String(c.id),
    name:        c.name,
    user_count:  c.count ?? null,
    description: c.description ?? null,
    dimensions:  {} satisfies Partial<SegmentDimensions>,
  }))
}

async function fetchPostHogCohorts(creds: Record<string, string>): Promise<ExternalCohort[]> {
  const { api_key, project_id, host } = creds
  if (!api_key || !project_id) return []

  const base = host ?? 'https://app.posthog.com'
  const res = await fetch(
    `${base}/api/projects/${encodeURIComponent(project_id)}/cohorts/`,
    {
      headers: { Authorization: `Bearer ${api_key}`, Accept: 'application/json' },
      next: { revalidate: 3600 },
    },
  )
  if (!res.ok) return []

  type PostHogCohort = { id: number; name: string; count?: number; description?: string }
  const json = await res.json() as { results?: PostHogCohort[] }
  return (json.results ?? []).map(c => ({
    id:          String(c.id),
    name:        c.name,
    user_count:  c.count ?? null,
    description: c.description ?? null,
    dimensions:  {} satisfies Partial<SegmentDimensions>,
  }))
}
