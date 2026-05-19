import mammoth from 'mammoth'
import type { ParsedDocument } from './types'

const MAX_CHARS = 50_000

export async function parseDocxBuffer(buffer: Buffer): Promise<ParsedDocument> {
  const result = await mammoth.extractRawText({ buffer })
  const text = result.value.slice(0, MAX_CHARS)
  return {
    type: 'research_context',
    content: text,
    source: 'google_docs',
    detectedFormat: `Research document — ${text.length} chars extracted`,
  }
}
