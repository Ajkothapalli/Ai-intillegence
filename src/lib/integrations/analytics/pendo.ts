import type { NormalisedFunnelData } from './types'

interface PendoCreds {
  integration_key: string
}

export async function validateCredentials(creds: Record<string, string>): Promise<boolean> {
  const c = creds as unknown as PendoCreds
  const res = await fetch('https://app.pendo.io/api/v1/feature', {
    headers: { 'x-pendo-integration-key': c.integration_key, Accept: 'application/json' },
    cache: 'no-store',
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Pendo validation failed (${res.status}): ${body.slice(0, 200)}`)
  }
  return true
}

export async function fetchFunnelData(creds: Record<string, string>): Promise<NormalisedFunnelData> {
  const c = creds as unknown as PendoCreds
  const end = Date.now()
  const start = end - 30 * 86400_000
  const url = `https://app.pendo.io/api/v1/aggregation`
  const body = JSON.stringify({
    response: { mimeType: 'application/json' },
    request: {
      pipeline: [
        { source: { events: null } },
        {
          filter: `accountId != null && timestamp >= ${start} && timestamp <= ${end}`,
        },
        { group: { group: ['type'], fields: [{ source: 'count()', as: 'count' }] } },
      ],
    },
  })
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'x-pendo-integration-key': c.integration_key,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body,
    cache: 'no-store',
  })
  if (!res.ok) {
    const resBody = await res.text()
    throw new Error(`Pendo fetch failed (${res.status}): ${resBody.slice(0, 200)}`)
  }
  const json = await res.json() as Array<{ type?: string; count?: number }>
  const steps = Array.isArray(json) ? json : []
  const stages = steps.map((s, idx) => ({
    name: s.type ?? `Event ${idx + 1}`,
    users: s.count ?? 0,
    drop_off_rate: idx === 0 ? 0 : (steps[idx - 1].count ?? 0) > 0 ? 1 - (s.count ?? 0) / (steps[idx - 1].count ?? 1) : 0,
    avg_time_seconds: 0,
  }))
  return { stages, fetched_at: new Date().toISOString() }
}
