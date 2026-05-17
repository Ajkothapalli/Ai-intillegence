import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  [
    'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold select-none',
    'transition-[color,background-color,border-color,transform] duration-150 [transition-timing-function:var(--ease-default)]',
  ].join(' '),
  {
    variants: {
      variant: {
        /* Base */
        default:     'border-[var(--cobalt-200)] bg-[var(--cobalt-50)] text-[var(--cobalt-700)]',
        secondary:   'border-[var(--border)] bg-[var(--background-elevated)] text-[var(--foreground-muted)]',
        outline:     'border-[var(--border)] text-[var(--foreground-muted)] bg-transparent',
        muted:       'border-transparent bg-[var(--background-elevated)] text-[var(--foreground-muted)]',
        /* Semantic */
        brand:       'border-[var(--forest-200)] bg-[var(--forest-50)] text-[var(--forest-700)]',
        accent:      'border-[var(--ember-200)] bg-[var(--ember-50)] text-[var(--ember-700)]',
        success:     'border-[var(--forest-200)] bg-[var(--forest-50)] text-[var(--forest-700)]',
        warning:     'border-[var(--ember-200)] bg-[var(--ember-50)] text-[var(--ember-700)]',
        destructive: 'border-[var(--rose-200)] bg-[var(--rose-50)] text-[var(--rose-700)]',
        info:        'border-[var(--cobalt-200)] bg-[var(--cobalt-50)] text-[var(--cobalt-700)]',
        /* Priority */
        p1: 'border-red-200    bg-red-50    text-red-700',
        p2: 'border-orange-200 bg-orange-50 text-orange-700',
        p3: 'border-[var(--ember-200)] bg-[var(--ember-50)] text-[var(--ember-700)]',
        p4: 'border-[var(--forest-200)] bg-[var(--forest-50)] text-[var(--forest-700)]',
        p5: 'border-[var(--border)] bg-[var(--background-elevated)] text-[var(--foreground-muted)]',
        /* Experiment type */
        ab:           'border-purple-200 bg-purple-50 text-purple-700',
        multivariate: 'border-indigo-200 bg-indigo-50 text-indigo-700',
        flag:         'border-[var(--forest-200)] bg-[var(--forest-50)] text-[var(--forest-700)]',
        holdout:      'border-cyan-200 bg-cyan-50 text-cyan-700',
        bandit:       'border-pink-200 bg-pink-50 text-pink-700',
        /* Status */
        pending:   'border-[var(--border)] bg-[var(--background-elevated)] text-[var(--foreground-muted)]',
        running:   'border-[var(--cobalt-200)] bg-[var(--cobalt-50)] text-[var(--cobalt-700)]',
        completed: 'border-[var(--forest-200)] bg-[var(--forest-50)] text-[var(--forest-700)]',
        failed:    'border-[var(--rose-200)] bg-[var(--rose-50)] text-[var(--rose-700)]',
      },
      size: {
        sm: 'px-1.5 py-px text-[10px]',
        md: 'px-2.5 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm',
      },
    },
    defaultVariants: { variant: 'default', size: 'md' },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, size }), className)} {...props} />
}

export { badgeVariants }
