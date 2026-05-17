import Anthropic from '@anthropic-ai/sdk'
import { SYSTEM_PROMPT } from './prompts/system'
import { buildAnalysisPrompt } from './prompts/analysis'
import { parseAnalysisOutput } from './parse'
import type { AnalysisOutput } from './schemas'
import type { Project } from '@/features/projects/types'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

type Upload = {
  file_name: string
  file_type: 'csv' | 'screenshot'
  content?: string
}

export async function runAnalysis(
  project: Project,
  uploads: Upload[],
  useDeepModel = false
): Promise<AnalysisOutput> {
  const model = useDeepModel ? 'claude-opus-4-7' : 'claude-sonnet-4-6'
  const userPrompt = buildAnalysisPrompt(project, uploads)

  const message = await client.messages.create({
    model,
    max_tokens: 4096,
    system: [
      {
        type: 'text',
        text: SYSTEM_PROMPT,
        // Prompt caching for the stable system prompt
        cache_control: { type: 'ephemeral' },
      },
    ],
    messages: [
      {
        role: 'user',
        content: userPrompt,
      },
    ],
  })

  const textBlock = message.content.find(b => b.type === 'text')
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('No text response from AI')
  }

  return parseAnalysisOutput(textBlock.text)
}
