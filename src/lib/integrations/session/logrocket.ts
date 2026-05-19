import type { NormalisedSessionData, SessionInsight } from './types'

/**
 * Parse LogRocket CSV export.
 * Expected columns: Session ID, User ID, Duration, Rage Clicks, Error Count, Page Path
 */
export function parseExport(fileContent: string): NormalisedSessionData {
  const lines = fileContent.split(/\r?\n/).filter(Boolean)
  if (lines.length < 2) return { tool: 'logrocket', insights: [] }

  const headers = parseCsvLine(lines[0]).map(h => h.toLowerCase().trim())
  const idx = {
    sessionId: headers.indexOf('session id'),
    userId: headers.indexOf('user id'),
    duration: headers.indexOf('duration'),
    rageClicks: headers.indexOf('rage clicks'),
    errorCount: headers.indexOf('error count'),
    pagePath: headers.indexOf('page path'),
  }

  const rageClickPaths = new Map<string, number>()
  const errorPaths = new Map<string, number>()
  const durations: number[] = []

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i])
    const path = idx.pagePath >= 0 ? (cols[idx.pagePath]?.trim() ?? '/') : '/'
    const rageClicks = idx.rageClicks >= 0 ? parseInt(cols[idx.rageClicks] ?? '0', 10) : 0
    const errors = idx.errorCount >= 0 ? parseInt(cols[idx.errorCount] ?? '0', 10) : 0
    const dur = idx.duration >= 0 ? parseFloat(cols[idx.duration] ?? '0') : 0

    if (rageClicks > 0) rageClickPaths.set(path, (rageClickPaths.get(path) ?? 0) + rageClicks)
    if (errors > 0) errorPaths.set(path, (errorPaths.get(path) ?? 0) + errors)
    if (dur > 0) durations.push(dur)
  }

  const insights: SessionInsight[] = []

  // Rage click hotspots
  const sortedRage = [...rageClickPaths.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5)
  sortedRage.forEach(([path, count]) => {
    insights.push({
      type: 'rage_click',
      location: path,
      frequency: count,
      detail: `${count} rage clicks recorded on this path`,
    })
  })

  // Error-heavy paths
  const sortedErrors = [...errorPaths.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5)
  sortedErrors.forEach(([path, count]) => {
    insights.push({
      type: 'error',
      location: path,
      frequency: count,
      detail: `${count} JavaScript errors recorded on this path`,
    })
  })

  // Session duration distribution (drop-off proxy)
  if (durations.length > 0) {
    const avg = durations.reduce((s, d) => s + d, 0) / durations.length
    const short = durations.filter(d => d < 30).length
    const shortPct = ((short / durations.length) * 100).toFixed(0)
    insights.push({
      type: 'drop_off',
      location: 'Overall session',
      frequency: durations.length,
      detail: `Avg session ${avg.toFixed(0)}s across ${durations.length} sessions; ${shortPct}% lasted under 30s`,
    })
  }

  return { tool: 'logrocket', insights }
}

function parseCsvLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { current += '"'; i++ }
      else inQuotes = !inQuotes
    } else if (ch === ',' && !inQuotes) {
      result.push(current)
      current = ''
    } else {
      current += ch
    }
  }
  result.push(current)
  return result
}
