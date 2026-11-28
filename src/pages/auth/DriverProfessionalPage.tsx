import { useEffect, useEffectEvent, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router'
import Logo from '../../components/common/Logo'
import Alert from '../../components/feedback/Alert'
import DriverProfessionalFields from '../../components/forms/DriverProfessionalFields'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import { accountRoute, driverInvitationsRoute } from '../../constants/environmentRoutes'
import { useAuth } from '../../contexts/authContext'
import { driverDetails, emptyDriverProfessional, formatCnh, isCnhCurrent } from '../../domain/driverProfessional'
import type { DriverProfessionalErrors, DriverProfessionalInput } from '../../domain/driverProfessional'
import { readOwnDriverProfessional, saveOwnDriverProfessional, transitionOwnDriverProfessional } from '../../services/driverProfessional'

const linkStyle = 'font-semibold text-primary underline underline-offset-2'
const errorsByKind = {
  denied: 'O perfil profissional está disponível para contas comuns.',
  invalidLegacy: 'Os dados do cadastro anterior estão inconsistentes. A transição foi interrompida.',
  invalidStore: 'Os registros profissionais estão inconsistentes. Os dados foram preservados.',
  transitionError: 'Não foi possível concluir a transição. Os registros originais foram preservados.',
  storageError: 'Não foi possível acessar o armazenamento profissional.',
  stale: 'O perfil mudou desde o início da edição. Confira os dados atuais antes de editar novamente.',
} as const

function DriverProfessionalContent({ userId }: { userId: string }) {
  const { refreshSession } = useAuth()
  const result = readOwnDriverProfessional(userId)
  const ready = result.kind === 'ready'
  const professional = ready ? result.professional : undefined
  const needsTransition = ready && result.needsTransition
  const refreshAfterTransition = useEffectEvent(() => refreshSession())
  const [editor, setEditor] = useState<{ draft: DriverProfessionalInput; revision: string | null }>()
  const [errors, setErrors] = useState<DriverProfessionalErrors>({})
  const [feedback, setFeedback] = useState<{ message: string; success: boolean }>()
  const [busy, setBusy] = useState(false)
  const [attempt, retryTransition] = useState(0)
  const pending = useRef(false)
  const heading = useRef<HTMLHeadingElement>(null)
  const form = useRef<HTMLFormElement>(null)
  const liveFeedback = useRef<HTMLDivElement>(null)

  useEffect(() => { heading.current?.focus() }, [])
  const editing = !!editor
  useEffect(() => {
    if (editing) form.current?.querySelector('input')?.focus()
  }, [editing])
  useEffect(() => {
    if (feedback) (form.current?.querySelector<HTMLElement>('[aria-invalid="true"]') ?? liveFeedback.current)?.focus()
  }, [feedback])

  useEffect(() => {
    if (!needsTransition) return
    let mounted = true
    void transitionOwnDriverProfessional(userId).then((outcome) => {
      if (!mounted) return
      if (outcome.kind === 'saved' || outcome.kind === 'ready') refreshAfterTransition()
      else setFeedback({ success: false, message: errorsByKind[outcome.kind] })
    })
    return () => { mounted = false }
  }, [userId, needsTransition, attempt])

  function openEditor() {
    if (!ready) return
    setFeedback(undefined)
    setErrors({})
    setEditor({
      revision: result.revision,
      draft: professional ? { ...driverDetails(professional), cnhNumber: formatCnh(professional.cnhNumber) } : emptyDriverProfessional,
    })
  }

  function change<Key extends keyof DriverProfessionalInput>(field: Key, value: DriverProfessionalInput[Key]) {
    setEditor((previous) => previous && { ...previous, draft: { ...previous.draft, [field]: value } })
    setErrors((previous) => ({ ...previous, [field]: undefined }))
    setFeedback(undefined)
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!editor || pending.current) return
    pending.current = true
    setBusy(true)
    setErrors({})
    const outcome = await saveOwnDriverProfessional(userId, editor.draft, editor.revision)
    pending.current = false
    setBusy(false)
    if (outcome.kind === 'saved') {
      setEditor(undefined)
      setFeedback({ success: true, message: 'Perfil profissional salvo.' })
      refreshSession()
    } else if (outcome.kind === 'invalid') {
      setErrors(outcome.errors)
      setFeedback({ success: false, message: 'Confira os campos indicados.' })
    } else {
      if (outcome.kind === 'stale' || outcome.kind === 'denied') setEditor(undefined)
      setFeedback({ success: false, message: outcome.kind === 'storageError'
        ? 'Não foi possível gravar o perfil profissional. Os dados anteriores foram preservados.'
        : errorsByKind[outcome.kind] })
      if (outcome.kind === 'stale' || outcome.kind === 'denied') refreshSession()
    }
  }

  return <main className="mx-auto max-w-3xl space-y-4 px-4 py-6 [overflow-wrap:anywhere] sm:px-6">
    <header className="flex flex-wrap items-center justify-between gap-3">
      <Logo /><Link to={accountRoute} className={linkStyle}>Voltar à Minha conta</Link>
    </header>
    <h1 ref={heading} tabIndex={-1} className="text-muv-h1 font-bold">Perfil profissional do motorista</h1>
    {feedback && <div ref={liveFeedback} tabIndex={-1}>
      <Alert role={feedback.success ? 'status' : 'alert'} variant={feedback.success ? 'success' : 'danger'}>{feedback.message}</Alert>
    </div>}
    {!ready ? <Alert role="alert" variant="danger">{errorsByKind[result.kind]}</Alert> : <>
      <Link to={driverInvitationsRoute} className={linkStyle}>Convites recebidos</Link>
      <Card className="space-y-3">
        <h2 className="text-muv-h2 font-semibold">Dados pessoais</h2>
        <dl className="grid gap-3 sm:grid-cols-2">
          <div><dt className="text-muted">Nome completo</dt><dd>{result.account.fullName}</dd></div>
          <div><dt className="text-muted">CPF</dt><dd>{result.account.cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4')}</dd></div>
          <div><dt className="text-muted">Telefone</dt><dd>{result.account.phone}</dd></div>
          <div><dt className="text-muted">E-mail</dt><dd>{result.account.email}</dd></div>
        </dl>
        <Link to={accountRoute} className={linkStyle}>Consultar dados em Minha conta</Link>
      </Card>
      <p className="text-muted">A habilitação é compartilhada entre as atuações da mesma conta{result.hasAutonomous ? ', incluindo seu cadastro autônomo' : ''}.</p>
      <p className="text-muted">Este perfil cadastral não estabelece vínculo, verificação, autorização de prestador ou aptidão operacional.</p>
      {result.legacyChanged && <Alert role="status" variant="warning">
        O cadastro anterior foi alterado após a transição. Recarregue ou feche abas antigas. O perfil atual continua sendo a fonte ativa.
      </Alert>}
      {needsTransition && <Alert role="status" variant="warning">
        {feedback ? <Button variant="secondary" onClick={() => { setFeedback(undefined); retryTransition((value) => value + 1) }}>Tentar transição novamente</Button>
          : 'Concluindo a transição dos dados profissionais.'}
      </Alert>}
      <Card className="space-y-4">
        <h2 className="text-muv-h2 font-semibold">Habilitação profissional</h2>
        {professional && !isCnhCurrent(professional.cnhExpiresAt) && <Alert variant="warning">
          CNH vencida. Informe uma validade vigente para atualizar os dados profissionais.
        </Alert>}
        {editor ? <form ref={form} onSubmit={save} noValidate aria-busy={busy} className="space-y-4">
          <DriverProfessionalFields draft={editor.draft} errors={errors} change={change} processing={busy} />
          <div className="flex flex-wrap gap-3">
            <Button type="submit" loading={busy}>{editor.revision ? 'Salvar alterações' : 'Cadastrar perfil profissional'}</Button>
            <Button type="button" variant="secondary" disabled={busy} onClick={() => {
              setEditor(undefined)
              setFeedback(undefined)
              requestAnimationFrame(() => heading.current?.focus())
            }}>Cancelar</Button>
          </div>
        </form> : <>
          {professional ? <dl className="grid gap-3 sm:grid-cols-2">
            <div><dt>Número da CNH</dt><dd>{formatCnh(professional.cnhNumber)}</dd></div>
            <div><dt>Categoria</dt><dd>{professional.cnhCategory}</dd></div>
            <div><dt>Validade</dt><dd>{professional.cnhExpiresAt.split('-').reverse().join('/')}</dd></div>
            <div><dt>EAR declarado</dt><dd>{professional.hasEar ? 'Sim' : 'Não'}</dd></div>
          </dl> : <p className="text-muted">Perfil profissional ainda não cadastrado.</p>}
          <Button type="button" disabled={needsTransition} onClick={openEditor}>
            {professional ? 'Editar perfil profissional' : 'Cadastrar perfil profissional'}
          </Button>
        </>}
      </Card>
    </>}
  </main>
}

export default function DriverProfessionalPage() {
  const { user } = useAuth()
  return user && <DriverProfessionalContent key={user.id} userId={user.id} />
}
