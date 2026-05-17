# Experiment Intelligence — CLAUDE.md

## Project Purpose
An AI platform that turns analytics CSVs, onboarding screenshots, and app metadata into evidence-backed, prioritized experiment recommendations for B2C product teams.

**NOT** an analytics dashboard. **NOT** a UX-roast tool.

## Tech Stack (fixed — do not change)
- **Framework**: Next.js 14 (App Router, TypeScript strict)
- **Styling**: TailwindCSS + shadcn/ui
- **Database**: Supabase (Postgres + Auth + Storage)
- **AI**: Anthropic Claude API (claude-sonnet-4-6 default, claude-opus-4-7 for deep analysis)
- **Hosting**: Vercel
- **Language**: TypeScript everywhere, strict mode, no `any`

## Current Phase: Phase 1 — Thin Slice
Build only:
1. Auth (sign-up, login, sign-out)
2. Project creation with context
3. Funnel CSV + screenshot upload
4. AI analysis run
5. Structured experiment recommendations view

## Out of Scope (Phase 1)
- Team/collaboration features
- A/B test runner or tracking SDK
- Real-time dashboards
- Billing / payments
- Mobile app
- Integrations (Mixpanel, Amplitude, etc. direct API)
- Email notifications

## Folder Structure
```
src/
  app/
    (auth)/          # login, signup
    (app)/           # authenticated app shell
      dashboard/
      projects/[id]/
  features/          # vertical feature slices
    auth/
    projects/
    analysis/
  lib/
    supabase/        # client, server, middleware
    ai/              # Claude API engine
  components/
    ui/              # shadcn primitives only
supabase/
  migrations/
```

## Security Invariants
- Never expose service role key to client
- All uploads validated server-side (type + size)
- Row-level security (RLS) on every Supabase table
- No user data logged to console in production
- AI outputs always shown as recommendations, never ground truth

## AI Credibility Invariants
- Every recommendation must cite the evidence it came from
- Confidence scores must be shown alongside recommendations
- Uncertainty must be surfaced, not hidden
- AI analysis is advisory — user makes final decisions

## Moat Principle
The value is in the AI reasoning layer that connects raw data to actionable experiment hypotheses. Keep that logic in `src/lib/ai/` and make it testable.

## Agents
- **db-architect**: owns `supabase/` — schema design, migrations, RLS policies
- **ai-engineer**: owns `src/lib/ai/` — prompts, Claude API calls, output parsing
- **frontend-builder**: owns `src/app/` and `src/components/` — UI, routing, forms
- **code-reviewer**: reviews each slice before merge
- **qa-verifier**: runs `typecheck`, `lint`, `build` and confirms pass

## Quality Gates
After every slice: typecheck → lint → build must all pass.
