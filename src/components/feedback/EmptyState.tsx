import type { ReactNode } from 'react'

import { Inbox } from 'lucide-react'

type EmptyStateProps = {
  title: string
  description?: string
  icon?: ReactNode
  action?: ReactNode
  className?: string
}

export default function EmptyState({
  title,
  description,
  icon,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`
        flex flex-col items-center
        justify-center px-4 py-12
        text-center sm:px-6

        ${className}
      `}
    >
      <div
        aria-hidden="true"
        className="
          mb-5 flex size-16
          items-center justify-center
          rounded-full
          bg-primary-light text-primary
        "
      >
        {icon ?? <Inbox size={30} />}
      </div>

      <h3 className="text-muv-h3 font-semibold text-foreground">
        {title}
      </h3>

      {description && (
        <p className="mt-2 max-w-md text-muv-body text-muted">
          {description}
        </p>
      )}

      {action && (
        <div className="mt-6 max-w-full">
          {action}
        </div>
      )}

    </div>
  )
}