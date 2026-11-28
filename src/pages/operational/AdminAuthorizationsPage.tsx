import { useState } from 'react'
import { Link } from 'react-router'
import { AuthorizationBadge } from '../../components/authorizations/AuthorizationDetails'
import { authorizationDate, useAuthorizationRefresh } from '../../components/authorizations/authorizationPresentation'
import Alert from '../../components/feedback/Alert'
import EmptyState from '../../components/feedback/EmptyState'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import { adminAuthorizationRoute } from '../../constants/environmentRoutes'
import { useAuth } from '../../contexts/authContext'
import { freightModalities } from '../../domain/autonomousProvider'
import { authorizationStatuses, providerTypes } from '../../domain/providerAuthorization'
import { listAuthorizationAttempts } from '../../services/authorizationAdministration'

function searchKey(value: string) {
  return value.normalize('NFD').replace(/\p{M}/gu, '').toLocaleLowerCase('pt-BR').trim()
}

export default function AdminAuthorizationsPage() {
  useAuthorizationRefresh()
  const { access } = useAuth()
  const [status, setStatus] = useState('PENDING')
  const [modality, setModality] = useState('')
  const [provider, setProvider] = useState('')
  const [query, setQuery] = useState('')
  const result = listAuthorizationAttempts()
  const attempts = result.kind === 'ready' ? result.attempts.filter((row) => (
    (!status || row.status === status) && (!modality || row.modality === modality)
    && (!provider || row.providerType === provider)
    && searchKey([row.name, row.organizationName].join(' ')).includes(searchKey(query))
  )) : []

  return <div className="mx-auto max-w-5xl min-w-0 space-y-4 [overflow-wrap:anywhere]">
    <h1 className="text-muv-h1 font-bold">Autorizações de prestadores</h1>
    {result.kind !== 'ready' || access?.activeContext?.kind !== 'admin'
      ? <Alert role="alert" variant="danger">{result.kind === 'readError' ? 'Não foi possível ler as solicitações de autorização.' : 'Acesso restrito à administração.'}</Alert>
      : <>
        <Card className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Input label="Buscar prestador" type="search" value={query} onChange={(event) => setQuery(event.target.value)} />
          <Select label="Situação" value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="">Todas</option>
            {Object.entries(authorizationStatuses).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
          </Select>
          <Select label="Modalidade" value={modality} onChange={(event) => setModality(event.target.value)}>
            <option value="">Todas</option>
            {Object.entries(freightModalities).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
          </Select>
          <Select label="Tipo de prestador" value={provider} onChange={(event) => setProvider(event.target.value)}>
            <option value="">Todos</option>
            {Object.entries(providerTypes).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
          </Select>
        </Card>
        <p role="status" className="text-muted">{attempts.length} {attempts.length === 1 ? 'tentativa' : 'tentativas'}</p>
        {attempts.length ? <ul className="space-y-3">
          {attempts.map((row) => <li key={row.id}><Card className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-muv-h3 font-semibold">{row.name}</h2><AuthorizationBadge status={row.status} />
            </div>
            <p>{providerTypes[row.providerType]} · {freightModalities[row.modality]}</p>
            <p className="text-muted">Enviada em {authorizationDate(row.requestedAt)}</p>
            <Link to={adminAuthorizationRoute + '/' + encodeURIComponent(row.id)}
              aria-label={`Consultar tentativa de ${row.name} · ${freightModalities[row.modality]} · ${authorizationDate(row.requestedAt)}`}
              className="inline-block font-semibold text-primary underline">Consultar tentativa</Link>
          </Card></li>)}
        </ul> : <Card><EmptyState title="Nenhuma tentativa encontrada" description="Ajuste os filtros para consultar outras solicitações." /></Card>}
      </>}
  </div>
}
