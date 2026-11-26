import { Link } from 'react-router'
import { ArrowLeft, Construction } from 'lucide-react'

import Card from '../../components/ui/Card'
import PageHeader from '../../components/common/PageHeader'
import EmptyState from '../../components/feedback/EmptyState'

type PublicPlaceholderPageProps = {
  title: string
  description: string
}

export default function PublicPlaceholderPage({
  title,
  description,
}: PublicPlaceholderPageProps) {
  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-12 sm:px-6">

      <PageHeader
        eyebrow="MUV"
        title={title}
        description={description}
      />

      <Card>
        <EmptyState
          icon={<Construction size={30} />}
          title="Página em desenvolvimento"
          description="
            Esta funcionalidade será disponibilizada
            em uma próxima etapa do protótipo.
          "
          action={
            <Link
              to="/"
              className="
                inline-flex items-center gap-2
                rounded-muv-button
                bg-primary px-5 py-3
                font-semibold text-white
                hover:bg-primary-dark
              "
            >
              <ArrowLeft size={18} aria-hidden="true" />
              Voltar ao início
            </Link>
          }
        />
      </Card>

    </div>
  )
}