import type {
  ButtonHTMLAttributes,
  ReactNode,
} from 'react'

import { LoaderCircle } from 'lucide-react'

type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'

type ButtonSize = 'sm' | 'md' | 'lg'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  fullWidth?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

const variants: Record<ButtonVariant, string> = {
  primary:
    'border-transparent bg-primary text-white hover:bg-primary-dark',

  secondary:
    'border-border bg-surface text-foreground hover:bg-background',

  outline:
    'border-primary bg-transparent text-primary hover:bg-primary-light',

  ghost:
    'border-transparent bg-transparent text-primary hover:bg-primary-light',

  danger:
    'border-transparent bg-danger text-white hover:brightness-90',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'min-h-9 px-3 text-muv-small',
  md: 'min-h-[var(--muv-button-height)] px-4 text-muv-body',
  lg: 'min-h-12 px-6 text-base',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  children,
  disabled,
  className = '',
  type = 'button',
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading

  return (
    <button
      {...props}
      type={type}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      className={`
        inline-flex items-center justify-center gap-2
        rounded-muv-button border
        font-medium transition-colors

        disabled:cursor-not-allowed
        disabled:border-border
        disabled:bg-neutral-light
        disabled:text-neutral

        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {loading ? (
        <LoaderCircle
          size={18}
          className="animate-spin"
          aria-hidden="true"
        />
      ) : (
        leftIcon && (
          <span aria-hidden="true">
            {leftIcon}
          </span>
        )
      )}

      {children}

      {!loading && rightIcon && (
        <span aria-hidden="true">
          {rightIcon}
        </span>
      )}
    </button>
  )
}