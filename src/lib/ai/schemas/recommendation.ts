import { z } from 'zod'

const ScreenshotAnnotationSchema = z.object({
  screenshot_index: z.number().int().min(0),
  x: z.number().min(0).max(100), // % from left edge
  y: z.number().min(0).max(100), // % from top edge
})

export const RecommendationSchema = z.object({
  priority:              z.number().int().min(1).max(5),
  hypothesis:            z.string().min(10),
  experiment_type:       z.enum(['A/B Test', 'Multivariate', 'Feature Flag', 'Holdout', 'Bandit']),
  confidence:            z.number().min(0).max(1),
  evidence:              z.array(z.string()).min(1),
  rationale:             z.string().optional(),
  screenshot_annotation: ScreenshotAnnotationSchema.nullable().optional(),
})

export const AnalysisOutputSchema = z.object({
  recommendations: z.array(RecommendationSchema).min(1).max(10),
  summary:         z.string().optional(),
})

export type ScreenshotAnnotation = z.infer<typeof ScreenshotAnnotationSchema>
export type Recommendation       = z.infer<typeof RecommendationSchema>
export type AnalysisOutput       = z.infer<typeof AnalysisOutputSchema>
