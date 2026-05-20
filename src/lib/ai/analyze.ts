import Anthropic from '@anthropic-ai/sdk'
import * as Sentry from '@sentry/nextjs'
import { SYSTEM_PROMPT } from './prompts/system'
import { parseAnalysisOutput } from './parse'
import { analyseScreenshot } from './vision'
import type { AnalysisOutput, ScreenshotAnalysis } from './schemas/recommendation'
import type { Project } from '@/features/projects/types'
import type { UserSegment } from '@/features/segments/types'
import type { BenchmarkResult } from './benchmarks'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export type FunnelContext = {
  category: string
  stages: string[]
  medians: Record<string, number>
}

export type UploadInput = {
  file_name: string
  file_type: 'csv' | 'screenshot' | 'user_research'
  content?: string
}

export type ScreenshotInput = {
  id: string
  buffer: Buffer
  mimeType: string
}

function buildProjectContextBlock(project: Project): string {
  return [
    '## Project Context',
    `Name: ${project.name}`,
    project.description     ? `Description: ${project.description}` : '',
    project.target_audience ? `Target audience: ${project.target_audience}` : '',
    project.funnel_stages?.length
      ? `Funnel stages: ${project.funnel_stages.join(' → ')}` : '',
    project.primary_metric  ? `Primary metric: ${project.primary_metric}` : '',
    project.business_goal   ? `Business goal: ${project.business_goal}` : '',
  ].filter(Boolean).join('\n')
}

function buildDataBlock(uploads: UploadInput[]): string | null {
  const csvUploads      = uploads.filter(u => u.file_type === 'csv')
  const screenshotCount = uploads.filter(u => u.file_type === 'screenshot').length
  if (csvUploads.length === 0 && screenshotCount === 0) return null
  const parts: string[] = ['## Uploaded Data']
  for (const u of csvUploads) {
    parts.push(`### CSV: ${u.file_name}`, u.content ?? '(Content unavailable)')
  }
  if (screenshotCount > 0) {
    parts.push(`### Screenshots`, `${screenshotCount} screenshot(s) attached as images above. Analyze the visual UI carefully.`)
  }
  return parts.join('\n\n')
}

function formatVisionAnalyses(analyses: Array<{ uploadId: string; analysis: ScreenshotAnalysis }>): string {
  const parts = ['## Pre-Analysis: Vision-Identified UI Elements']
  analyses.forEach(({ uploadId, analysis }, idx) => {
    parts.push(`### Screenshot ${idx} — "${analysis.screen_name}" (screenshot_id: ${uploadId})`)
    parts.push(`Assessment: ${analysis.overall_assessment}`)
    const allElements = [
      ...analysis.friction_elements.map(e => ({ ...e, kind: 'Friction' })),
      ...analysis.trust_elements.map(e => ({ ...e, kind: 'Trust' })),
      ...analysis.clarity_elements.map(e => ({ ...e, kind: 'Clarity' })),
    ]
    for (const el of allElements) {
      parts.push(
        `[${el.kind}][id:${el.id}] "${el.label}" at ${el.location}: ${el.issue}. Currently: ${el.current_state}. Bounds: x=${el.bounding_hint.x}% y=${el.bounding_hint.y}% w=${el.bounding_hint.width}% h=${el.bounding_hint.height}%`
      )
    }
  })
  return parts.join('\n')
}

function buildSegmentBlock(segments: UserSegment[]): string {
  if (segments.length === 0) return ''
  const lines = segments.map(s => {
    const dimParts: string[] = []
    if (s.dimensions.device?.length)              dimParts.push(`Device: ${s.dimensions.device.join(', ')}`)
    if (s.dimensions.acquisition_channel?.length) dimParts.push(`Channel: ${s.dimensions.acquisition_channel.join(', ')}`)
    if (s.dimensions.geography?.length)           dimParts.push(`Geography: ${s.dimensions.geography.join(', ')}`)
    if (s.dimensions.plan_tier?.length)           dimParts.push(`Plan: ${s.dimensions.plan_tier.join(', ')}`)
    if (s.dimensions.behaviour?.length)           dimParts.push(`Behaviour: ${s.dimensions.behaviour.join(', ')}`)
    if (s.dimensions.lifecycle?.length)           dimParts.push(`Lifecycle: ${s.dimensions.lifecycle.join(', ')}`)
    const dimStr = dimParts.length > 0 ? ` — Dimensions: ${dimParts.join(' | ')}` : ''
    const countStr = s.user_count != null ? ` — ${s.user_count.toLocaleString()} users` : ''
    return `- ${s.name}${countStr}${dimStr} [id: ${s.id}]`
  })
  return `## Audience Segments
The following user segments are defined for this product:
${lines.join('\n')}

For each recommendation, specify which segment(s) it is most relevant to and why. Set target_segments to an array of { segment_id, segment_name, relevance_reason } objects. Set estimated_reach to the total user count across targeted segments (null if unknown).`
}

function buildFunnelContextBlock(ctx: FunnelContext): string {
  const lines = [
    `## Industry Funnel Benchmark (${ctx.category} category)`,
    `Canonical funnel: ${ctx.stages.join(' → ')}`,
    '',
    'Industry median conversion rates at each stage transition:',
  ]
  for (const [transition, median] of Object.entries(ctx.medians)) {
    lines.push(`- ${transition}: ${median}% conversion (industry median)`)
  }
  lines.push('', 'Compare the user\'s actual CSV data against these benchmarks. Stages with significantly worse-than-median conversion should be flagged as high-priority experiment targets.')
  return lines.join('\n')
}

function buildTaskInstruction(hasVisionAnalyses: boolean): string {
  const elementInstructions = hasVisionAnalyses ? `
For each recommendation that addresses a specific UI element identified in the vision pre-analysis above:
- Set target_element to the full UIElement object (copy id, label, location, issue, current_state, bounding_hint exactly from above)
- Set screenshot_id to the screenshot_id string shown for that screenshot` : ''
  return `## Task
Analyze the project context, screenshots (if attached), and uploaded data above. Generate prioritized experiment recommendations.

For each recommendation include screenshot_annotation with x/y percentage coordinates if it targets a visible UI area.${elementInstructions}

Always include pm_summary: one plain-English sentence for a PM to share with their team (e.g. "Add a trust badge below the payment button to reduce anxiety at the highest drop-off point in your funnel.").

Return ONLY valid JSON:
{ "recommendations": [...], "summary": "optional overall summary" }`
}

export async function runAnalysis(
  project: Project,
  uploads: UploadInput[],
  useDeepModel = false,
  userResearchSummary?: string,
  screenshotUrls?: string[],
  screenshotInputs?: ScreenshotInput[],
  segments?: UserSegment[],
  funnelContext?: FunnelContext,
  benchmarks?: Map<string, BenchmarkResult>,
): Promise<AnalysisOutput> {
  const model = useDeepModel ? 'claude-opus-4-7' : 'claude-sonnet-4-6'

  // Run vision pre-analysis on each screenshot
  const visionAnalyses: Array<{ uploadId: string; analysis: ScreenshotAnalysis }> = []
  if (screenshotInputs && screenshotInputs.length > 0) {
    await Promise.all(
      screenshotInputs.map(async input => {
        try {
          const analysis = await analyseScreenshot(input.buffer, input.mimeType)
          visionAnalyses.push({ uploadId: input.id, analysis })
        } catch {
          // Skip failed screenshot analyses — don't abort whole analysis
        }
      })
    )
  }

  const contextText = buildProjectContextBlock(project)
  const dataText    = buildDataBlock(uploads)

  type AnyBlock =
    | (Anthropic.TextBlockParam  & { cache_control?: { type: 'ephemeral' } })
    | (Anthropic.ImageBlockParam & { cache_control?: { type: 'ephemeral' } })

  const userContent: AnyBlock[] = [
    { type: 'text', text: contextText, cache_control: { type: 'ephemeral' } },
  ]

  if (visionAnalyses.length > 0) {
    userContent.push({
      type: 'text',
      text: formatVisionAnalyses(visionAnalyses),
      cache_control: { type: 'ephemeral' },
    })
  }

  if (screenshotUrls && screenshotUrls.length > 0) {
    userContent.push({
      type: 'text',
      text: `## Screenshots (${screenshotUrls.length} image${screenshotUrls.length > 1 ? 's' : ''})\nAnalyze each screenshot carefully for UI/UX improvements.`,
    })
    for (const url of screenshotUrls) {
      userContent.push({ type: 'image', source: { type: 'url', url }, cache_control: { type: 'ephemeral' } })
    }
  }

  if (dataText) {
    userContent.push({ type: 'text', text: dataText, cache_control: { type: 'ephemeral' } })
  }

  if (userResearchSummary) {
    userContent.push({ type: 'text', text: `## User Research\n${userResearchSummary}`, cache_control: { type: 'ephemeral' } })
  }

  if (segments && segments.length > 0) {
    const segBlock = buildSegmentBlock(segments)
    if (segBlock) {
      userContent.push({ type: 'text', text: segBlock, cache_control: { type: 'ephemeral' } })
    }
  }

  if (funnelContext) {
    userContent.push({ type: 'text', text: buildFunnelContextBlock(funnelContext), cache_control: { type: 'ephemeral' } })
  }

  if (benchmarks && benchmarks.size > 0) {
    const lines = ['## Experiment Benchmark Data', 'Use these historical benchmarks to calibrate confidence scores:']
    for (const [type, b] of benchmarks) {
      lines.push(`- ${type}: median lift ${b.median_lift_percent.toFixed(1)}%, win rate ${Math.round(b.win_rate * 100)}%, n=${b.sample_size} (range: ${b.p05_lift.toFixed(1)}%–${b.p95_lift.toFixed(1)}%)`)
    }
    userContent.push({ type: 'text', text: lines.join('\n'), cache_control: { type: 'ephemeral' } })
  }

  userContent.push({ type: 'text', text: buildTaskInstruction(visionAnalyses.length > 0) })

  let message: Awaited<ReturnType<typeof client.messages.create>>
  try {
    message = await client.messages.create({
      model,
      max_tokens: 4096,
      system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
      messages: [{ role: 'user', content: userContent as Anthropic.MessageParam['content'] }],
    })
  } catch (err) {
    Sentry.captureException(err, { tags: { model, projectId: project.id } })
    throw err
  }

  const textBlock = message.content.find(b => b.type === 'text')
  if (!textBlock || textBlock.type !== 'text') throw new Error('No text response from AI')

  try {
    return parseAnalysisOutput(textBlock.text)
  } catch (err) {
    Sentry.captureException(err, { tags: { model, projectId: project.id }, extra: { rawResponse: textBlock.text.slice(0, 500) } })
    throw err
  }
}
