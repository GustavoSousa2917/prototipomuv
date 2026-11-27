import {
  useEffect,
  useId,
  useRef,
} from 'react'

import { Outlet, useLocation } from 'react-router'
import { X } from 'lucide-react'

import Logo from '../components/common/Logo'

import OperationalHeader from '../components/navigation/OperationalHeader'
import Sidebar from '../components/navigation/Sidebar'

import type {
  SidebarNavigationItem,
} from '../components/navigation/SidebarItem'

type OperationalLayoutProps = {
  authenticated?: boolean
  areaLabel: string
  userName: string
  profileLabel: string
  homeTo: string
  accountTo: string
  notificationsTo: string
  items: readonly SidebarNavigationItem[]
}

export default function OperationalLayout({
  authenticated = false,
  areaLabel,
  userName,
  profileLabel,
  homeTo,
  accountTo,
  notificationsTo,
  items,
}: OperationalLayoutProps) {
  const location = useLocation()
  const mainRef = useRef<HTMLElement>(null)
  useEffect(() => {
    if (!authenticated) return
    mainRef.current?.focus({ preventScroll: true })
    window.scrollTo(0, 0)
  }, [authenticated, location.key])

  const navigationDialog = useRef<HTMLDialogElement>(null)

  const navigationId = useId()
  const navigationTitleId = useId()

  function openNavigation() {
    const dialog = navigationDialog.current

    if (dialog && !dialog.open) {
      dialog.showModal()
    }
  }

  function closeNavigation() {
    navigationDialog.current?.close()
  }

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1024px)')

    function handleResize() {
      if (desktop.matches) {
        navigationDialog.current?.close()
      }
    }

    desktop.addEventListener('change', handleResize)

    return () => {
      desktop.removeEventListener('change', handleResize)
    }
  }, [])

  const sidebarProps = {
    userName,
    profileLabel,
    items,
    accountTo,
  }

  return (
    <div className="min-h-dvh bg-background">

      {/* Atalho de acessibilidade */}

      <a
        href="#operational-main-content"
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

      <OperationalHeader
        areaLabel={areaLabel}
        authenticated={authenticated}
        profileLabel={profileLabel}
        userName={userName}
        homeTo={homeTo}
        notificationsTo={notificationsTo}
        accountTo={accountTo}
        navigationId={navigationId}
        onOpenNavigation={openNavigation}
      />

      {/* Estrutura desktop */}

      <div
        className="
          mx-auto flex w-full
          max-w-[var(--muv-container-width)]
          min-h-[calc(100dvh-var(--muv-header-height))]
          items-start
        "
      >
        <aside
          className="
            sticky top-[var(--muv-header-height)]
            hidden shrink-0
            h-[calc(100dvh-var(--muv-header-height))]
            w-[var(--muv-sidebar-width)]
            overflow-y-auto
            border-r border-border
            bg-surface lg:block
          "
        >
          <Sidebar {...sidebarProps} />
        </aside>

        {/* Conteúdo da página */}

        <main
          ref={mainRef}
          id="operational-main-content"
          tabIndex={-1}
          className="
            min-w-0 flex-1
            scroll-mt-24 px-4 py-8
            sm:px-6 lg:px-8 lg:py-10
            focus:outline-none
          "
        >
          <Outlet />
        </main>
      </div>

      {/* Barra lateral mobile */}

      <dialog
        ref={navigationDialog}
        id={navigationId}
        aria-labelledby={navigationTitleId}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            closeNavigation()
          }
        }}
        className="
          fixed inset-y-0 left-0 right-auto
          m-0 h-dvh max-h-none
          w-[min(85vw,320px)] max-w-none
          overflow-y-auto border-0
          bg-surface p-0 text-foreground
          shadow-muv-lg backdrop:bg-black/50
        "
      >
        <div className="flex min-h-full flex-col">

          <div
            className="
              sticky top-0 z-10
              flex min-h-18 shrink-0 items-center
              justify-between gap-3
              border-b border-border
              bg-surface px-4
            "
          >
            <Logo size="md" />

            <span
              id={navigationTitleId}
              className="sr-only"
            >
              Navegação operacional
            </span>

            <button
              type="button"
              aria-label="Fechar navegação operacional"
              onClick={closeNavigation}
              className="
                flex size-11 items-center
                justify-center rounded-muv-button
                text-primary hover:bg-primary-light
              "
            >
              <X
                size={24}
                aria-hidden="true"
              />
            </button>
          </div>

          <div className="flex-1">
            <Sidebar
              {...sidebarProps}
              onNavigate={closeNavigation}
            />
          </div>

        </div>
      </dialog>

    </div>
  )
}