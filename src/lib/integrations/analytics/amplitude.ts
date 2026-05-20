import type { NormalisedFunnelData } from './types'
import { IntegrationAuthError, IntegrationRateLimitError, IntegrationNotFoundError } from '@/lib/integrations/errors'

function throwTyped(platform: string, status: number, body: string): never {
  if (status === 401 || status === 403) throw new IntegrationAuthError(platform, status)
  if (status === 429) throw new IntegrationRateLimitError(platform)
  if (status === 404) throw new IntegrationNotFoundError(platform, 'resource')
  throw new Error(`${platform} request failed (${status}): ${body.slice(0, 200)}`)
}

interface AmplitudeCreds {
  api_key: string
  secret_key: string
}

function buildAuth(creds: AmplitudeCreds): string {
  const token = Buffer.from(`${creds.api_key}:${creds.secret_key}`).toString('base64')
  return `Basic ${token}`
}

export async function validateCredentials(creds: Record<string, string>): Promise<boolean> {
  const c = creds as unknown as AmplitudeCreds
  const res = await fetch('https://amplitude.com/api/2/events/list', {
    headers: { Authorization: buildAuth(c), Accept: 'application/json' },
    cache: 'no-store',
  })
  if (!res.ok) throwTyped('Amplitude', res.status, await res.text())
  return true
}

export async function fetchFunnelData(creds: Record<string, string>): Promise<NormalisedFunnelData> {
  const c = creds as unknown as AmplitudeCreds
  const end = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const start = new Date(Date.now() - 30 * 86400_000).toISOString().slice(0, 10).replace(/-/g, '')
  const url = `https://amplitude.com/api/2/funnels?start=${start}&end=${end}&interval=1`
  const res = await fetch(url, {
    headers: { Authorization: buildAuth(c), Accept: 'application/json' },
    cache: 'no-store',
  })
  if (!res.ok) throwTyped('Amplitude', res.status, await res.text())
  const json = await res.json() as { data?: Array<{ event_name: string; totals: number; avg_session_time?: number }> }
  const steps = json.data ?? []
  const stages = steps.map((s, idx) => ({
    name: s.event_name,
    users: s.totals,
    drop_off_rate: idx === 0 ? 0 : steps[idx - 1].totals > 0 ? 1 - s.totals / steps[idx - 1].totals : 0,
    avg_time_seconds: s.avg_session_time ?? 0,
  }))
  return { stages, fetched_at: new Date().toISOString() }
}
