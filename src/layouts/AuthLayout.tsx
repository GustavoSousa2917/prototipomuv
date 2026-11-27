import { useEffect } from 'react'
import { Link, Outlet, useLocation } from 'react-router'

import {
  ArrowLeft,
  UsersRound,
  Package,
} from 'lucide-react'

import Logo from '../components/common/Logo'

export default function AuthLayout() {
  const { pathname } = useLocation()

  useEffect(() => {
    document.getElementById('auth-main-content')?.focus({
      preventScroll: true,
    })

    window.scrollTo({
      top: 0,
      behavior: 'auto',
    })
  }, [pathname])

  return (
    <div className="flex min-h-dvh flex-col bg-background">

      {/* Atalho de acessibilidade */}

      <a
        href="#auth-main-content"
        className="
          sr-only focus:not-sr-only
          focus:fixed focus:left-4 focus:top-4
          focus:z-50 focus:rounded-muv-button
          focus:bg-primary focus:px-4
          focus:py-3 focus:text-white
        "
      >
        Ir para o conteúdo principal
      </a>

      {/* Cabeçalho de autenticação */}

      <header className="border-b border-border bg-surface">
        <div
          className="
            mx-auto flex min-h-18 max-w-7xl
            items-center justify-between
            gap-4 px-4 sm:px-6 lg:px-8
          "
        >
          <Link
            to="/"
            aria-label="MUV — Página inicial"
            className="shrink-0"
          >
            <Logo size="md" />
          </Link>

          <Link
            to="/"
            aria-label="Voltar ao site"
            className="
              inline-flex min-h-11 items-center gap-2
              rounded-muv-button px-3 py-2
              font-medium text-primary
              hover:bg-primary-light
            "
          >
            <ArrowLeft size={18} aria-hidden="true" />

            <span className="sm:hidden">
              Voltar
            </span>

            <span className="hidden sm:inline">
              Voltar ao site
            </span>
          </Link>
        </div>
      </header>

      {/* Conteúdo principal */}

      <main
        id="auth-main-content"
        tabIndex={-1}
        className="
          mx-auto grid w-full max-w-7xl
          min-w-0 flex-1 items-center
          gap-8 px-4 py-8
          sm:px-6 sm:py-12
          lg:grid-cols-2 lg:gap-12 lg:px-8
          focus:outline-none
        "
      >

        {/* Conteúdo da rota de autenticação */}

        <div
          className="
            mx-auto w-full min-w-0 max-w-md
            lg:col-start-2 lg:row-start-1
          "
        >
          <Outlet />
        </div>

        {/* Apresentação institucional em desktop */}

        <aside
          aria-label="Sobre o MUV"
          className="
            hidden min-w-0 flex-col justify-center
            rounded-muv-panel bg-primary-light
            p-10 lg:col-start-1 lg:row-start-1
            lg:flex lg:min-h-[30rem] xl:p-14
          "
        >
          <Logo size="lg" />

          <p
            className="
              mt-10 text-muv-label font-semibold
              uppercase tracking-wide text-primary
            "
          >
            Bem-vindo ao MUV
          </p>

          <h2
            className="
              mt-3 text-muv-h1 font-bold
              text-primary-dark xl:text-muv-display
            "
          >
            Conectando pessoas, encomendas e destinos.
          </h2>

          <p className="mt-5 leading-relaxed text-muted">
            Encontre prestadores de serviços de frete,
            solicite transportes e acompanhe seus
            serviços em um único ambiente.
          </p>

          <div
            className="
              mt-8 grid grid-cols-2 gap-3
            "
          >
            <div
              className="
                flex flex-col gap-3 rounded-muv-card
                bg-surface/70 p-4 text-primary
              "
            >
              <UsersRound size={24} aria-hidden="true" />

              <span className="font-medium">
                Transporte de pessoas
              </span>
            </div>

            <div
              className="
                flex flex-col gap-3 rounded-muv-card
                bg-surface/70 p-4 text-primary
              "
            >
              <Package size={24} aria-hidden="true" />

              <span className="font-medium">
                Transporte de encomendas
              </span>
            </div>
          </div>
        </aside>

      </main>

      {/* Rodapé simplificado */}

      <footer className="border-t border-border bg-surface">
        <div
          className="
            mx-auto flex max-w-7xl flex-col
            items-center justify-between gap-3
            px-4 py-5 text-muv-small text-muted
            sm:flex-row sm:px-6 lg:px-8
          "
        >
          <p>
            MUV — Fretes de pessoas e encomendas
          </p>

          <nav
            aria-label="Informações legais"
            className="flex flex-wrap justify-center gap-4"
          >
            <Link
              to="/termos-de-uso"
              className="py-2 hover:text-primary hover:underline"
            >
              Termos de uso
            </Link>

            <Link
              to="/privacidade"
              className="py-2 hover:text-primary hover:underline"
            >
              Privacidade
            </Link>
          </nav>
        </div>
      </footer>

    </div>
  )
}
