import { Link } from 'react-router'
import {
  Building2,
  ChevronDown,
  ClipboardCheck,
  Handshake,
  MapPin,
  Package,
  Route,
  Search,
  Truck,
  UsersRound,
} from 'lucide-react'

import Card from '../../components/ui/Card'

const benefits = [
  {
    icon: Route,
    title: 'Transporte conforme sua necessidade.',
    description: 'Solicite fretes de pessoas ou encomendas, informando origem, destino e detalhes do serviço.',
  },
  {
    icon: Search,
    title: 'Informações para escolher.',
    description: 'Consulte prestadores, veículos, condições e valores estimados antes de encaminhar sua solicitação.',
  },
  {
    icon: Handshake,
    title: 'Contratação com clareza.',
    description: 'Confirme as condições acordadas e acompanhe as informações do frete pela plataforma.',
  },
]

const steps = [
  ['Informe sua necessidade', 'Escolha a modalidade, origem, destino, data e detalhes do frete.'],
  ['Encontre prestadores', 'Consulte os prestadores que atendem à região e à modalidade desejada.'],
  ['Escolha e solicite', 'Analise as informações e encaminhe a solicitação ao prestador escolhido.'],
  ['Confirme a contratação', 'Analise as condições apresentadas pelo prestador e confirme o serviço.'],
  ['Acompanhe seu frete', 'Consulte as informações e atualizações do serviço contratado.'],
]

const example = [
  ['Modalidade', 'Frete de pessoas'],
  ['Origem', 'Quixadá — CE'],
  ['Destino', 'Fortaleza — CE'],
  ['Passageiros', '4 pessoas'],
  ['Prestador', 'Transporte Exemplo (fictício)'],
]

const providerTypes = [
  { icon: Truck, label: 'Motoristas autônomos' },
  { icon: Building2, label: 'Empresas' },
  { icon: UsersRound, label: 'Cooperativas' },
]

const providerHighlights = [
  'Apresente seus serviços.',
  'Prepare sua operação.',
  'Receba solicitações direcionadas.',
  'Gerencie seus fretes.',
]

const questions = [
  ['O que é o MUV?', 'É um protótipo acadêmico de uma plataforma que conecta clientes a prestadores de fretes de pessoas e encomendas.'],
  ['Quais tipos de frete posso solicitar?', 'O MUV prevê fretes de pessoas, para transporte de passageiros, e fretes de encomendas, para coleta e entrega de volumes.'],
  ['Como funciona a contratação?', 'O cliente escolhe um prestador antes de enviar a solicitação. O prestador pode aceitar o valor base, propor outro valor ou recusar. A contratação depende da confirmação do cliente.'],
  ['Quem pode oferecer serviços?', 'Motoristas autônomos, empresas e cooperativas podem oferecer serviços nas modalidades autorizadas, desde que atendam às condições operacionais exigidas.'],
  ['Posso solicitar fretes e também oferecer serviços?', 'Sim. A mesma conta pode atuar como cliente e prestador. A oferta de serviços depende da autorização por modalidade.'],
  ['O pagamento é realizado pela plataforma?', 'Não. O MUV não processa pagamentos.'],
]

const container = 'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'
const sectionSpacing = 'py-12 sm:py-16 lg:py-20'
const heading = 'text-muv-h1 font-bold tracking-tight text-primary-dark'
const action = 'inline-flex min-h-[var(--muv-button-height)] items-center justify-center rounded-muv-button border px-5 py-2.5 text-center font-semibold transition-colors'
const primaryAction = `${action} border-transparent bg-primary text-white hover:bg-primary-dark`
const secondaryAction = `${action} border-primary-soft bg-surface text-primary-dark hover:bg-primary-light`

function HomeActions({ onDark = false }: { onDark?: boolean }) {
  return (
    <div className="flex flex-wrap gap-3">
      <Link to="/cadastro" className={onDark ? `${secondaryAction} focus-visible:outline-white` : primaryAction}>
        Solicitar frete
      </Link>
      <Link
        to="/cadastro"
        className={onDark
          ? `${action} border-white text-white hover:bg-white/15 focus-visible:outline-white`
          : secondaryAction}
      >
        Oferecer serviços
      </Link>
    </div>
  )
}

export default function HomePage() {
  return (
    <>
      <div className={`${container} py-5 sm:py-8`}>
        <section className="grid overflow-hidden rounded-muv-panel bg-primary-light lg:grid-cols-2">
          <div className="min-w-0 px-5 py-9 sm:p-10 lg:px-12 lg:py-14">
            <p className="text-muv-label font-bold tracking-wider text-primary">
              CONECTANDO PESSOAS E CAMINHOS
            </p>
            <h1 className="mt-4 text-muv-h1 font-bold tracking-tight text-primary-dark sm:text-muv-display">
              Quem precisa transportar.<br />
              Quem pode levar.<br />
              Um só lugar.
            </h1>
            <p className="mb-6 mt-5 max-w-lg text-base leading-relaxed text-muted">
              O MUV conecta clientes a prestadores de serviços de frete de pessoas e encomendas, facilitando solicitações, propostas e contratações em uma única plataforma.
            </p>
            <HomeActions />
          </div>
          <div
            aria-hidden="true"
            className="relative grid min-h-60 place-items-center overflow-hidden bg-primary-dark text-white lg:min-h-full"
          >
            <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(var(--color-primary-soft)_1px,transparent_1px)] [background-size:22px_22px]" />
            <div className="absolute size-72 rounded-full border border-primary-soft/30 sm:size-96" />
            <div className="absolute size-52 rounded-full border border-primary-soft/35 sm:size-72" />
            <div className="relative flex items-center gap-4 sm:gap-8">
              <span className="grid size-14 place-items-center rounded-muv-panel bg-primary-light text-primary-dark sm:size-20">
                <UsersRound className="size-7 sm:size-9" />
              </span>
              <Route className="size-10 text-primary-soft sm:size-16" />
              <span className="grid size-14 place-items-center rounded-muv-panel bg-primary-light text-primary-dark sm:size-20">
                <Package className="size-7 sm:size-9" />
              </span>
            </div>
          </div>
        </section>
      </div>

      <section className={`${container} pb-12 pt-5 sm:pb-16`}>
        <h2 className={heading}>Para quem é o MUV</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Card>
            <p className="text-muv-label font-bold uppercase tracking-wider text-primary">Para clientes</p>
            <h3 className="mt-2 text-muv-h3 font-semibold">Encontre o transporte que você precisa.</h3>
            <p className="mt-2 text-base leading-relaxed text-muted">
              Consulte prestadores que atendem à sua região, compare informações e valores estimados e encaminhe sua solicitação ao prestador escolhido.
            </p>
            <Link to="/#como-funciona" className="mt-4 inline-block font-semibold text-primary hover:underline">
              Veja como funciona
            </Link>
          </Card>
          <Card>
            <p className="text-muv-label font-bold uppercase tracking-wider text-primary">Para prestadores</p>
            <h3 className="mt-2 text-muv-h3 font-semibold">Seu serviço ao alcance de novos clientes.</h3>
            <p className="mt-2 text-base leading-relaxed text-muted">
              Apresente seus serviços e receba solicitações de frete direcionadas ao seu perfil.
            </p>
            <Link to="/#para-prestadores" className="mt-4 inline-block font-semibold text-primary hover:underline">
              Conheça o espaço do prestador
            </Link>
          </Card>
        </div>
      </section>

      <section className={`bg-primary-light ${sectionSpacing}`}>
        <div className={container}>
          <h2 className={heading}>Benefícios do MUV</h2>
          <div className="mt-7 grid gap-7 md:grid-cols-3">
            {benefits.map(({ icon: Icon, title, description }) => (
              <div key={title}>
                <Icon size={26} aria-hidden="true" className="text-primary" />
                <h3 className="mt-3 text-muv-h3 font-semibold text-primary-dark">{title}</h3>
                <p className="mt-2 text-base leading-relaxed text-muted">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="como-funciona" tabIndex={-1} className={`scroll-mt-24 bg-surface ${sectionSpacing}`}>
        <div className={`${container} grid items-center gap-8 lg:grid-cols-[3fr_2fr] lg:gap-14`}>
          <div>
            <h2 className={heading}>Como funciona</h2>
            <ol className="mt-6 space-y-4">
              {steps.map(([title, description], index) => (
                <li key={title} className="flex items-start gap-3">
                  <span aria-hidden="true" className="grid size-8 shrink-0 place-items-center rounded-full bg-primary-light font-bold text-primary">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="text-muv-h4 font-bold">{title}</h3>
                    <p className="text-base leading-relaxed text-muted">{description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <Card elevated className="min-w-0 bg-background">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-muv-label font-bold uppercase tracking-wider text-primary">Exemplo ilustrativo</p>
                <h3 className="mt-1 text-muv-h3 font-bold">Solicitação direcionada</h3>
              </div>
              <MapPin size={24} aria-hidden="true" className="shrink-0 text-primary" />
            </div>
            <dl className="mt-4 space-y-2">
              {example.map(([label, value]) => (
                <div key={label} className="rounded-muv-input border border-border bg-surface px-3 py-2">
                  <dt className="text-muv-label text-muted">{label}</dt>
                  <dd className="text-base font-semibold">{value}</dd>
                </div>
              ))}
            </dl>
          </Card>
        </div>
      </section>

      <section id="para-prestadores" tabIndex={-1} className={`${sectionSpacing} scroll-mt-24`}>
        <div className={`${container} grid items-center gap-8 lg:grid-cols-2 lg:gap-14`}>
          <div className="lg:col-start-2 lg:row-start-1">
            <p className="mb-2 text-muv-label font-bold uppercase tracking-wider text-primary">Para prestadores</p>
            <h2 className={heading}>Seu serviço merece ser encontrado.</h2>
            <ul className="mt-5 space-y-3">
              {providerHighlights.map((item) => (
                <li key={item} className="flex items-start gap-3 text-base font-semibold">
                  <ClipboardCheck size={20} aria-hidden="true" className="mt-0.5 shrink-0 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="my-5 text-base leading-relaxed text-muted">
              A prestação de serviços depende de autorização por modalidade e do atendimento às condições operacionais exigidas.
            </p>
            <Link to="/cadastro" className={primaryAction}>Quero oferecer serviços</Link>
          </div>
          <div className="rounded-muv-panel bg-primary-light p-5 sm:p-8 lg:col-start-1 lg:row-start-1">
            <ul className="space-y-3">
              {providerTypes.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-3 rounded-muv-card bg-surface p-4 text-base font-semibold text-primary-dark">
                  <Icon size={24} aria-hidden="true" className="shrink-0 text-primary" />
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="duvidas" tabIndex={-1} className={`scroll-mt-24 bg-surface ${sectionSpacing}`}>
        <div className={`${container} grid items-start gap-6 lg:grid-cols-[1fr_2fr] lg:gap-14`}>
          <h2 className={heading}>Dúvidas frequentes</h2>
          <div className="divide-y divide-border border-y border-border">
            {questions.map(([question, answer]) => (
              <details key={question} className="group">
                <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 rounded-muv-button py-3 text-base font-semibold [&::-webkit-details-marker]:hidden">
                  {question}
                  <ChevronDown size={20} aria-hidden="true" className="shrink-0 text-primary group-open:rotate-180" />
                </summary>
                <p className="pb-4 pr-7 text-base leading-relaxed text-muted">{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <div className={`${container} ${sectionSpacing}`}>
        <section className="flex flex-col gap-6 rounded-muv-panel bg-primary-dark p-6 text-white sm:p-9 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-muv-h1 font-bold tracking-tight">Seu próximo caminho começa aqui.</h2>
            <p className="mt-2 text-base leading-relaxed text-primary-light">
              Conheça uma nova forma de solicitar e oferecer serviços de frete.
            </p>
          </div>
          <HomeActions onDark />
        </section>
      </div>
    </>
  )
}
