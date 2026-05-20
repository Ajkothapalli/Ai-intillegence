import type { NormalisedFunnelData } from './types'
import { IntegrationAuthError, IntegrationRateLimitError, IntegrationNotFoundError } from '@/lib/integrations/errors'

function throwTyped(status: number, body: string): never {
  if (status === 401 || status === 403) throw new IntegrationAuthError('Heap', status)
  if (status === 429) throw new IntegrationRateLimitError('Heap')
  if (status === 404) throw new IntegrationNotFoundError('Heap', 'app')
  throw new Error(`Heap request failed (${status}): ${body.slice(0, 200)}`)
}

interface HeapCreds {
  app_id: string
  api_key: string
}

export async function validateCredentials(creds: Record<string, string>): Promise<boolean> {
  const c = creds as unknown as HeapCreds
  const res = await fetch(`https://heapanalytics.com/api/account?app_id=${encodeURIComponent(c.app_id)}`, {
    headers: { Authorization: `Bearer ${c.api_key}`, Accept: 'application/json' },
    cache: 'no-store',
  })
  if (!res.ok) throwTyped(res.status, await res.text())
  return true
}

export async function fetchFunnelData(creds: Record<string, string>): Promise<NormalisedFunnelData> {
  const c = creds as unknown as HeapCreds
  const url = `https://heapanalytics.com/api/funnels?app_id=${encodeURIComponent(c.app_id)}`
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${c.api_key}`, Accept: 'application/json' },
    cache: 'no-store',
  })
  if (!res.ok) throwTyped(res.status, await res.text())
  const json = await res.json() as {
    results?: Array<{ label?: string; count?: number; avg_time_to_convert?: number }>
  }
  const steps = json.results ?? []
  const stages = steps.map((s, idx) => ({
    name: s.label ?? `Step ${idx + 1}`,
    users: s.count ?? 0,
    drop_off_rate: idx === 0 ? 0 : (steps[idx - 1].count ?? 0) > 0 ? 1 - (s.count ?? 0) / (steps[idx - 1].count ?? 1) : 0,
    avg_time_seconds: s.avg_time_to_convert ?? 0,
  }))
  return { stages, fetched_at: new Date().toISOString() }
}
