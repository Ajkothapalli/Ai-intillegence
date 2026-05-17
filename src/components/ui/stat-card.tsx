import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: string | number
  subvalue?: string
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  icon?: React.ReactNode
  variant?: 'default' | 'primary' | 'brand' | 'accent'
  className?: string
}

const variantStyle = {
  default: 'border-[var(--border)] bg-white shadow-[var(--shadow-sm)]',
  primary: 'gradient-cobalt border-[var(--cobalt-200)] shadow-[var(--shadow-sm)]',
  brand:   'gradient-emerald border-[var(--forest-200)] shadow-[var(--shadow-sm)]',
  accent:  'gradient-ember border-[var(--ember-200)] shadow-[var(--shadow-sm)]',
}

const trendStyle = {
  up:      { color: 'text-[var(--forest-700)]', arrow: '↑' },
  down:    { color: 'text-[var(--rose-600)]',   arrow: '↓' },
  neutral: { color: 'text-[var(--foreground-muted)]', arrow: '→' },
}

export function StatCard({ label, value, subvalue, trend, trendValue, icon, variant = 'default', className }: StatCardProps) {
  const trendInfo = trend ? trendStyle[trend] : null

  return (
    <div
      className={cn(
        'rounded-xl border p-5 space-y-3',
        'transition-[transform,box-shadow,border-color] duration-200 [transition-timing-function:var(--ease-out)]',
        'hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]',
        variantStyle[variant],
        className
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-[var(--foreground-muted)]">{label}</p>
        {icon && <span className="text-xl opacity-70">{icon}</span>}
      </div>
      <div>
        <p className="text-2xl font-bold tracking-tight tabular-nums text-foreground" data-numeric="true">
          {value}
        </p>
        {subvalue && (
          <p className="text-xs mt-0.5 text-[var(--foreground-muted)]">{subvalue}</p>
        )}
      </div>
      {trendInfo && trendValue && (
        <p className={cn('text-xs font-medium flex items-center gap-1', trendInfo.color)}>
          <span>{trendInfo.arrow}</span>
          <span>{trendValue}</span>
        </p>
      )}
    </div>
  )
}
