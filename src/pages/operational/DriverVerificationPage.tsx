import { useId, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import Alert from '../../components/feedback/Alert'
import Modal from '../../components/feedback/Modal'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Textarea from '../../components/ui/Textarea'
import { accountRoute, driverInvitationsRoute, driverOwnLinksRoute, driverProfessionalRoute } from '../../constants/environmentRoutes'
import { useAuth } from '../../contexts/authContext'
import { formatCnh } from '../../domain/driverProfessional'
import type { DriverProfessionalDetails } from '../../domain/driverProfessional'
import { evidenceFields } from '../../domain/driverVerification'
import type { DriverEvidence } from '../../domain/driverVerification'
import { organizationKinds } from '../../domain/organization'
import { endDriverLink, readDriverLinkDetails, recordDriverVerification } from '../../services/driverVerification'
import type { DriverLinkActor, DriverLinkDetail } from '../../services/driverVerification'

const verificationLabels = { pending: 'Pendente', approved: 'Aprovada', rejected: 'Rejeitada' }
const linkStyle = 'font-semibold text-primary underline underline-offset-2'
const date = (value: string) => new Date(value).toLocaleString('pt-BR')
const messages = {
  denied: 'O acesso mudou. Confira a conta e o contexto selecionados.',
  ended: 'Este vínculo já foi encerrado.',
  stale: 'A habilitação ou o histórico mudou. Confira os dados atuais e abra uma nova análise.',
  ineligible: 'Confira os dados profissionais. A aprovação exige CNH vigente.',
  reasonRequired: 'Informe uma justificativa.',
  storageError: 'Não foi possível concluir a operação. Os registros anteriores foram preservados.',
}
type Action = 'approved' | 'rejected' | 'end'
const titles: Record<Action, string> = {
  approved: 'Aprovar verificação', rejected: 'Rejeitar verificação', end: 'Encerrar vínculo',
}

function fieldValue(details: DriverProfessionalDetails, field: keyof DriverProfessionalDetails) {
  if (field === 'hasEar') return details.hasEar ? 'Sim' : 'Não'
  if (field === 'cnhNumber') return formatCnh(details.cnhNumber)
  if (field === 'cnhExpiresAt') return details.cnhExpiresAt.split('-').reverse().join('/')
  return details[field]
}

function Evidence({ evidence }: { evidence: DriverEvidence }) {
  if (evidence.kind === 'unavailable') return <p>Habilitação {evidence.reason === 'missing' ? 'ausente' : 'inconsistente'} para {evidence.name}.</p>
  return <dl className="grid min-w-0 gap-2 sm:grid-cols-2">
    <div><dt className="font-semibold">Motorista</dt><dd>{evidence.name}</dd></div>
    {(Object.keys(evidenceFields) as (keyof DriverProfessionalDetails)[]).map((field) => <div key={field}>
      <dt className="font-semibold">{evidenceFields[field]}</dt><dd>{fieldValue(evidence.details, field)}</dd>
    </div>)}
  </dl>
}

export function VerificationSummary({ detail }: { detail: DriverLinkDetail }) {
  return <>
    <p>Vínculo {detail.status === 'active' ? 'ativo' : 'encerrado'} · Verificação {verificationLabels[detail.verification].toLowerCase()}</p>
    {detail.status === 'active' && detail.expired && <p>CNH vencida.</p>}
    {detail.status === 'active' && detail.differences.length > 0 && <p>Habilitação atual diverge do último retrato.</p>}
  </>
}

function DriverLinkPanel({ actor, detail }: { actor: DriverLinkActor; detail: DriverLinkDetail }) {
  const { refreshSession } = useAuth()
  const navigate = useNavigate()
  const reasonId = useId()
  const [dialog, setDialog] = useState<{ action: Action; revision: string; evidence: DriverEvidence }>()
  const [reason, setReason] = useState('')
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState<{ text: string; error: boolean }>()
  const pending = useRef(false)
  const feedback = useRef<HTMLDivElement>(null)
  const latest = detail.history[0]
  const active = detail.status === 'active' ? detail : null
  const current = active?.evidence
  const before = latest?.evidence

  function show(action: Action) {
    if (!active) return
    setReason('')
    setDialog({ action, revision: active.revision, evidence: active.evidence })
  }

  async function submit() {
    if (!dialog || pending.current) return
    setBusy(true)
    pending.current = true
    const result = dialog.action === 'end' ? await endDriverLink(actor, detail.id, reason)
      : actor.kind === 'organization' ? await recordDriverVerification(actor, detail.id, dialog.action, dialog.revision, reason) : 'denied'
    setBusy(false)
    pending.current = false
    setDialog(undefined)
    if (result === 'saved' && dialog.action === 'end' && actor.kind === 'driver' && actor.activeContext) {
      navigate(driverOwnLinksRoute, { replace: true })
    }
    setNotice({ error: result !== 'saved', text: result === 'saved'
      ? (dialog.action === 'end' ? 'Vínculo encerrado.' : 'Decisão registrada.') : messages[result] })
    refreshSession()
    requestAnimationFrame(() => feedback.current?.focus())
  }

  return <article className="space-y-4 [overflow-wrap:anywhere]">
    <Card className="space-y-2">
      <h2 className="text-muv-h2 font-semibold">{actor.kind === 'driver' ? detail.organizationName : detail.name}</h2>
      <p>{organizationKinds[detail.organizationKind]} · {actor.kind === 'driver' ? detail.name : detail.organizationName}</p>
      <p>Vínculo {detail.id}</p>
      <p>Aceite em {date(detail.acceptedAt)}</p>
      <VerificationSummary detail={detail} />
      {latest && <p>Última decisão em {date(latest.at)}{latest.result === 'rejected' ? ' · ' + latest.reason : ''}</p>}
      <p>A verificação é independente da autorização administrativa. A aptidão para fretes depende de critérios operacionais.</p>
    </Card>
    <div ref={feedback} tabIndex={-1}>{notice && <Alert role={notice.error ? 'alert' : 'status'}
      variant={notice.error ? 'danger' : 'success'}>{notice.text}</Alert>}</div>
    {detail.status === 'ended' && <Card className="space-y-2">
      <h3 className="text-muv-h2 font-semibold">Encerramento</h3>
      <p>Encerrado em {date(detail.ending.at)} por {detail.ending.authorName} ({detail.ending.source === 'driver' ? 'motorista' : 'organização'}).</p>
      <p>Justificativa: {detail.ending.reason}</p>
    </Card>}
    {current && active && <Card className="space-y-3">
      <h3 className="text-muv-h2 font-semibold">Dados profissionais atuais</h3>
      <Evidence evidence={current} />
      {current.kind === 'available' && <p>CNH {active.expired ? 'vencida' : 'vigente'}.</p>}
      {current.kind === 'available' && before?.kind === 'available' && active.differences.length > 0 && <>
        <h4 className="font-semibold">Diferenças em relação à última decisão</h4>
        <ul className="space-y-1">{active.differences.map((field) => <li key={field}>
          <strong>{evidenceFields[field]}</strong> · Analisado: {fieldValue(before.details, field)} · Atual: {fieldValue(current.details, field)}
        </li>)}</ul>
      </>}
      {actor.kind === 'organization' && <div className="flex flex-wrap gap-2">
        <Button disabled={current.kind !== 'available' || active.expired} onClick={() => show('approved')}>{titles.approved}</Button>
        <Button variant="secondary" onClick={() => show('rejected')}>{titles.rejected}</Button>
      </div>}
      <Button variant="danger" onClick={() => show('end')}>{titles.end}</Button>
    </Card>}
    <Card className="space-y-3">
      <h3 className="text-muv-h2 font-semibold">Histórico de verificações</h3>
      {detail.history.length ? <ol className="space-y-3">{detail.history.map((decision) => <li className="space-y-2 border-t border-border pt-3" key={decision.id}>
        <h4 className="font-semibold">Análise {decision.sequence} · {verificationLabels[decision.result]}</h4>
        <p>{decision.authorName} · {date(decision.at)}</p>
        {decision.result === 'rejected' && <p>Justificativa: {decision.reason}</p>}
        <p className="font-semibold">Retrato analisado</p>
        <Evidence evidence={decision.evidence} />
      </li>)}</ol> : <p>Nenhuma decisão registrada.</p>}
    </Card>
    <Modal open={!!dialog} onClose={() => setDialog(undefined)} title={dialog ? titles[dialog.action] : ''}
      description={dialog?.action === 'end'
        ? 'O contexto deste vínculo será retirado. O histórico ficará disponível às partes.'
        : 'Confira os dados apresentados antes de confirmar a decisão.'}
      closeDisabled={busy} footer={<>
        <Button data-modal-initial-focus variant="secondary" onClick={() => setDialog(undefined)} disabled={busy}>Voltar</Button>
        <Button variant={dialog?.action === 'approved' ? 'primary' : 'danger'} onClick={() => void submit()}
          disabled={dialog?.action !== 'approved' && !reason.trim()} loading={busy}>Confirmar</Button>
      </>}>
      <div className="space-y-3 [overflow-wrap:anywhere]">
        {dialog && dialog.action !== 'end' && <Evidence evidence={dialog.evidence} />}
        {dialog && dialog.action !== 'approved' && <Textarea id={reasonId} label="Justificativa" required
          value={reason} onChange={(event) => setReason(event.target.value)} readOnly={busy} />}
      </div>
    </Modal>
  </article>
}

export function OrganizationDriverDetailPage() {
  const { linkId } = useParams()
  const { user, access } = useAuth()
  const context = access?.activeContext
  if (!user || !linkId || (context?.kind !== 'company' && context?.kind !== 'cooperative')) return null
  const actor = { kind: 'organization', userId: user.id, organization: { kind: context.kind, organizationId: context.organizationId } } as const
  const result = readDriverLinkDetails(actor, linkId)
  return <div className="space-y-4">
    <Link to=".." relative="path" className={linkStyle}>Voltar à equipe</Link>
    <h1 className="text-muv-h1 font-bold">Verificação do vínculo</h1>
    {result.kind === 'ready' && result.links[0] ? <DriverLinkPanel key={user.id + ':' + linkId} actor={actor} detail={result.links[0]} />
      : <Alert role="alert" variant="danger">{result.kind === 'notFound' ? 'Vínculo indisponível nesta organização.' : 'Não foi possível consultar o vínculo.'}</Alert>}
  </div>
}

export function OwnDriverLinksPage({ selected = false }: { selected?: boolean }) {
  const { user, access } = useAuth()
  const context = access?.activeContext
  if (!user || (selected && context?.kind !== 'linkedDriver')) return null
  const actor: DriverLinkActor = { kind: 'driver', userId: user.id, activeContext: selected ? true : undefined }
  const result = readDriverLinkDetails(actor, selected && context?.kind === 'linkedDriver' ? context.linkId : undefined)
  const content = <>
    <h1 className="text-muv-h1 font-bold">{selected ? 'Vínculo selecionado' : 'Meus vínculos'}</h1>
    <ul className="space-y-2">
      <li><Link className={linkStyle} to={driverProfessionalRoute}>Perfil profissional</Link></li>
      <li><Link className={linkStyle} to={driverInvitationsRoute}>Convites recebidos</Link></li>
      <li><Link className={linkStyle} to={accountRoute}>Selecionar contexto em Minha conta</Link></li>
      {selected && <li><Link className={linkStyle} to={driverOwnLinksRoute}>Histórico de todos os meus vínculos</Link></li>}
    </ul>
    {result.kind === 'notFound' && <Alert variant="warning">Este contexto está sem vínculo organizacional de negócio ativo.</Alert>}
    {(result.kind === 'storageError' || result.kind === 'denied') && <Alert role="alert" variant="danger">Não foi possível consultar os vínculos.</Alert>}
    {result.kind === 'ready' && (result.links.length > 0 ? result.links.map((detail) =>
      <DriverLinkPanel key={user.id + ':' + detail.id} actor={actor} detail={detail} />) : <Card>Nenhum vínculo registrado.</Card>)}
  </>
  return selected ? <div className="space-y-4">{content}</div>
    : <main className="mx-auto max-w-3xl space-y-4 px-4 py-6">{content}</main>
}
