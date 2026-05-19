import type { ParsedDocument } from './types'

type DocumentPlatform =
  | 'google_sheets' | 'excel'
  | 'google_docs' | 'word'
  | 'google_slides' | 'powerpoint'
  | 'pdf'

export async function detectAndParse(
  platform: DocumentPlatform,
  buffer: Buffer,
  fileName: string,
): Promise<ParsedDocument> {
  switch (platform) {
    case 'google_sheets': {
      const { parseGoogleSheetsBuffer } = await import('./sheets')
      return parseGoogleSheetsBuffer(buffer)
    }
    case 'excel': {
      const { parseExcelBuffer } = await import('./excel')
      return parseExcelBuffer(buffer)
    }
    case 'google_docs': {
      const { parseDocxBuffer } = await import('./docs')
      return parseDocxBuffer(buffer)
    }
    case 'word': {
      const { parseWordBuffer } = await import('./word')
      return parseWordBuffer(buffer)
    }
    case 'google_slides': {
      const { parseSlidesBuffer } = await import('./slides')
      return parseSlidesBuffer(buffer)
    }
    case 'powerpoint': {
      const { parsePowerPointBuffer } = await import('./powerpoint')
      return parsePowerPointBuffer(buffer)
    }
    case 'pdf': {
      const { passThroughPdf } = await import('./pdf')
      return passThroughPdf(fileName)
    }
    default: {
      const exhaustive: never = platform
      throw new Error(`Unknown document platform: ${String(exhaustive)}`)
    }
  }
}

export type { ParsedDocument }
