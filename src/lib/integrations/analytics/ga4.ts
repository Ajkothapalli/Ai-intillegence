import type { NormalisedFunnelData } from './types'

interface GA4Creds {
  property_id: string
  api_secret: string
}

export async function validateCredentials(creds: Record<string, string>): Promise<boolean> {
  const c = creds as unknown as GA4Creds
  const url = `https://analyticsdata.googleapis.com/v1beta/properties/${encodeURIComponent(c.property_id)}/metadata`
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${c.api_secret}`, Accept: 'application/json' },
    cache: 'no-store',
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`GA4 validation failed (${res.status}): ${body.slice(0, 200)}`)
  }
  return true
}

export async function fetchFunnelData(creds: Record<string, string>): Promise<NormalisedFunnelData> {
  const c = creds as unknown as GA4Creds
  const url = `https://analyticsdata.googleapis.com/v1beta/properties/${encodeURIComponent(c.property_id)}:runFunnelReport`
  const body = JSON.stringify({
    dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
    funnel: {
      steps: [
        { name: 'Session start', hasNextStepCondition: { orGroup: { expressions: [{ eventCondition: { eventName: 'session_start' } }] } } },
        { name: 'First visit',   hasNextStepCondition: { orGroup: { expressions: [{ eventCondition: { eventName: 'first_visit' } }] } } },
        { name: 'Purchase',      hasNextStepCondition: { orGroup: { expressions: [{ eventCondition: { eventName: 'purchase' } }] } } },
      ],
    },
  })
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${c.api_secret}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body,
    cache: 'no-store',
  })
  if (!res.ok) {
    const resBody = await res.text()
    throw new Error(`GA4 fetch failed (${res.status}): ${resBody.slice(0, 200)}`)
  }
  const json = await res.json() as {
    funnelTable?: {
      rows?: Array<{ dimensionValues?: Array<{ value?: string }>; metricValues?: Array<{ value?: string }> }>
    }
  }
  const rows = json.funnelTable?.rows ?? []
  const stages = rows.map((row, idx) => {
    const stepName = row.dimensionValues?.[0]?.value ?? `Step ${idx + 1}`
    const users = parseInt(row.metricValues?.[0]?.value ?? '0', 10)
    const prev = idx > 0 ? parseInt(rows[idx - 1].metricValues?.[0]?.value ?? '0', 10) : users
    return {
      name: stepName,
      users,
      drop_off_rate: idx === 0 ? 0 : prev > 0 ? 1 - users / prev : 0,
      avg_time_seconds: 0,
    }
  })
  return { stages, fetched_at: new Date().toISOString() }
}
