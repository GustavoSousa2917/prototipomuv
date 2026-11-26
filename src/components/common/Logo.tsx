type LogoProps = {
  variant?: 'full' | 'symbol' | 'inverse'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizes = {
  sm: {
    symbol: 'size-7',
    text: 'text-xl',
  },
  md: {
    symbol: 'size-8',
    text: 'text-2xl',
  },
  lg: {
    symbol: 'size-12',
    text: 'text-4xl',
  },
}

export default function Logo({
  variant = 'full',
  size = 'md',
  className = '',
}: LogoProps) {
  const selectedSize = sizes[size]
  const isInverse = variant === 'inverse'

  return (
    <span
      role="img"
      aria-label="MUV"
      className={`inline-flex items-center gap-2 ${className}`}
    >
      <span
        aria-hidden="true"
        className={`
          inline-flex shrink-0 items-center justify-center
          rounded-[28%]
          ${selectedSize.symbol}
          ${isInverse
            ? 'bg-white text-primary'
            : 'bg-primary text-white'
          }
        `}
      >
        <svg
          viewBox="0 0 32 32"
          fill="none"
          className="size-[80%]"
          aria-hidden="true"
        >
          <path
            d="
              M19 10
              H11
              C5 10 5 16 11 16
              H21
              C27 16 27 22 21 22
              H13
            "
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <circle
            cx="22"
            cy="10"
            r="3"
            stroke="currentColor"
            strokeWidth="2"
          />

          <circle
            cx="10"
            cy="22"
            r="3"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      </span>

      {variant !== 'symbol' && (
        <span
          aria-hidden="true"
          className={`
            font-bold tracking-tight
            ${selectedSize.text}
            ${isInverse ? 'text-white' : 'text-primary-dark'}
          `}
        >
          MUV
        </span>
      )}
    </span>
  )
}