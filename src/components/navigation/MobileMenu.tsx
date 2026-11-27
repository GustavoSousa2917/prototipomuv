import { useId, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { Menu, X } from 'lucide-react'

type NavigationItem = {
  label: string
  to: string
}

type MobileMenuProps = {
  items: readonly NavigationItem[]
  accountActions: (closeMenu: () => void) => ReactNode
}

export default function MobileMenu({
  items,
  accountActions,
}: MobileMenuProps) {
  const [open, setOpen] = useState(false)

  const menuId = useId()
  const buttonRef = useRef<HTMLButtonElement>(null)

  function closeMenu() {
    setOpen(false)
  }

  return (
    <div
      className="lg:hidden"
      onKeyDown={(event) => {
        if (event.key === 'Escape' && open) {
          closeMenu()
          buttonRef.current?.focus()
        }
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-label={open ? 'Fechar menu' : 'Abrir menu'}
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((previous) => !previous)}
        className="
          flex size-11 items-center justify-center
          rounded-muv-button text-primary
          hover:bg-primary-light
        "
      >
        {open ? (
          <X size={24} aria-hidden="true" />
        ) : (
          <Menu size={24} aria-hidden="true" />
        )}
      </button>

      <nav
        id={menuId}
        hidden={!open}
        aria-label="Navegação mobile"
        className="
          absolute inset-x-0 top-full
          border-b border-border
          bg-surface p-4 shadow-muv-lg
        "
      >
        <div className="mx-auto max-w-7xl space-y-2">

          {items.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={closeMenu}
              className="
                block rounded-muv-button
                px-4 py-3 font-medium
                text-foreground
                hover:bg-primary-light
                hover:text-primary
              "
            >
              {item.label}
            </Link>
          ))}

          <div className="my-3 border-t border-border" />

          {accountActions(closeMenu)}

        </div>
      </nav>
    </div>
  )
}