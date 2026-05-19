import * as XLSX from 'xlsx'
import type { ParsedDocument } from './types'

const MAX_CHARS = 50_000
const FUNNEL_KEYWORDS = ['stage', 'step', 'drop', 'funnel', 'conversion', 'users', 'sessions', 'visits']

function looksLikeFunnelData(headers: string[]): boolean {
  const lower = headers.map(h => h.toLowerCase())
  return FUNNEL_KEYWORDS.some(kw => lower.some(h => h.includes(kw)))
}

export function parseGoogleSheetsBuffer(buffer: Buffer): ParsedDocument {
  const workbook = XLSX.read(buffer, { type: 'buffer' })
  const sheetName = workbook.SheetNames[0]
  if (!sheetName) return { type: 'research_context', content: '', source: 'google_sheets' }

  const sheet = workbook.Sheets[sheetName]
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' })

  if (rows.length === 0) return { type: 'research_context', content: '', source: 'google_sheets' }

  const headers = Object.keys(rows[0])
  const isFunnel = looksLikeFunnelData(headers)

  const csv = XLSX.utils.sheet_to_csv(sheet)
  const truncated = csv.slice(0, MAX_CHARS)

  return {
    type: isFunnel ? 'funnel_data' : 'research_context',
    content: truncated,
    source: 'google_sheets',
    detectedFormat: isFunnel
      ? `Funnel data — ${rows.length} rows found`
      : `Research context — ${rows.length} rows found`,
  }
}
