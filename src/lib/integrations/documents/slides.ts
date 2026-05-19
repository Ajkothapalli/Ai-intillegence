import * as XLSX from 'xlsx'
import type { ParsedDocument } from './types'

const MAX_CHARS = 50_000

/**
 * Extract text from .pptx files using xlsx (pptx is a zip with XML).
 * Extracts slide text content from slide XML nodes.
 */
export function parseSlidesBuffer(buffer: Buffer): ParsedDocument {
  const zip = XLSX.read(buffer, { type: 'buffer' })
  const slideKeys = Object.keys(zip.Sheets).filter(k => k.startsWith('ppt/slides/slide'))

  if (slideKeys.length === 0) {
    // Fallback: try as spreadsheet
    const sheetName = zip.SheetNames[0]
    if (sheetName) {
      const text = XLSX.utils.sheet_to_csv(zip.Sheets[sheetName]).slice(0, MAX_CHARS)
      return { type: 'research_context', content: text, source: 'google_slides', detectedFormat: 'Slide deck (spreadsheet fallback)' }
    }
    return { type: 'research_context', content: '', source: 'google_slides', detectedFormat: 'Empty slide deck' }
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
    source: 'google_slides',
    detectedFormat: `Slide deck — ${slideKeys.length} slides extracted`,
  }
}
