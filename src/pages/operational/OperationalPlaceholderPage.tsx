import {
  Info,
  Construction,
} from 'lucide-react'

type OperationalPlaceholderPageProps = {
  title: string
  description: string
  areaLabel?: string
}

export default function OperationalPlaceholderPage({
  title,
  description,
  areaLabel = 'Ambiente operacional',
}: OperationalPlaceholderPageProps) {
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
          {areaLabel}
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

      {/* Identificação do ambiente demonstrativo */}

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
          Esta funcionalidade será implementada
          nos próximos incrementos do protótipo MUV.
        </p>
      </section>

    </div>
  )
}