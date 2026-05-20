import Anthropic from '@anthropic-ai/sdk'
import { ScreenshotAnalysisSchema } from './schemas/recommendation'
import type { ScreenshotAnalysis } from './schemas/recommendation'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SUPPORTED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'] as const
type SupportedMime = (typeof SUPPORTED_MIME_TYPES)[number]

function isSupportedMime(mime: string): mime is SupportedMime {
  return (SUPPORTED_MIME_TYPES as readonly string[]).includes(mime)
}

const VISION_SYSTEM = `You are a conversion optimisation expert analysing a product screen. Identify specific UI elements causing friction, reducing trust, or creating confusion. Use plain PM language — no design jargon.

Return ONLY valid JSON:
{
  "screen_name": "descriptive name of this screen",
  "overall_assessment": "2 sentences max in PM language",
  "friction_elements": [{ "id": "friction-1", "label": "Primary CTA button", "location": "top|middle|bottom|top-left|top-right|bottom-left|bottom-right|center", "issue": "why users hesitate or drop off here (PM language)", "current_state": "what it looks like now", "bounding_hint": { "x": 0, "y": 0, "width": 0, "height": 0 } }],
  "trust_elements": [{ ...same shape as above... }],
  "clarity_elements": [{ ...same shape as above... }]
}
bounding_hint x, y, width, height are percentages of image dimensions (0–100).`

export async function analyseScreenshot(
  imageBuffer: Buffer,
  mimeType: string,
): Promise<ScreenshotAnalysis> {
  const safeMime = isSupportedMime(mimeType) ? mimeType : 'image/png'

  type ImageBlock = Anthropic.ImageBlockParam & { cache_control?: { type: 'ephemeral' } }
  const imageBlock: ImageBlock = {
    type: 'image',
    source: {
      type: 'base64',
      media_type: safeMime,
      data: imageBuffer.toString('base64'),
    },
    cache_control: { type: 'ephemeral' },
  }

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    system: VISION_SYSTEM,
    messages: [
      {
        role: 'user',
        content: [
          imageBlock,
          { type: 'text', text: 'Analyse this product screen and return the JSON.' },
        ] as Anthropic.MessageParam['content'],
      },
    ],
  })

  const textBlock = message.content.find(b => b.type === 'text')
  if (!textBlock || textBlock.type !== 'text') throw new Error('No text response from vision analysis')

  const raw = textBlock.text.trim()
  const jsonStart = raw.indexOf('{')
  const jsonEnd = raw.lastIndexOf('}')
  if (jsonStart === -1 || jsonEnd === -1) throw new Error('No JSON in vision response')

  const parsed: unknown = JSON.parse(raw.slice(jsonStart, jsonEnd + 1))
  return ScreenshotAnalysisSchema.parse(parsed)
}
