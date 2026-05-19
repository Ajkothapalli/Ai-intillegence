import type { ParsedDocument } from './types'

/**
 * PDFs are stored as-is and passed to Claude via vision capabilities.
 * No text extraction happens here — Claude reads the PDF directly.
 */
export function passThroughPdf(fileName: string): ParsedDocument {
  return {
    type: 'research_context',
    content: `(PDF file: ${fileName} — text extraction handled by Claude vision at analysis time)`,
    source: 'pdf',
    detectedFormat: 'PDF — passed to Claude for vision-based reading',
  }
}
