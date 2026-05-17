# AI Engine Design

## Architecture

```
src/lib/ai/
  analyze.ts          # main entry: orchestrates the full analysis
  prompts/
    system.ts         # system prompt (cached)
    analysis.ts       # analysis user prompt template
  schemas/
    recommendation.ts # Zod schemas for AI output
  parse.ts            # validates and transforms raw AI output
```

## Analysis Flow
1. Load project context (name, goal, funnel stages, primary metric)
2. Load CSV data (funnel drop-off stats)
3. Load screenshot descriptions (from vision analysis)
4. Build prompt with all context
5. Call Claude API (claude-sonnet-4-6)
6. Parse + validate output against Zod schema
7. Persist recommendations to DB

## Output Schema (Zod)
```typescript
const RecommendationSchema = z.object({
  hypothesis: z.string().min(10),
  evidence: z.array(z.string()).min(1),
  confidence: z.number().min(0).max(1),
  priority: z.number().int().min(1).max(5),
  experiment_type: z.enum(['copy', 'layout', 'flow', 'incentive', 'social_proof', 'friction_removal']),
  rationale: z.string(),
})

const AnalysisOutputSchema = z.object({
  summary: z.string(),
  recommendations: z.array(RecommendationSchema).min(1).max(10),
})
```

## Prompt Caching
Use `cache_control: { type: 'ephemeral' }` on:
- The system prompt
- The CSV data block
- The project context block
