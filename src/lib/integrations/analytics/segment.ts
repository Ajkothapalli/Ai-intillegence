import type { NormalisedFunnelData } from './types'
import { IntegrationAuthError, IntegrationRateLimitError, IntegrationNotFoundError } from '@/lib/integrations/errors'

function throwTyped(status: number, body: string): never {
  if (status === 401 || status === 403) throw new IntegrationAuthError('Segment', status)
  if (status === 429) throw new IntegrationRateLimitError('Segment')
  if (status === 404) throw new IntegrationNotFoundError('Segment', 'workspace')
  throw new Error(`Segment request failed (${status}): ${body.slice(0, 200)}`)
}

interface SegmentCreds {
  workspace_slug: string
  access_token: string
}

export async function validateCredentials(creds: Record<string, string>): Promise<boolean> {
  const c = creds as unknown as SegmentCreds
  const res = await fetch(`https://platform.segmentapis.com/v1beta/workspaces/${encodeURIComponent(c.workspace_slug)}`, {
    headers: { Authorization: `Bearer ${c.access_token}`, Accept: 'application/json' },
    cache: 'no-store',
  })
  if (!res.ok) throwTyped(res.status, await res.text())
  return true
}

export async function fetchFunnelData(creds: Record<string, string>): Promise<NormalisedFunnelData> {
  const c = creds as unknown as SegmentCreds
  const url = `https://platform.segmentapis.com/v1beta/workspaces/${encodeURIComponent(c.workspace_slug)}/tracking-plans`
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${c.access_token}`, Accept: 'application/json' },
    cache: 'no-store',
  })
  if (!res.ok) throwTyped(res.status, await res.text())
  // Segment doesn't have a native funnel API — return event plan as stages
  const json = await res.json() as {
    tracking_plans?: Array<{ display_name?: string }>
  }
  const plans = json.tracking_plans ?? []
  const stages = plans.map((p, idx) => ({
    name: p.display_name ?? `Event ${idx + 1}`,
    users: 0,
    drop_off_rate: 0,
    avg_time_seconds: 0,
  }))
  return { stages, fetched_at: new Date().toISOString() }
}
