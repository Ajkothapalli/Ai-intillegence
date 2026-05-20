import type { NormalisedFunnelData } from './types'
import { IntegrationAuthError, IntegrationRateLimitError, IntegrationNotFoundError } from '@/lib/integrations/errors'

function throwTyped(platform: string, status: number, body: string): never {
  if (status === 401 || status === 403) throw new IntegrationAuthError(platform, status)
  if (status === 429) throw new IntegrationRateLimitError(platform)
  if (status === 404) throw new IntegrationNotFoundError(platform, 'project')
  throw new Error(`${platform} request failed (${status}): ${body.slice(0, 200)}`)
}

interface PostHogCreds {
  api_key: string
  project_id: string
  host: string
}

export async function validateCredentials(creds: Record<string, string>): Promise<boolean> {
  const c = creds as unknown as PostHogCreds
  const host = c.host ?? 'https://app.posthog.com'
  const res = await fetch(`${host}/api/projects/${encodeURIComponent(c.project_id)}/`, {
    headers: { Authorization: `Bearer ${c.api_key}`, Accept: 'application/json' },
    cache: 'no-store',
  })
  if (!res.ok) throwTyped('PostHog', res.status, await res.text())
  return true
}

export async function fetchFunnelData(creds: Record<string, string>): Promise<NormalisedFunnelData> {
  const c = creds as unknown as PostHogCreds
  const host = c.host ?? 'https://app.posthog.com'
  const dateFrom = new Date(Date.now() - 30 * 86400_000).toISOString().slice(0, 10)
  const url = `${host}/api/projects/${encodeURIComponent(c.project_id)}/insights/funnel/`
  const body = JSON.stringify({
    insight: 'FUNNELS',
    date_from: dateFrom,
    events: [
      { id: '$pageview', name: 'Pageview', type: 'events', order: 0 },
      { id: '$autocapture', name: 'Autocapture', type: 'events', order: 1 },
    ],
  })
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${c.api_key}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body,
    cache: 'no-store',
  })
  if (!res.ok) throwTyped('PostHog', res.status, await res.text())
  const json = await res.json() as Array<{ name?: string; count?: number; average_conversion_time?: number }>
  const steps = Array.isArray(json) ? json : []
  const stages = steps.map((s, idx) => ({
    name: s.name ?? `Step ${idx + 1}`,
    users: s.count ?? 0,
    drop_off_rate: idx === 0 ? 0 : (steps[idx - 1].count ?? 0) > 0 ? 1 - (s.count ?? 0) / (steps[idx - 1].count ?? 1) : 0,
    avg_time_seconds: s.average_conversion_time ?? 0,
  }))
  return { stages, fetched_at: new Date().toISOString() }
}
