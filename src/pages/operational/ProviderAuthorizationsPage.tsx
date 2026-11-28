import { useId, useRef, useState } from 'react'
import { Link } from 'react-router'
import { AuthorizationBadge, AuthorizationHistory } from '../../components/authorizations/AuthorizationDetails'
import { authorizationDate, useAuthorizationRefresh } from '../../components/authorizations/authorizationPresentation'
import Alert from '../../components/feedback/Alert'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import { environmentRoutes, serviceRegionRoutes } from '../../constants/environmentRoutes'
import { useAuth } from '../../contexts/authContext'
import { freightModalities } from '../../domain/autonomousProvider'
import { authorizationStatus, providerTypes } from '../../domain/providerAuthorization'
import { providerKey } from '../../domain/providerReference'
import type { ProviderReference } from '../../domain/providerReference'
import { authorizationIssues, authorizationOperationMessages, readOwnAuthorizations, requestAuthorization } from '../../services/providerAuthorizations'

type View = Extract<ReturnType<typeof readOwnAuthorizations>, { kind: 'ready' }>
type Modality = View['modalities'][number]

function ModalityCard({ scope, entry, refresh }: { scope: View['scope']; entry: Modality; refresh: () => void }) {
  const [busy, setBusy] = useState(false)
  const [feedback, setFeedback] = useState<Awaited<ReturnType<typeof requestAuthorization>>>()
  const submitting = useRef(false)
  const headingId = useId()
  const heading = useRef<HTMLHeadingElement>(null)
  const latest = entry.history[0]
  const status = authorizationStatus(latest)
  const canRequest = status === 'NOT_REQUESTED' || status === 'REJECTED'
  const count = entry.submission?.regions.length

  async function request() {
    if (submitting.current) return
    submitting.current = true
    setBusy(true)
    const result = await requestAuthorization(scope, entry.modality)
    submitting.current = false
    setBusy(false)
    setFeedback(result)
    refresh()
    if (result === 'saved') heading.current?.focus()
  }

  return <Card role="region" aria-labelledby={headingId} className="min-w-0 space-y-4">
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h2 id={headingId} ref={heading} tabIndex={-1} className="text-muv-h2 font-semibold">{freightModalities[entry.modality]}</h2>
      <AuthorizationBadge status={status} />
    </div>
    <dl className="grid gap-2 sm:grid-cols-2">
      <div><dt className="text-muted">Intenção cadastral atual</dt><dd>{scope.intendedModalities.includes(entry.modality) ? 'Pretendida' : 'Fora da intenção'}</dd></div>
      <div><dt className="text-muted">Municípios atualmente configurados</dt><dd>{count ?? 'Indisponível'}</dd></div>
    </dl>
    {status === 'PENDING' && <p>Enviada em {authorizationDate(latest.requestedAt)}. Aguardando análise administrativa.</p>}
    {latest?.decision && <p>Decisão em {authorizationDate(latest.decision.decidedAt)}.</p>}
    {latest?.decision?.status === 'REJECTED' && <Alert variant="warning" title="Justificativa">
      <p>{latest.decision.reason}</p><p className="mt-2">Atualize os dados pertinentes antes de enviar uma nova tentativa.</p>
    </Alert>}
    {status === 'APPROVED' && count === 0 && <p>A cobertura atual está vazia. A decisão administrativa permanece registrada.</p>}
    {canRequest && <div className="space-y-3">
      {entry.issues.length > 0 && <ul className="list-disc pl-5">{entry.issues.map((issue) => <li key={issue}>{authorizationIssues[issue]}</li>)}</ul>}
      <p className="text-muted">O envio exige cadastro válido, modalidade pretendida e cobertura configurada. Para autônomos, a CNH deve estar vigente.</p>
      <div className="flex flex-wrap gap-3">
        <Link className="font-semibold text-primary underline" to={environmentRoutes[scope.provider.kind] + '/perfil'}>Consultar cadastro</Link>
        <Link className="font-semibold text-primary underline" to={serviceRegionRoutes[scope.provider.kind]}>Gerenciar regiões</Link>
      </div>
      {entry.issues.length === 0 && <Button loading={busy} onClick={() => void request()}>
        {status === 'REJECTED' ? 'Solicitar novamente' : 'Solicitar autorização'}
      </Button>}
    </div>}
    {feedback && <Alert role={feedback === 'saved' ? 'status' : 'alert'} variant={feedback === 'saved' ? 'success' : 'danger'}>
      {feedback === 'saved' ? 'Solicitação enviada.' : authorizationOperationMessages[feedback]}
    </Alert>}
    <div>
      <h3 className="font-semibold">Histórico de tentativas</h3>
      <AuthorizationHistory history={entry.history} />
    </div>
  </Card>
}

export default function ProviderAuthorizationsPage({ profile }: { profile: ProviderReference['kind'] }) {
  const refresh = useAuthorizationRefresh()
  const { user, access } = useAuth()
  const view = readOwnAuthorizations()
  const active = access?.activeContext
  const matches = view.kind === 'ready' && user?.id === view.scope.userId
    && active?.kind === profile && view.scope.provider.kind === profile
    && (!('organizationId' in view.scope.provider)
      || ('organizationId' in active && active.organizationId === view.scope.provider.organizationId))

  return <div className="mx-auto max-w-5xl min-w-0 space-y-4 [overflow-wrap:anywhere]">
    <h1 className="text-muv-h1 font-bold">Autorizações por modalidade</h1>
    {matches ? <>
      <p className="font-semibold">{view.scope.label} · {providerTypes[profile]}</p>
      <p className="text-muted">A autorização administrativa não comprova prontidão operacional nem determina elegibilidade para pesquisa.</p>
      <div className="grid gap-4 xl:grid-cols-2 xl:items-start">
        {view.modalities.map((entry) => <ModalityCard key={JSON.stringify([view.scope.userId, providerKey(view.scope.provider), entry.modality])}
          scope={view.scope} entry={entry} refresh={refresh} />)}
      </div>
    </> : <Alert role="alert" variant="warning">
      {view.kind === 'missingProvider' ? 'Este contexto ainda não possui cadastro profissional ou organizacional.'
        : view.kind === 'readError' ? 'Não foi possível consultar as autorizações.'
          : 'O contexto atual não permite consultar estas autorizações.'}
    </Alert>}
  </div>
}
