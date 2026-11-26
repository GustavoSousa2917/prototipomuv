import { ArrowLeft, Palette } from 'lucide-react'
import { Link } from 'react-router'
import CoreComponentsDemo from './CoreComponentsDemo'
import FormComponentsDemo from './FormComponentsDemo'
import SelectionComponentsDemo from './SelectionComponentsDemo'
import FeedbackComponentsDemo from './FeedbackComponentsDemo'
import SharedComponentsDemo from './SharedComponentsDemo'

const brandColors = [
  {
    name: 'Primary',
    hex: '#1D695B',
    className: 'bg-primary',
  },
  {
    name: 'Primary Dark',
    hex: '#174F45',
    className: 'bg-primary-dark',
  },
  {
    name: 'Primary Light',
    hex: '#E4F2ED',
    className: 'bg-primary-light',
  },
  {
    name: 'Primary Soft',
    hex: '#CAE1D8',
    className: 'bg-primary-soft',
  },
]

const neutralColors = [
  {
    name: 'Background',
    hex: '#F5F7F8',
    className: 'bg-background',
  },
  {
    name: 'Surface',
    hex: '#FFFFFF',
    className: 'bg-surface',
  },
  {
    name: 'Foreground',
    hex: '#233135',
    className: 'bg-foreground',
  },
  {
    name: 'Muted',
    hex: '#637378',
    className: 'bg-muted',
  },
  {
    name: 'Border',
    hex: '#DEE6E7',
    className: 'bg-border',
  },
  {
    name: 'Input',
    hex: '#F5F7F8',
    className: 'bg-input',
  },
  {
    name: 'Disabled',
    hex: '#B0B8BB',
    className: 'bg-disabled',
  },
]

const semanticColors = [
  {
    name: 'Sucesso',
    className: 'bg-success-light text-success',
  },
  {
    name: 'Atenção',
    className: 'bg-warning-light text-warning',
  },
  {
    name: 'Erro',
    className: 'bg-danger-light text-danger',
  },
  {
    name: 'Informação',
    className: 'bg-info-light text-info',
  },
  {
    name: 'Neutro',
    className: 'bg-neutral-light text-neutral',
  },
]

const typography = [
  {
    name: 'Display — 48 px (32 px no celular)',
    className: 'text-muv-h1 font-bold sm:text-muv-display',
  },
  {
    name: 'H1 — 32 px',
    className: 'text-muv-h1 font-bold',
  },
  {
    name: 'H2 — 24 px',
    className: 'text-muv-h2 font-semibold',
  },
  {
    name: 'H3 — 20 px',
    className: 'text-muv-h3 font-semibold',
  },
  {
    name: 'H4 — 16 px',
    className: 'text-muv-h4 font-semibold',
  },
  {
    name: 'Body — 14 px',
    className: 'text-muv-body',
  },
  {
    name: 'Label — 13 px',
    className: 'text-muv-label font-medium',
  },
  {
    name: 'Small — 12 px',
    className: 'text-muv-small',
  },
  {
    name: 'Caption — 11 px',
    className: 'text-muv-caption font-medium',
  },
]

const spacing = [
  4, 8, 12, 16, 20, 24, 32, 40, 48, 64,
]

export default function DesignSystemPage() {
  return (
    <main className="min-h-screen bg-background">

      {/* Cabeçalho */}

      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-5">

          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-muv-button bg-primary text-white">
              <Palette size={22} />
            </div>

            <div>
              <h1 className="text-muv-h3 font-bold text-primary">
                MUV Design System
              </h1>

              <p className="text-muv-small text-muted">
                Identidade visual e componentes
              </p>
            </div>
          </div>

          <Link
            to="/"
            className="flex items-center gap-2 font-medium text-primary hover:text-primary-dark"
          >
            <ArrowLeft size={18} />
            Voltar ao início
          </Link>

        </div>
      </header>

      {/* Conteúdo */}

      <div className="mx-auto max-w-7xl space-y-8 px-6 py-10">

        <section>
          <p className="font-medium text-primary">
            DOCUMENTAÇÃO VISUAL
          </p>

          <h2 className="mt-2 text-muv-h1 font-bold">
            Fundamentos do Design System
          </h2>

          <p className="mt-3 max-w-2xl text-muted">
            Padrões visuais compartilhados pelas interfaces
            públicas, administrativas e operacionais do MUV.
          </p>
        </section>

        {/* Cores da marca */}

        <section className="rounded-muv-panel border border-border bg-surface p-6 shadow-muv-sm">

          <h2 className="text-muv-h2 font-semibold">
            Cores da marca
          </h2>

          <p className="mt-2 text-muted">
            Identidade visual principal do MUV.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {brandColors.map((color) => (
              <div
                key={color.name}
                className="overflow-hidden rounded-muv-card border border-border"
              >
                <div className={`h-28 ${color.className}`} />

                <div className="p-4">
                  <p className="font-semibold">
                    {color.name}
                  </p>

                  <p className="mt-1 text-muv-small text-muted">
                    {color.hex}
                  </p>
                </div>
              </div>
            ))}

          </div>
        </section>

        {/* Cores neutras */}

        <section className="rounded-muv-panel border border-border bg-surface p-6 shadow-muv-sm">

          <h2 className="text-muv-h2 font-semibold">
            Cores neutras
          </h2>

          <p className="mt-2 text-muted">
            Superfícies, textos, bordas e campos.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-4">

            {neutralColors.map((color) => (
              <div
                key={color.name}
                className="overflow-hidden rounded-muv-card border border-border"
              >
                <div className={`h-20 ${color.className}`} />

                <div className="p-4">
                  <p className="font-semibold">
                    {color.name}
                  </p>

                  <p className="mt-1 text-muv-small text-muted">
                    {color.hex}
                  </p>
                </div>
              </div>
            ))}

          </div>
        </section>

        {/* Cores semânticas */}

        <section className="rounded-muv-panel border border-border bg-surface p-6 shadow-muv-sm">

          <h2 className="text-muv-h2 font-semibold">
            Cores semânticas
          </h2>

          <p className="mt-2 text-muted">
            Comunicação visual dos estados e acontecimentos.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">

            {semanticColors.map((color) => (
              <div
                key={color.name}
                className={`rounded-full px-4 py-2 font-medium ${color.className}`}
              >
                {color.name}
              </div>
            ))}

          </div>
        </section>

        {/* Tipografia */}

        <section className="rounded-muv-panel border border-border bg-surface p-6 shadow-muv-sm">

          <h2 className="text-muv-h2 font-semibold">
            Tipografia
          </h2>

          <p className="mt-2 text-muted">
            Família tipográfica: Inter Variable.
          </p>

          <div className="mt-6 divide-y divide-border">

            {typography.map((item) => (
              <div key={item.name} className="py-5">

                <p className="mb-2 text-muv-small text-muted">
                  {item.name}
                </p>

                <p className={item.className}>
                  Conectando pessoas e destinos.
                </p>

              </div>
            ))}

          </div>
        </section>

        {/* Espaçamentos */}

        <section className="rounded-muv-panel border border-border bg-surface p-6 shadow-muv-sm">

          <h2 className="text-muv-h2 font-semibold">
            Espaçamentos
          </h2>

          <p className="mt-2 text-muted">
            Escala baseada em unidades de quatro pixels.
          </p>

          <div className="mt-6 flex flex-wrap items-end gap-6">

            {spacing.map((size) => (
              <div key={size} className="text-center">

                <div
                  className="mx-auto rounded-sm bg-primary"
                  style={{
                    width: size,
                    height: size,
                  }}
                />

                <p className="mt-2 text-muv-small text-muted">
                  {size} px
                </p>

              </div>
            ))}

          </div>
        </section>

        {/* Arredondamentos e sombras */}

        <section className="rounded-muv-panel border border-border bg-surface p-6 shadow-muv-sm">

          <h2 className="text-muv-h2 font-semibold">
            Arredondamentos e sombras
          </h2>

          <div className="mt-6 grid gap-6 sm:grid-cols-3">

            <div className="rounded-muv-button border border-border bg-surface p-6 shadow-muv-sm">
              <p className="font-semibold">
                Suave
              </p>

              <p className="mt-2 text-muted">
                8 px — Botões
              </p>
            </div>

            <div className="rounded-muv-card border border-border bg-surface p-6 shadow-muv-md">
              <p className="font-semibold">
                Intermediário
              </p>

              <p className="mt-2 text-muted">
                12 px — Cards
              </p>
            </div>

            <div className="rounded-muv-panel border border-border bg-surface p-6 shadow-muv-lg">
              <p className="font-semibold">
                Elevado
              </p>

              <p className="mt-2 text-muted">
                16 px — Painéis e modais
              </p>
            </div>

          </div>
        </section>

        <CoreComponentsDemo />

        <FormComponentsDemo />

        <SelectionComponentsDemo />

        <FeedbackComponentsDemo />

        <SharedComponentsDemo />

        <footer className="border-t border-border py-6 text-center text-muv-small text-muted">
          MUV Design System — Versão 0.1.0
        </footer>

      </div>
    </main>
  )
}