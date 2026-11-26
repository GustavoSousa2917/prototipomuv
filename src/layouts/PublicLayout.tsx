import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router'

import PublicHeader from '../components/navigation/PublicHeader'
import PublicFooter from '../components/navigation/PublicFooter'

export default function PublicLayout() {
  const { pathname, hash, key } = useLocation()

  useEffect(() => {
    const target = hash
      ? document.getElementById(hash.slice(1))
      : null

    if (target) {
      target.focus({ preventScroll: true })

      target.scrollIntoView({
        block: 'start',
        behavior: 'auto',
      })

      return
    }

    document.getElementById('main-content')?.focus({
      preventScroll: true,
    })

    window.scrollTo({
      top: 0,
      behavior: 'auto',
    })
  }, [pathname, hash, key])

  return (
    <div className="flex min-h-screen flex-col bg-background">

      <a
        href="#main-content"
        className="
          sr-only focus:not-sr-only
          focus:fixed focus:left-4 focus:top-4
          focus:z-50 focus:rounded-muv-button
          focus:bg-primary focus:p-3
          focus:text-white
        "
      >
        Ir para o conteúdo principal
      </a>

      <PublicHeader />

      <main
        id="main-content"
        tabIndex={-1}
        className="min-w-0 flex-1"
      >
        <Outlet />
      </main>

      <PublicFooter />

    </div>
  )
}