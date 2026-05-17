import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const alertVariants = cva(
  [
    'relative flex gap-3 rounded-xl border p-4 text-sm',
    'motion-enter',
  ].join(' '),
  {
    variants: {
      variant: {
        default:     'border-[var(--border)] bg-[var(--surface)] text-foreground',
        success:     'border-[var(--forest-200)] bg-[var(--forest-50)] text-[var(--forest-800)]',
        warning:     'border-[var(--ember-200)] bg-[var(--ember-50)] text-[var(--ember-800)]',
        destructive: 'border-[var(--rose-200)] bg-[var(--rose-50)] text-[var(--rose-800)]',
        info:        'border-[var(--cobalt-200)] bg-[var(--cobalt-50)] text-[var(--cobalt-800)]',
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

const iconColor: Record<string, string> = {
  default:     'text-[var(--foreground-muted)]',
  success:     'text-[var(--forest-600)]',
  warning:     'text-[var(--ember-600)]',
  destructive: 'text-[var(--rose-600)]',
  info:        'text-[var(--cobalt-600)]',
}

const defaultIcon: Record<string, string> = {
  default: 'ℹ', success: '✓', warning: '⚠', destructive: '✕', info: 'ℹ',
}

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof alertVariants> {
  icon?: React.ReactNode
  title?: string
}

export function Alert({ className, variant = 'default', icon, title, children, ...props }: AlertProps) {
  const v = variant ?? 'default'
  return (
    <div role="alert" className={cn(alertVariants({ variant }), className)} {...props}>
      <span className={cn('shrink-0 text-base leading-5 font-bold', iconColor[v])}>
        {icon ?? defaultIcon[v]}
      </span>
      <div className="flex-1 min-w-0">
        {title && <p className="font-semibold mb-0.5">{title}</p>}
        <div className="opacity-90">{children}</div>
      </div>
    </div>
  )
}
