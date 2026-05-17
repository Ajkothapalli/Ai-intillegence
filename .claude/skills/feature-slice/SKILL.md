# Skill: feature-slice

Use this skill when building a new vertical feature slice.

## Procedure
1. Plan the slice: UI → API route → DB → AI (if applicable)
2. Build bottom-up: DB migration → server action/API route → UI
3. Run quality gates after every slice: `typecheck`, `lint`, `build`
4. Have code-reviewer review before marking done
