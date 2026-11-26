import { LoaderCircle } from 'lucide-react'

type LoadingSize = 'sm' | 'md' | 'lg'

type LoadingProps = {
  message?: string
  size?: LoadingSize
  inline?: boolean
  className?: string
}

const sizes: Record<LoadingSize, number> = {
  sm: 18,
  md: 28,
  lg: 40,
}

export default function Loading({
  message = 'Carregando informações...',
  size = 'md',
  inline = false,
  className = '',
}: LoadingProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`
        flex items-center justify-center
        gap-3 text-muted

        ${inline
          ? 'flex-row'
          : 'flex-col py-12 text-center'
        }

        ${className}
      `}
    >
      <LoaderCircle
        size={sizes[size]}
        className="shrink-0 animate-spin text-primary"
        aria-hidden="true"
      />

      <span className="text-muv-body">
        {message}
      </span>

    </div>
  )
}