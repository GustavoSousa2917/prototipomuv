import { Link, useLocation } from 'react-router'
import { Construction, ArrowRight } from 'lucide-react'

import PageHeader from '../../components/common/PageHeader'
import Card from '../../components/ui/Card'
import EmptyState from '../../components/feedback/EmptyState'
import Alert from '../../components/feedback/Alert'

type ClientPlaceholderPageProps = {
  title: string
  description: string
}

export default function ClientPlaceholderPage({
  title,
  description,
}: ClientPlaceholderPageProps) {
  const { pathname } = useLocation()

  const isProvidersPage =
    pathname.replace(/\/+$/, '') === '/cliente/prestadores'

  const actionTo = isProvidersPage
    ? '/cliente/solicitar-frete'
    : '/cliente/prestadores'

  const actionLabel = isProvidersPage
    ? 'Solicitar frete'
    : 'Explorar prestadores'

  return (
    <div className="space-y-6">

      <PageHeader
        eyebrow="Área do cliente"
        title={title}
        description={description}
      />

      <Alert variant="info">
        Ambiente demonstrativo do MUV.
        As funcionalidades de frete desta página ainda são provisórias.
      </Alert>

      <Card>
        <EmptyState
          icon={
            <Construction
              size={30}
              aria-hidden="true"
            />
          }
          title="Funcionalidade em desenvolvimento"
          description="
            Este módulo será implementado em uma próxima
            etapa do desenvolvimento do protótipo.
          "
          action={
            <Link
              to={actionTo}
              className="
                inline-flex items-center gap-2
                rounded-muv-button bg-primary
                px-5 py-3 font-semibold text-white
                hover:bg-primary-dark
              "
            >
              {actionLabel}

              <ArrowRight
                size={18}
                aria-hidden="true"
              />
            </Link>
          }
        />
      </Card>

    </div>
  )
}