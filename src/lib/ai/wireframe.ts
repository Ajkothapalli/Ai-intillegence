import Anthropic from '@anthropic-ai/sdk'
import type { UIElement } from './schemas/recommendation'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export type WireframeOutput = {
  html: string
  description: string
}

const WIREFRAME_SYSTEM = `You are a UI engineer. Generate a self-contained HTML snippet showing a proposed UI change. Use Tailwind CSS CDN. Use Inter font from Google Fonts. Accent colour: violet-600. Match a clean, modern SaaS product UI. Output ONLY the HTML — no explanation, no markdown fences, no comments outside the HTML.`

function sanitiseHtml(raw: string): string {
  return raw
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/\s+on\w+="[^"]*"/g, '')
    .replace(/\s+on\w+='[^']*'/g, '')
    .replace(/\s+on\w+=(?:"[^"]*"|'[^']*'|[^\s>]+)/g, '')
    .replace(/javascript:/gi, '')
}

export async function generateWireframe(
  recommendation: { hypothesis: string; experiment_type: string; rationale: string | null },
  targetElement: UIElement | null,
  projectContext: { name: string; description: string | null },
): Promise<WireframeOutput> {
  const elementContext = targetElement
    ? `Target UI element: "${targetElement.label}" at ${targetElement.location}. Currently: ${targetElement.current_state}. Issue: ${targetElement.issue}.`
    : 'No specific UI element identified — show the proposed change in context.'

  const userPrompt = `Project: ${projectContext.name}${projectContext.description ? ` — ${projectContext.description}` : ''}

Recommendation: ${recommendation.hypothesis}
Experiment type: ${recommendation.experiment_type}
${recommendation.rationale ? `Rationale: ${recommendation.rationale}` : ''}

${elementContext}

Generate a clean HTML wireframe showing what the PROPOSED new design looks like after implementing this recommendation. Include a label at the top: "Proposed design — for reference only, not final". Use Tailwind CDN classes. Make it look like a real SaaS UI component.`

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    system: WIREFRAME_SYSTEM,
    messages: [{ role: 'user', content: userPrompt }],
  })

  const textBlock = message.content.find(b => b.type === 'text')
  if (!textBlock || textBlock.type !== 'text') throw new Error('No wireframe response')

  const rawHtml = textBlock.text.trim()
  const html = sanitiseHtml(rawHtml)

  const description = `Proposed design for: ${recommendation.hypothesis.slice(0, 100)}${recommendation.hypothesis.length > 100 ? '…' : ''}`

  return { html, description }
}
