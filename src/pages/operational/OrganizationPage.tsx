import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router'

import ContextChoices from '../../components/common/ContextChoices'
import Alert from '../../components/feedback/Alert'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Checkbox from '../../components/ui/Checkbox'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import { accountRoute, environmentRoutes, organizationRegistrationRoutes } from '../../constants/environmentRoutes'
import { useAuth } from '../../contexts/authContext'
import { freightModalities } from '../../domain/autonomousProvider'
import { brazilianStates, isOrganizationKind, organizationKinds } from '../../domain/organization'
import type { Organization, OrganizationErrors, OrganizationInput, OrganizationKind } from '../../domain/organization'
import { readOrganizationRegistrant, readOwnOrganization, registerOrganization, updateOwnOrganization } from '../../services/organizations'

const emptyInput: OrganizationInput = {
  legalName: '', tradeName: '', email: '', phone: '', intendedModalities: [],
  address: { cep: '', street: '', number: '', complement: '', neighborhood: '', city: '', state: '' },
}
const addressFields = [
  ['cep', 'CEP'], ['street', 'Logradouro'], ['number', 'Número'],
  ['complement', 'Complemento'], ['neighborhood', 'Bairro'], ['city', 'Município'],
] as const
const linkStyle = 'inline-block font-semibold text-primary underline underline-offset-2'
const dateFormat = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' })

function OrganizationForm({ userId, organization, initialKind, onSaved, onCancel }: {
  userId: string
  organization?: Organization
  initialKind: OrganizationKind
  onSaved: (id: string) => void
  onCancel?: () => void
}) {
  const [input, setInput] = useState<OrganizationInput>(() => organization ? {
    legalName: organization.legalName, tradeName: organization.tradeName, email: organization.email, phone: organization.phone,
    intendedModalities: organization.intendedModalities, address: organization.address,
  } : emptyInput)
  const [kind, setKind] = useState(initialKind)
  const [cnpj, setCnpj] = useState('')
  const [acceptsResponsibility, setAcceptsResponsibility] = useState(false)
  const [errors, setErrors] = useState<OrganizationErrors>({})
  const [failure, setFailure] = useState('')
  const [busy, setBusy] = useState(false)
  const pending = useRef(false)
  const form = useRef<HTMLFormElement>(null)
  const feedback = useRef<HTMLDivElement>(null)

  const isEditForm = !!organization
  useEffect(() => {
    if (isEditForm) form.current?.querySelector<HTMLElement>('input:not([readonly])')?.focus()
  }, [isEditForm])

  useEffect(() => {
    if (Object.keys(errors).length) form.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
    else if (failure) feedback.current?.focus()
  }, [errors, failure])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending.current) return
    pending.current = true
    setBusy(true)
    setErrors({})
    setFailure('')
    const result = organization
      ? await updateOwnOrganization(userId, organization.id, input)
      : await registerOrganization(userId, { ...input, kind, cnpj, acceptsResponsibility })
    pending.current = false
    setBusy(false)
    if (result.kind === 'saved') onSaved(result.organizationId)
    else if (result.kind === 'invalid') setErrors(result.errors)
    else setFailure(result.kind === 'denied' || result.kind === 'missing'
      ? 'A sessão ou o contexto mudou. A gravação foi interrompida.'
      : 'Não foi possível salvar o cadastro organizacional. Tente novamente.')
  }

  return (
    <form ref={form} onSubmit={submit} noValidate aria-busy={busy} className="space-y-4">
      {failure && <div ref={feedback} tabIndex={-1}><Alert role="alert" variant="danger">{failure}</Alert></div>}
      <Card className="space-y-3">
        <h2 className="text-muv-h2 font-semibold">Identificação da organização</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {organization ? <Input label="Tipo organizacional" readOnly value={organizationKinds[organization.kind]} /> : (
            <Select name="kind" label="Tipo organizacional" required disabled={busy} value={kind} error={errors.kind}
              onChange={(event) => { if (isOrganizationKind(event.target.value)) setKind(event.target.value) }}>
              {Object.entries(organizationKinds).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </Select>
          )}
          <Input name="cnpj" label="CNPJ" autoCapitalize="characters" spellCheck={false} required
            value={organization?.cnpj ?? cnpj} readOnly={busy || !!organization} error={errors.cnpj}
            onChange={(event) => setCnpj(event.target.value)} />
          <Input name="legalName" label="Razão social" required readOnly={busy} value={input.legalName} error={errors.legalName}
            onChange={(event) => setInput({ ...input, legalName: event.target.value })} />
          <Input name="tradeName" label="Nome fantasia" readOnly={busy} value={input.tradeName}
            onChange={(event) => setInput({ ...input, tradeName: event.target.value })} />
        </div>
      </Card>
      <Card className="space-y-3">
        <h2 className="text-muv-h2 font-semibold">Contato comercial</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Input name="phone" label="Telefone comercial" type="tel" required readOnly={busy} value={input.phone} error={errors.phone}
            onChange={(event) => setInput({ ...input, phone: event.target.value })} />
          <Input name="email" label="E-mail comercial" type="email" required readOnly={busy} value={input.email} error={errors.email}
            onChange={(event) => setInput({ ...input, email: event.target.value })} />
        </div>
      </Card>
      <Card className="space-y-3">
        <h2 className="text-muv-h2 font-semibold">Endereço cadastral</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {addressFields.map(([name, label]) => (
            <Input key={name} name={name} label={label} required={name !== 'complement'} readOnly={busy}
              inputMode={name === 'cep' ? 'numeric' : undefined} value={input.address[name]} error={errors[name]}
              onChange={(event) => setInput({ ...input, address: { ...input.address, [name]: event.target.value } })} />
          ))}
          <Select name="state" label="UF" required disabled={busy} value={input.address.state} error={errors.state}
            onChange={(event) => setInput({ ...input, address: { ...input.address, state: event.target.value } })}>
            <option value="">Selecione</option>
            {brazilianStates.map((state) => <option key={state}>{state}</option>)}
          </Select>
        </div>
      </Card>
      <Card className="space-y-4">
        <fieldset className="space-y-3">
          <legend className="text-muv-h2 font-semibold">Modalidades pretendidas</legend>
          <p className="text-muted">A autorização por modalidade será tratada em etapa posterior.</p>
          {Object.entries(freightModalities).map(([key, label], index) => (
            <Checkbox key={key} name={key} label={label} disabled={busy} checked={input.intendedModalities.includes(key)}
              error={index === 0 ? errors.intendedModalities : undefined}
              onChange={(event) => setInput({ ...input, intendedModalities: event.target.checked
                ? [...input.intendedModalities, key] : input.intendedModalities.filter((item) => item !== key) })} />
          ))}
        </fieldset>
        {!organization && <Checkbox name="responsibility" label="Declaro ser responsável pela organização neste protótipo."
          description="A declaração é simulada." required disabled={busy} checked={acceptsResponsibility}
          error={errors.acceptsResponsibility} onChange={(event) => setAcceptsResponsibility(event.target.checked)} />}
      </Card>
      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" loading={busy}>{organization ? 'Salvar alterações' : 'Cadastrar organização'}</Button>
        {onCancel
          ? <Button variant="secondary" disabled={busy} onClick={onCancel}>Cancelar</Button>
          : <Link to="/prestador" className={linkStyle}>Cancelar</Link>}
      </div>
    </form>
  )
}

function OrganizationDetails({ organization }: { organization: Organization }) {
  const { address } = organization
  const rows = [
    ['Tipo', organizationKinds[organization.kind]], ['CNPJ', organization.cnpj],
    ['Razão social', organization.legalName], ['Nome fantasia', organization.tradeName || 'Não informado'],
    ['Telefone comercial', organization.phone], ['E-mail comercial', organization.email],
    ['CEP', address.cep], ['Logradouro', address.street], ['Número', address.number],
    ['Complemento', address.complement || 'Não informado'], ['Bairro', address.neighborhood],
    ['Município', address.city], ['UF', address.state],
    ['Modalidades pretendidas', organization.intendedModalities.map((key) => freightModalities[key]).join(', ')],
    ['Cadastro', dateFormat.format(new Date(organization.createdAt))],
  ]
  if (organization.createdAt !== organization.updatedAt) rows.push(['Atualização', dateFormat.format(new Date(organization.updatedAt))])
  return (
    <Card>
      <dl className="grid gap-3 [overflow-wrap:anywhere] sm:grid-cols-2">
        {rows.map(([label, value]) => <div key={label}><dt className="text-muted">{label}</dt><dd>{value}</dd></div>)}
      </dl>
    </Card>
  )
}

function OrganizationContent({ userId, kind, organizationId }: { userId: string; kind: OrganizationKind; organizationId?: string }) {
  const { access, refreshSession } = useAuth()
  const result = organizationId ? readOwnOrganization(userId, organizationId) : null
  const organization = result?.kind === 'ready' ? result.organization : undefined
  const account = result ? result.kind === 'ready' ? result.account : null : readOrganizationRegistrant(userId)
  const [editing, setEditing] = useState(false)
  const [savedId, setSavedId] = useState<string | null>(null)
  const heading = useRef<HTMLHeadingElement>(null)
  const confirmation = useRef<HTMLDivElement>(null)
  const active = access?.activeContext
  const savedContexts = access?.contexts.filter((item) => 'organizationId' in item && item.organizationId === savedId) ?? []

  useEffect(() => {
    if (savedId) confirmation.current?.focus()
    else if (!editing) heading.current?.focus()
  }, [savedId, editing])

  function saved(id: string) {
    setEditing(false)
    setSavedId(id)
    refreshSession()
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      {!organizationId && <Link to="/prestador" className={linkStyle}>Voltar à área do prestador</Link>}
      <h1 ref={heading} tabIndex={-1} className="text-muv-h1 font-bold">{organizationId ? 'Perfil organizacional' : 'Cadastro organizacional'}</h1>
      {savedId && <div ref={confirmation} tabIndex={-1}>
        <Alert role="status" variant="success">{organizationId ? 'Dados organizacionais atualizados.'
          : 'Cadastro realizado. Seu ambiente organizacional está disponível para preparação operacional.'}</Alert>
      </div>}
      {account && <Card className="space-y-3">
        <h2 className="text-muv-h2 font-semibold">Dados do responsável</h2>
        <dl className="grid gap-3 [overflow-wrap:anywhere] sm:grid-cols-2">
          {[['Nome completo', account.fullName], ['CPF', account.cpf], ['Telefone', account.phone], ['E-mail', account.email]]
            .map(([label, value]) => <div key={label}><dt className="text-muted">{label}</dt><dd>{value}</dd></div>)}
        </dl>
        <Link to={accountRoute} className={linkStyle}>Minha conta</Link>
      </Card>}
      {!organizationId && savedId ? (
        <Card className="space-y-4">
          {savedContexts.length > 0 && <ContextChoices contexts={savedContexts} />}
          <Link to={active ? environmentRoutes[active.kind] : '/prestador'} className={linkStyle}>Continuar no contexto atual</Link>
        </Card>
      ) : account && (!organizationId || editing) ? (
        <OrganizationForm userId={userId} organization={organization} initialKind={kind} onSaved={saved}
          onCancel={organizationId ? () => setEditing(false) : undefined} />
      ) : organization ? (
        <>
          <OrganizationDetails organization={organization} />
          <Button onClick={() => { setSavedId(null); setEditing(true) }}>Editar dados organizacionais</Button>
        </>
      ) : result?.kind === 'missing' ? (
        <Alert>
          Este contexto demonstrativo ainda não possui cadastro organizacional.
          <Link to={organizationRegistrationRoutes[kind]} className={`mt-2 block ${linkStyle}`}>Cadastrar organização</Link>
        </Alert>
      ) : <Alert role="alert" variant="danger">Não foi possível consultar os dados organizacionais no contexto atual.</Alert>}
    </div>
  )
}

export default function OrganizationPage({ register }: { register?: OrganizationKind }) {
  const { user, access } = useAuth()
  if (!user) return null
  if (register) return <main className="px-4 py-6"><OrganizationContent key={`${user.id}:${register}`} userId={user.id} kind={register} /></main>
  const active = access?.activeContext
  if (!active || (active.kind !== 'company' && active.kind !== 'cooperative')) return null
  return <OrganizationContent key={`${user.id}:${active.organizationId}`} userId={user.id} kind={active.kind} organizationId={active.organizationId} />
}
