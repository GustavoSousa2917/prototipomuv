import { Link, NavLink } from 'react-router'

import {
  Bell,
  Menu,
} from 'lucide-react'

import Logo from '../common/Logo'
import Avatar from '../common/Avatar'
import ContextDialog from '../common/ContextDialog'

type OperationalHeaderProps = {
  authenticated: boolean
  profileLabel: string
  areaLabel: string
  userName: string
  homeTo: string
  notificationsTo: string
  accountTo: string
  navigationId: string
  onOpenNavigation: () => void
}

export default function OperationalHeader({
  authenticated,
  profileLabel,
  areaLabel,
  userName,
  homeTo,
  notificationsTo,
  accountTo,
  navigationId,
  onOpenNavigation,
}: OperationalHeaderProps) {
  return (
    <header
      className="
        sticky top-0 z-40
        h-[var(--muv-header-height)]
        border-b border-border bg-surface
      "
    >
      <div
        className="
          mx-auto flex h-full w-full
          max-w-[var(--muv-container-width)]
          items-center justify-between
          gap-3 px-4 sm:px-6
        "
      >
        {/* Identidade visual */}

        <div className="flex min-w-0 items-center gap-5">
          <Link
            to={homeTo}
            aria-label="MUV — Início do ambiente operacional"
            className="shrink-0"
          >
            <Logo size="md" />
          </Link>

          <div
            className="
              hidden border-l border-border
              pl-5 sm:block
            "
          >
            <p className="font-medium text-foreground">
              {areaLabel}
            </p>

            <p className="text-muv-small text-muted">
              {authenticated ? profileLabel : 'Ambiente operacional'}
            </p>
          </div>
        </div>

        {/* Ações do cabeçalho */}

        <div className="flex shrink-0 items-center gap-2">

          <NavLink
            to={notificationsTo}
            aria-label="Notificações"
            title="Notificações"
            className={({ isActive }) => `
              flex size-11 items-center justify-center
              rounded-muv-button transition-colors

              ${
                isActive
                  ? 'bg-primary-light text-primary'
                  : 'text-muted hover:bg-primary-light hover:text-primary'
              }
            `}
          >
            <Bell
              size={21}
              aria-hidden="true"
            />
          </NavLink>

          {authenticated ? (
            <ContextDialog accountMenu trigger={<Avatar name={userName} />} />
          ) : (
            <NavLink
              to={accountTo}
              aria-label="Minha conta"
              title="Minha conta"
              className={({ isActive }) => `
                flex size-11 items-center justify-center
                rounded-muv-button

                ${
                  isActive
                    ? 'bg-primary-light'
                    : 'hover:bg-background'
                }
              `}
            >
              <Avatar
                name={userName}
                size="md"
              />
            </NavLink>

          )}

          {/* Abertura da barra lateral mobile */}

          <button
            type="button"
            aria-label="Abrir navegação operacional"
            aria-haspopup="dialog"
            aria-controls={navigationId}
            onClick={onOpenNavigation}
            className="
              flex size-11 items-center justify-center
              rounded-muv-button text-primary
              hover:bg-primary-light lg:hidden
            "
          >
            <Menu
              size={24}
              aria-hidden="true"
            />
          </button>

        </div>
      </div>
    </header>
  )
}