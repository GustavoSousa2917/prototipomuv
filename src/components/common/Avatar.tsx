import { useState } from 'react'
import { UserRound } from 'lucide-react'

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl'

type AvatarProps = {
  name: string
  src?: string
  size?: AvatarSize
  className?: string
}

const sizes: Record<AvatarSize, string> = {
  sm: 'size-8 text-muv-small',
  md: 'size-10 text-muv-body',
  lg: 'size-14 text-muv-h3',
  xl: 'size-20 text-muv-h2',
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)

  if (parts.length === 0) {
    return ''
  }

  if (parts.length === 1) {
    return Array.from(parts[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
  }

  return (
    Array.from(parts[0])[0] +
    Array.from(parts[parts.length - 1])[0]
  ).toUpperCase()
}

export default function Avatar({
  name,
  src,
  size = 'md',
  className = '',
}: AvatarProps) {
  const [failedSrc, setFailedSrc] =
    useState<string | null>(null)

  const initials = getInitials(name)

  const showImage =
    Boolean(src) && failedSrc !== src

  return (
    <span
      role="img"
      aria-label={name.trim() || 'Usuário'}
      className={`
        inline-flex shrink-0
        items-center justify-center
        overflow-hidden rounded-full
        bg-primary-light text-primary
        font-semibold

        ${sizes[size]}
        ${className}
      `}
    >
      {showImage ? (
        <img
          src={src}
          alt=""
          className="size-full object-cover"
          onError={() => setFailedSrc(src ?? null)}
        />
      ) : initials ? (
        <span aria-hidden="true">
          {initials}
        </span>
      ) : (
        <UserRound
          className="size-1/2"
          aria-hidden="true"
        />
      )}
    </span>
  )
}