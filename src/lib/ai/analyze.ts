import Anthropic from '@anthropic-ai/sdk'
import { SYSTEM_PROMPT } from './prompts/system'
import { parseAnalysisOutput } from './parse'
import type { AnalysisOutput } from './schemas/recommendation'
import type { Project } from '@/features/projects/types'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export type UploadInput = {
  file_name: string
  file_type: 'csv' | 'screenshot' | 'user_research'
  content?: string // text content for CSVs and readable user_research files
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

function buildDataBlock(uploads: UploadInput[]): string | null {
  const csvUploads      = uploads.filter(u => u.file_type === 'csv')
  const screenshotCount = uploads.filter(u => u.file_type === 'screenshot').length

  if (csvUploads.length === 0 && screenshotCount === 0) return null

  const parts: string[] = ['## Uploaded Data']

  for (const u of csvUploads) {
    parts.push(
      `### CSV: ${u.file_name}`,
      u.content ?? '(Content unavailable — analyze based on filename and project context)',
    )
  }

  if (screenshotCount > 0) {
    parts.push(
      `### Screenshots`,
      `${screenshotCount} screenshot(s) attached as images above. Analyze the visual UI carefully.`,
    )
  }

  return parts.join('\n\n')
}

const TASK_INSTRUCTION = `## Task
Analyze the project context, screenshots (if attached), and uploaded data above. Generate prioritized experiment recommendations.

For each recommendation that targets a visible UI area in a screenshot, include screenshot_annotation with the exact x/y percentage coordinates pointing to where the new/changed element should appear.

Return ONLY valid JSON — no markdown, no prose outside the JSON object:
{ "recommendations": [...], "summary": "optional overall summary" }`

export async function runAnalysis(
  project: Project,
  uploads: UploadInput[],
  useDeepModel = false,
  userResearchSummary?: string,
  screenshotUrls?: string[],
): Promise<AnalysisOutput> {
  const model = useDeepModel ? 'claude-opus-4-7' : 'claude-sonnet-4-6'

  const contextText = buildProjectContextBlock(project)
  const dataText    = buildDataBlock(uploads)

  // Content block type that accepts both text and image blocks with cache_control
  type AnyBlock =
    | (Anthropic.TextBlockParam  & { cache_control?: { type: 'ephemeral' } })
    | (Anthropic.ImageBlockParam & { cache_control?: { type: 'ephemeral' } })

  const userContent: AnyBlock[] = [
    {
      type: 'text',
      text: contextText,
      cache_control: { type: 'ephemeral' },
    },
  ]

  // Inject screenshot images so Claude can visually analyze the UI
  if (screenshotUrls && screenshotUrls.length > 0) {
    userContent.push({
      type: 'text',
      text: `## Screenshots (${screenshotUrls.length} image${screenshotUrls.length > 1 ? 's' : ''})\nAnalyze each screenshot carefully for UI/UX improvements. Screenshots are numbered 0–${screenshotUrls.length - 1}.`,
    })
    for (const url of screenshotUrls) {
      userContent.push({
        type: 'image',
        source: { type: 'url', url },
        cache_control: { type: 'ephemeral' },
      })
    }
  }

  if (dataText) {
    userContent.push({
      type: 'text',
      text: dataText,
      cache_control: { type: 'ephemeral' },
    })
  }

  if (userResearchSummary) {
    userContent.push({
      type: 'text',
      text: `## User Research\n${userResearchSummary}`,
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
    messages: [{ role: 'user', content: userContent as Anthropic.MessageParam['content'] }],
  })

  const textBlock = message.content.find(b => b.type === 'text')
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('No text response from AI')
  }

  return parseAnalysisOutput(textBlock.text)
}
