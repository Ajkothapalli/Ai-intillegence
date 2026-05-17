# Experiment Intelligence — DESIGN.md

> A plain-text design system document. AI agents read this to generate consistent, world-class UI for the Experiment Intelligence platform.
>
> **Live preview:** `npm run dev` → http://localhost:3000/design

---

## 1. Brand Identity

**Product:** Experiment Intelligence — an AI platform that turns analytics CSVs, onboarding screenshots, and app metadata into evidence-backed, prioritized A/B test recommendations for B2C product teams.

**Design character:** Quietly technical. High-conviction. Editorial density. Not a developer tool — a product intelligence command center. Think Linear × Supabase × a financial terminal. Dense information, measured whitespace, surgical use of color.

**Canvas:** Near-black zinc (`#09090b`) — never pure black, never a grey that reads "default dark mode." The dark is intentional and rich.

**Primary:** Deep forest green `#133429` — the brand's founding color. Every primary CTA, every key interactive element.

**Accent:** Bright leaf `#3fbb5e` — the "voltage" moment. Focus rings, positive metrics, success states, the checkmark on a selected option.

---

## 2. Color Palette

### Primitive: Zinc (neutral dark-grey surfaces)

| Token          | Hex       | Role                            |
|----------------|-----------|---------------------------------|
| `--zinc-950`   | `#09090b` | Page canvas (near-black)        |
| `--zinc-900`   | `#111113` | Background-elevated (hover)     |
| `--zinc-850`   | `#161618` | Intermediate surface            |
| `--zinc-800`   | `#1c1c1f` | Cards, panels, inputs           |
| `--zinc-750`   | `#222226` | Raised modals, dropdowns        |
| `--zinc-700`   | `#2e2e33` | Strong surface                  |
| `--zinc-600`   | `#3f3f47` | Borders (strong)                |
| `--zinc-500`   | `#52525e` | Borders (default opacity base)  |
| `--zinc-400`   | `#71717d` | Subtle text, icons              |
| `--zinc-300`   | `#a1a1ab` | Muted text                      |
| `--zinc-200`   | `#d4d4d8` | Secondary text                  |

### Primitive: Forest Green (primary brand)

| Token           | Hex       | Role                                 |
|-----------------|-----------|--------------------------------------|
| `--forest-950`  | `#051208` | Darkest tint                         |
| `--forest-900`  | `#0a2012` | Deep panel tints                     |
| `--forest-800`  | `#12351e` | Dark green fills                     |
| `--forest-700`  | `#1c5530` | Hover fills                          |
| `--forest-600`  | `#22703e` | Mid fills                            |
| `--forest-500`  | `#2ea455` | Mid-bright                           |
| `--forest-400`  | `#3fbb5e` | **Brand accent** — focus, success    |
| `--forest-300`  | `#5ecc7a` | Hover accent                         |
| `--forest-200`  | `#90dda4` | Light tint                           |
| `--forest-100`  | `#bfeccc` | Pale wash                            |
| `--forest-50`   | `#e4f8e9` | Lightest wash                        |

**Primary action color:** `#133429` — NOT `--forest-500`. This is the exact brand primary, darker and more authoritative.

### Primitive: Cobalt Blue (info, links)

| Token          | Hex       | Role                    |
|----------------|-----------|-------------------------|
| `--cobalt-500` | `#3068d4` | Info, links             |
| `--cobalt-400` | `#5083de` | Hover/accent cobalt     |
| `--cobalt-300` | `#7aaaea` | Muted cobalt text       |
| `--cobalt-200` | `#aec8f4` | Badge borders           |

### Primitive: Ember Orange (warnings, accent CTA)

| Token          | Hex       | Role                    |
|----------------|-----------|-------------------------|
| `--ember-500`  | `#ed8020` | Accent CTA, warnings    |
| `--ember-400`  | `#f4a040` | Hover/lighter           |
| `--ember-300`  | `#f7bc68` | Muted orange text       |

### Primitive: Violet (AI confidence, statistics)

| Token           | Hex       | Role                                  |
|-----------------|-----------|---------------------------------------|
| `--violet-500`  | `#7c3aed` | AI outputs, p-values, confidence      |
| `--violet-400`  | `#9d61f5` | Violet hover                          |
| `--violet-300`  | `#b78cf7` | Muted violet text                     |

### Primitive: Teal (live experiments, real-time)

| Token         | Hex       | Role                          |
|---------------|-----------|-------------------------------|
| `--teal-500`  | `#14a98f` | Running experiments, live     |
| `--teal-400`  | `#2ec4a9` | Hover teal                    |

### Primitive: Rose (failures, negative)

| Token         | Hex       | Role                        |
|---------------|-----------|------------------------------|
| `--rose-500`  | `#e03360` | Destructive, failed          |
| `--rose-400`  | `#f05c7e` | Hover destructive            |

---

## 3. Semantic Token Map

```
--background          #09090b   zinc-950 — page canvas
--background-elevated #111113   zinc-900 — hover lift bg
--surface             #1c1c1f   zinc-800 — cards, panels
--surface-raised      #222226   zinc-750 — modals, dropdowns

--foreground          #ffffff   ink-0 — primary text
--foreground-muted    #d4d4d8   ink-200 — secondary text
--foreground-subtle   #60607a   ink-400 — placeholder, icons
--foreground-disabled #43435a   ink-500 — disabled

--primary             #133429   deep forest — all primary CTAs
--primary-hover       #1a4535
--primary-active      #0d2319
--primary-foreground  #ffffff

--brand               #3fbb5e   forest-400 — voltage accent
--brand-hover         #5ecc7a   forest-300
--brand-foreground    #09090b   zinc-950

--accent              #ed8020   ember-500
--accent-hover        #f4a040   ember-400
--accent-foreground   #09090b

--border              color-mix(zinc-600 55%, transparent)
--border-hairline     color-mix(zinc-600 30%, transparent)
--border-strong       #3f3f47   zinc-600
--border-stronger     #52525e   zinc-500
--border-focus        #3fbb5e   forest-400

--ring                #3fbb5e   forest-400 — focus rings (always green)

--destructive         #e03360   rose-500
--success             #3fbb5e   forest-400
--warning             #f4a040   ember-400
--info                #5083de   cobalt-400
```

---

## 4. Surface Ladder (4-step elevation)

Depth is communicated through background-color progression and hairline borders — **NOT heavy box shadows**. This is the Linear/Raycast principle.

```
Layer 0 — Canvas:       zinc-950 (#09090b)  page background
Layer 1 — Elevated:     zinc-900 (#111113)  hover states, row highlights
Layer 2 — Surface:      zinc-800 (#1c1c1f)  cards, panels, inputs
Layer 3 — Raised:       zinc-750 (#222226)  dropdowns, modals, tooltips
```

Each layer gains a hairline inset border (`inset 0 0 0 1px rgba(255,255,255,0.04)`) to reinforce lift without adding visual weight.

---

## 5. Typography

**Font family:** Plus Jakarta Sans (--font-sans), JetBrains Mono (--font-mono)

**Font smoothing:** Always use `-webkit-font-smoothing: antialiased` — applied globally on `*`.

**Font features globally:** `font-feature-settings: 'calt' 1, 'liga' 1, 'kern' 1`

**Numeric displays:** `font-variant-numeric: tabular-nums lining-nums` + `font-feature-settings: 'tnum' 1, 'lnum' 1` on all stat values, progress labels, metric numbers. Ensures columns align in data tables.

### Type Scale with Tracking

| Role         | Size     | Weight | Tracking   | Line height | Use case                        |
|--------------|----------|--------|------------|-------------|---------------------------------|
| Display      | 48–60px  | 700    | `-0.04em`  | 1.1         | Hero headlines, page titles     |
| Heading 1    | 30–36px  | 700    | `-0.03em`  | 1.15        | Section titles                  |
| Heading 2    | 24px     | 600    | `-0.025em` | 1.2         | Card titles, panel headers      |
| Heading 3    | 18–20px  | 600    | `-0.015em` | 1.3         | Subheadings                     |
| Heading 4    | 16px     | 600    | `-0.01em`  | 1.4         | Form section labels             |
| Body         | 14–16px  | 400    | `0`        | 1.5         | All body copy                   |
| Small        | 13px     | 400    | `0`        | 1.5         | Descriptions, metadata          |
| Label/eyebrow| 10–12px  | 500    | `+0.06em`  | 1.2         | Uppercase section labels        |
| Caption      | 11px     | 400    | `0`        | 1.4         | Footnotes, timestamps           |
| Code         | 13px     | 400    | `0`        | 1.6         | JetBrains Mono — code/CLI only  |

**Rule:** Never use weight above 700 on display text. Never use pure bold (800+) decoratively. The density comes from negative tracking, not weight.

---

## 6. Spacing System (4px base unit)

| Token        | Value   | Tailwind equiv |
|--------------|---------|----------------|
| `--space-1`  | `4px`   | `p-1`          |
| `--space-2`  | `8px`   | `p-2`          |
| `--space-3`  | `12px`  | `p-3`          |
| `--space-4`  | `16px`  | `p-4`          |
| `--space-5`  | `20px`  | `p-5`          |
| `--space-6`  | `24px`  | `p-6`          |
| `--space-8`  | `32px`  | `p-8`          |
| `--space-10` | `40px`  | `p-10`         |
| `--space-12` | `48px`  | `p-12`         |
| `--space-16` | `64px`  | `p-16`         |
| `--space-20` | `80px`  | `p-20`         |
| `--space-24` | `96px`  | `p-24`         |

Section rhythm: **96px** top/bottom padding on major page sections (`.section-rhythm`).

---

## 7. Border Radius

| Context               | Radius   | Note                                     |
|-----------------------|----------|------------------------------------------|
| Inputs, dropdowns     | `6px`    | `rounded-md` — professional, not pill    |
| Buttons               | `9999px` | `rounded-full` — brand pill shape        |
| Cards, panels         | `12px`   | `rounded-xl`                             |
| Dropdown panels       | `10px`   | `rounded-lg`                             |
| Modals, drawers       | `16px`   | `rounded-2xl`                            |
| Badges                | `9999px` | `rounded-full`                           |
| Avatars               | `9999px` | `rounded-full`                           |
| Code blocks           | `8px`    | `rounded-sm`                             |

---

## 8. Shadow System

Shadows use **layered small offsets + inset hairline** — never a single heavy drop shadow. Inset hairline (`inset 0 0 0 1px rgba(255,255,255,N)`) simulates a subtle top-lit inner border, giving surfaces lift without glow.

```
--shadow-xs:  0 1px 2px rgba(0,0,0,0.55),
              inset 0 0 0 1px rgba(255,255,255,0.04)

--shadow-sm:  0 2px 4px rgba(0,0,0,0.60),
              0 1px 2px rgba(0,0,0,0.40),
              inset 0 0 0 1px rgba(255,255,255,0.05)

--shadow-md:  0 4px 8px rgba(0,0,0,0.65),
              0 2px 4px rgba(0,0,0,0.45),
              inset 0 0 0 1px rgba(255,255,255,0.04)

--shadow-lg:  0 8px 24px rgba(0,0,0,0.70),
              0 4px 8px rgba(0,0,0,0.50),
              inset 0 0 0 1px rgba(255,255,255,0.04)

--shadow-xl:  0 16px 40px rgba(0,0,0,0.75),
              0 8px 16px rgba(0,0,0,0.55),
              inset 0 0 0 1px rgba(255,255,255,0.03)

--shadow-primary: 0 4px 20px rgba(19,52,41,0.70),
                  0 2px 8px rgba(63,187,94,0.15)
                  (Green-tinted — on primary #133429 buttons)

--shadow-brand:   0 4px 16px rgba(63,187,94,0.30)
                  (Bright green glow — on brand #3fbb5e surfaces)

--shadow-accent:  0 4px 16px rgba(237,128,32,0.40)
                  (Ember glow — on accent surfaces)
```

---

## 9. Motion Contract

All motion follows a consistent contract. Never deviate from these timings.

| Category  | Duration | Easing                          | What moves                         |
|-----------|----------|---------------------------------|------------------------------------|
| Micro     | 150ms    | `cubic-bezier(0.4, 0, 0.2, 1)` | Color, border, background, opacity |
| Macro     | 200ms    | `cubic-bezier(0, 0, 0.2, 1)`   | Transform, shadow, size            |
| Press     | 50ms     | `cubic-bezier(0.4, 0, 0.2, 1)` | Active scale (snap)                |
| Spring    | 200ms    | `cubic-bezier(0.34,1.56,0.64,1)`| Avatar scale, badge pop            |
| Enter     | 180ms    | `cubic-bezier(0, 0, 0.2, 1)`   | Fade-in + translate + scale        |
| Shimmer   | 1.6s     | ease-default, infinite          | Skeleton loading                   |

**Reduced motion:** `@media (prefers-reduced-motion: reduce)` collapses all durations to `0.01ms`. This is non-negotiable — WCAG 2.1 AA requirement.

### Motion utilities

```
.motion-base      — micro transitions (color/border/bg) 150ms
.motion-lift      — card hover: translateY(-2px) + shadow 200ms ease-out
.motion-press     — active: scale(0.97) 50ms snap
.motion-spring    — avatar/chip: scale(1.06) hover, scale(0.95) active
.motion-enter     — fade-in + translateY(6px) + scale(0.99) 180ms
.motion-scale-in  — dropdown/modal: scale(0.96) + translateY(-4px) 180ms spring
.motion-shimmer   — skeleton shimmer loop
.motion-spin      — loading spinner 700ms linear
```

---

## 10. Gradients

### Page-level (atmospheric, not fills)

Use on page/section backgrounds as invisible atmosphere on the zinc canvas.

```
.gradient-hero          — radial green glow from top (auth, hero sections)
.gradient-ambient-green — corner green ambient (dashboard, app shell)
.gradient-ambient-multi — multi-color ambient (rich data sections)
```

### Card-level (surface fills)

Use as card/panel background fills for semantic coloring.

```
.gradient-surface   — neutral card depth (zinc-800 → zinc-850)
.gradient-emerald   — primary-tinted cards, AI output panels
.gradient-cobalt    — info/link-heavy panels
.gradient-ember     — warning/accent panels
.gradient-violet    — AI confidence, stats panels
.gradient-teal      — live experiment, real-time panels
.gradient-rose      — failure, negative result panels
```

### Text gradients

```
.gradient-text-green   — forest-300 → forest-400 (metric headlines)
.gradient-text-gold    — ember-300 → ember-400 (warning metrics)
.gradient-text-violet  — violet-300 → cobalt-300 (AI labels)
```

---

## 11. Component Reference

### Button

```tsx
import { Button } from '@/components/ui/button'

// Variants
<Button variant="default">Primary</Button>      // #133429 filled, pill, shadow-primary on hover
<Button variant="secondary">Secondary</Button>  // forest tint bg + forest border + forest text
<Button variant="brand">Brand</Button>          // #3fbb5e filled, brand glow on hover
<Button variant="accent">Accent</Button>        // ember filled
<Button variant="ghost">Ghost</Button>          // transparent, no lift
<Button variant="outline">Outline</Button>      // zinc border, lift on hover
<Button variant="destructive">Delete</Button>   // rose tint + rose border
<Button variant="link">Link</Button>            // green underline

// Sizes: xs | sm | default | lg | xl | icon | icon-sm | icon-lg

// All filled variants lift on hover: hover:-translate-y-px
// All variants press on active: active:scale-[0.96] active:duration-[50ms]
// Focus: focus-visible:ring-2 focus-visible:ring-[var(--forest-400)]/50
```

### Input

```tsx
import { Input } from '@/components/ui/input'

<Input placeholder="Project name" />        // rounded-md, hover darkens bg
<Input error defaultValue="bad" />          // rose border + rose ring
<Input disabled />                          // opacity-40

// Focus: border turns forest-400, ring 2px forest-400/25, bg lightens to zinc-750
// Hover: bg zinc-750, border zinc-600
```

### Dropdown

```tsx
import { Dropdown } from '@/components/ui/dropdown'

<Dropdown
  label="Primary metric"
  placeholder="Select…"
  options={[
    { value: 'cvr', label: 'Conversion rate', description: 'Main funnel CVR' },
    { value: 'ltv', label: 'LTV' },
  ]}
  value={value}
  onChange={setValue}
/>
// Keyboard: ↑↓ navigate, Enter/Space open, Escape close
// Selected: forest tint bg + forest checkmark
// Focus/open: forest-400 border + ring (matches Input exactly)
```

### DatePicker

```tsx
import { DatePicker } from '@/components/ui/date-picker'

<DatePicker
  placeholder="Pick a date"
  value={date}
  onChange={setDate}
  minDate={new Date()}     // optional
  maxDate={maxDate}        // optional
/>
// Today highlighted with forest-400 ring
// Selected day: bg-primary text-white
// Panel: motion-enter fade-in
```

### Scheduler

```tsx
import { Scheduler } from '@/components/ui/scheduler'

<Scheduler
  label="Analysis schedule"
  value={schedule}         // { days: number[], hour: number, minute: number }
  onChange={setSchedule}
/>
// Smart summary: "Weekdays at 9:00 AM", "Every day at 2:30 PM"
// Day toggles: forest tint when active
// Hour: scrollable list (h-40, sticky selected)
// Minute: 4-slot grid (0, 15, 30, 45)
```

### Badge

```tsx
import { Badge } from '@/components/ui/badge'

// Semantic
<Badge variant="brand">Active</Badge>
<Badge variant="success">Completed</Badge>
<Badge variant="warning">Low confidence</Badge>
<Badge variant="destructive">Failed</Badge>
<Badge variant="info">Running</Badge>

// Priority (experiment priority 1–5)
<Badge variant="p1">P1</Badge>   // red — must fix
<Badge variant="p2">P2</Badge>   // orange
<Badge variant="p3">P3</Badge>   // ember
<Badge variant="p4">P4</Badge>   // forest green
<Badge variant="p5">P5</Badge>   // muted

// Experiment types
<Badge variant="ab">A/B Test</Badge>
<Badge variant="multivariate">Multivariate</Badge>
<Badge variant="flag">Feature Flag</Badge>
<Badge variant="holdout">Holdout</Badge>
<Badge variant="bandit">Bandit</Badge>

// Status
<Badge variant="pending">Pending</Badge>
<Badge variant="running">Running</Badge>
<Badge variant="completed">Completed</Badge>
<Badge variant="failed">Failed</Badge>

// Sizes: sm | md (default) | lg
```

### Card

```tsx
import { Card, CardGlass, CardGradient, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'

<Card>
  <CardHeader>
    <CardTitle>Experiment name</CardTitle>
    <CardDescription>Brief description of the hypothesis</CardDescription>
  </CardHeader>
  <CardContent>…</CardContent>
  <CardFooter>…</CardFooter>
</Card>

// CardGlass — frosted green tint (analysis ready states)
// CardGradient — gradient-surface fill
```

### StatCard

```tsx
import { StatCard } from '@/components/ui/stat-card'

<StatCard
  label="Total analyses"
  value="38"                        // auto tabular-nums applied
  subvalue="Last 30 days"
  trend="up"
  trendValue="+14%"
  icon="🤖"
  variant="default"                 // default | primary | brand | accent
/>
// Values always render with font-variant-numeric: tabular-nums
```

### Progress / ConfidenceMeter

```tsx
import { Progress, ConfidenceMeter } from '@/components/ui/progress'

<Progress value={73} variant="brand" size="md" showLabel />
// Variants: default | brand | accent | danger | gradient
// Sizes: sm | md | lg

<ConfidenceMeter value={0.84} />  // 0–1 → colored bar
// ≥0.80 → brand (green)
// ≥0.50 → default (cobalt)
// <0.50 → accent (ember)
```

### Alert

```tsx
import { Alert } from '@/components/ui/alert'

<Alert variant="success" title="Analysis complete">
  5 experiment recommendations generated with 73% avg confidence.
</Alert>
<Alert variant="info" title="Pro tip">Upload CSVs to raise confidence above 80%.</Alert>
<Alert variant="warning" title="Low confidence">Context-only analysis.</Alert>
<Alert variant="destructive" title="Failed">AI returned invalid response.</Alert>
// All alerts: motion-enter fade-in on mount
```

### Avatar

```tsx
import { Avatar } from '@/components/ui/avatar'

<Avatar initials="AK" size="md" variant="forest" />
// Variants: forest | cobalt | ember
// Sizes: sm | md | lg | xl
// Motion: spring scale on hover (1.06x), snap on press (0.95x)
```

---

## 12. Layout Patterns

### Authenticated app shell

```tsx
<main className="min-h-screen bg-background">
  <header className="border-b border-[var(--border)] bg-[var(--surface)] px-8 py-4 flex items-center justify-between">
    <span className="text-lg font-semibold">Experiment Intelligence</span>
    {/* nav actions */}
  </header>
  <div className="max-w-4xl mx-auto px-8 py-10 space-y-8">
    {/* page content */}
  </div>
</main>
```

### Hero header (gradient)

```tsx
<header className="gradient-hero px-8 py-14 text-white">
  <div className="max-w-4xl mx-auto">
    <p className="text-label text-white/60 mb-2">EXPERIMENT INTELLIGENCE</p>
    <h1 className="text-4xl font-bold tracking-tight mb-3">Page title</h1>
    <p className="text-white/75 text-lg max-w-xl">Supporting copy here.</p>
  </div>
</header>
```

### Dashboard stats row

```tsx
<div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
  <StatCard label="Total projects" value="12" trend="up" trendValue="3 new" icon="📁" />
  <StatCard label="Analyses" value="38" variant="primary" />
  <StatCard label="Avg confidence" value="73%" variant="brand" />
  <StatCard label="Recommendations" value="142" variant="accent" />
</div>
```

### Project card list

```tsx
<div className="grid gap-4">
  {projects.map(p => (
    <Link
      key={p.id}
      href={`/projects/${p.id}`}
      className="block bg-[var(--surface)] rounded-xl border border-[var(--border)] px-6 py-5 motion-lift hover:border-[var(--forest-600)] hover:shadow-[var(--shadow-md)]"
    >
      <h3 className="font-semibold text-foreground">{p.name}</h3>
      <p className="text-sm text-[var(--foreground-muted)] mt-1">{p.description}</p>
    </Link>
  ))}
</div>
```

---

## 13. Design Guardrails (what NOT to do)

- **Never** use pure `#000000` black — always zinc-950 (`#09090b`)
- **Never** use multiple chromatic accent colors in the same section
- **Never** apply gradients to interactive components (buttons, inputs)
- **Never** use `box-shadow` with a single heavy offset — always layer 2+ offsets
- **Never** display weight above 700
- **Never** use `transition-all` — always name specific properties
- **Never** omit `prefers-reduced-motion` support
- **Never** use `any` TypeScript type
- **Never** expose service role key to client
- **Limit** brand accent (`#3fbb5e`) to <10% of any screen's visual weight
- **Limit** primary color (`#133429`) to CTAs and essential interactive states only
- **Reserve** colored shadows for elements that actually use that fill color
- **Always** use tabular-nums on stat values, currency, percentages, counts

---

## 14. Agent Prompt Guide

When using this file to generate UI, follow this priority order:

1. **Canvas first** — start with `bg-background` (`#09090b`). Every element sits on this.
2. **Surface for cards** — wrap card content in `bg-[var(--surface)]` (`#1c1c1f`) with `rounded-xl border border-[var(--border)]`.
3. **Text hierarchy** — `text-foreground` (primary) → `text-[var(--foreground-muted)]` (secondary) → `text-[var(--foreground-subtle)]` (tertiary/labels).
4. **Primary actions** — `<Button variant="default">` for primary, `<Button variant="secondary">` for secondary.
5. **Focus rings** — always forest-400 (`#3fbb5e`). Never change this.
6. **Numbers** — add `tabular-nums` class to any `<span>` or `<p>` containing metrics, counts, percentages, or monetary values.
7. **Motion** — every interactive element needs `motion-base` or the equivalent `transition-[property] duration-150`. Cards get `motion-lift`. Buttons have it built-in.
8. **No decoration without purpose** — every gradient, every shadow, every color must communicate something (hierarchy, state, semantic meaning).

---

## 15. File Map

```
src/
  app/
    globals.css                       ← All tokens, gradients, motion, base styles
    layout.tsx                        ← Plus Jakarta Sans + JetBrains Mono fonts
    design/page.tsx                   ← Live showcase → /design
    (auth)/login/page.tsx
    (auth)/signup/page.tsx
    (app)/dashboard/page.tsx
    (app)/projects/new/page.tsx
    (app)/projects/[id]/page.tsx
    (app)/projects/[id]/uploads/
    (app)/projects/[id]/analysis/
    (app)/projects/[id]/recommendations/
  components/ui/
    badge.tsx         ← 20+ variants (priority, experiment type, status, semantic)
    button.tsx        ← Base UI + CVA, 7 variants, 8 sizes, full motion
    card.tsx          ← Card + CardGlass + CardGradient + sub-components
    input.tsx         ← rounded-md, green focus ring, error state, motion
    textarea.tsx      ← Same as Input, resize-none
    dropdown.tsx      ← Custom select: keyboard nav, descriptions, click-outside
    date-picker.tsx   ← Full calendar: month grid, today, min/max, clear button
    scheduler.tsx     ← Recurring schedule: day toggles, hour scroll, minute grid
    progress.tsx      ← 5 variants, 3 sizes + ConfidenceMeter (0–1)
    alert.tsx         ← 5 variants + motion-enter on mount
    skeleton.tsx      ← motion-shimmer loading states
    separator.tsx     ← Horizontal + vertical
    avatar.tsx        ← forest/cobalt/ember, initials or image, spring motion
    stat-card.tsx     ← 4 variants + trend arrows + tabular-nums values
  features/
    auth/             ← Sign-in, sign-up, sign-out actions
    projects/         ← Project CRUD queries
    analysis/         ← Claude AI analysis engine
  lib/
    supabase/         ← Client, server, middleware helpers
    ai/               ← Claude API calls, prompt engineering, output parsing
design.md             ← This file
CLAUDE.md             ← Agent instructions and project guardrails
```
