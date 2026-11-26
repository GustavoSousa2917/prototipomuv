import type { HTMLAttributes } from 'react'

type BadgeVariant =
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral'

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant
}

const variants: Record<BadgeVariant, string> = {
  success: 'bg-success-light text-success',
  warning: 'bg-warning-light text-warning',
  danger: 'bg-danger-light text-danger',
  info: 'bg-info-light text-info',
  neutral: 'bg-neutral-light text-neutral',
}

export default function Badge({
  variant = 'neutral',
  children,
  className = '',
  ...props
}: BadgeProps) {
  return (
    <span
      {...props}
      className={`
        inline-flex max-w-full items-center gap-1.5
        rounded-full px-3 py-1
        text-muv-small font-medium

        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  )
}