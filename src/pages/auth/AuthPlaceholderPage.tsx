import { Link } from 'react-router'
import { Construction } from 'lucide-react'

import Card from '../../components/ui/Card'
import EmptyState from '../../components/feedback/EmptyState'

type AuthPlaceholderPageProps = {
  title: string
  description: string
  alternativePrompt: string
  alternativeLabel: string
  alternativeTo: '/login' | '/cadastro'
}

export default function AuthPlaceholderPage({
  title,
  description,
  alternativePrompt,
  alternativeLabel,
  alternativeTo,
}: AuthPlaceholderPageProps) {
  return (
    <div className="space-y-6">

      <div className="space-y-2">
        <p
          className="
            text-muv-label font-semibold
            uppercase tracking-wide text-primary
          "
        >
          Acesso ao MUV
        </p>

        <h1
          className="
            text-muv-h2 font-bold text-foreground
            sm:text-muv-h1
          "
        >
          {title}
        </h1>

        <p className="text-muted">
          {description}
        </p>
      </div>

      <Card>
        <EmptyState
          icon={<Construction size={30} />}
          title="Funcionalidade em desenvolvimento"
          description="
            Este módulo será implementado
            em uma próxima etapa do protótipo MUV.
          "
        />
      </Card>

      <div
        className="
          flex flex-wrap items-center
          justify-center gap-x-2
          text-center text-muted
        "
      >
        <span>
          {alternativePrompt}
        </span>

        <Link
          to={alternativeTo}
          className="
            inline-flex min-h-11 items-center
            font-semibold text-primary
            hover:underline
          "
        >
          {alternativeLabel}
        </Link>
      </div>

    </div>
  )
}
