import { Link } from 'react-router'

import {
  ArrowRight,
  UsersRound,
  Package,
  Truck,
  Route,
  CircleHelp,
} from 'lucide-react'

import Card from '../../components/ui/Card'
import PageHeader from '../../components/common/PageHeader'

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl space-y-16 px-4 py-10 sm:px-6 lg:px-8 lg:py-16">

      {/* Apresentação provisória */}

      <section
        className="
          rounded-muv-modal
          bg-primary-light
          px-6 py-12
          sm:px-10 lg:px-16 lg:py-20
        "
      >
        <p className="font-semibold uppercase tracking-wide text-primary">
          Conheça o MUV
        </p>

        <h1
          className="
            mt-4 max-w-3xl
            text-muv-h1 font-bold
            text-primary-dark
            sm:text-muv-display
          "
        >
          Conectando pessoas, encomendas e destinos.
        </h1>

        <p className="mt-5 max-w-xl leading-relaxed text-muted">
          Uma plataforma para aproximar clientes e prestadores
          de serviços de frete, facilitando a solicitação,
          a contratação e o acompanhamento dos serviços.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">

          <Link
            to="/cadastro"
            className="
              inline-flex items-center gap-3
              rounded-muv-button
              bg-primary px-5 py-3
              font-semibold text-white
              hover:bg-primary-dark
            "
          >
            Criar conta
            <ArrowRight size={18} aria-hidden="true" />
          </Link>

          <Link
            to="/#como-funciona"
            className="
              inline-flex items-center gap-3
              rounded-muv-button
              border border-border
              bg-surface px-5 py-3
              font-semibold text-primary
              hover:bg-background
            "
          >
            Como funciona
          </Link>

        </div>
      </section>

      {/* Modalidades */}

      <section className="space-y-6">

        <PageHeader
          eyebrow="Modalidades"
          title="Encontre o serviço adequado"
          description="O MUV contempla duas modalidades de frete."
          headingLevel={2}
        />

        <div className="grid gap-4 md:grid-cols-2">

          <Card>
            <div className="flex size-12 items-center justify-center rounded-muv-card bg-primary-light text-primary">
              <UsersRound size={24} aria-hidden="true" />
            </div>

            <h3 className="mt-4 text-muv-h3 font-semibold">
              Frete de pessoas
            </h3>

            <p className="mt-2 leading-relaxed text-muted">
              Solicite serviços de transporte de passageiros
              conforme suas necessidades de deslocamento.
            </p>
          </Card>

          <Card>
            <div className="flex size-12 items-center justify-center rounded-muv-card bg-primary-light text-primary">
              <Package size={24} aria-hidden="true" />
            </div>

            <h3 className="mt-4 text-muv-h3 font-semibold">
              Frete de encomendas
            </h3>

            <p className="mt-2 leading-relaxed text-muted">
              Solicite serviços de coleta e entrega de
              encomendas entre diferentes localidades.
            </p>
          </Card>

        </div>

      </section>

      {/* Como funciona */}

      <section
        id="como-funciona"
        tabIndex={-1}
        className="scroll-mt-28 space-y-6"
      >
        <PageHeader
          eyebrow="Conheça o processo"
          title="Como funciona"
          description="Da solicitação ao acompanhamento do frete."
          headingLevel={2}
        />

        <Card>
          <Route
            size={28}
            className="text-primary"
            aria-hidden="true"
          />

          <p className="mt-4 leading-relaxed text-muted">
            O cliente informa as características do serviço,
            escolhe um prestador compatível, envia a solicitação
            e avalia a resposta para decidir sobre a contratação.
          </p>
        </Card>

      </section>

      {/* Para prestadores */}

      <section
        id="para-prestadores"
        tabIndex={-1}
        className="scroll-mt-28 space-y-6"
      >
        <PageHeader
          eyebrow="Prestação de serviços"
          title="Para prestadores"
          description="Conheça as possibilidades de atuação no MUV."
          headingLevel={2}
        />

        <Card>
          <Truck
            size={28}
            className="text-primary"
            aria-hidden="true"
          />

          <p className="mt-4 leading-relaxed text-muted">
            Prestadores autônomos, empresas e cooperativas
            poderão solicitar autorização para oferecer
            serviços nas modalidades atendidas.
          </p>

          <Link
            to="/cadastro"
            className="
              mt-5 inline-flex items-center gap-2
              font-semibold text-primary
              hover:underline
            "
          >
            Criar minha conta
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </Card>

      </section>

      {/* Dúvidas */}

      <section
        id="duvidas"
        tabIndex={-1}
        className="scroll-mt-28 space-y-6"
      >
        <PageHeader
          eyebrow="Informações"
          title="Dúvidas frequentes"
          description="Entenda as principais características do MUV."
          headingLevel={2}
        />

        <Card>
          <CircleHelp
            size={28}
            className="text-primary"
            aria-hidden="true"
          />

          <p className="mt-4 leading-relaxed text-muted">
            A seção completa de perguntas frequentes será
            desenvolvida junto à página institucional.
          </p>
        </Card>

      </section>

    </div>
  )
}