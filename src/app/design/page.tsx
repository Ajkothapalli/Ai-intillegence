import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardGradient, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Progress, ConfidenceMeter } from '@/components/ui/progress'
import { Alert } from '@/components/ui/alert'
import { Skeleton, SkeletonCard } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { Avatar } from '@/components/ui/avatar'
import { StatCard } from '@/components/ui/stat-card'
import { DatePicker } from '@/components/ui/date-picker'
import { Scheduler } from '@/components/ui/scheduler'
import { Dropdown } from '@/components/ui/dropdown'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-5">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-semibold text-foreground whitespace-nowrap">{title}</h2>
        <div className="flex-1 h-px bg-[var(--border)]" />
      </div>
      {children}
    </section>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-[var(--foreground-subtle)] uppercase tracking-wider">{label}</p>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  )
}

type SwatchData = { name: string; token: string; hex: string }

const zincSwatches: SwatchData[] = [
  { name: 'Zinc 950', token: '--zinc-950', hex: '#09090b' },
  { name: 'Zinc 900', token: '--zinc-900', hex: '#111113' },
  { name: 'Zinc 850', token: '--zinc-850', hex: '#161618' },
  { name: 'Zinc 800', token: '--zinc-800', hex: '#1c1c1f' },
  { name: 'Zinc 750', token: '--zinc-750', hex: '#222226' },
  { name: 'Zinc 700', token: '--zinc-700', hex: '#2e2e33' },
  { name: 'Zinc 600', token: '--zinc-600', hex: '#3f3f47' },
  { name: 'Zinc 400', token: '--zinc-400', hex: '#71717d' },
  { name: 'Zinc 300', token: '--zinc-300', hex: '#a1a1ab' },
  { name: 'Zinc 200', token: '--zinc-200', hex: '#d4d4d8' },
]

const forestSwatches: SwatchData[] = [
  { name: 'Forest 900', token: '--forest-900', hex: '#0a2012' },
  { name: 'Forest 800', token: '--forest-800', hex: '#12351e' },
  { name: 'Forest 700', token: '--forest-700', hex: '#1c5530' },
  { name: 'Forest 600', token: '--forest-600', hex: '#22703e' },
  { name: 'Forest 500', token: '--forest-500', hex: '#2ea455' },
  { name: 'Forest 400', token: '--forest-400', hex: '#3fbb5e' },
  { name: 'Forest 300', token: '--forest-300', hex: '#5ecc7a' },
  { name: 'Forest 200', token: '--forest-200', hex: '#90dda4' },
  { name: 'Forest 100', token: '--forest-100', hex: '#bfeccc' },
]

const cobaltSwatches: SwatchData[] = [
  { name: 'Cobalt 700', token: '--cobalt-700', hex: '#1e3aac' },
  { name: 'Cobalt 500', token: '--cobalt-500', hex: '#3068d4' },
  { name: 'Cobalt 400', token: '--cobalt-400', hex: '#5083de' },
  { name: 'Cobalt 300', token: '--cobalt-300', hex: '#7aaaea' },
  { name: 'Cobalt 200', token: '--cobalt-200', hex: '#aec8f4' },
]

const emberSwatches: SwatchData[] = [
  { name: 'Ember 600', token: '--ember-600', hex: '#cf6214' },
  { name: 'Ember 500', token: '--ember-500', hex: '#ed8020' },
  { name: 'Ember 400', token: '--ember-400', hex: '#f4a040' },
  { name: 'Ember 300', token: '--ember-300', hex: '#f7bc68' },
  { name: 'Ember 200', token: '--ember-200', hex: '#fad498' },
]

const violetSwatches: SwatchData[] = [
  { name: 'Violet 800', token: '--violet-800', hex: '#2d1260' },
  { name: 'Violet 600', token: '--violet-600', hex: '#5e2baa' },
  { name: 'Violet 500', token: '--violet-500', hex: '#7c3aed' },
  { name: 'Violet 400', token: '--violet-400', hex: '#9d61f5' },
  { name: 'Violet 300', token: '--violet-300', hex: '#b78cf7' },
  { name: 'Violet 200', token: '--violet-200', hex: '#d0b5fa' },
]

const tealSwatches: SwatchData[] = [
  { name: 'Teal 700', token: '--teal-700', hex: '#0d4a43' },
  { name: 'Teal 500', token: '--teal-500', hex: '#14a98f' },
  { name: 'Teal 400', token: '--teal-400', hex: '#2ec4a9' },
  { name: 'Teal 300', token: '--teal-300', hex: '#5dd4bc' },
  { name: 'Teal 200', token: '--teal-200', hex: '#99e6d8' },
]

const roseSwatches: SwatchData[] = [
  { name: 'Rose 700', token: '--rose-700', hex: '#8c1c38' },
  { name: 'Rose 500', token: '--rose-500', hex: '#e03360' },
  { name: 'Rose 400', token: '--rose-400', hex: '#f05c7e' },
  { name: 'Rose 300', token: '--rose-300', hex: '#f78fa3' },
  { name: 'Rose 200', token: '--rose-200', hex: '#fbbfcc' },
]

function Swatch({ name, hex }: SwatchData) {
  return (
    <div className="flex flex-col items-center gap-1.5 w-16">
      <div className="w-14 h-12 rounded-lg border border-[var(--border)] shadow-sm" style={{ background: hex }} />
      <div className="text-center">
        <p className="text-[10px] font-medium text-foreground leading-tight">{name}</p>
        <p className="text-[9px] text-[var(--foreground-subtle)] font-mono">{hex}</p>
      </div>
    </div>
  )
}

export default function DesignPage() {
  return (
    <div className="min-h-screen bg-background">

      {/* ── Hero ── */}
      <header className="border-b border-[var(--border)] bg-[var(--surface)] px-8 py-14">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--foreground-subtle)] mb-2">
            Experiment Intelligence
          </p>
          <h1 className="text-4xl font-bold mb-3 text-foreground">Design System</h1>
          <p className="text-[var(--foreground-muted)] text-lg max-w-xl">
            White canvas · Deep forest green primary · Bright green accent · Violet for AI · Teal for live data.
          </p>
          <div className="flex flex-wrap gap-2 mt-6">
            <Badge variant="brand">Forest #3fbb5e</Badge>
            <Badge variant="info">Cobalt #5083de</Badge>
            <Badge variant="accent">Ember #ed8020</Badge>
            <Badge variant="ab">Violet #9d61f5</Badge>
            <Badge variant="holdout">Teal #2ec4a9</Badge>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-8 py-14 space-y-16">

        {/* ── Color Palette ── */}
        <Section title="Color Palette">
          <Row label="Zinc — neutral surfaces (backgrounds, borders, subtle elements)">
            <div className="flex flex-wrap gap-3">
              {zincSwatches.map(s => <Swatch key={s.token} {...s} />)}
            </div>
          </Row>
          <Row label="Forest green — primary action, positive metrics, success">
            <div className="flex flex-wrap gap-3">
              {forestSwatches.map(s => <Swatch key={s.token} {...s} />)}
            </div>
          </Row>
          <Row label="Cobalt blue — info, links, secondary CTA">
            <div className="flex flex-wrap gap-3">
              {cobaltSwatches.map(s => <Swatch key={s.token} {...s} />)}
            </div>
          </Row>
          <Row label="Ember orange — warnings, caution metrics, accent CTA">
            <div className="flex flex-wrap gap-3">
              {emberSwatches.map(s => <Swatch key={s.token} {...s} />)}
            </div>
          </Row>
          <Row label="Violet — AI confidence, statistical significance, p-values">
            <div className="flex flex-wrap gap-3">
              {violetSwatches.map(s => <Swatch key={s.token} {...s} />)}
            </div>
          </Row>
          <Row label="Teal — live experiments, real-time data, streaming indicators">
            <div className="flex flex-wrap gap-3">
              {tealSwatches.map(s => <Swatch key={s.token} {...s} />)}
            </div>
          </Row>
          <Row label="Rose — negative results, failed experiments, drop-off metrics">
            <div className="flex flex-wrap gap-3">
              {roseSwatches.map(s => <Swatch key={s.token} {...s} />)}
            </div>
          </Row>

          <Row label="Ambient backgrounds (page / section level)">
            <div className="space-y-3 w-full">
              {[
                { cls: 'gradient-hero',          label: 'gradient-hero',          desc: 'Green radial glow from top — auth screens, hero sections' },
                { cls: 'gradient-ambient-green',  label: 'gradient-ambient-green', desc: 'Green corner ambient — dashboard, app shell' },
                { cls: 'gradient-ambient-multi',  label: 'gradient-ambient-multi', desc: 'Green + cobalt + violet atmosphere — data-rich sections' },
              ].map(g => (
                <div key={g.cls} className="flex items-center gap-4">
                  <div className={`${g.cls} h-14 w-56 rounded-lg border border-[var(--border)] shrink-0`} />
                  <div>
                    <p className="text-xs font-medium text-foreground">{g.label}</p>
                    <p className="text-[10px] text-[var(--foreground-subtle)] font-mono">{g.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Row>

          <Row label="Surface fills (card / panel level)">
            <div className="space-y-3 w-full">
              {[
                { cls: 'gradient-surface',  label: 'gradient-surface',  desc: 'Neutral card depth — zinc-800 → zinc-850' },
                { cls: 'gradient-emerald',  label: 'gradient-emerald',  desc: 'Primary-tinted panel — #133429 → zinc-800' },
                { cls: 'gradient-cobalt',   label: 'gradient-cobalt',   desc: 'Info panels — cobalt-900 → zinc-800' },
                { cls: 'gradient-ember',    label: 'gradient-ember',    desc: 'Warning / accent panels — ember-900 → zinc-800' },
                { cls: 'gradient-violet',   label: 'gradient-violet',   desc: 'AI / confidence panels — violet-900 → zinc-800' },
                { cls: 'gradient-teal',     label: 'gradient-teal',     desc: 'Live / real-time panels — teal-900 → zinc-800' },
                { cls: 'gradient-rose',     label: 'gradient-rose',     desc: 'Failure / negative panels — rose-900 → zinc-800' },
              ].map(g => (
                <div key={g.cls} className="flex items-center gap-4">
                  <div className={`${g.cls} h-12 w-56 rounded-lg border border-[var(--border)] shrink-0`} />
                  <div>
                    <p className="text-xs font-medium text-foreground">{g.label}</p>
                    <p className="text-[10px] text-[var(--foreground-subtle)] font-mono">{g.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Row>

          <Row label="Text gradients">
            <div className="space-y-3 w-full">
              {[
                { cls: 'gradient-text-green',  label: 'gradient-text-green',  desc: 'forest-300 → forest-400' },
                { cls: 'gradient-text-gold',   label: 'gradient-text-gold',   desc: 'ember-300 → ember-400' },
                { cls: 'gradient-text-violet', label: 'gradient-text-violet', desc: 'violet-300 → cobalt-300' },
              ].map(g => (
                <div key={g.cls} className="flex items-center gap-4">
                  <p className={`${g.cls} text-3xl font-bold shrink-0 w-56`}>Aa Bb 123</p>
                  <div>
                    <p className="text-xs font-medium text-foreground">{g.label}</p>
                    <p className="text-[10px] text-[var(--foreground-subtle)] font-mono">{g.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Row>

          <Row label="Semantic tokens">
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Background', bg: 'bg-background',  fg: 'text-foreground', ring: true },
                { label: 'Surface',    bg: 'bg-[var(--surface)]', fg: 'text-foreground', ring: true },
                { label: 'Primary',    bg: 'bg-primary',     fg: 'text-primary-foreground' },
                { label: 'Secondary',  bg: 'bg-secondary',   fg: 'text-secondary-foreground', ring: true },
                { label: 'Muted',      bg: 'bg-muted',       fg: 'text-muted-foreground', ring: true },
                { label: 'Accent',     bg: 'bg-accent',      fg: 'text-accent-foreground' },
                { label: 'Destructive',bg: 'bg-destructive', fg: 'text-white' },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <div className={`w-20 h-10 rounded-lg flex items-center justify-center ${s.bg} ${s.fg} ${s.ring ? 'border border-[var(--border)]' : ''}`}>
                    <span className="text-[9px] font-semibold">{s.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </Row>
        </Section>

        {/* ── Typography ── */}
        <Section title="Typography">
          <div className="space-y-3">
            <p className="text-4xl font-bold tracking-tight">Heading 4xl Bold</p>
            <p className="text-3xl font-bold tracking-tight">Heading 3xl Bold</p>
            <p className="text-2xl font-bold tracking-tight">Heading 2xl Bold</p>
            <p className="text-xl font-semibold">Heading xl Semibold</p>
            <p className="text-base font-medium">Body base Medium</p>
            <p className="text-sm text-foreground">Body sm Regular</p>
            <p className="text-sm text-[var(--foreground-muted)]">Body sm Muted</p>
            <p className="text-xs text-[var(--foreground-subtle)]">Caption xs Subtle</p>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground-subtle)]">Label xs Uppercase</p>
            <p className="gradient-text-green text-3xl font-bold">Gradient Headline · green</p>
            <p className="gradient-text-gold text-3xl font-bold">Gradient Headline · gold</p>
          </div>
        </Section>

        {/* ── Buttons ── */}
        <Section title="Buttons">
          <Row label="Variants">
            <Button variant="default">Primary (cobalt)</Button>
            <Button variant="brand">Brand (forest)</Button>
            <Button variant="accent">Accent (ember)</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link</Button>
          </Row>
          <Row label="Sizes">
            <Button size="xs">XS</Button>
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="xl">XL</Button>
          </Row>
          <Row label="States">
            <Button disabled>Disabled</Button>
            <Button variant="outline" disabled>Outline Disabled</Button>
          </Row>
        </Section>

        {/* ── Badges ── */}
        <Section title="Badges">
          <Row label="Base variants">
            <Badge variant="default">Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="muted">Muted</Badge>
            <Badge variant="brand">Brand</Badge>
            <Badge variant="accent">Accent</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="info">Info</Badge>
          </Row>
          <Row label="Priority">
            <Badge variant="p1">P1 Critical</Badge>
            <Badge variant="p2">P2 High</Badge>
            <Badge variant="p3">P3 Medium</Badge>
            <Badge variant="p4">P4 Low</Badge>
            <Badge variant="p5">P5 Minimal</Badge>
          </Row>
          <Row label="Experiment type">
            <Badge variant="ab">A/B Test</Badge>
            <Badge variant="multivariate">Multivariate</Badge>
            <Badge variant="flag">Feature Flag</Badge>
            <Badge variant="holdout">Holdout</Badge>
            <Badge variant="bandit">Bandit</Badge>
          </Row>
          <Row label="Analysis status">
            <Badge variant="pending">Pending</Badge>
            <Badge variant="running">Running</Badge>
            <Badge variant="completed">Completed</Badge>
            <Badge variant="failed">Failed</Badge>
          </Row>
          <Row label="Sizes">
            <Badge variant="default" size="sm">Small</Badge>
            <Badge variant="default" size="md">Medium</Badge>
            <Badge variant="default" size="lg">Large</Badge>
          </Row>
        </Section>

        {/* ── Cards ── */}
        <Section title="Cards">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Standard Card</CardTitle>
                <CardDescription>forest-800 bg · border · shadow-sm</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[var(--foreground-muted)]">Card body content sits here.</p>
              </CardContent>
              <CardFooter className="gap-2">
                <Button size="sm">Action</Button>
                <Button size="sm" variant="ghost">Cancel</Button>
              </CardFooter>
            </Card>

            <CardGradient>
              <CardHeader>
                <CardTitle>Gradient Card</CardTitle>
                <CardDescription>gradient-surface — forest-800 → forest-850</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[var(--foreground-muted)]">Used to highlight key sections.</p>
              </CardContent>
              <CardFooter>
                <Button size="sm" variant="secondary">Learn more</Button>
              </CardFooter>
            </CardGradient>
          </div>

          {/* Recommendation card sample */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Badge variant="p1" size="lg">P1</Badge>
                <div className="flex-1 space-y-3">
                  <p className="text-sm font-medium">
                    If we simplify onboarding from 5 steps to 3, then 7-day activation will improve by 18% because users reach first value moment faster.
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge variant="ab">A/B Test</Badge>
                    <ConfidenceMeter value={0.84} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-[var(--foreground-subtle)] uppercase tracking-wide">Evidence</p>
                    <ul className="space-y-0.5">
                      {[
                        '62% of users drop off at step 3 in the current flow',
                        'Median time-to-first-value is 8.4 min vs 3.2 min for retained users',
                        'Cohort analysis: step-3 dropoffs have 0% week-2 retention',
                      ].map((e, i) => (
                        <li key={i} className="flex gap-2 text-sm text-[var(--foreground-muted)]">
                          <span className="text-[var(--forest-400)] shrink-0">•</span>
                          <span>{e}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Section>

        {/* ── Inputs ── */}
        <Section title="Form Inputs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Normal</label>
              <Input placeholder="e.g. Checkout funnel Q3" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-destructive">Error state</label>
              <Input error defaultValue="bad-email" />
              <p className="text-xs text-destructive">Please enter a valid email</p>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Disabled</label>
              <Input placeholder="Disabled" disabled />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">URL</label>
              <Input type="url" placeholder="https://myapp.com" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-sm font-medium text-foreground">Textarea</label>
              <Textarea placeholder="Describe your business goal…" rows={3} />
            </div>
          </div>
        </Section>

        {/* ── Dropdown ── */}
        <Section title="Dropdown (Select)">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
            <Dropdown
              label="Primary metric"
              placeholder="Select a metric…"
              options={[
                { value: 'cvr', label: 'Conversion rate', description: 'Primary funnel conversion' },
                { value: 'arpu', label: 'ARPU', description: 'Average revenue per user' },
                { value: 'ltv', label: 'LTV', description: 'Lifetime value' },
                { value: 'retention', label: 'Retention (D7)', description: 'Day-7 user retention' },
                { value: 'nps', label: 'NPS', description: 'Net promoter score' },
              ]}
            />
            <Dropdown
              label="Experiment type"
              placeholder="Select type…"
              options={[
                { value: 'ab', label: 'A/B Test' },
                { value: 'mv', label: 'Multivariate' },
                { value: 'flag', label: 'Feature flag' },
                { value: 'holdout', label: 'Holdout' },
                { value: 'bandit', label: 'Bandit' },
              ]}
            />
            <Dropdown
              label="Disabled"
              placeholder="Cannot select"
              disabled
              options={[{ value: 'x', label: 'Option' }]}
            />
            <Dropdown
              label="Error state"
              placeholder="Required field"
              error
              options={[
                { value: 'a', label: 'Option A' },
                { value: 'b', label: 'Option B' },
              ]}
            />
          </div>
        </Section>

        {/* ── Progress ── */}
        <Section title="Progress & Confidence">
          <div className="max-w-sm space-y-6">
            <Row label="Variants">
              <div className="w-full space-y-3">
                {[
                  { label: 'Default (cobalt)',      v: 'default'  as const, val: 65 },
                  { label: 'Brand (forest green)',   v: 'brand'    as const, val: 88 },
                  { label: 'Accent (ember orange)',  v: 'accent'   as const, val: 42 },
                  { label: 'Danger',                 v: 'danger'   as const, val: 18 },
                  { label: 'Gradient (leaf burst)',   v: 'gradient' as const, val: 73 },
                ].map(p => (
                  <div key={p.label}>
                    <p className="text-xs text-[var(--foreground-muted)] mb-1">{p.label}</p>
                    <Progress value={p.val} variant={p.v} showLabel />
                  </div>
                ))}
              </div>
            </Row>
            <Row label="Confidence meter (0–1)">
              <div className="w-full space-y-2">
                {[
                  { label: '≥80% → brand (high)',   v: 0.84 },
                  { label: '50–79% → primary (mid)', v: 0.56 },
                  { label: '<50% → accent (low)',    v: 0.31 },
                ].map(c => (
                  <div key={c.label} className="flex items-center gap-3">
                    <span className="text-xs text-[var(--foreground-muted)] w-44 shrink-0">{c.label}</span>
                    <ConfidenceMeter value={c.v} />
                  </div>
                ))}
              </div>
            </Row>
          </div>
        </Section>

        {/* ── Alerts ── */}
        <Section title="Alerts">
          <div className="space-y-3">
            <Alert variant="success" title="Analysis complete">
              5 experiment recommendations generated.
            </Alert>
            <Alert variant="info" title="Pro tip">
              Upload CSV exports to raise confidence scores above 80%.
            </Alert>
            <Alert variant="warning" title="Low confidence">
              No data uploaded — context-only analysis.
            </Alert>
            <Alert variant="destructive" title="Analysis failed">
              AI returned invalid response. Please try again.
            </Alert>
            <Alert variant="default">
              Neutral status message.
            </Alert>
          </div>
        </Section>

        {/* ── Skeletons ── */}
        <Section title="Loading States">
          <Row label="Inline">
            <div className="space-y-2 w-full max-w-xs">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </Row>
          <Row label="Card skeleton">
            <div className="w-full max-w-sm">
              <SkeletonCard />
            </div>
          </Row>
        </Section>

        {/* ── Separator ── */}
        <Section title="Separator">
          <div className="space-y-4 max-w-xs">
            <p className="text-sm text-foreground">Content above</p>
            <Separator />
            <p className="text-sm text-foreground">Content below</p>
            <div className="flex items-center gap-3 h-6">
              <span className="text-sm text-foreground">Left</span>
              <Separator orientation="vertical" />
              <span className="text-sm text-foreground">Right</span>
            </div>
          </div>
        </Section>

        {/* ── Avatars ── */}
        <Section title="Avatar">
          <Row label="Sizes · forest / cobalt / ember variants">
            <Avatar initials="AK" size="sm" variant="forest" />
            <Avatar initials="AK" size="md" variant="forest" />
            <Avatar initials="AK" size="lg" variant="cobalt" />
            <Avatar initials="AK" size="xl" variant="ember" />
          </Row>
          <Row label="Different initials">
            <Avatar initials="JS" size="md" variant="forest" />
            <Avatar initials="PL" size="md" variant="cobalt" />
            <Avatar initials="EI" size="md" variant="ember" />
          </Row>
        </Section>

        {/* ── Stat Cards ── */}
        <Section title="Stat Cards">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard label="Total projects" value="12"  subvalue="Active this month" trend="up"      trendValue="3 new"  icon="📁" />
            <StatCard label="Analyses run"   value="38"  subvalue="Last 30 days"       trend="up"      trendValue="+14%"   icon="🤖" variant="primary" />
            <StatCard label="Avg confidence" value="73%" subvalue="Across all recs"    trend="up"      trendValue="+5pts"  icon="📊" variant="brand" />
            <StatCard label="Recommendations" value="142" subvalue="Total generated"   trend="neutral" trendValue="Stable" icon="💡" variant="accent" />
          </div>
        </Section>

        {/* ── Date Picker ── */}
        <Section title="Date Picker">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Experiment start date</label>
              <DatePicker placeholder="Pick a date" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">With min date (today)</label>
              <DatePicker placeholder="Future dates only" minDate={new Date()} />
            </div>
          </div>
        </Section>

        {/* ── Scheduler ── */}
        <Section title="Scheduler">
          <div className="max-w-sm">
            <Scheduler label="Analysis schedule" />
          </div>
        </Section>

        {/* ── Full gradient showcase ── */}
        <Section title="Gradient Showcase">
          <div className="gradient-emerald rounded-2xl p-8 space-y-4 border border-[var(--forest-200)]">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--forest-600)]">AI Analysis Ready — gradient-emerald</p>
            <h3 className="text-2xl font-bold text-[var(--forest-900)]">Your data is generating insights</h3>
            <p className="text-[var(--forest-700)] text-sm max-w-md">
              5 experiment recommendations prioritized by impact and evidence strength.
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="p1">P1 Critical ×1</Badge>
              <Badge variant="p2">P2 High ×2</Badge>
              <Badge variant="p3">P3 Medium ×2</Badge>
            </div>
            <div className="flex gap-3 pt-2">
              <Button size="sm">View recommendations</Button>
              <Button size="sm" variant="secondary">Run again</Button>
            </div>
          </div>

          <div className="gradient-violet rounded-2xl p-8 space-y-2 border border-[var(--violet-200)]">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--violet-600)]">Violet — AI & Statistical — gradient-violet</p>
            <h3 className="text-xl font-bold text-[var(--violet-900)]">Confidence · Significance · p-values</h3>
            <p className="text-[var(--violet-700)] text-sm">violet-100 → violet-50 — use for AI confidence scores and statistical output sections.</p>
          </div>

          <div className="gradient-teal rounded-2xl p-8 space-y-2 border border-[var(--teal-200)]">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--teal-600)]">Teal — Live Data — gradient-teal</p>
            <h3 className="text-xl font-bold text-[var(--teal-900)]">Real-time · Running Experiments · Streaming</h3>
            <p className="text-[var(--teal-700)] text-sm">teal-100 → teal-50 — use for live experiment status and real-time metric feeds.</p>
          </div>

          <div className="gradient-ember rounded-2xl p-8 space-y-2 border border-[var(--ember-200)]">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--ember-600)]">Ember — Accent CTA — gradient-ember</p>
            <h3 className="text-xl font-bold text-[var(--ember-900)]">Urgency · Highlights · Upsell</h3>
            <p className="text-[var(--ember-700)] text-sm">ember-100 → ember-50 — use for urgency states and premium/upsell sections.</p>
          </div>

          <div className="gradient-rose rounded-2xl p-8 space-y-2 border border-[var(--rose-200)]">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--rose-600)]">Rose — Negative Results — gradient-rose</p>
            <h3 className="text-xl font-bold text-[var(--rose-900)]">Failed Experiments · Drop-off · Losses</h3>
            <p className="text-[var(--rose-700)] text-sm">rose-100 → rose-50 — use for failure states, negative metric movements.</p>
          </div>
        </Section>

        {/* ── Component Index ── */}
        <Section title="Component Index">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] divide-y divide-[var(--border)] overflow-hidden">
            {[
              { name: 'Badge',     file: 'src/components/ui/badge.tsx',    desc: '20+ variants — priority, experiment type, status, semantic' },
              { name: 'Button',    file: 'src/components/ui/button.tsx',    desc: 'Base UI + CVA — default/brand/accent/secondary/outline/ghost/link' },
              { name: 'Card',      file: 'src/components/ui/card.tsx',      desc: 'Card + CardGlass + CardGradient + subcomponents' },
              { name: 'Input',      file: 'src/components/ui/input.tsx',       desc: 'Error state, green focus ring, hover bg, rounded-md' },
              { name: 'Textarea',   file: 'src/components/ui/textarea.tsx',    desc: 'Error state, green focus ring, hover bg, rounded-md' },
              { name: 'Dropdown',   file: 'src/components/ui/dropdown.tsx',    desc: 'Keyboard nav, descriptions, error/disabled, click-outside' },
              { name: 'DatePicker', file: 'src/components/ui/date-picker.tsx', desc: 'Month grid, today highlight, min/max, clear, Today shortcut' },
              { name: 'Scheduler',  file: 'src/components/ui/scheduler.tsx',   desc: 'Day toggle, hour scroll, minute grid, human-readable summary' },
              { name: 'Progress',   file: 'src/components/ui/progress.tsx',    desc: '5 variants, 3 sizes + ConfidenceMeter (0–1)' },
              { name: 'Alert',      file: 'src/components/ui/alert.tsx',       desc: 'success / info / warning / destructive / default' },
              { name: 'Skeleton',   file: 'src/components/ui/skeleton.tsx',    desc: 'Skeleton, SkeletonCard, SkeletonList' },
              { name: 'Separator',  file: 'src/components/ui/separator.tsx',   desc: 'Horizontal + vertical' },
              { name: 'Avatar',     file: 'src/components/ui/avatar.tsx',      desc: 'forest/cobalt/ember variants, initials or image, 4 sizes' },
              { name: 'StatCard',   file: 'src/components/ui/stat-card.tsx',   desc: 'default/primary/brand/accent variants + trend arrows' },
            ].map(c => (
              <div key={c.name} className="px-5 py-3.5 flex items-start gap-4">
                <span className="font-semibold text-sm text-[var(--forest-400)] w-24 shrink-0">{c.name}</span>
                <code className="text-xs text-[var(--foreground-subtle)] font-mono w-60 shrink-0 pt-px">{c.file}</code>
                <span className="text-sm text-[var(--foreground-muted)]">{c.desc}</span>
              </div>
            ))}
          </div>
        </Section>

      </main>

      <footer className="border-t border-[var(--border)] bg-[var(--surface)] px-8 py-6 text-center">
        <p className="text-xs text-[var(--foreground-subtle)]">
          Experiment Intelligence Design System ·{' '}
          <span className="text-[var(--forest-400)] font-medium">Forest #3fbb5e · Cobalt #3068d4 · Ember #ed8020</span>{' '}
          · Tailwind v4 + Base UI + CSS custom properties
        </p>
      </footer>
    </div>
  )
}
