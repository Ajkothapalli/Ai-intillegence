import * as XLSX from 'xlsx'
import type { ParsedDocument } from './types'

const MAX_CHARS = 50_000

/**
 * Extract text from .pptx files using xlsx (pptx is a zip with XML).
 */
export function parsePowerPointBuffer(buffer: Buffer): ParsedDocument {
  const zip = XLSX.read(buffer, { type: 'buffer' })
  const slideKeys = Object.keys(zip.Sheets).filter(k => k.startsWith('ppt/slides/slide'))

  if (slideKeys.length === 0) {
    const sheetName = zip.SheetNames[0]
    if (sheetName) {
      const text = XLSX.utils.sheet_to_csv(zip.Sheets[sheetName]).slice(0, MAX_CHARS)
      return { type: 'research_context', content: text, source: 'powerpoint', detectedFormat: 'Presentation (fallback)' }
    }
    return { type: 'research_context', content: '', source: 'powerpoint', detectedFormat: 'Empty presentation' }
  }

  const textParts: string[] = []
  for (const key of slideKeys) {
    const sheet = zip.Sheets[key]
    if (!sheet) continue
    const csv = XLSX.utils.sheet_to_csv(sheet)
    textParts.push(csv)
  }

  const combined = textParts.join('\n\n').slice(0, MAX_CHARS)
  return {
    type: 'research_context',
    content: combined,
    source: 'powerpoint',
    detectedFormat: `Presentation — ${slideKeys.length} slides extracted`,
  }
}
