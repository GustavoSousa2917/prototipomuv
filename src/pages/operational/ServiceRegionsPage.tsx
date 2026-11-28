import { useEffect, useMemo, useReducer, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router'
import Alert from '../../components/feedback/Alert'
import ConfirmDialog from '../../components/feedback/ConfirmDialog'
import EmptyState from '../../components/feedback/EmptyState'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Select from '../../components/ui/Select'
import { environmentRoutes } from '../../constants/environmentRoutes'
import { useAuth } from '../../contexts/authContext'
import { compareMunicipalities, findMunicipality, municipalitiesInState, municipalityStates } from '../../data/municipalities'
import { freightModalities } from '../../domain/autonomousProvider'
import type { FreightModality } from '../../domain/autonomousProvider'
import { providerKey } from '../../domain/providerReference'
import type { ProviderReference } from '../../domain/providerReference'
import { isFreightModality } from '../../domain/serviceRegion'
import { serviceRegionStorageKey } from '../../repositories/serviceRegionRepository'
import { changeServiceRegion, readServiceRegions } from '../../services/serviceRegions'

type RegionsView = Extract<ReturnType<typeof readServiceRegions>, { kind: 'ready' }>
const modalities: FreightModality[] = ['PESSOA', 'ENCOMENDA']

const mutationErrors = {
  invalid: 'Selecione uma modalidade e um município válidos.',
  duplicate: 'Este município já está cadastrado para a modalidade.',
  missingRegion: 'Este município já foi removido da modalidade.',
  unavailable: 'A modalidade deixou de ser pretendida no cadastro.',
  stale: 'A conta ou o contexto mudou. Confira a cobertura atual e tente novamente.',
  writeError: 'Não foi possível gravar a alteração. Tente novamente.',
}

function RegionsContent({ scope, regions, refresh }: RegionsView & { refresh: () => void }) {
  const [modality, setModality] = useState<FreightModality>(scope.intendedModalities[0])
  const [uf, setUf] = useState('')
  const [code, setCode] = useState('')
  const [removal, setRemoval] = useState<ReturnType<typeof findMunicipality>>()
  const [busy, setBusy] = useState(false)
  const [feedback, setFeedback] = useState<{ message: string; success: boolean }>()
  const submitting = useRef(false)
  const heading = useRef<HTMLHeadingElement>(null)
  const focusAfterRemoval = useRef(false)
  const options = useMemo(() => municipalitiesInState(uf), [uf])
  const editable = scope.intendedModalities.includes(modality)
  const coverage = regions
    .filter((region) => region.modality === modality)
    .map(({ municipalityCode }) => findMunicipality(municipalityCode))
    .filter((municipality) => municipality !== undefined)
    .sort(compareMunicipalities)

  useEffect(() => {
    if (!removal && focusAfterRemoval.current) {
      focusAfterRemoval.current = false
      heading.current?.focus()
    }
  }, [removal])

  async function mutate(action: 'add' | 'remove', municipalityCode: string) {
    if (submitting.current) return
    submitting.current = true
    setBusy(true)
    setFeedback(undefined)
    const result = await changeServiceRegion(action, scope, modality, municipalityCode)
    const success = typeof result !== 'string'
    if (success && action === 'remove') focusAfterRemoval.current = true
    setRemoval(undefined)
    submitting.current = false
    setBusy(false)
    if (success && action === 'add') setCode('')
    setFeedback({
      success,
      message: success
        ? action === 'add' ? 'Município adicionado à cobertura.' : 'Município removido da cobertura.'
        : mutationErrors[result],
    })
    refresh()
  }

  function add(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (editable && code && !busy) void mutate('add', code)
  }

  return <>
    <p className="font-semibold">{scope.label}</p>
    <p className="text-muted">A configuração territorial não concede autorização para oferecer serviços.</p>
    <Card className="space-y-4">
      <Select label="Modalidade" value={modality} disabled={busy} onChange={(event) => {
        const selected = event.target.value
        if (isFreightModality(selected)) setModality(selected)
        setCode('')
        setFeedback(undefined)
      }}>
        {modalities.map((item) => <option key={item} value={item}>
          {freightModalities[item]}{scope.intendedModalities.includes(item) ? '' : ' (não pretendida)'}
        </option>)}
      </Select>

      {editable ? <form onSubmit={add} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,3fr)]">
          <Select label="UF" value={uf} disabled={busy} onChange={(event) => {
            setUf(event.target.value)
            setCode('')
          }}>
            <option value="">Selecione a UF</option>
            {municipalityStates.map((state) => <option key={state} value={state}>{state}</option>)}
          </Select>
          <Select label="Município" value={code} disabled={!uf || busy} onChange={(event) => setCode(event.target.value)}>
            <option value="">Selecione o município</option>
            {options.map((municipality) => <option key={municipality.code} value={municipality.code}>{municipality.name}</option>)}
          </Select>
        </div>
        <Button type="submit" disabled={!code || busy}>Adicionar município</Button>
      </form> : <Alert variant="warning">Modalidade indisponível para edição. Os registros são preservados até que ela volte a ser pretendida no cadastro.</Alert>}
    </Card>

    {feedback && <Alert role={feedback.success ? 'status' : 'alert'} variant={feedback.success ? 'success' : 'danger'}>
      {feedback.message}
    </Alert>}

    <Card className="space-y-3">
      <h2 ref={heading} tabIndex={-1} className="text-muv-h2 font-semibold">
        {editable ? 'Cobertura configurada' : 'Regiões preservadas'}
      </h2>
      <p className="text-muted" aria-live="polite">{coverage.length} {coverage.length === 1 ? 'município' : 'municípios'}</p>
      {coverage.length === 0 ? <EmptyState title="Nenhum município cadastrado" /> : (
        <ul className="divide-y divide-border">
          {coverage.map((municipality) => (
            <li key={municipality.code} className="flex flex-wrap items-center justify-between gap-2 py-3">
              <span className="min-w-0 [overflow-wrap:anywhere]">{municipality.name} · {municipality.uf}</span>
              {editable && <Button type="button" variant="secondary" disabled={busy}
                aria-label={`Remover ${municipality.name}, ${municipality.uf}`}
                onClick={() => setRemoval(municipality)}>Remover</Button>}
            </li>
          ))}
        </ul>
      )}
    </Card>

    <ConfirmDialog open={!!removal && editable} onClose={() => setRemoval(undefined)}
      onConfirm={() => { if (removal && !busy) void mutate('remove', removal.code) }}
      title="Remover município"
      description={removal ? `Remover ${removal.name} (${removal.uf}) de ${freightModalities[modality].toLocaleLowerCase('pt-BR')}?` : ''}
      confirmLabel="Remover município" cancelLabel="Cancelar" variant="danger" loading={busy} />
  </>
}

export default function ServiceRegionsPage({ profile }: { profile: ProviderReference['kind'] }) {
  const { user, access } = useAuth()
  const [, refresh] = useReducer((count: number) => count + 1, 0)

  useEffect(() => {
    function synchronize(event: StorageEvent) {
      if (event.storageArea === localStorage && (event.key === serviceRegionStorageKey || event.key === null)) refresh()
    }
    window.addEventListener('storage', synchronize)
    return () => window.removeEventListener('storage', synchronize)
  }, [])

  const view = readServiceRegions()
  const matchesContext = view.kind === 'ready' && user?.id === view.scope.userId
    && access?.activeContext?.kind === profile && view.scope.provider.kind === profile
    && (!('organizationId' in view.scope.provider)
      || ('organizationId' in access.activeContext && access.activeContext.organizationId === view.scope.provider.organizationId))

  return <div className="mx-auto max-w-3xl min-w-0 space-y-4 [overflow-wrap:anywhere]">
    <Link to={environmentRoutes[profile] + '/perfil'} className="text-primary underline underline-offset-2">Voltar ao perfil</Link>
    <h1 className="text-muv-h1 font-bold">Regiões de atendimento</h1>
    {matchesContext ? <RegionsContent key={JSON.stringify([view.scope.userId, providerKey(view.scope.provider)])}
      {...view} refresh={refresh} /> : (
      <Alert role="alert" variant="warning">
        {view.kind === 'missingProvider' ? 'Este contexto ainda não possui cadastro profissional ou organizacional.'
          : view.kind === 'readError' ? 'Não foi possível consultar as regiões de atendimento.'
            : 'O contexto atual não permite consultar estas regiões.'}
      </Alert>
    )}
  </div>
}
