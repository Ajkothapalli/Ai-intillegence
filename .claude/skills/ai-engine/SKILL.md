# Skill: ai-engine

Use this skill when building or modifying the AI analysis pipeline in `src/lib/ai/`.

## Procedure
1. Read `design.md` for the prompt architecture
2. Implement using the Anthropic SDK with prompt caching
3. Define Zod schema for output BEFORE writing the prompt
4. Test with mock data before wiring to real uploads
5. Every output must include evidence + confidence
