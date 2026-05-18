import { Button as ButtonPrimitive } from '@base-ui/react/button'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  [
    'group/button inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full',
    'text-sm font-semibold whitespace-nowrap select-none',
    'outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]/20 focus-visible:ring-offset-1 focus-visible:ring-offset-background',
    'disabled:pointer-events-none disabled:opacity-40',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4',
    'transition-[color,background-color,border-color,box-shadow,transform,opacity]',
    'duration-150 [transition-timing-function:var(--ease-default)]',
    'active:scale-[0.96] active:duration-[50ms]',
  ].join(' '),
  {
    variants: {
      variant: {
        /* #133429 filled — primary action */
        default:
          'bg-primary text-primary-foreground shadow-[var(--shadow-sm)]' +
          ' hover:bg-[var(--primary-hover)] hover:-translate-y-px hover:shadow-[var(--shadow-primary)]' +
          ' active:bg-[var(--primary-active)] active:translate-y-0',
        /* Forest tint bg + forest border + dark forest text */
        secondary:
          'bg-[var(--forest-50)] border border-[var(--forest-200)] text-[var(--forest-700)]' +
          ' hover:bg-[var(--forest-100)] hover:border-[var(--forest-300)] hover:text-[var(--forest-800)] hover:-translate-y-px' +
          ' active:bg-[var(--forest-100)] active:translate-y-0',
        /* Solid bright green — strong CTA */
        brand:
          'bg-[var(--brand)] text-[var(--brand-foreground)] shadow-[var(--shadow-sm)]' +
          ' hover:bg-[var(--brand-hover)] hover:-translate-y-px hover:shadow-[var(--shadow-brand)]' +
          ' active:translate-y-0',
        /* Ember orange — accent CTA */
        accent:
          'bg-accent text-accent-foreground shadow-[var(--shadow-sm)]' +
          ' hover:bg-[var(--accent-hover)] hover:-translate-y-px hover:shadow-[var(--shadow-accent)]' +
          ' active:translate-y-0',
        /* Ghost — transparent, no lift */
        ghost:
          'text-[var(--foreground-muted)] hover:bg-[var(--background-elevated)] hover:text-foreground',
        /* Outline — subtle lift */
        outline:
          'border border-[var(--border)] text-foreground bg-white' +
          ' hover:bg-[var(--background-elevated)] hover:border-[var(--border-strong)] hover:-translate-y-px' +
          ' active:translate-y-0',
        /* Destructive */
        destructive:
          'bg-[var(--rose-50)] text-[var(--rose-700)] border border-[var(--rose-200)] hover:bg-[var(--rose-100)]',
        /* Link */
        link: 'text-[var(--forest-700)] underline-offset-4 hover:underline p-0 h-auto',
      },
      size: {
        xs:       'h-7 px-2.5 text-xs',
        sm:       'h-8 px-3 text-sm',
        default:  'h-11 px-4',
        lg:       'h-11 px-6 text-base',
        xl:       'h-12 px-8 text-base',
        icon:     'size-9',
        'icon-sm':'size-8',
        'icon-lg':'size-11',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

function Button({
  className,
  variant = 'default',
  size = 'default',
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
