import type { NormalisedFunnelData } from './types'

interface MixpanelCreds {
  project_id: string
  service_account_username: string
  service_account_secret: string
}

function buildAuth(creds: MixpanelCreds): string {
  const token = Buffer.from(`${creds.service_account_username}:${creds.service_account_secret}`).toString('base64')
  return `Basic ${token}`
}

export async function validateCredentials(creds: Record<string, string>): Promise<boolean> {
  const c = creds as unknown as MixpanelCreds
  const res = await fetch(
    `https://mixpanel.com/api/2.0/engage?project_id=${encodeURIComponent(c.project_id)}&limit=1`,
    { headers: { Authorization: buildAuth(c), Accept: 'application/json' }, cache: 'no-store' },
  )
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Mixpanel validation failed (${res.status}): ${body.slice(0, 200)}`)
  }
  return true
}

export async function fetchFunnelData(creds: Record<string, string>): Promise<NormalisedFunnelData> {
  const c = creds as unknown as MixpanelCreds
  const to = new Date().toISOString().slice(0, 10)
  const from = new Date(Date.now() - 30 * 86400_000).toISOString().slice(0, 10)
  const url = `https://mixpanel.com/api/2.0/funnels?project_id=${encodeURIComponent(c.project_id)}&from_date=${from}&to_date=${to}&unit=day`
  const res = await fetch(url, {
    headers: { Authorization: buildAuth(c), Accept: 'application/json' },
    cache: 'no-store',
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Mixpanel fetch failed (${res.status}): ${body.slice(0, 200)}`)
  }
  const json = await res.json() as { data?: { steps?: Array<{ event: string; count: number; avg_time?: number }> } }
  const steps = json.data?.steps ?? []
  const stages = steps.map((s, idx) => ({
    name: s.event,
    users: s.count,
    drop_off_rate: idx === 0 ? 0 : steps[idx - 1].count > 0 ? 1 - s.count / steps[idx - 1].count : 0,
    avg_time_seconds: s.avg_time ?? 0,
  }))
  return { stages, fetched_at: new Date().toISOString() }
}
