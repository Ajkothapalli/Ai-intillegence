import { cn } from '@/lib/utils'

interface ProgressProps {
  value: number
  max?: number
  variant?: 'default' | 'brand' | 'accent' | 'danger' | 'gradient'
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

const trackSize = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-4' }

const fillClass = {
  default:  'bg-primary',
  brand:    'bg-[var(--brand)]',
  accent:   'bg-accent',
  danger:   'bg-destructive',
  gradient: 'bg-gradient-to-r from-[var(--forest-600)] to-[var(--teal-500)]',
}

export function Progress({ value, max = 100, variant = 'default', size = 'md', showLabel = false, className }: ProgressProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        className={cn('flex-1 overflow-hidden rounded-full bg-[var(--background-elevated)]', trackSize[size])}
      >
        <div
          className={cn(
            'h-full rounded-full',
            'transition-[width,opacity] duration-500 [transition-timing-function:var(--ease-out)]',
            fillClass[variant]
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-[var(--foreground-muted)] tabular-nums w-9 text-right" data-numeric="true">
          {Math.round(pct)}%
        </span>
      )}
    </div>
  )
}

export function ConfidenceMeter({ value, className }: { value: number; className?: string }) {
  const pct = Math.round(value * 100)
  const variant = value >= 0.8 ? 'brand' : value >= 0.5 ? 'default' : 'accent'
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Progress value={pct} variant={variant} size="sm" className="w-24 flex-none" />
      <span className="text-xs text-[var(--foreground-muted)] tabular-nums" data-numeric="true">{pct}%</span>
    </div>
  )
}
