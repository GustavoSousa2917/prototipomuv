import type { HTMLAttributes } from 'react'

type CardPadding = 'none' | 'sm' | 'md' | 'lg'

type CardProps = HTMLAttributes<HTMLDivElement> & {
  padding?: CardPadding
  elevated?: boolean
}

const paddings: Record<CardPadding, string> = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

export default function Card({
  children,
  padding = 'md',
  elevated = false,
  className = '',
  ...props
}: CardProps) {
  return (
    <div
      {...props}
      className={`
        rounded-muv-panel
        border border-border
        bg-surface

        ${elevated ? 'shadow-muv-md' : 'shadow-muv-sm'}
        ${paddings[padding]}
        ${className}
      `}
    >
      {children}
    </div>
  )
}