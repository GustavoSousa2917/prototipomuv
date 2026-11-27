import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'

import Card from '../ui/Card'
import Logo from './Logo'

export default function AccessScreen({ title, code, children }: {
  title: string
  code?: string
  children: ReactNode
}) {
  const titleRef = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    titleRef.current?.focus({ preventScroll: true })
    window.scrollTo(0, 0)
  }, [title])

  return (
    <main className="grid min-h-dvh place-items-center bg-background px-4 py-8">
      <Card className="w-full max-w-md space-y-5 sm:p-8">
        <Logo />
        {code && <p className="text-muv-display font-bold text-primary">{code}</p>}
        <h1 ref={titleRef} tabIndex={-1} className="text-muv-h1 font-bold">{title}</h1>
        {children}
      </Card>
    </main>
  )
}
