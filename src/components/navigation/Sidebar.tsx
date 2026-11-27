import { Link } from 'react-router'

import {
  ArrowLeft,
  UserRound,
} from 'lucide-react'

import Avatar from '../common/Avatar'

import SidebarItem from './SidebarItem'
import type { SidebarNavigationItem } from './SidebarItem'

type SidebarProps = {
  userName: string
  profileLabel: string
  items: readonly SidebarNavigationItem[]
  accountTo: string
  onNavigate?: () => void
}

export default function Sidebar({
  userName,
  profileLabel,
  items,
  accountTo,
  onNavigate,
}: SidebarProps) {
  return (
    <div
      className="
        flex min-h-full w-full flex-col
        bg-surface
        lg:h-full lg:min-h-0 lg:overflow-hidden
      "
    >
      {/* Identificação do perfil ativo */}

      <div className="shrink-0 border-b border-border p-5">
        <div className="flex items-center gap-3">

          <Avatar
            name={userName}
            size="md"
          />

          <div className="min-w-0">
            <p
							className="
                font-semibold text-foreground
								[overflow-wrap:anywhere]
							"
						>
              {userName}
            </p>

            <p className="mt-1 text-muv-small text-muted">
              {profileLabel}
            </p>
          </div>

        </div>
      </div>

      {/* Navegação principal */}

      <nav
        aria-label="Navegação operacional"
        className="
					flex-1 px-3 py-5
					lg:min-h-0 lg:overflow-y-auto
					lg:overscroll-contain
				"
      >
        <p
          className="
            mb-3 px-3 text-muv-caption
            font-semibold uppercase
            tracking-wide text-muted
          "
        >
          Menu principal
        </p>

        <div className="space-y-1">
          {items.map((item) => (
            <SidebarItem
              key={item.to}
              item={item}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </nav>

      {/* Navegação secundária */}

      <nav
        aria-label="Conta e saída"
        className="
          shrink-0 space-y-1 border-t
          border-border p-3
        "
      >
        <SidebarItem
          item={{
            label: 'Minha conta',
            to: accountTo,
            icon: UserRound,
          }}
          onNavigate={onNavigate}
        />

        <Link
          to="/"
          onClick={onNavigate}
          className="
            flex min-h-11 items-center gap-3
            rounded-muv-button px-3 py-3
            font-medium text-muted
            hover:bg-background hover:text-foreground
          "
        >
          <ArrowLeft
            size={20}
            aria-hidden="true"
          />

          Voltar ao site
        </Link>
      </nav>

    </div>
  )
}