'use client'

import {
  AreaChart, Area,
  BarChart, Bar,
  XAxis, YAxis,
  CartesianGrid, Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from 'recharts'

// ── Shared tooltip ──────────────────────────────────────────────────

function ChartTooltip({ active, payload, label, valueFormatter = (v: number) => String(v) }: {
  active?: boolean
  payload?: Array<{ value: number; color: string; name: string }>
  label?: string
  valueFormatter?: (v: number) => string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-[var(--border)] bg-white shadow-[var(--shadow-md)] px-3 py-2 text-xs space-y-1">
      {label && <p className="font-medium text-[var(--foreground-muted)] mb-1">{label}</p>}
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: p.color }} />
          <span className="text-foreground font-medium">{valueFormatter(p.value)}</span>
          {p.name && <span className="text-[var(--foreground-subtle)]">{p.name}</span>}
        </div>
      ))}
    </div>
  )
}

// ── Area chart ──────────────────────────────────────────────────────

type AreaSeries = { key: string; color: string; label?: string }

export function AreaChartComponent({
  data,
  series,
  xKey,
  height = 220,
  valueFormatter,
  className,
}: {
  data: Record<string, string | number>[]
  series: AreaSeries[]
  xKey: string
  height?: number
  valueFormatter?: (v: number) => string
  className?: string
}) {
  return (
    <div className={className} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            {series.map(s => (
              <linearGradient key={s.key} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={s.color} stopOpacity={0.18} />
                <stop offset="100%" stopColor={s.color} stopOpacity={0.01} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey={xKey}
            tick={{ fontSize: 10, fill: 'var(--foreground-subtle)' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: 'var(--foreground-subtle)' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={valueFormatter}
          />
          <Tooltip content={<ChartTooltip valueFormatter={valueFormatter} />} />
          {series.map(s => (
            <Area
              key={s.key}
              type="monotone"
              dataKey={s.key}
              stroke={s.color}
              strokeWidth={2}
              fill={`url(#grad-${s.key})`}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
              name={s.label}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

// ── Grouped vertical bar chart ─────────────────────────────────────

type BarSeries = { key: string; color: string; label?: string }

export function GroupedBarChart({
  data,
  series,
  xKey,
  height = 220,
  valueFormatter,
  className,
}: {
  data: Record<string, string | number>[]
  series: BarSeries[]
  xKey: string
  height?: number
  valueFormatter?: (v: number) => string
  className?: string
}) {
  return (
    <div className={className} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barGap={3} barCategoryGap="28%">
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey={xKey}
            tick={{ fontSize: 10, fill: 'var(--foreground-subtle)' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: 'var(--foreground-subtle)' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={valueFormatter}
          />
          <Tooltip content={<ChartTooltip valueFormatter={valueFormatter} />} cursor={{ fill: 'var(--background-elevated)' }} />
          <Legend
            iconType="circle"
            iconSize={7}
            wrapperStyle={{ fontSize: 10, color: 'var(--foreground-muted)', paddingTop: 8 }}
          />
          {series.map(s => (
            <Bar key={s.key} dataKey={s.key} name={s.label ?? s.key} fill={s.color} radius={[3, 3, 0, 0]} maxBarSize={20} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// ── Horizontal bar chart ────────────────────────────────────────────

export function HorizontalBarChart({
  data,
  height,
  valueFormatter,
  className,
}: {
  data: { label: string; value: number; color?: string }[]
  height?: number
  valueFormatter?: (v: number) => string
  className?: string
}) {
  const defaultHeight = data.length * 44 + 16
  return (
    <div className={className} style={{ height: height ?? defaultHeight }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 8, left: 0, bottom: 0 }}
          barCategoryGap="30%"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
          <XAxis
            type="number"
            domain={[0, 1]}
            tick={{ fontSize: 10, fill: 'var(--foreground-subtle)' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={valueFormatter ?? ((v: number) => `${Math.round(v * 100)}%`)}
          />
          <YAxis
            type="category"
            dataKey="label"
            width={24}
            tick={{ fontSize: 10, fill: 'var(--foreground-subtle)' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: string) => v}
          />
          <Tooltip
            content={<ChartTooltip valueFormatter={valueFormatter ?? ((v: number) => `${Math.round(v * 100)}%`)} />}
            cursor={{ fill: 'var(--background-elevated)' }}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={18}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color ?? 'var(--primary)'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
