# Design System

## Palette
- Background: white (`bg-white`)
- Surface: slate-50 (`bg-slate-50`)
- Border: slate-200 (`border-slate-200`)
- Text primary: slate-900 (`text-slate-900`)
- Text secondary: slate-500 (`text-slate-500`)
- Accent: violet-600 (`text-violet-600`, `bg-violet-600`)
- Accent hover: violet-700
- Destructive: red-600
- Success: emerald-600
- Warning: amber-500

## Typography
- Font: Inter (Next.js default)
- Heading 1: `text-3xl font-bold text-slate-900`
- Heading 2: `text-xl font-semibold text-slate-900`
- Body: `text-sm text-slate-700`
- Muted: `text-sm text-slate-500`

## Spacing
- Page padding: `px-6 py-8` on mobile, `px-8 py-10` on md+
- Card padding: `p-6`
- Stack gap: `gap-4` standard, `gap-6` between sections

## Key Components
- `Card`: shadcn Card with `border border-slate-200 rounded-xl`
- `Button` primary: shadcn Button with `bg-violet-600 hover:bg-violet-700`
- `Input`: shadcn Input, always with a visible label
- `Badge`: used for confidence scores and experiment types
- `Skeleton`: for all loading states

## Recommendation Card Pattern
Each recommendation gets a Card with:
- Priority badge (1–5, colored by urgency)
- Hypothesis (bold, large)
- Confidence meter (progress bar, 0–100%)
- Evidence list (bullet points, muted text)
- Experiment type badge
- Rationale (collapsible)
