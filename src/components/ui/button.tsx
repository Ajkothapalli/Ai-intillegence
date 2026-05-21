import { Button as ButtonPrimitive } from '@base-ui/react/button'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  [
    'group/button inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl',
    'text-sm font-semibold whitespace-nowrap select-none',
    'outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]',
    'disabled:pointer-events-none disabled:opacity-35',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4',
    'transition-[color,background-color,border-color,box-shadow,transform,opacity]',
    'duration-150 [transition-timing-function:var(--ease-default)]',
    'active:scale-[0.96] active:duration-[50ms]',
  ].join(' '),
  {
    variants: {
      variant: {
        /* Violet filled — Midjourney-style glow shadow */
        default:
          'bg-primary text-primary-foreground shadow-[var(--shadow-primary)]' +
          ' hover:bg-[var(--primary-hover)] hover:-translate-y-px hover:shadow-[var(--shadow-primary-hover)]' +
          ' active:bg-[var(--primary-active)] active:translate-y-0',

        /* Dark glass — semi-transparent surface with depth shadow */
        secondary:
          'bg-white/7 border border-white/10 text-foreground' +
          ' shadow-[0_1px_3px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.06)]' +
          ' hover:bg-white/11 hover:border-white/16 hover:-translate-y-px' +
          ' hover:shadow-[0_2px_8px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.08)]' +
          ' active:translate-y-0',

        /* Bright teal accent — Midjourney brand glow */
        brand:
          'bg-[var(--brand)] text-[var(--brand-foreground)] shadow-[var(--shadow-brand)]' +
          ' hover:bg-[var(--brand-hover)] hover:-translate-y-px hover:shadow-[var(--shadow-brand-hover)]' +
          ' active:translate-y-0',

        /* Ember orange — accent CTA glow */
        accent:
          'bg-accent text-accent-foreground shadow-[var(--shadow-accent)]' +
          ' hover:bg-[var(--accent-hover)] hover:-translate-y-px hover:shadow-[var(--shadow-accent-hover)]' +
          ' active:translate-y-0',

        /* Ghost — no background, subtle hover fill */
        ghost:
          'text-[var(--foreground-muted)] hover:bg-white/6 hover:text-foreground',

        /* Outline — thin border, glass hover */
        outline:
          'border border-white/12 text-foreground bg-transparent' +
          ' hover:bg-white/6 hover:border-white/20 hover:-translate-y-px' +
          ' active:translate-y-0',

        /* Destructive */
        destructive:
          'bg-[rgba(224,51,96,0.12)] text-[var(--rose-400)] border border-[rgba(224,51,96,0.20)]' +
          ' hover:bg-[rgba(224,51,96,0.18)] hover:border-[rgba(224,51,96,0.30)]',

        /* Link */
        link: 'text-[var(--link)] underline-offset-4 hover:underline hover:text-[var(--link-hover)] p-0 h-auto',
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
