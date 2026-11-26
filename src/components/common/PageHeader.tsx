import type { ReactNode } from 'react'

type PageHeaderProps = {
  title: string
  description?: string
  eyebrow?: string
  actions?: ReactNode
  headingLevel?: 1 | 2 | 3
  className?: string
}

export default function PageHeader({
  title,
  description,
  eyebrow,
  actions,
  headingLevel = 1,
  className = '',
}: PageHeaderProps) {
  const Heading =
    headingLevel === 1
      ? 'h1'
      : headingLevel === 2
        ? 'h2'
        : 'h3'

  return (
    <header
      className={`
        flex flex-col gap-4

        lg:flex-row
        lg:items-center
        lg:justify-between

        ${className}
      `}
    >
      <div className="min-w-0 flex-1">

        {eyebrow && (
          <p className="mb-2 text-muv-small font-semibold uppercase tracking-wide text-primary">
            {eyebrow}
          </p>
        )}

        <Heading className="break-words text-muv-h2 font-bold text-foreground sm:text-muv-h1">
          {title}
        </Heading>

        {description && (
          <p className="mt-2 max-w-3xl text-muv-body text-muted">
            {description}
          </p>
        )}

      </div>

      {actions && (
        <div className="flex flex-wrap items-center gap-3">
          {actions}
        </div>
      )}

    </header>
  )
}