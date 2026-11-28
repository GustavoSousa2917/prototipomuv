import { useEffect, useRef, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { Link } from 'react-router'

import ContextChoices from '../../components/common/ContextChoices'
import Logo from '../../components/common/Logo'
import Alert from '../../components/feedback/Alert'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import { driverProfessionalRoute, environmentRoutes } from '../../constants/environmentRoutes'
import { useAuth } from '../../contexts/authContext'
import { contextKey, contextLabel } from '../../domain/accountAccess'
import type { PersonalDetails, User } from '../../domain/userRegistration'
import { readOwnAccount, updateOwnAccount } from '../../services/manageAccount'

const purposeLabels: Record<User['initialPurpose'], string> = {
  requestFreight: 'Solicitar fretes',
  offerFreight: 'Oferecer serviços de frete',
  linkedDriver: 'Atuar como motorista vinculado',
}
const dateFormat = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' })
const linkStyle = 'font-semibold text-primary underline underline-offset-2'

function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="break-words font-medium">{children}</dd>
    </div>
  )
}

function AccountDetails({ userId }: { userId: string }) {
  const { refreshSession, logout } = useAuth()
  const account = readOwnAccount(userId)
  const [draft, setDraft] = useState<PersonalDetails | null>(null)
  const [errors, setErrors] = useState<Partial<Record<keyof PersonalDetails, string>>>({})
  const [message, setMessage] = useState('')
  const [saved, setSaved] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const pending = useRef(false)
  const heading = useRef<HTMLHeadingElement>(null)
  const personalSection = useRef<HTMLDivElement>(null)
  const restoreFocus = useRef(false)
  const editing = draft !== null

  useEffect(() => {
    heading.current?.focus()
  }, [])

  useEffect(() => {
    if (editing) personalSection.current?.querySelector<HTMLInputElement>('[name="fullName"]')?.focus()
    else if (restoreFocus.current) {
      personalSection.current?.querySelector<HTMLButtonElement>('button')?.focus()
      restoreFocus.current = false
    }
  }, [editing])

  function closeEditor() {
    restoreFocus.current = true
    setDraft(null)
    setErrors({})
    setMessage('')
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!draft || pending.current) return
    pending.current = true
    setProcessing(true)
    setMessage('')
    setErrors({})

    const result = await updateOwnAccount(userId, draft)

    pending.current = false
    setProcessing(false)
    if (result.kind === 'updated') {
      closeEditor()
      setSaved(true)
      refreshSession()
    } else if (result.kind === 'invalidFields') {
      setErrors(result.errors)
      if (result.errors.fullName) personalSection.current?.querySelector<HTMLInputElement>('[name="fullName"]')?.focus()
      else personalSection.current?.querySelector<HTMLInputElement>('[name="phone"]')?.focus()
    } else if (result.kind === 'sessionChanged') {
      refreshSession()
      setMessage('A sessão mudou. Os dados não foram salvos.')
    } else {
      setMessage('Não foi possível salvar os dados. Tente novamente.')
    }
  }

  async function exit() {
    setLoggingOut(true)
    const result = await logout()
    setLoggingOut(false)
    if (result === 'storageError') setMessage('Não foi possível encerrar a sessão. Tente novamente.')
  }

  const active = account?.activeContext
  const activeKey = active && contextKey(active)
  const phone = account?.phone.replace(/^(\d{2})(\d{4,5})(\d{4})$/, '($1) $2-$3')

  return (
    <main className="mx-auto max-w-4xl space-y-5 px-4 py-6 sm:px-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <Logo />
        <Link to={active ? environmentRoutes[active.kind] : '/'} className={linkStyle}>Voltar ao ambiente</Link>
        <Button variant="outline" loading={loggingOut} onClick={exit}>Sair da conta</Button>
      </header>
      <h1 ref={heading} tabIndex={-1} className="text-muv-h1 font-bold">Minha conta</h1>
      {message && <Alert role="alert" variant="danger">{message}</Alert>}
      {saved && <Alert role="status" variant="success">Dados atualizados.</Alert>}
      {!account ? <Alert role="alert" variant="danger">Não foi possível consultar sua conta.</Alert> : (
        <>
          <div ref={personalSection}>
            <Card className="space-y-4">
              <h2 className="text-muv-h2 font-bold">Dados pessoais</h2>
              {!draft && (
                <dl className="grid gap-4 sm:grid-cols-2">
                  <Detail label="Nome completo">{account.fullName}</Detail>
                  <Detail label="Telefone">{phone}</Detail>
                </dl>
              )}
              <dl className="grid gap-4 sm:grid-cols-2">
                <Detail label="CPF (somente leitura)">{account.cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4')}</Detail>
                <Detail label="E-mail (somente leitura)">{account.email}</Detail>
              </dl>
              {draft ? (
                <form noValidate onSubmit={save} aria-busy={processing} className="space-y-4">
                  <Input label="Nome completo" name="fullName" autoComplete="name" required readOnly={processing}
                    value={draft.fullName} error={errors.fullName} onChange={(event) => setDraft({ ...draft, fullName: event.target.value })} />
                  <Input label="Telefone" type="tel" name="phone" autoComplete="tel-national" required readOnly={processing}
                    value={draft.phone} error={errors.phone} onChange={(event) => setDraft({ ...draft, phone: event.target.value })} />
                  <div className="flex flex-wrap gap-2">
                    <Button type="submit" loading={processing}>Salvar alterações</Button>
                    <Button variant="secondary" disabled={processing} onClick={closeEditor}>Cancelar</Button>
                  </div>
                </form>
              ) : (
                <Button onClick={() => {
                  setSaved(false)
                  setMessage('')
                  setDraft({ fullName: account.fullName, phone: phone ?? '' })
                }}>Editar dados</Button>
              )}
            </Card>
          </div>
          {account.contexts.some(({ kind }) => kind === 'client') && <Card className="space-y-2">
            <h2 className="text-muv-h2 font-bold">Habilitação profissional</h2>
            <Link to={driverProfessionalRoute} className={linkStyle}>Cadastrar ou consultar perfil profissional</Link>
          </Card>}
          <Card className="space-y-4">
            <h2 className="text-muv-h2 font-bold">Contextos de atuação</h2>
            <ul className="list-disc space-y-1 pl-5">
              {account.contexts.map((context) => (
                <li key={contextKey(context)} className="break-words">
                  {contextLabel(context)}{activeKey === contextKey(context) && ' (ativo)'}
                </li>
              ))}
            </ul>
            {account.contexts.length > 1 && !editing && <ContextChoices contexts={account.contexts} />}
          </Card>
          <Card className="space-y-4">
            <h2 className="text-muv-h2 font-bold">Informações da conta</h2>
            <dl className="grid gap-4 sm:grid-cols-2">
              <Detail label="Finalidade inicial">{purposeLabels[account.initialPurpose]}</Detail>
              <Detail label="Data de cadastro">{dateFormat.format(new Date(account.createdAt))}</Detail>
            </dl>
            <p className="text-muted">A finalidade inicial registra a intenção informada no cadastro. As permissões profissionais dependem de atribuições próprias.</p>
          </Card>
        </>
      )}
    </main>
  )
}

export default function AccountPage() {
  const { user } = useAuth()
  return user && <AccountDetails key={user.id} userId={user.id} />
}
