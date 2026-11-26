import { Link, useLocation } from 'react-router'

import Logo from '../common/Logo'
import MobileMenu from './MobileMenu'

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
          gap-6 px-4 py-3
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
            justify-center gap-8 lg:flex
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

        <div className="hidden shrink-0 items-center gap-4 lg:flex">

          <Link
            to="/login"
            className="
              rounded-muv-button
              px-4 py-3 font-semibold
              text-primary
              hover:bg-primary-light
            "
          >
            Entrar
          </Link>

          <Link
            to="/cadastro"
            className="
              rounded-muv-button
              bg-primary px-5 py-3
              font-semibold text-white
              transition-colors
              hover:bg-primary-dark
            "
          >
            Criar conta
          </Link>

        </div>

        {/* Navegação mobile */}

        <MobileMenu
          key={location.key}
          items={navigationItems}
        />

      </div>
    </header>
  )
}