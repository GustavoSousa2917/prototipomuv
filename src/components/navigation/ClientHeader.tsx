import { useId, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router'

import {
  Bell,
  ChevronDown,
  Menu,
  X,
  UserRound,
  Truck,
  ArrowLeft,
  LogOut,
} from 'lucide-react'

import Logo from '../common/Logo'
import Avatar from '../common/Avatar'
import ContextDialog from '../common/ContextDialog'
import { accountRoute } from '../../constants/environmentRoutes'
import { useAuth } from '../../contexts/authContext'

const navigationItems = [
  {
    label: 'Solicitar frete',
    to: '/cliente/solicitar-frete',
  },
  {
    label: 'Prestadores',
    to: '/cliente/prestadores',
  },
  {
    label: 'Minhas solicitações',
    to: '/cliente/solicitacoes',
  },
  {
    label: 'Meus fretes',
    to: '/cliente/fretes',
  },
  {
    label: 'Histórico',
    to: '/cliente/historico',
  },
] as const

type OpenPanel = 'navigation' | 'account' | null

export default function ClientHeader() {
  const [openPanel, setOpenPanel] = useState<OpenPanel>(null)
  const [logoutError, setLogoutError] = useState(false)
  const { user, access, initializing, logout } = useAuth()
  const [loggingOut, setLoggingOut] = useState(false)
  const logoutInProgress = useRef(false)

  async function handleLogout() {
    if (logoutInProgress.current) return
    logoutInProgress.current = true
    setLoggingOut(true)
    setLogoutError(false)
    const result = await logout()
    logoutInProgress.current = false
    setLoggingOut(false)

    if (result === 'storageError') setLogoutError(true)
  }

  const navigationId = useId()
  const accountId = useId()

  const navigationButton = useRef<HTMLButtonElement>(null)
  const accountButton = useRef<HTMLButtonElement>(null)

  function closePanels() {
    setOpenPanel(null)
  }

  function togglePanel(panel: Exclude<OpenPanel, null>) {
    setOpenPanel((previous) =>
      previous === panel ? null : panel,
    )
  }

  return (
    <header
      className="
        sticky top-0 z-40
        border-b border-border bg-surface
      "
      onKeyDown={(event) => {
        if (event.key !== 'Escape' || !openPanel) return

        if (openPanel === 'navigation') {
          navigationButton.current?.focus()
        } else {
          accountButton.current?.focus()
        }

        closePanels()
      }}
    >
      <div
        className="
          relative mx-auto flex min-h-18
          max-w-7xl items-center justify-between
          gap-3 px-4 sm:px-6 lg:px-8
        "
      >
        {/* Identidade visual */}

        <Link
          to="/cliente"
          aria-label="MUV — Início do cliente"
          className="shrink-0"
          onClick={closePanels}
        >
          <Logo size="md" />
        </Link>

        {/* Navegação desktop */}

        <nav
          aria-label="Navegação do cliente"
          className="
            hidden min-h-18 flex-1
            items-stretch justify-center gap-5 xl:flex
          "
        >
          {navigationItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={closePanels}
              className={({ isActive }) => `
                inline-flex items-center whitespace-nowrap
                border-b-2 px-1 font-medium
                transition-colors
                ${
                  isActive
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted hover:text-primary'
                }
              `}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Ações do cliente */}

        <div className="flex shrink-0 items-center gap-2">

          <Link
            to="/cliente/seja-prestador"
            onClick={closePanels}
            className="
              hidden whitespace-nowrap rounded-muv-button
              px-3 py-2 text-muv-small
              font-medium text-muted
              hover:bg-primary-light hover:text-primary
              xl:inline-flex
            "
          >
            Seja prestador
          </Link>

          {/* Notificações */}

          <NavLink
            to="/cliente/notificacoes"
            aria-label="Notificações"
            title="Notificações"
            onClick={closePanels}
            className={({ isActive }) => `
              flex size-11 items-center justify-center
              rounded-muv-button
              ${
                isActive
                  ? 'bg-primary-light text-primary'
                  : 'text-muted hover:bg-primary-light hover:text-primary'
              }
            `}
          >
            <Bell size={21} aria-hidden="true" />
          </NavLink>

          {/* Identificação e menu da conta */}

          <div className="sm:relative">

            <button
              ref={accountButton}
              type="button"
              aria-label="Abrir ou fechar menu da conta"
              aria-expanded={openPanel === 'account'}
              aria-controls={accountId}
              onClick={() => togglePanel('account')}
              className="
                flex min-h-11 items-center gap-2
                rounded-muv-button px-1
                hover:bg-primary-light
              "
            >
              <Avatar name={user?.fullName ?? ''} />

              <ChevronDown
                size={16}
                aria-hidden="true"
                className="hidden text-muted sm:block"
              />
            </button>

            <div
              id={accountId}
              hidden={openPanel !== 'account'}
              className="
                absolute right-4 top-full mt-2 sm:right-0
                w-60 max-w-[calc(100vw-2rem)]
                rounded-muv-card border border-border
                bg-surface p-2 shadow-muv-lg
              "
            >
              <div className="border-b border-border px-3 py-3">
                <p className="break-words font-semibold text-foreground">
                  {user?.fullName ?? (initializing ? 'Carregando sessão…' : 'Cliente demonstrativo')}
                </p>

                <p className="mt-1 text-muv-small text-muted">
                  {!user
                    ? 'Sem sessão iniciada'
                    : access?.capabilities.includes('accessClient')
                      ? 'Contexto ativo: Cliente'
                      : access?.contexts.some(({ kind }) => kind === 'client')
                        ? 'Contexto cliente disponível'
                        : 'Sessão demonstrativa'}
                </p>
              </div>

              <Link
                to={accountRoute}
                onClick={closePanels}
                className="
                  mt-2 flex items-center gap-3
                  rounded-muv-button px-3 py-3
                  hover:bg-primary-light hover:text-primary
                "
              >
                <UserRound size={18} aria-hidden="true" />
                Minha conta
              </Link>

              <Link
                to="/cliente/seja-prestador"
                onClick={closePanels}
                className="
                  flex items-center gap-3
                  rounded-muv-button px-3 py-3
                  hover:bg-primary-light hover:text-primary
                "
              >
                <Truck size={18} aria-hidden="true" />
                Seja prestador
              </Link>

              <div className="my-2 border-t border-border" />

              <Link
                to="/"
                onClick={closePanels}
                className="
                  flex items-center gap-3
                  rounded-muv-button px-3 py-3
                  text-muted hover:bg-background
                "
              >
                <ArrowLeft size={18} aria-hidden="true" />
                Voltar ao site
              </Link>

              {(access?.contexts.length ?? 0) > 1 && (
                <ContextDialog trigger="Trocar contexto" />
              )}

              {user && (
                <>
                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="
                      flex w-full items-center gap-3 rounded-muv-button
                      px-3 py-3 text-left text-primary hover:bg-primary-light
                    "
                  >
                    <LogOut size={18} aria-hidden="true" />
                    {loggingOut ? 'Encerrando sessão…' : 'Sair da conta'}
                  </button>
                  {logoutError && (
                    <p role="alert" className="px-3 py-2 text-muv-small text-danger">
                      Não foi possível encerrar a sessão. Tente novamente.
                    </p>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Botão de navegação mobile */}

          <button
            ref={navigationButton}
            type="button"
            aria-label={
              openPanel === 'navigation'
                ? 'Fechar navegação'
                : 'Abrir navegação'
            }
            aria-expanded={openPanel === 'navigation'}
            aria-controls={navigationId}
            onClick={() => togglePanel('navigation')}
            className="
              flex size-11 items-center justify-center
              rounded-muv-button text-primary
              hover:bg-primary-light xl:hidden
            "
          >
            {openPanel === 'navigation' ? (
              <X size={24} aria-hidden="true" />
            ) : (
              <Menu size={24} aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Navegação mobile */}

        <nav
          id={navigationId}
          hidden={openPanel !== 'navigation'}
          aria-label="Navegação mobile do cliente"
          className="
            absolute inset-x-0 top-full
            max-h-[calc(100dvh-4.5rem)]
            overflow-y-auto border-b border-border
            bg-surface p-4 shadow-muv-lg xl:hidden
          "
        >
          <div className="space-y-2">

            {navigationItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={closePanels}
                className={({ isActive }) => `
                  block rounded-muv-button
                  px-4 py-3 font-medium
                  ${
                    isActive
                      ? 'bg-primary-light text-primary'
                      : 'text-foreground hover:bg-background'
                  }
                `}
              >
                {item.label}
              </NavLink>
            ))}

            <div className="my-3 border-t border-border" />

            <Link
              to="/cliente/seja-prestador"
              onClick={closePanels}
              className="
                flex items-center gap-3
                rounded-muv-button px-4 py-3
                font-medium text-primary
                hover:bg-primary-light
              "
            >
              <Truck size={18} aria-hidden="true" />
              Seja prestador
            </Link>
          </div>
        </nav>

      </div>
    </header>
  )
}