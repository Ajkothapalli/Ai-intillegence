import { z } from 'zod'

export const RecommendationSchema = z.object({
  priority:        z.number().int().min(1).max(5),
  hypothesis:      z.string().min(10),
  experiment_type: z.enum(['A/B Test', 'Multivariate', 'Feature Flag', 'Holdout', 'Bandit']),
  confidence:      z.number().min(0).max(1),
  evidence:        z.array(z.string()).min(1),
  rationale:       z.string().optional(),
})

export const AnalysisOutputSchema = z.object({
  recommendations: z.array(RecommendationSchema).min(1).max(10),
  summary:         z.string().optional(),
})

export type Recommendation  = z.infer<typeof RecommendationSchema>
export type AnalysisOutput  = z.infer<typeof AnalysisOutputSchema>
