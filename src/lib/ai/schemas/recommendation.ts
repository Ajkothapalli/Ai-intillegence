import { z } from 'zod'

const ScreenshotAnnotationSchema = z.object({
  screenshot_index: z.number().int().min(0),
  x: z.number().min(0).max(100),
  y: z.number().min(0).max(100),
})

export const UIElementSchema = z.object({
  id: z.string(),
  label: z.string(),
  location: z.enum(['top', 'middle', 'bottom', 'top-left', 'top-right', 'bottom-left', 'bottom-right', 'center']),
  issue: z.string(),
  current_state: z.string(),
  bounding_hint: z.object({
    x: z.number().min(0).max(100),
    y: z.number().min(0).max(100),
    width: z.number().min(0).max(100),
    height: z.number().min(0).max(100),
  }),
})

export const ScreenshotAnalysisSchema = z.object({
  screen_name: z.string(),
  overall_assessment: z.string(),
  friction_elements: z.array(UIElementSchema),
  trust_elements: z.array(UIElementSchema),
  clarity_elements: z.array(UIElementSchema),
})

const TargetSegmentSchema = z.object({
  segment_id:       z.string(),
  segment_name:     z.string(),
  relevance_reason: z.string(),
})

export const RecommendationSchema = z.object({
  priority:              z.number().int().min(1).max(5),
  hypothesis:            z.string().min(10),
  experiment_type:       z.enum(['A/B Test', 'Multivariate', 'Feature Flag', 'Holdout', 'Bandit']),
  confidence:            z.number().min(0).max(1),
  evidence:              z.array(z.string()).min(1),
  rationale:             z.string().optional(),
  screenshot_annotation: ScreenshotAnnotationSchema.nullable().optional(),
  target_element:        UIElementSchema.nullable().optional(),
  screenshot_id:         z.string().nullable().optional(),
  pm_summary:            z.string().nullable().optional(),
  target_segments:       z.array(TargetSegmentSchema).optional(),
  estimated_reach:       z.number().int().nullable().optional(),
})

export const AnalysisOutputSchema = z.object({
  recommendations: z.array(RecommendationSchema).min(1).max(10),
  summary:         z.string().optional(),
})

export type ScreenshotAnnotation = z.infer<typeof ScreenshotAnnotationSchema>
export type UIElement            = z.infer<typeof UIElementSchema>
export type ScreenshotAnalysis   = z.infer<typeof ScreenshotAnalysisSchema>
export type Recommendation       = z.infer<typeof RecommendationSchema>
export type AnalysisOutput       = z.infer<typeof AnalysisOutputSchema>
