import {
  LayoutDashboard,
  Truck,
  Info,
  Construction,
} from 'lucide-react'

import OperationalLayout from '../../layouts/OperationalLayout'

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

export function OperationalPreviewPage({
  title,
  description,
}: OperationalPreviewPageProps) {
  return (
    <div className="space-y-6">

      {/* Cabeçalho da página */}

      <div>
        <p
          className="
            mb-2 text-muv-label
            font-semibold uppercase text-primary
          "
        >
          Ambiente operacional
        </p>

        <h1
          className="
            text-muv-h2 font-bold
            text-foreground sm:text-muv-h1
          "
        >
          {title}
        </h1>

        <p className="mt-2 text-muted">
          {description}
        </p>
      </div>

      {/* Identificação do ambiente de testes */}

      <div
        className="
          flex items-start gap-3
          rounded-muv-card bg-info-light
          p-4 text-info
        "
      >
        <Info
          size={20}
          className="mt-0.5 shrink-0"
          aria-hidden="true"
        />

        <p>
          Ambiente demonstrativo do MUV.
          Os dados e as funcionalidades apresentados
          nesta página são provisórios.
        </p>
      </div>

      {/* Conteúdo provisório */}

      <section
        className="
          rounded-muv-panel border border-border
          bg-surface px-6 py-16
          text-center shadow-muv-sm
          sm:py-20
        "
      >
        <div
          className="
            mx-auto mb-5 flex size-16
            items-center justify-center
            rounded-full bg-primary-light
            text-primary
          "
        >
          <Construction
            size={28}
            aria-hidden="true"
          />
        </div>

        <h2 className="text-muv-h3 font-semibold">
          Funcionalidade em desenvolvimento
        </h2>

        <p className="mx-auto mt-3 max-w-md text-muted">
          Esta página demonstra a estrutura compartilhada
          dos ambientes operacionais do MUV.
          As funcionalidades serão implementadas
          nos próximos incrementos.
        </p>
      </section>

    </div>
  )
}