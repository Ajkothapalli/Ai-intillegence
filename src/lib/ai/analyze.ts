import Anthropic from '@anthropic-ai/sdk'
import { SYSTEM_PROMPT } from './prompts/system'
import { parseAnalysisOutput } from './parse'
import type { AnalysisOutput } from './schemas/recommendation'
import type { Project } from '@/features/projects/types'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export type UploadInput = {
  file_name: string
  file_type: 'csv' | 'screenshot'
  content?: string // text content for CSVs only
}

function buildProjectContextBlock(project: Project): string {
  return [
    '## Project Context',
    `Name: ${project.name}`,
    project.description       ? `Description: ${project.description}` : '',
    project.target_audience   ? `Target audience: ${project.target_audience}` : '',
    project.funnel_stages?.length
      ? `Funnel stages: ${project.funnel_stages.join(' → ')}` : '',
    project.primary_metric    ? `Primary metric: ${project.primary_metric}` : '',
    project.business_goal     ? `Business goal: ${project.business_goal}` : '',
  ].filter(Boolean).join('\n')
}

function buildCsvBlock(uploads: UploadInput[]): string | null {
  const csvUploads = uploads.filter(u => u.file_type === 'csv')
  const screenshotUploads = uploads.filter(u => u.file_type === 'screenshot')

  if (csvUploads.length === 0 && screenshotUploads.length === 0) return null

  const parts: string[] = ['## Uploaded Data']

  for (const u of csvUploads) {
    parts.push(
      `### CSV: ${u.file_name}`,
      u.content ?? '(Content unavailable — analyze based on filename and project context)',
    )
  }

  for (const u of screenshotUploads) {
    parts.push(`### Screenshot: ${u.file_name}`)
  }

  return parts.join('\n\n')
}

const TASK_INSTRUCTION = `## Task
Analyze the project context and uploaded data above. Generate prioritized experiment recommendations.

Return ONLY valid JSON — no markdown, no prose outside the JSON object:
{ "recommendations": [...], "summary": "optional overall summary" }`

export async function runAnalysis(
  project: Project,
  uploads: UploadInput[],
  useDeepModel = false,
): Promise<AnalysisOutput> {
  const model = useDeepModel ? 'claude-opus-4-7' : 'claude-sonnet-4-6'

  const contextText = buildProjectContextBlock(project)
  const csvText = buildCsvBlock(uploads)

  // Structured content blocks — cache_control applied per layer:
  // 1. System prompt  — stable across all projects (longest TTL benefit)
  // 2. Project context — stable for the lifetime of the project
  // 3. CSV/upload data — stable until user re-uploads
  // 4. Task instruction — not cached (cheapest, always last)
  type TextBlock = Anthropic.TextBlockParam & { cache_control?: { type: 'ephemeral' } }

  const userContent: TextBlock[] = [
    {
      type: 'text',
      text: contextText,
      cache_control: { type: 'ephemeral' },
    },
  ]

  if (csvText) {
    userContent.push({
      type: 'text',
      text: csvText,
      cache_control: { type: 'ephemeral' },
    })
  }

  userContent.push({ type: 'text', text: TASK_INSTRUCTION })

  const message = await client.messages.create({
    model,
    max_tokens: 4096,
    system: [
      {
        type: 'text',
        text: SYSTEM_PROMPT,
        cache_control: { type: 'ephemeral' },
      },
    ],
    messages: [{ role: 'user', content: userContent }],
  })

  const textBlock = message.content.find(b => b.type === 'text')
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('No text response from AI')
  }

  return parseAnalysisOutput(textBlock.text)
}
