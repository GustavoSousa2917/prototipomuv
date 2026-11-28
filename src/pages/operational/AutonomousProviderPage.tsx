import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router'

import ContextChoices from '../../components/common/ContextChoices'
import DriverProfessionalFields from '../../components/forms/DriverProfessionalFields'
import Alert from '../../components/feedback/Alert'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Checkbox from '../../components/ui/Checkbox'
import { accountRoute, autonomousProfileRoute, autonomousRegistrationRoute, driverProfessionalRoute, environmentRoutes, serviceRegionRoutes } from '../../constants/environmentRoutes'
import { useAuth } from '../../contexts/authContext'
import { freightModalities } from '../../domain/autonomousProvider'
import { driverDetails, emptyDriverProfessional, formatCnh, isCnhCurrent } from '../../domain/driverProfessional'
import type { DriverProfessional, DriverProfessionalInput } from '../../domain/driverProfessional'
import type { ProfessionalInput } from '../../domain/autonomousProvider'
import { readOwnProfessionalRegistration, saveOwnProfessionalRegistration } from '../../services/autonomousProvider'

const linkStyle = 'inline-block rounded-muv-button font-semibold text-primary underline underline-offset-2'
const dateFormat = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' })

function initialDraft(professional?: DriverProfessional, intendedModalities: string[] = []): ProfessionalInput {
  return {
    ...(professional ? { ...driverDetails(professional), cnhNumber: formatCnh(professional.cnhNumber) } : emptyDriverProfessional),
    intendedModalities,
  }
}

function ProfessionalRegistration({ userId, create }: { userId: string; create: boolean }) {
  const { access, refreshSession } = useAuth()
  const result = readOwnProfessionalRegistration(userId)
  const provider = result.kind === 'ready' ? result.provider : undefined
  const professional = result.kind === 'ready' ? result.professional : undefined
  const [draft, setDraft] = useState<ProfessionalInput | null>(() => create && !provider ? initialDraft(professional) : null)
  const [revision, setRevision] = useState(result.kind === 'ready' ? result.revision : undefined)
  const [errors, setErrors] = useState<Partial<Record<keyof ProfessionalInput, string>>>({})
  const [feedback, setFeedback] = useState('')
  const [failed, setFailed] = useState(false)
  const [saved, setSaved] = useState(false)
  const [processing, setProcessing] = useState(false)
  const submitting = useRef(false)
  const form = useRef<HTMLFormElement>(null)
  const title = useRef<HTMLHeadingElement>(null)
  const focusedFeedback = useRef<HTMLDivElement>(null)
  const feedbackFocus = useRef(false)
  const editing = draft !== null && !(create && provider)

  useEffect(() => {
    if (editing) form.current?.querySelector('input')?.focus()
    else title.current?.focus()
  }, [editing])

  useEffect(() => {
    if (!feedbackFocus.current) return
    feedbackFocus.current = false
    const invalid = form.current?.querySelector<HTMLElement>('[aria-invalid="true"]')
    const target = invalid ?? focusedFeedback.current
    target?.focus()
  }, [errors, feedback])

  function changeDriver<Key extends keyof DriverProfessionalInput>(field: Key, value: DriverProfessionalInput[Key]) {
    setDraft((previous) => previous && { ...previous, [field]: value })
    setErrors((previous) => ({ ...previous, [field]: undefined }))
    setFeedback('')
  }

  function changeModalities(intendedModalities: string[]) {
    setDraft((previous) => previous && { ...previous, intendedModalities })
    setErrors((previous) => ({ ...previous, intendedModalities: undefined }))
    setFeedback('')
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!draft || submitting.current) return
    submitting.current = true
    setProcessing(true)
    setErrors({})
    setFeedback('')
    const outcome = await saveOwnProfessionalRegistration(userId, draft, create ? 'create' : 'edit', revision ?? '')
    submitting.current = false
    setProcessing(false)
    feedbackFocus.current = true

    if (outcome.kind === 'saved') {
      setSaved(true)
      setFailed(false)
      setDraft(null)
      setFeedback(create
        ? 'Cadastro profissional realizado. Seu ambiente de prestador autônomo está disponível para preparação operacional.'
        : 'Dados profissionais atualizados.')
      refreshSession()
      return
    }

    setFailed(true)
    if (outcome.kind === 'invalid') {
      setErrors(outcome.errors)
      setFeedback('Confira os campos indicados.')
    } else {
      if (outcome.kind === 'stale') {
        if (!create) setDraft(null)
        setFeedback('A habilitação ou as modalidades mudaram. Confira os dados atuais antes de editar novamente.')
        refreshSession()
        return
      }
      setFeedback(outcome.kind === 'denied' ? 'A sessão mudou. A operação foi interrompida.'
        : outcome.kind === 'transitionError' || outcome.kind === 'invalidLegacy'
          ? 'Não foi possível concluir a transição dos dados profissionais. Os registros originais foram preservados.'
          : outcome.kind === 'alreadyExists' ? 'A conta já possui cadastro profissional.'
          : 'Não foi possível salvar o cadastro profissional. Confira o armazenamento e tente novamente.')
      if (outcome.kind === 'denied') refreshSession()
    }
  }

  const active = access?.activeContext
  const autonomous = access?.contexts.filter(({ kind }) => kind === 'autonomous') ?? []
  function restartDraft() {
    if (result.kind !== 'ready') return
    setRevision(result.revision)
    setErrors({})
    setFeedback('')
    setDraft(initialDraft(result.professional, provider?.intendedModalities))
  }

  const returnTo = active ? environmentRoutes[active.kind] : '/prestador'

  return (
    <div className="mx-auto w-full max-w-3xl space-y-4 [overflow-wrap:anywhere]">
      {create && <Link to="/prestador" className={linkStyle}>Voltar à área do prestador</Link>}
      <h1 ref={title} tabIndex={-1} className="text-muv-h1 font-bold">{create ? 'Cadastro de prestador autônomo' : 'Perfil do prestador autônomo'}</h1>
      {feedback && <div ref={focusedFeedback} tabIndex={-1}>
        <Alert role={failed ? 'alert' : 'status'} variant={failed ? 'danger' : 'success'}>{feedback}</Alert>
      </div>}
      {result.kind !== 'ready' ? (
        <Alert role="alert" variant="danger">{result.kind === 'invalidLegacy'
          ? 'Os dados do cadastro anterior estão inconsistentes. A transição foi interrompida.'
          : 'Não foi possível consultar o cadastro profissional da conta atual.'}</Alert>
      ) : (
        <>
          {result.legacyChanged && <Alert role="status" variant="warning">
            O cadastro anterior foi alterado após a transição. Recarregue ou feche abas antigas. Os dados atuais permanecem ativos.
          </Alert>}
          {professional && !isCnhCurrent(professional.cnhExpiresAt) && <Alert variant="warning">
            CNH vencida. Informe uma validade vigente para atualizar o cadastro.
          </Alert>}
          <Card className="space-y-3">
            <h2 className="text-muv-h2 font-semibold">Dados da conta</h2>
            <dl className="grid gap-3 break-words sm:grid-cols-2">
              <div><dt className="text-muted">Nome completo</dt><dd>{result.account.fullName}</dd></div>
              <div><dt className="text-muted">CPF</dt><dd>{result.account.cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4')}</dd></div>
              <div><dt className="text-muted">Telefone</dt><dd>{result.account.phone.replace(/^(\d{2})(\d{4,5})(\d{4})$/, '($1) $2-$3')}</dd></div>
              <div><dt className="text-muted">E-mail</dt><dd>{result.account.email}</dd></div>
            </dl>
            <Link to={accountRoute} className={linkStyle}>Minha conta</Link>
          </Card>
          {editing && draft ? (
            <form ref={form} onSubmit={submit} noValidate aria-busy={processing} className="space-y-4">
              <Card className="space-y-4">
                <h2 className="text-muv-h2 font-semibold">Habilitação profissional</h2>
                {create && professional && <p className="text-muted">Habilitação reaproveitada do perfil profissional da conta.</p>}
                <DriverProfessionalFields draft={draft} errors={errors} processing={processing} change={changeDriver} />
                {create && revision !== result.revision && <Button type="button" variant="secondary" onClick={restartDraft}>Carregar dados atuais</Button>}
              </Card>
              <Card>
                <fieldset className="space-y-3" aria-describedby="modality-hint">
                  <legend className="text-muv-h2 font-semibold">Modalidades pretendidas</legend>
                  <p id="modality-hint" className="text-muted">Envie a solicitação na página Autorizações.</p>
                  {Object.entries(freightModalities).map(([key, label], index) => (
                    <Checkbox key={key} label={label} name="intendedModalities" disabled={processing}
                      checked={draft.intendedModalities.includes(key)} error={index === 0 ? errors.intendedModalities : undefined}
                      onChange={(event) => changeModalities(event.target.checked
                        ? [...draft.intendedModalities, key] : draft.intendedModalities.filter((item) => item !== key))} />
                  ))}
                </fieldset>
              </Card>
              <div className="flex flex-wrap items-center gap-3">
                <Button type="submit" loading={processing}>{create ? 'Cadastrar prestador' : 'Salvar alterações'}</Button>
                {create ? <Link to="/prestador" className={linkStyle}>Cancelar</Link> : (
                  <Button variant="secondary" disabled={processing} onClick={() => {
                    setDraft(null)
                    setErrors({})
                    setFeedback('')
                  }}>Cancelar</Button>
                )}
              </div>
            </form>
          ) : provider ? (
            <Card className="space-y-4">
              <h2 className="text-muv-h2 font-semibold">Dados profissionais</h2>
              <dl className="grid gap-3 sm:grid-cols-2">
                <div><dt>Número da CNH</dt><dd>{formatCnh(provider.cnhNumber)}</dd></div>
                <div><dt>Categoria</dt><dd>{provider.cnhCategory}</dd></div>
                <div><dt>Validade</dt><dd>{provider.cnhExpiresAt.split('-').reverse().join('/')}</dd></div>
                <div><dt>EAR declarado</dt><dd>{provider.hasEar ? 'Sim' : 'Não'}</dd></div>
                <div><dt>Cadastro</dt><dd>{dateFormat.format(new Date(provider.createdAt))}</dd></div>
                {provider.updatedAt !== provider.createdAt && <div><dt>Atualização</dt><dd>{dateFormat.format(new Date(provider.updatedAt))}</dd></div>}
              </dl>
              <div>
                <h3 className="font-semibold">Modalidades pretendidas</h3>
                <ul className="list-disc pl-5">
                  {provider.intendedModalities.map((key) => <li key={key}>{freightModalities[key]}</li>)}
                </ul>
              </div>
              <p className="text-muted">O cadastro permite preparar a operação. Consulte a situação administrativa na página Autorizações. A prontidão operacional será determinada em etapa posterior.</p>
              {!create && <Link to={driverProfessionalRoute} className={`block ${linkStyle}`}>Consultar habilitação compartilhada</Link>}
              {!create && <Link to={serviceRegionRoutes.autonomous} className={`block ${linkStyle}`}>Gerenciar regiões de atendimento</Link>}
              {create ? (
                <div className="space-y-4">
                  {!saved && <Link to={autonomousProfileRoute} className={linkStyle}>Consultar cadastro profissional</Link>}
                  {autonomous.length > 0 && <ContextChoices contexts={autonomous} />}
                  <Link to={returnTo} className={linkStyle}>Continuar no contexto atual</Link>
                </div>
              ) : (
                <Button onClick={restartDraft}>Editar dados profissionais</Button>
              )}
            </Card>
          ) : (
            <Alert>
              Esta conta tem acesso ao ambiente demonstrativo e ainda não possui cadastro profissional.
              <Link to={autonomousRegistrationRoute} className={`mt-2 block ${linkStyle}`}>Iniciar cadastro autônomo</Link>
            </Alert>
          )}
        </>
      )}
    </div>
  )
}

export default function AutonomousProviderPage({ create = false }: { create?: boolean }) {
  const { user } = useAuth()
  if (!user) return null
  return create ? (
    <main className="px-4 py-6">
      <ProfessionalRegistration key={user.id} userId={user.id} create />
    </main>
  ) : <ProfessionalRegistration key={user.id} userId={user.id} create={false} />
}
