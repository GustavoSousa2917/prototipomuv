import { Link } from 'react-router'

import Logo from '../../components/common/Logo'
import Card from '../../components/ui/Card'

export default function NotFoundPage() {
  return (
    <main className="grid min-h-dvh place-items-center bg-background px-4 py-8">
      <Card className="w-full max-w-md space-y-5 text-center sm:p-8">
        <Logo />

        <div className="space-y-2">
          <p className="text-muv-display font-bold text-primary">
            404
          </p>

          <h1 className="text-muv-h1 font-bold text-foreground">
            Página não encontrada
          </h1>

          <p className="text-muted">
            O endereço que você tentou acessar não existe ou mudou.
          </p>
        </div>

        <Link
          to="/"
          className="
            inline-flex min-h-[var(--muv-button-height)] items-center
            justify-center rounded-muv-button bg-primary px-4 py-2
            font-medium text-white transition-colors hover:bg-primary-dark
          "
        >
          Voltar para o início
        </Link>
      </Card>
    </main>
  )
}
