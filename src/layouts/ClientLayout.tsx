import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router'

import ClientHeader from '../components/navigation/ClientHeader'

export default function ClientLayout() {
  const location = useLocation()

  useEffect(() => {
    document.getElementById('client-main-content')?.focus({
      preventScroll: true,
    })

    window.scrollTo({
      top: 0,
      behavior: 'auto',
    })
  }, [location.key])

  return (
    <div className="flex min-h-screen flex-col bg-background">

      <a
        href="#client-main-content"
        className="
          sr-only focus:not-sr-only
          focus:fixed focus:left-4 focus:top-4
          focus:z-50 focus:rounded-muv-button
          focus:bg-primary focus:p-3 focus:text-white
        "
      >
        Ir para o conteúdo principal
      </a>

      <ClientHeader key={location.key} />

      <main
        id="client-main-content"
        tabIndex={-1}
        className="
          mx-auto w-full min-w-0 max-w-7xl
          flex-1 scroll-mt-24 px-4 py-8
          sm:px-6 lg:px-8 lg:py-10
          focus:outline-none
        "
      >
        <Outlet />
      </main>

    </div>
  )
}