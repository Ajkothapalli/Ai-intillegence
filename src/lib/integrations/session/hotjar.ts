import type { NormalisedSessionData, SessionInsight } from './types'

/**
 * Parse Hotjar survey CSV export.
 * Expected columns: Response ID, Date, [question columns...]
 * Each question column header becomes the location, answers become detail.
 */
export function parseExport(fileContent: string): NormalisedSessionData {
  const lines = fileContent.split(/\r?\n/).filter(Boolean)
  if (lines.length < 2) return { tool: 'hotjar', insights: [] }

  const headers = parseCsvLine(lines[0])
  // Skip first two columns (Response ID, Date)
  const questionHeaders = headers.slice(2)

  // Accumulate answer frequencies per question
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

  const insights: SessionInsight[] = []
  answerCounts.forEach((answers, question) => {
    // Sort by frequency, take top answer as representative detail
    const sorted = [...answers.entries()].sort((a, b) => b[1] - a[1])
    const totalResponses = sorted.reduce((s, [, c]) => s + c, 0)
    if (totalResponses === 0) return
    const topAnswer = sorted[0]
    insights.push({
      type: 'survey_response',
      location: question.slice(0, 100),
      frequency: totalResponses,
      detail: `Top response: "${topAnswer[0].slice(0, 200)}" (${topAnswer[1]} of ${totalResponses} responses)`,
    })
  })

  return { tool: 'hotjar', insights }
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
