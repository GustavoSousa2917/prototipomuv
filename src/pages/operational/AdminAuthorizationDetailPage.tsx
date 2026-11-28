import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router'
import { AttemptDecision, AuthorizationBadge, AuthorizationHistory, SubmissionDetails } from '../../components/authorizations/AuthorizationDetails'
import { authorizationDate, useAuthorizationRefresh } from '../../components/authorizations/authorizationPresentation'
import Alert from '../../components/feedback/Alert'
import Modal from '../../components/feedback/Modal'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Checkbox from '../../components/ui/Checkbox'
import Textarea from '../../components/ui/Textarea'
import { adminAuthorizationRoute } from '../../constants/environmentRoutes'
import { useAuth } from '../../contexts/authContext'
import { freightModalities } from '../../domain/autonomousProvider'
import { authorizationStatus, normalizeReason, providerTypes } from '../../domain/providerAuthorization'
import { authorizationIssues, authorizationOperationMessages, decideAuthorizationAttempt, readAuthorizationAttempt } from '../../services/providerAuthorizations'

type View = Extract<ReturnType<typeof readAuthorizationAttempt>, { kind: 'ready' }>
type ModalState = { action: 'approve' | 'reject'; reviewKey: string | null; hasDifferences: boolean }

function Analysis({ view, refresh }: { view: View; refresh: () => void }) {
  const { attempt, current, issues, differences, history, other, reviewKey } = view
  const [modal, setModal] = useState<ModalState>()
  const [acknowledged, setAcknowledged] = useState(false)
  const [reason, setReason] = useState('')
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState<Awaited<ReturnType<typeof decideAuthorizationAttempt>>>()
  const submitting = useRef(false)
  const heading = useRef<HTMLHeadingElement>(null)
  const pending = attempt.decision === null
  const changed = modal?.action === 'approve' && modal.reviewKey !== reviewKey

  useEffect(() => {
    if (!pending && result === 'saved') heading.current?.focus()
  }, [pending, result])

  function open(action: ModalState['action']) {
    setAcknowledged(false)
    setResult(undefined)
    setModal({ action, reviewKey, hasDifferences: differences.length > 0 })
  }

  async function decide() {
    if (!modal || !pending || submitting.current || changed) return
    submitting.current = true
    setBusy(true)
    const outcome = await decideAuthorizationAttempt(attempt.id, view.administratorId,
      modal.action === 'reject' ? { action: 'reject', reason }
        : { action: 'approve', reviewKey: modal.reviewKey, acknowledged })
    setResult(outcome)
    setModal(undefined)
    submitting.current = false
    setBusy(false)
    refresh()
  }

  return <>
    <Card className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 ref={heading} tabIndex={-1} className="text-muv-h2 font-semibold">{attempt.submission.name}</h2>
        <AuthorizationBadge status={authorizationStatus(attempt)} />
      </div>
      <p>{providerTypes[attempt.provider.kind]} · {freightModalities[attempt.modality]}</p>
      <p className="text-muted">Tentativa {attempt.sequence} · {attempt.id}</p>
      <p>Enviada em {authorizationDate(attempt.requestedAt)} por {attempt.requester.name}.</p>
      <p>{freightModalities[attempt.modality === 'PESSOA' ? 'ENCOMENDA' : 'PESSOA']} <AuthorizationBadge status={other} /></p>
      <AttemptDecision attempt={attempt} />
    </Card>
    {result && <Alert role={result === 'saved' ? 'status' : 'alert'} variant={result === 'saved' ? 'success' : 'danger'}>
      {result === 'saved' ? 'Decisão registrada.' : authorizationOperationMessages[result]}
    </Alert>}
    <div className="grid gap-4 xl:grid-cols-2 xl:items-start">
      <Card className="min-w-0 space-y-3">
        <h2 className="text-muv-h2 font-semibold">Dados submetidos</h2>
        <SubmissionDetails submission={attempt.submission} />
      </Card>
      <Card className="min-w-0 space-y-3">
        <h2 className="text-muv-h2 font-semibold">Dados atuais</h2>
        {current && <SubmissionDetails submission={current} />}
        <h3 className="font-semibold">Pré-requisitos atuais</h3>
        {issues.length ? <ul className="list-disc pl-5">{issues.map((issue) => <li key={issue}>{authorizationIssues[issue]}</li>)}</ul>
          : <p>Requisitos objetivos atendidos.</p>}
      </Card>
    </div>
    {differences.length > 0 && <Card className="space-y-3">
      <h2 className="text-muv-h2 font-semibold">Diferenças desde o envio</h2>
      <dl className="divide-y divide-border">
        {differences.map((difference) => <div key={difference.field} className="py-3">
          <dt className="font-semibold">{difference.field}</dt>
          <dd className="grid gap-2 sm:grid-cols-2">
            <div><p className="text-muted">Submetido</p><p>{difference.submitted || 'Não informado'}</p></div>
            <div><p className="text-muted">Atual</p><p>{difference.current || 'Não informado'}</p></div>
          </dd>
        </div>)}
      </dl>
    </Card>}
    {pending && <Card className="space-y-3">
      <h2 className="text-muv-h2 font-semibold">Decidir tentativa</h2>
      {issues.length > 0 && <p className="text-muted">A aprovação ficará indisponível até a regularização dos requisitos.</p>}
      <div className="flex flex-wrap gap-3">
        <Button disabled={busy || issues.length > 0} onClick={() => open('approve')}>Aprovar modalidade</Button>
        <Button variant="danger" disabled={busy} onClick={() => open('reject')}>Rejeitar solicitação</Button>
      </div>
    </Card>}
    <Card className="space-y-3">
      <h2 className="text-muv-h2 font-semibold">Histórico da modalidade</h2>
      <AuthorizationHistory history={history} />
    </Card>
    <Modal open={!!modal && pending} onClose={() => setModal(undefined)} closeDisabled={busy} size="sm"
      title={modal?.action === 'reject' ? 'Confirmar rejeição' : 'Confirmar aprovação'}
      description={freightModalities[attempt.modality] + ' · ' + attempt.submission.name}
      footer={<>
        <Button variant="secondary" disabled={busy} data-modal-initial-focus onClick={() => setModal(undefined)}>Cancelar</Button>
        <Button variant={modal?.action === 'reject' ? 'danger' : 'primary'} loading={busy} onClick={() => void decide()}
          disabled={modal?.action === 'reject' ? !normalizeReason(reason) : !!changed || issues.length > 0 || (!!modal?.hasDifferences && !acknowledged)}>
          {modal?.action === 'reject' ? 'Confirmar rejeição' : 'Confirmar aprovação'}
        </Button>
      </>}>
      {modal?.action === 'reject' ? <Textarea label="Justificativa da rejeição" required value={reason}
        readOnly={busy} onChange={(event) => setReason(event.target.value)} />
        : changed ? <Alert role="alert" variant="warning">Os dados mudaram. Feche esta confirmação e consulte a versão atual.</Alert>
          : modal?.hasDifferences ? <Checkbox label="Li os valores submetidos e atuais e estou ciente das diferenças."
            checked={acknowledged} disabled={busy} onChange={(event) => setAcknowledged(event.target.checked)} />
            : <p>A confirmação registra a autorização administrativa da modalidade.</p>}
    </Modal>
  </>
}

export default function AdminAuthorizationDetailPage() {
  const { id = '' } = useParams()
  const refresh = useAuthorizationRefresh()
  const { user, access } = useAuth()
  const detail = readAuthorizationAttempt(id)
  const canView = access?.activeContext?.kind === 'admin'
  const missing = detail.kind === 'notFound' && canView
  const matches = detail.kind === 'ready' && canView && user?.id === detail.administratorId

  return <div className="mx-auto max-w-5xl min-w-0 space-y-4 [overflow-wrap:anywhere]">
    <Link to={adminAuthorizationRoute} className="inline-block font-semibold text-primary underline">Voltar às autorizações</Link>
    {missing && <p className="font-semibold text-primary">404</p>}
    <h1 className="text-muv-h1 font-bold">{missing ? 'Tentativa não encontrada' : 'Análise de autorização'}</h1>
    {matches ? <Analysis key={JSON.stringify([detail.administratorId, detail.attempt.id])} view={detail} refresh={refresh} />
      : <Alert role="alert" variant="warning">
        {missing ? 'Confira o endereço ou volte à lista de autorizações.'
          : detail.kind === 'readError' ? 'Não foi possível consultar a tentativa.'
            : 'Acesso restrito à administração.'}
      </Alert>}
  </div>
}
