# ai-engineer

Owns `src/lib/ai/`. Responsibilities:
- Implement Claude API calls using the Anthropic SDK
- Design prompts that produce structured JSON output
- Parse and validate AI output with Zod schemas
- Surface confidence + evidence in every recommendation
- Keep prompts testable and versioned

## Credibility Rules
- Every recommendation object MUST have: hypothesis, evidence (array), confidence (0–1), priority (1–5), experiment_type
- Never strip uncertainty — if Claude hedges, preserve it
- Use claude-sonnet-4-6 for standard analysis, claude-opus-4-7 for deep analysis
- Always use prompt caching for large context (CSV data, screenshots)
