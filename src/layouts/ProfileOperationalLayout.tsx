import OperationalLayout from './OperationalLayout'
import { accountRoute } from '../constants/environmentRoutes'
import { useAuth } from '../contexts/authContext'
import { contextLabel } from '../domain/accountAccess'

import type {
  OperationalProfileConfig,
} from '../constants/operationalNavigation'

import type {
  SidebarNavigationItem,
} from '../components/navigation/SidebarItem'

type ProfileOperationalLayoutProps = {
  config: OperationalProfileConfig
}

export default function ProfileOperationalLayout({
  config,
}: ProfileOperationalLayoutProps) {
  const { user, access } = useAuth()
  const active = access?.activeContext
  if (!user || !active) return null

  const items: SidebarNavigationItem[] =
    config.pages.map((page) => ({
      label: page.label,
      to: page.path
        ? `${config.basePath}/${page.path}`
        : config.basePath,
      icon: page.icon,
      end: page.path === '',
    }))

  return (
    <OperationalLayout
      areaLabel={config.areaLabel}
      userName={user.fullName}
      profileLabel={contextLabel(active)}
      authenticated
      homeTo={config.basePath}
      accountTo={accountRoute}
      notificationsTo={`${config.basePath}/notificacoes`}
      items={items}
    />
  )
}