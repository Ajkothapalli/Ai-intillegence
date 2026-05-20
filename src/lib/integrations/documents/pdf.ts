import type { ParsedDocument } from './types'

/**
 * PDFs are stored as-is and passed to the AI via vision capabilities.
 * No text extraction happens here — the AI reads the PDF directly.
 */
export function passThroughPdf(fileName: string): ParsedDocument {
  return {
    type: 'research_context',
    content: `(PDF file: ${fileName} — text extraction handled by AI vision at analysis time)`,
    source: 'pdf',
    detectedFormat: 'PDF — passed to AI for vision-based reading',
  }
}
