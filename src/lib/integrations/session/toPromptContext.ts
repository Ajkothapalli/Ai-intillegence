import type { NormalisedSessionData } from './types'

export function sessionDataToPromptContext(data: NormalisedSessionData): string {
  return `Session tool insights from ${data.tool}:\n` +
    data.insights.map(i => `- [${i.type}] ${i.location}: ${i.detail} (${i.frequency} occurrences)`).join('\n')
}
