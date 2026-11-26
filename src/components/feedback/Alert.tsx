import type {
  HTMLAttributes,
  ReactNode,
} from 'react'

import {
  CircleCheck,
  CircleAlert,
  TriangleAlert,
  Info,
} from 'lucide-react'

type AlertVariant =
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'

type AlertProps = HTMLAttributes<HTMLDivElement> & {
  variant?: AlertVariant
  title?: string
  children?: ReactNode
}

const variants = {
  success: {
    className:
      'bg-success-light text-success',
    icon: CircleCheck,
  },

  warning: {
    className:
      'bg-warning-light text-warning',
    icon: TriangleAlert,
  },

  danger: {
    className:
      'bg-danger-light text-danger',
    icon: CircleAlert,
  },

  info: {
    className:
      'bg-info-light text-info',
    icon: Info,
  },
}

export default function Alert({
  variant = 'info',
  title,
  children,
  className = '',
  ...props
}: AlertProps) {
  const configuration = variants[variant]
  const Icon = configuration.icon

  return (
    <div
      {...props}
      className={`
        flex items-start gap-3
        rounded-muv-card p-4

        ${configuration.className}
        ${className}
      `}
    >
      <Icon
        size={20}
        className="mt-0.5 shrink-0"
        aria-hidden="true"
      />

      <div className="min-w-0 flex-1">

        {title && (
          <p className="font-semibold">
            {title}
          </p>
        )}

        {children && (
          <div
            className={`
              text-muv-body
              ${title ? 'mt-1' : ''}
            `}
          >
            {children}
          </div>
        )}

      </div>
    </div>
  )
}