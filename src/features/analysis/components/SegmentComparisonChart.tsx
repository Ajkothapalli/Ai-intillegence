'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from 'recharts'

export type SegmentStage = {
  name: string
  drop_off_rate: number
}

export type SegmentData = {
  dimension: string
  value: string
  stages: SegmentStage[]
}

interface Props {
  segments: SegmentData[]
}

const SEGMENT_COLORS = ['#7c3aed', '#f59e0b', '#10b981', '#3b82f6', '#f87171']

type TooltipPayload = {
  dataKey: string
  value: number
  color: string
}

type CustomTooltipProps = {
  active?: boolean
  label?: string
  payload?: TooltipPayload[]
}

function CustomTooltip({ active, label, payload }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null
  const sorted = [...payload].sort((a, b) => a.value - b.value)
  const best = sorted[0]
  const worst = sorted[sorted.length - 1]
  return (
    <div className="bg-slate-900 text-white text-xs rounded-lg px-3 py-2 shadow-xl max-w-[220px] space-y-1">
      <p className="font-semibold">{label}</p>
      {payload.map(p => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.dataKey}: {p.value}% drop-off
        </p>
      ))}
      {payload.length > 1 && worst && best && worst.dataKey !== best.dataKey && (
        <p className="text-red-300 text-[10px] pt-1 border-t border-white/10">
          {worst.dataKey} is {(worst.value - best.value).toFixed(1)}% worse than {best.dataKey}
        </p>
      )}
    </div>
  )
}

export function SegmentComparisonChart({ segments }: Props) {
  if (segments.length <= 1) return null

  // Build chart data: one row per stage
  const allStages = segments[0]?.stages.map(s => s.name) ?? []
  if (allStages.length === 0) return null

  const chartData = allStages.map(stageName => {
    const row: Record<string, string | number> = { stage: stageName }
    segments.forEach(seg => {
      const stageData = seg.stages.find(s => s.name === stageName)
      row[seg.value] = stageData?.drop_off_rate ?? 0
    })
    return row
  })

  // Find worst-performing segment per stage
  const worstPerStage = new Map<string, string>()
  chartData.forEach(row => {
    let worstVal = -1
    let worstKey = ''
    segments.forEach(seg => {
      const val = (row[seg.value] as number) ?? 0
      if (val > worstVal) { worstVal = val; worstKey = seg.value }
    })
    if (worstKey) worstPerStage.set(String(row.stage), worstKey)
  })

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex items-start gap-2 mb-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">Drop-off by segment</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Shows how different user groups perform at each funnel stage. Largest gaps = highest-priority experiment targets.
          </p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            dataKey="stage"
            tick={{ fontSize: 10, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            unit="%"
            tick={{ fontSize: 10, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
            domain={[0, 100]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: '11px', paddingTop: '12px' }}
          />
          {segments.map((seg, i) => (
            <Bar
              key={seg.value}
              dataKey={seg.value}
              fill={SEGMENT_COLORS[i % SEGMENT_COLORS.length]}
              radius={[3, 3, 0, 0]}
              maxBarSize={32}
            >
              {chartData.map((row) => {
                const isWorst = worstPerStage.get(String(row.stage)) === seg.value
                return (
                  <Cell
                    key={String(row.stage)}
                    fill={SEGMENT_COLORS[i % SEGMENT_COLORS.length]}
                    stroke={isWorst ? '#ef4444' : 'none'}
                    strokeWidth={isWorst ? 2 : 0}
                  />
                )
              })}
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
