/**
 * Client-side CSV preview utility for session tool exports.
 * Does NOT import server-only packages (xlsx, mammoth, etc).
 */

interface InsightPreview {
  type: string
  location: string
  detail: string
  frequency: number
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

function parseHotjarPreview(content: string): InsightPreview[] {
  const lines = content.split(/\r?\n/).filter(Boolean)
  if (lines.length < 2) return []
  const headers = parseCsvLine(lines[0])
  const questionHeaders = headers.slice(2)
  const answerCounts = new Map<string, Map<string, number>>()
  questionHeaders.forEach(q => answerCounts.set(q, new Map()))
  for (let i = 1; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i])
    questionHeaders.forEach((q, idx) => {
      const answer = cols[idx + 2]?.trim()
      if (!answer) return
      const qMap = answerCounts.get(q)!
      qMap.set(answer, (qMap.get(answer) ?? 0) + 1)
    })
  }
  const insights: InsightPreview[] = []
  answerCounts.forEach((answers, question) => {
    const sorted = [...answers.entries()].sort((a, b) => b[1] - a[1])
    const total = sorted.reduce((s, [, c]) => s + c, 0)
    if (total === 0) return
    const top = sorted[0]
    insights.push({
      type: 'survey_response',
      location: question.slice(0, 100),
      frequency: total,
      detail: `Top response: "${top[0].slice(0, 200)}" (${top[1]} of ${total} responses)`,
    })
  })
  return insights
}

function parseLogRocketPreview(content: string): InsightPreview[] {
  const lines = content.split(/\r?\n/).filter(Boolean)
  if (lines.length < 2) return []
  const headers = parseCsvLine(lines[0]).map(h => h.toLowerCase().trim())
  const rageIdx = headers.indexOf('rage clicks')
  const errorIdx = headers.indexOf('error count')
  const pathIdx = headers.indexOf('page path')
  const durIdx = headers.indexOf('duration')
  const rageClickPaths = new Map<string, number>()
  const errorPaths = new Map<string, number>()
  const durations: number[] = []
  for (let i = 1; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i])
    const path = pathIdx >= 0 ? (cols[pathIdx]?.trim() ?? '/') : '/'
    const rageClicks = rageIdx >= 0 ? parseInt(cols[rageIdx] ?? '0', 10) : 0
    const errors = errorIdx >= 0 ? parseInt(cols[errorIdx] ?? '0', 10) : 0
    const dur = durIdx >= 0 ? parseFloat(cols[durIdx] ?? '0') : 0
    if (rageClicks > 0) rageClickPaths.set(path, (rageClickPaths.get(path) ?? 0) + rageClicks)
    if (errors > 0) errorPaths.set(path, (errorPaths.get(path) ?? 0) + errors)
    if (dur > 0) durations.push(dur)
  }
  const insights: InsightPreview[] = []
  const sortedRage = [...rageClickPaths.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3)
  sortedRage.forEach(([path, count]) => {
    insights.push({ type: 'rage_click', location: path, frequency: count, detail: `${count} rage clicks` })
  })
  const sortedErrors = [...errorPaths.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3)
  sortedErrors.forEach(([path, count]) => {
    insights.push({ type: 'error', location: path, frequency: count, detail: `${count} JS errors` })
  })
  if (durations.length > 0) {
    const avg = durations.reduce((s, d) => s + d, 0) / durations.length
    insights.push({
      type: 'drop_off',
      location: 'Overall session',
      frequency: durations.length,
      detail: `Avg session ${avg.toFixed(0)}s across ${durations.length} sessions`,
    })
  }
  return insights
}

export function parseInsightsClientSide(platform: string, content: string): InsightPreview[] {
  if (platform === 'hotjar') return parseHotjarPreview(content)
  if (platform === 'logrocket') return parseLogRocketPreview(content)
  return []
}
