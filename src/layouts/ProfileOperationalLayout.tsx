import { ArrowLeft } from 'lucide-react'

import OperationalLayout from './OperationalLayout'

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
  const items: SidebarNavigationItem[] =
    config.pages.map((page) => ({
      label: page.label,
      to: page.path
        ? `${config.basePath}/${page.path}`
        : config.basePath,
      icon: page.icon,
      end: page.path === '',
    }))

  if (config.canAccessClientArea) {
    items.push({
      label: 'Área do cliente',
      to: '/cliente',
      icon: ArrowLeft,
    })
  }

  return (
    <OperationalLayout
      areaLabel={config.areaLabel}
      userName={config.userName}
      profileLabel={config.profileLabel}
      homeTo={config.basePath}
      accountTo={`${config.basePath}/conta`}
      notificationsTo={`${config.basePath}/notificacoes`}
      items={items}
    />
  )
}