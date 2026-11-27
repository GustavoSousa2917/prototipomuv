import { useRef, useState } from 'react'
import { Link, useLocation } from 'react-router'

import Logo from '../common/Logo'
import Alert from '../feedback/Alert'
import Button from '../ui/Button'
import MobileMenu from './MobileMenu'
import { usePublicNavigation } from './usePublicNavigation'

const navigationItems = [
  {
    label: 'Como funciona',
    to: '/#como-funciona',
  },
  {
    label: 'Para prestadores',
    to: '/#para-prestadores',
  },
  {
    label: 'Dúvidas',
    to: '/#duvidas',
  },
] as const

export default function PublicHeader() {
  const location = useLocation()
  const { links, logout } = usePublicNavigation()
  const [loggingOut, setLoggingOut] = useState(false)
  const [logoutError, setLogoutError] = useState(false)
  const pending = useRef(false)

  async function handleLogout() {
    if (!logout || pending.current) return
    pending.current = true
    setLoggingOut(true)
    setLogoutError(false)
    const result = await logout()
    pending.current = false
    setLoggingOut(false)
    setLogoutError(result === 'storageError')
  }

  function accountActions(closeMenu?: () => void) {
    return (
      <>
        {links.map(({ to, label }) => (
          <Link key={to} to={to} onClick={closeMenu} className={
            to === '/cadastro'
              ? 'block rounded-muv-button bg-primary px-3 py-2.5 text-center font-semibold text-white hover:bg-primary-dark'
              : 'block rounded-muv-button px-3 py-2.5 text-center font-semibold text-primary hover:bg-primary-light'
          }>
            {label}
          </Link>
        ))}
        {logout && (
          <Button variant="outline" loading={loggingOut} onClick={handleLogout} className="w-full lg:w-auto">
            Sair da conta
          </Button>
        )}
      </>
    )
  }

  return (
    <header
      className="
        sticky top-0 z-40
        border-b border-border
        bg-surface
      "
    >
      <div
        className="
          relative mx-auto
          flex min-h-18 max-w-7xl
          items-center justify-between
          gap-3 px-4 py-3
          sm:px-6 lg:px-8
        "
      >
        {/* Identidade visual */}

        <Link
          to="/"
          aria-label="MUV — Página inicial"
          className="shrink-0 rounded-muv-button"
        >
          <Logo size="md" />
        </Link>

        {/* Navegação desktop */}

        <nav
          aria-label="Navegação principal"
          className="
            hidden flex-1 items-center
            justify-center gap-4 lg:flex xl:gap-8
          "
        >
          {navigationItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="
                whitespace-nowrap font-medium
                text-muted transition-colors
                hover:text-primary
              "
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Ações de autenticação */}

        <div className="hidden shrink-0 items-center gap-1 lg:flex">
          {accountActions()}
        </div>

        {/* Navegação mobile */}

        <MobileMenu
          key={location.key}
          items={navigationItems}
          accountActions={accountActions}
        />

      </div>
      {logoutError && logout && <Alert variant="danger" role="alert">Não foi possível encerrar a sessão. Tente novamente.</Alert>}
    </header>
  )
}