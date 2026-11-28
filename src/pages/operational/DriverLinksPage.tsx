import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router'
import Alert from '../../components/feedback/Alert'
import ConfirmDialog from '../../components/feedback/ConfirmDialog'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import { accountRoute, driverInvitationsRoute, driverProfessionalRoute } from '../../constants/environmentRoutes'
import { useAuth } from '../../contexts/authContext'
import { contextKey } from '../../domain/accountAccess'
import { isCnhCurrent } from '../../domain/driverProfessional'
import type { OrganizationReference } from '../../domain/driverLink'
import { organizationKinds } from '../../domain/organization'
import { readOwnDriverProfessional } from '../../services/driverProfessional'
import {
  decideDriverInvitation, readActiveDriverLink, readDriverInvitations, readOrganizationDrivers, sendDriverInvitation,
} from '../../services/driverLinks'

const labels = { pending: 'Pendente', accepted: 'Aceito', declined: 'Recusado', canceled: 'Cancelado' }
const linkLabels = { active: 'Ativo', ended: 'Encerrado' }
const actionLabels = { accept: 'Aceitar', decline: 'Recusar', cancel: 'Cancelar' }
const linkStyle = 'font-semibold text-primary underline underline-offset-2'
const date = (value: string) => new Date(value).toLocaleString('pt-BR')
const errors = {
  denied: 'O acesso mudou. Confira a conta e o contexto ativos.',
  stale: 'Este convite já foi concluído. Confira o histórico.',
  missingProfile: 'Cadastre a habilitação profissional para aceitar o convite.',
  missingOrganization: 'A organização remetente está indisponível.',
  storageError: 'Não foi possível gravar a operação. Os registros anteriores foram preservados.',
  invalidEmail: 'Informe o e-mail completo da conta no MUV.',
}
const readError = 'Não foi possível consultar os registros neste contexto.'
type Action = keyof typeof actionLabels

function useInvitationFlow(userId: string, organization?: OrganizationReference) {
  const { refreshSession } = useAuth()
  const [confirmation, setConfirmation] = useState<{ id: string; action: Action; label: string }>()
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState<{ message: string; error?: boolean }>()
  const pending = useRef(false)
  const feedback = useRef<HTMLDivElement>(null)
  function report(message: string, error = false) {
    setNotice({ message, error })
    requestAnimationFrame(() => feedback.current?.focus())
  }
  async function run(operation: () => Promise<void>) {
    if (pending.current) return
    pending.current = true
    setBusy(true)
    try {
      await operation()
      refreshSession()
    } finally {
      pending.current = false
      setBusy(false)
    }
  }
  function decide() {
    if (!confirmation) return
    void run(async () => {
      const { id, action } = confirmation
      const result = await decideDriverInvitation(userId, id, action === 'cancel' && organization
        ? { kind: 'cancel', organization }
        : { kind: action === 'accept' ? 'accept' : 'decline' })
      setConfirmation(undefined)
      if (result.kind !== 'saved') report(errors[result.kind], true)
      else report(action === 'accept'
        ? 'Vínculo ativo. Para acessá-lo, selecione o novo contexto em Minha conta. A verificação organizacional é uma etapa independente.'
        : action === 'decline' ? 'Convite recusado.' : 'Convite cancelado.')
    })
  }
  const title = confirmation ? actionLabels[confirmation.action] + ' convite' : ''
  return {
    busy, run, report, setConfirmation,
    feedback: <div tabIndex={-1} ref={feedback}>{notice && <Alert role={notice.error ? 'alert' : 'status'}
      variant={notice.error ? 'danger' : 'success'}>{notice.message}</Alert>}</div>,
    dialog: <ConfirmDialog open={!!confirmation} onClose={() => setConfirmation(undefined)} onConfirm={decide}
      title={title} description={confirmation?.label ?? ''} confirmLabel={title}
      variant={confirmation?.action === 'accept' ? 'primary' : 'danger'} loading={busy} />,
  }
}

function OrganizationDrivers({ userId, organization }: { userId: string; organization: OrganizationReference }) {
  const data = readOrganizationDrivers(userId, organization)
  const flow = useInvitationFlow(userId, organization)
  const [email, setEmail] = useState('')
  const [invalid, setInvalid] = useState(false)
  function send(event: FormEvent) {
    event.preventDefault()
    void flow.run(async () => {
      const result = await sendDriverInvitation(userId, organization, email)
      setInvalid(result.kind === 'invalidEmail')
      if (result.kind === 'processed') {
        setEmail('')
        flow.report('Consulta processada. Confira os convites enviados para acompanhar novos registros.')
      } else flow.report(errors[result.kind], true)
    })
  }
  if (data.kind !== 'ready') return <Alert role="alert" variant="danger">{readError}</Alert>
  return <div className="space-y-5 [overflow-wrap:anywhere]">
    <h1 className="text-muv-h1 font-bold">Motoristas</h1>
    <p>{organizationKinds[organization.kind]} · {data.label}</p>
    {flow.feedback}
    <Card>
      <h2 className="mb-3 text-muv-h2 font-semibold">Convidar motorista</h2>
      <form className="space-y-3" onSubmit={send} noValidate>
        <Input type="email" label="E-mail da conta no MUV" name="email" autoComplete="off" required value={email}
          disabled={flow.busy} error={invalid ? errors.invalidEmail : undefined}
          onChange={(event) => { setEmail(event.target.value); setInvalid(false) }} />
        <Button type="submit" disabled={flow.busy}>Enviar convite</Button>
      </form>
    </Card>
    <Card className="space-y-3">
      <h2 className="text-muv-h2 font-semibold">Motoristas vinculados</h2>
      <p>A verificação organizacional será disponibilizada em etapa posterior.</p>
      {data.links.length ? <ul className="divide-y">{data.links.map((row) => <li key={row.id} className="py-3">
        <strong>{row.name ?? 'Identidade profissional indisponível'}</strong>
        {row.professionalId && <p>Perfil profissional · {row.professionalId}</p>}
        <p>{linkLabels[row.status]} · Aceite em {date(row.acceptedAt)}</p>
      </li>)}</ul> : <p>Nenhum motorista vinculado.</p>}
    </Card>
    <Card className="space-y-3">
      <h2 className="text-muv-h2 font-semibold">Convites enviados</h2>
      {data.invitations.length ? <ul className="divide-y">{data.invitations.map((row) => <li key={row.id} className="space-y-1 py-3">
        <strong>{row.email}</strong>
        <p>{labels[row.status]} · Envio em {date(row.sentAt)}</p>
        {row.decidedAt && <p>Conclusão em {date(row.decidedAt)}</p>}
        {row.status === 'pending' && <Button variant="secondary" disabled={flow.busy} onClick={() =>
          flow.setConfirmation({ id: row.id, action: 'cancel', label: 'Cancelar convite para ' + row.email + '?' })}>
          Cancelar convite
        </Button>}
      </li>)}</ul> : <p>Nenhum convite enviado.</p>}
    </Card>
    {flow.dialog}
  </div>
}

function DriverInvitations({ userId }: { userId: string }) {
  const data = readDriverInvitations(userId)
  const profile = readOwnDriverProfessional(userId)
  const flow = useInvitationFlow(userId)
  const professional = profile.kind === 'ready' && profile.professional
  return <main className="mx-auto max-w-3xl space-y-4 px-4 py-6 [overflow-wrap:anywhere]">
    <Link className={linkStyle} to={driverProfessionalRoute}>Voltar ao perfil profissional</Link>
    <h1 className="text-muv-h1 font-bold">Convites recebidos</h1>
    {flow.feedback}
    {data.kind !== 'ready' ? <Alert role="alert" variant="danger">{readError}</Alert> : <>
      {profile.kind !== 'ready' && <Alert variant="warning">Dados profissionais indisponíveis para aceite.</Alert>}
      {profile.kind === 'ready' && !professional && <Alert variant="warning">
        <Link className={linkStyle} to={driverProfessionalRoute}>Cadastre seu perfil profissional</Link> para aceitar. A recusa já está disponível.
      </Alert>}
      {professional && !isCnhCurrent(professional.cnhExpiresAt) && <Alert variant="warning">
        Sua CNH está vencida. Regularize a habilitação. O aceite do vínculo continua disponível.
      </Alert>}
      {data.invitations.length ? <ul className="space-y-3">{data.invitations.map((row) => <li key={row.id}>
        <Card className="space-y-2">
          <h2 className="text-muv-h2 font-semibold">{row.organizationName}</h2>
          <p>{organizationKinds[row.organizationKind]} · {labels[row.status]}</p>
          <p>Envio em {date(row.sentAt)}</p>
          {row.decidedAt && <p>Conclusão em {date(row.decidedAt)}</p>}
          {row.linkStatus && <p>Vínculo {linkLabels[row.linkStatus].toLowerCase()}</p>}
          {row.status === 'pending' && <div className="flex flex-wrap gap-2">
            <Button disabled={!professional || flow.busy} onClick={() =>
              flow.setConfirmation({ id: row.id, action: 'accept', label: 'Estabelecer vínculo com ' + row.organizationName + '?' })}>Aceitar</Button>
            <Button variant="secondary" disabled={flow.busy} onClick={() =>
              flow.setConfirmation({ id: row.id, action: 'decline', label: 'Recusar convite de ' + row.organizationName + '?' })}>Recusar</Button>
          </div>}
        </Card>
      </li>)}</ul> : <Card>Nenhum convite recebido.</Card>}
      <Link className={linkStyle} to={accountRoute}>Consultar contextos em Minha conta</Link>
    </>}
    {flow.dialog}
  </main>
}

export function DriverInvitationsPage() {
  const { user } = useAuth()
  return user && <DriverInvitations key={user.id} userId={user.id} />
}

export function OrganizationDriversPage() {
  const { user, access } = useAuth()
  const active = access?.activeContext
  if (!user || (active?.kind !== 'company' && active?.kind !== 'cooperative')) return null
  return <OrganizationDrivers key={user.id + ':' + contextKey(active)} userId={user.id}
    organization={{ kind: active.kind, organizationId: active.organizationId }} />
}

export function ActiveDriverLinkPage() {
  const { user, access } = useAuth()
  const active = access?.activeContext
  if (!user || active?.kind !== 'linkedDriver') return null
  const data = readActiveDriverLink(user.id, active.linkId)
  return <div className="space-y-4 [overflow-wrap:anywhere]">
    <h1 className="text-muv-h1 font-bold">Vínculo selecionado</h1>
    {data.kind === 'ready' ? <Card className="space-y-2">
      <h2 className="text-muv-h2 font-semibold">{data.organizationName}</h2>
      <p>{organizationKinds[data.organizationKind]} · CNPJ {data.cnpj}</p>
      <p>Motorista: {data.name}</p>
      <p>Vínculo {linkLabels[data.link.status].toLowerCase()} · Aceite em {date(data.link.acceptedAt)}</p>
      <p>A verificação organizacional é uma etapa posterior. O vínculo permite consultar esta organização.</p>
    </Card> : <Alert role="status" variant="warning">
      {data.kind === 'missingLink' ? 'Este contexto está sem vínculo organizacional de negócio.' : readError}
    </Alert>}
    <ul className="space-y-2">
      <li><Link className={linkStyle} to={driverProfessionalRoute}>Perfil profissional</Link></li>
      <li><Link className={linkStyle} to={driverInvitationsRoute}>Convites recebidos</Link></li>
      <li><Link className={linkStyle} to={accountRoute}>Selecionar contexto em Minha conta</Link></li>
    </ul>
  </div>
}
