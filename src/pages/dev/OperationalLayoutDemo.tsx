import {
  LayoutDashboard,
  Truck,
} from 'lucide-react'

import OperationalLayout from '../../layouts/OperationalLayout'

import OperationalPlaceholderPage
  from '../operational/OperationalPlaceholderPage'

import type {
  SidebarNavigationItem,
} from '../../components/navigation/SidebarItem'

const basePath = '/dev/operational-layout'

const navigationItems: SidebarNavigationItem[] = [
  {
    label: 'Visão geral',
    to: basePath,
    icon: LayoutDashboard,
    end: true,
  },
  {
    label: 'Fretes',
    to: `${basePath}/fretes`,
    icon: Truck,
  },
]

export default function OperationalLayoutDemo() {
  return (
    <OperationalLayout
      areaLabel="Área do prestador"
      userName="João Ferreira"
      profileLabel="Prestador demonstrativo"
      homeTo={basePath}
      accountTo={`${basePath}/conta`}
      notificationsTo={`${basePath}/notificacoes`}
      items={navigationItems}
    />
  )
}

type OperationalPreviewPageProps = {
  title: string
  description: string
}

export function OperationalPreviewPage(
  props: OperationalPreviewPageProps,
) {
  return <OperationalPlaceholderPage {...props} />
}