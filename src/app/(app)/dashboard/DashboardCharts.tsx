'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { ActivityDay } from '@/features/projects/queries'

interface TooltipEntry {
  name: string
  value: number
  color: string
}

interface CustomTooltipProps {
  active?: boolean
  payload?: TooltipEntry[]
  label?: string
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-[var(--border)] rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.10)] px-4 py-3 text-xs">
      <p className="font-semibold text-foreground mb-2">{label}</p>
      {payload.map(entry => (
        <div key={entry.name} className="flex items-center gap-2 mb-1 last:mb-0">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: entry.color }} />
          <span className="text-[var(--foreground-muted)] capitalize">{entry.name}</span>
          <span className="ml-auto font-semibold text-foreground tabular-nums">{entry.value}</span>
        </div>
      ))}
    </div>
  )
}

interface Props {
  data: ActivityDay[]
}

export function DashboardCharts({ data }: Props) {
  // Show every 5th label so x-axis isn't crowded
  const tickFormatter = (val: string, idx: number) => (idx % 5 === 0 ? val : '')

  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
        <defs>
          <linearGradient id="gradExp" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#196262" stopOpacity={0.18} />
            <stop offset="100%" stopColor="#196262" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gradRec" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.15} />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 11, fill: '#9ca3af' }}
          tickFormatter={tickFormatter}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 11, fill: '#9ca3af' }}
          allowDecimals={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#e5e7eb', strokeWidth: 1 }} />
        <Area
          type="monotone"
          dataKey="experiments"
          name="experiments"
          stroke="#196262"
          strokeWidth={2}
          fill="url(#gradExp)"
          dot={false}
          activeDot={{ r: 4, fill: '#196262', strokeWidth: 0 }}
        />
        <Area
          type="monotone"
          dataKey="recommendations"
          name="recommendations"
          stroke="#7c3aed"
          strokeWidth={2}
          fill="url(#gradRec)"
          dot={false}
          activeDot={{ r: 4, fill: '#7c3aed', strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
