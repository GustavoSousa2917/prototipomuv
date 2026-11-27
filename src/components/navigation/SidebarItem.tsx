import { NavLink } from 'react-router'
import type { LucideIcon } from 'lucide-react'

export type SidebarNavigationItem = {
  label: string
  to: string
  icon: LucideIcon
  end?: boolean
}

type SidebarItemProps = {
  item: SidebarNavigationItem
  onNavigate?: () => void
}

export default function SidebarItem({
  item,
  onNavigate,
}: SidebarItemProps) {
  const Icon = item.icon

  return (
    <NavLink
      to={item.to}
      end={item.end}
      onClick={onNavigate}
      className={({ isActive }) => `
        flex min-h-11 items-center gap-3
        rounded-muv-button px-3 py-3
        font-medium transition-colors

        ${
          isActive
            ? 'bg-primary-light text-primary'
            : 'text-muted hover:bg-background hover:text-foreground'
        }
      `}
    >
      <Icon
        size={20}
        className="shrink-0"
        aria-hidden="true"
      />

      <span>{item.label}</span>
    </NavLink>
  )
}