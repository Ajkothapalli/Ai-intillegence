import type { NormalisedFunnelData } from './analytics/types'

export function normalisedFunnelDataToCSV(data: NormalisedFunnelData): string {
  const header = 'stage,users,drop_off_rate,avg_time_seconds'
  const rows = data.stages.map(s =>
    `${s.name},${s.users},${s.drop_off_rate.toFixed(4)},${s.avg_time_seconds}`
  )
  return [header, ...rows].join('\n')
}
