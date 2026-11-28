import { useEffect, useReducer, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import Alert from '../../components/feedback/Alert'
import ConfirmDialog from '../../components/feedback/ConfirmDialog'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Checkbox from '../../components/ui/Checkbox'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Textarea from '../../components/ui/Textarea'
import { useAuth } from '../../contexts/authContext'
import { vehicleRoutes } from '../../constants/environmentRoutes'
import { freightModalities } from '../../domain/autonomousProvider'
import type { FreightModality } from '../../domain/autonomousProvider'
import { providerKey } from '../../domain/providerReference'
import { dimensionFields, formatMeasure, normalizePlate, technicalPurposes, vehicleConfigurations, vehicleDraft, vehicleTextLimits, vehicleTypes } from '../../domain/vehicle'
import type { Dimension, Vehicle, VehicleDraft, VehicleErrors } from '../../domain/vehicle'
import { vehicleStorageKey } from '../../repositories/vehicleRepository'
import type { ActiveProvider } from '../../services/providerAccess'
import { changeVehicle, readVehicles } from '../../services/vehicles'

const linkStyle = 'font-semibold text-primary underline underline-offset-2'
const modes = Object.keys(freightModalities) as FreightModality[]
const modalityLabel: Record<FreightModality, string> = { PESSOA: 'Pessoas', ENCOMENDA: 'Encomendas' }
const statuses = { active: 'Ativo', inactive: 'Inativo' } as const
const date = (value: string) => new Date(value).toLocaleString('pt-BR')
const errors = {
  invalid: 'Confira os campos indicados.',
  duplicate: 'Esta placa está indisponível para cadastro.',
  stale: 'O contexto ou o veículo mudou. Reabra o registro para continuar.',
  notFound: 'Veículo indisponível neste contexto.',
  confirmationRequired: 'Confirme a correção da placa.',
  storageError: 'Não foi possível salvar a alteração. Os registros anteriores foram preservados.',
}

function VehicleDivergence({ vehicle, scope }: { vehicle: Vehicle; scope: ActiveProvider }) {
  const missing = vehicle.modalities.filter((mode) => !scope.intendedModalities.includes(mode))
  return missing.length ? <Alert variant="warning">Fora da intenção atual do prestador: {missing.map((mode) => modalityLabel[mode]).join(', ')}.</Alert> : null
}

function Capacities({ vehicle, summary = false }: { vehicle: Vehicle; summary?: boolean }) {
  const { passengers, cargo } = vehicle
  const dimensions = cargo?.millimeters
  return <div className="space-y-2">
    {passengers && (!summary || vehicle.modalities.includes('PESSOA')) && <div>
      <p><strong>Pessoas</strong>{!vehicle.modalities.includes('PESSOA') && ' · Dados preservados, modalidade desmarcada'}</p>
      <p>{passengers.count} passageiros, sem contar o condutor.</p>
      {!summary && <p>Bagagem: {passengers.luggage ?? 'Não informada'}</p>}
    </div>}
    {cargo && (!summary || vehicle.modalities.includes('ENCOMENDA')) && <div>
      <p><strong>Encomendas</strong>{!vehicle.modalities.includes('ENCOMENDA') && ' · Dados preservados, modalidade desmarcada'}</p>
      <p>Carga útil: {formatMeasure(cargo.grams, 3)} kg · Volume útil: {formatMeasure(cargo.liters, 3)} m³</p>
      {!summary && <p>Dimensões úteis: {dimensions
        ? (Object.keys(dimensionFields) as Dimension[]).map((key) => formatMeasure(dimensions[key], 1)).join(' × ') + ' cm (comprimento × largura × altura)'
        : 'Não informadas'}</p>}
    </div>}
  </div>
}

function Fleet({ scope, vehicles, base }: { scope: ActiveProvider; vehicles: Vehicle[]; base: string }) {
  const [query, setQuery] = useState('')
  const [type, setType] = useState('')
  const [modality, setModality] = useState('')
  const [status, setStatus] = useState('')
  const active = vehicles.filter((row) => row.status === 'active').length
  const term = query.trim().toLocaleLowerCase('pt-BR')
  const plateTerm = (normalizePlate(query) ?? term).toLowerCase()
  const filtered = vehicles.filter((row) => (!type || row.type === type)
    && (!modality || row.modalities.some((mode) => mode === modality))
    && (!status || row.status === status)
    && (row.plate.toLowerCase().includes(plateTerm) || `${row.brand} ${row.model}`.toLocaleLowerCase('pt-BR').includes(term)))
  return <>
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h1 className="text-muv-h1 font-bold">Veículos</h1>
      <Link className={linkStyle} to={base + '/novo'}>Cadastrar veículo</Link>
    </div>
    <p>Prestador responsável: {scope.label}</p>
    <Card className="grid gap-3 sm:grid-cols-3">
      <p>Total cadastrado: <strong>{vehicles.length}</strong></p>
      <p>Ativos: <strong>{active}</strong></p>
      <p>Inativos: <strong>{vehicles.length - active}</strong></p>
    </Card>
    {vehicles.length > 0 && <Card className="grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <Input label="Placa ou modelo" value={query} onChange={(event) => setQuery(event.target.value)} />
      <Select label="Tipo" value={type} onChange={(event) => setType(event.target.value)}>
        <option value="">Todos</option>
        {Object.entries(vehicleTypes).map(([id, label]) => <option key={id} value={id}>{label}</option>)}
      </Select>
      <Select label="Modalidade" value={modality} onChange={(event) => setModality(event.target.value)}>
        <option value="">Todas</option>
        {modes.map((mode) => <option key={mode} value={mode}>{modalityLabel[mode]}</option>)}
      </Select>
      <Select label="Situação" value={status} onChange={(event) => setStatus(event.target.value)}>
        <option value="">Todas</option>
        {Object.entries(statuses).map(([id, label]) => <option key={id} value={id}>{label}</option>)}
      </Select>
    </Card>}
    {filtered.length ? <ul className="grid gap-4 lg:grid-cols-2">{filtered.map((vehicle) => <li key={vehicle.id} className="min-w-0">
      <Card className="h-full space-y-3">
        <h2 className="text-muv-h2 font-semibold">{vehicle.brand} {vehicle.model}</h2>
        <p>{vehicle.plate} · {vehicleTypes[vehicle.type]} · {vehicle.year} · {statuses[vehicle.status]}</p>
        <p>Dados técnicos {vehicle.technical ? (Object.keys(vehicle.technical).length === 4 ? 'completos' : 'incompletos') : 'não informados'}</p>
        <p>{vehicle.modalities.map((mode) => modalityLabel[mode]).join(' e ')}</p>
        <Capacities vehicle={vehicle} summary />
        <VehicleDivergence vehicle={vehicle} scope={scope} />
        <div className="flex flex-wrap gap-4">
          <Link className={linkStyle} to={base + '/' + vehicle.id}>Consultar detalhes</Link>
          <Link className={linkStyle} to={base + '/' + vehicle.id + '/editar'}>Editar veículo</Link>
        </div>
      </Card>
    </li>)}</ul> : <Card>{vehicles.length ? 'Nenhum veículo corresponde aos filtros.' : 'Nenhum veículo cadastrado.'}</Card>}
  </>
}

function VehicleForm({ scope, vehicle, base }: { scope: ActiveProvider; vehicle?: Vehicle; base: string }) {
  const navigate = useNavigate()
  const [draft, setDraft] = useState(() => vehicleDraft(vehicle))
  const [original] = useState(vehicle)
  const [issues, setIssues] = useState<VehicleErrors>({})
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)
  const [confirmPlate, setConfirmPlate] = useState<string>()
  const pending = useRef(false)
  const form = useRef<HTMLFormElement>(null)
  const focusError = useRef(false)

  useEffect(() => {
    if (!busy && focusError.current) {
      focusError.current = false
      form.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
    }
  }, [busy, issues])

  function change(field: Exclude<keyof VehicleDraft, 'modalities'>, value: string) {
    setDraft((current) => ({ ...current, [field]: value }))
    setIssues((current) => ({ ...current, [field]: undefined }))
  }

  async function save(confirmedPlate?: string) {
    if (pending.current) return
    pending.current = true
    setBusy(true)
    setNotice('')
    const result = await changeVehicle(scope, original
      ? { kind: 'edit', id: original.id, revision: original.revision, draft, confirmedPlate }
      : { kind: 'create', draft })
    pending.current = false
    setBusy(false)
    setConfirmPlate(undefined)
    if (result.kind === 'saved') {
      navigate(base + '/' + result.id, { replace: true })
      return
    }
    focusError.current = result.kind === 'invalid' || result.kind === 'duplicate'
    if (result.kind === 'invalid') setIssues(result.errors)
    else if (result.kind === 'duplicate') setIssues({ plate: errors.duplicate })
    setNotice(errors[result.kind])

  }

  function submit(event: FormEvent) {
    event.preventDefault()
    const plate = normalizePlate(draft.plate)
    if (original && plate && plate !== original.plate) setConfirmPlate(plate)
    else void save()
  }

  function input(field: Exclude<keyof VehicleDraft, 'modalities'>, label: string, options?: {
    maxLength?: number; inputMode?: 'numeric' | 'decimal'; helperText?: string; required?: boolean
  }) {
    return <Input name={field} label={label} value={draft[field] ?? ''} error={issues[field]}
      onChange={(event) => change(field, event.target.value)} {...options} />
  }

  return <>
    <Link className={linkStyle} to={original ? base + '/' + original.id : base}>Voltar</Link>
    <h1 className="text-muv-h1 font-bold">{original ? 'Editar veículo' : 'Cadastrar veículo'}</h1>
    <p>Prestador responsável: {scope.label}</p>
    {notice && <Alert role="alert" variant="danger">{notice}</Alert>}
    {vehicle && original && vehicle.revision !== original.revision &&
      <Alert variant="warning">O cadastro mudou em outra operação. Volte aos detalhes e reabra a edição.</Alert>}
    <form className="space-y-4" noValidate onSubmit={submit} ref={form} aria-busy={busy}>
      <fieldset disabled={busy} className="min-w-0 space-y-4">
        <Card className="space-y-3">
          <h2 className="text-muv-h2 font-semibold">Identificação e características</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {input('plate', 'Placa', { required: true })}
            <Select name="type" label="Tipo de veículo" required value={draft.type} error={issues.type}
              onChange={(event) => change('type', event.target.value)}>
              <option value="">Selecione</option>
              {Object.entries(vehicleTypes).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
            </Select>
            {input('brand', 'Marca', { required: true, maxLength: vehicleTextLimits.brand })}
            {input('model', 'Modelo', { required: true, maxLength: vehicleTextLimits.model })}
            {input('year', 'Ano', { required: true, inputMode: 'numeric' })}
            {input('color', 'Cor', { required: true, maxLength: vehicleTextLimits.color })}
          </div>
          <Textarea label="Descrição (opcional)" name="description" maxLength={vehicleTextLimits.description}
            value={draft.description} error={issues.description} onChange={(event) => change('description', event.target.value)} />
        </Card>
        <Card>
          <fieldset className="space-y-2">
            <legend className="text-muv-h2 font-semibold">Modalidades declaradas</legend>
            {modes.map((mode, index) => <Checkbox key={mode} name="modalities" label={modalityLabel[mode]}
              checked={draft.modalities.includes(mode)} error={index === 0 ? issues.modalities : undefined}
              onChange={(event) => {
                const checked = event.target.checked
                setDraft((current) => ({ ...current,
                  modalities: checked ? [...current.modalities, mode] : current.modalities.filter((value) => value !== mode),
                }))
                setIssues((current) => ({ ...current, modalities: undefined }))
              }} />)}
            {draft.modalities.some((mode) => !scope.intendedModalities.includes(mode)) &&
              <Alert variant="warning">A seleção inclui modalidade fora da intenção atual do prestador.</Alert>}
          </fieldset>
        </Card>
        {draft.modalities.includes('PESSOA') && <Card className="space-y-3">
          <h2 className="text-muv-h2 font-semibold">Capacidade de pessoas</h2>
          {input('passengers', 'Passageiros', { required: true, inputMode: 'numeric', helperText: 'Exclua o condutor.' })}
          {input('luggage', 'Bagagem (opcional)', { maxLength: vehicleTextLimits.luggage })}
        </Card>}
        {draft.modalities.includes('ENCOMENDA') && <Card className="space-y-3">
          <h2 className="text-muv-h2 font-semibold">Capacidade de encomendas</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {input('payload', 'Carga útil (kg)', { required: true, inputMode: 'decimal', helperText: 'Peso máximo transportável.' })}
            {input('volume', 'Volume útil (m³)', { required: true, inputMode: 'decimal', helperText: 'Espaço útil declarado para carga.' })}
          </div>
          <fieldset className="grid gap-3 sm:grid-cols-3">
            <legend className="font-semibold">Dimensões do compartimento (opcionais)</legend>
            <p className="sm:col-span-3">Informe as três medidas internas ou deixe as três vazias.</p>
            {(Object.entries(dimensionFields) as [Dimension, string][]).map(([field, label]) => <div key={field}>
              {input(field, label + ' (cm)', { inputMode: 'decimal' })}
            </div>)}
          </fieldset>
        </Card>}
        <Card className="space-y-3">
          <h2 className="text-muv-h2 font-semibold">Dados técnicos declarados</h2>
          <p>Preenchimento opcional para cadastro. Consulte a fonte técnica do veículo. Os dados são declarados, sem verificação externa, e permitem avaliar o recorte demonstrativo.</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {input('grossWeight', 'Peso bruto total (kg)', { inputMode: 'decimal', helperText: 'Use até três casas decimais, sem separador de milhar.' })}
            {input('totalSeats', 'Lotação incluindo o condutor', { inputMode: 'numeric' })}
            <Select name="technicalPurpose" label="Destinação técnica" value={draft.technicalPurpose ?? ''} error={issues.technicalPurpose}
              onChange={(event) => change('technicalPurpose', event.target.value)}>
              <option value="">Não informada</option>
              {Object.entries(technicalPurposes).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
            </Select>
            <Select name="configuration" label="Configuração veicular" value={draft.configuration ?? ''} error={issues.configuration}
              onChange={(event) => change('configuration', event.target.value)}>
              <option value="">Não informada</option>
              {Object.entries(vehicleConfigurations).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
            </Select>
          </div>
          <p>A opção simples abrange automotor sem unidade acoplada em operação comum. Composições, veículos articulados, motor-casa, motocicletas e operações especializadas ficam fora do recorte.</p>
        </Card>
      </fieldset>
      <Button type="submit" loading={busy}>Salvar veículo</Button>
    </form>
    <ConfirmDialog open={!!confirmPlate} title="Corrigir placa"
      description={`Alterar ${original?.plate ?? ''} para ${confirmPlate ?? ''}? O histórico conservará a placa anterior.`}
      onClose={() => setConfirmPlate(undefined)} onConfirm={() => void save(confirmPlate)} loading={busy}
      confirmLabel="Confirmar correção" />
  </>
}

function VehicleDetails({ scope, vehicle, base, refresh }: {
  scope: ActiveProvider; vehicle: Vehicle; base: string; refresh: () => void
}) {
  const [transition, setTransition] = useState<{ status: Vehicle['status']; revision: number }>()
  const [notice, setNotice] = useState<{ message: string; error: boolean }>()
  const [busy, setBusy] = useState(false)
  const pending = useRef(false)
  const heading = useRef<HTMLHeadingElement>(null)
  const statusAction = vehicle.status === 'active' ? 'Inativar' : 'Reativar'
  const confirmation = transition?.status === 'inactive' ? 'Inativar' : 'Reativar'

  async function apply() {
    if (!transition || pending.current) return
    pending.current = true
    setBusy(true)
    const result = await changeVehicle(scope, { kind: 'status', id: vehicle.id, ...transition })
    pending.current = false
    setBusy(false)
    setTransition(undefined)
    setNotice({ message: result.kind === 'saved' ? 'Situação cadastral atualizada.' : errors[result.kind], error: result.kind !== 'saved' })
    refresh()
    requestAnimationFrame(() => heading.current?.focus())
  }

  return <>
    <Link className={linkStyle} to={base}>Voltar à frota</Link>
    <h1 ref={heading} tabIndex={-1} className="text-muv-h1 font-bold">{vehicle.brand} {vehicle.model}</h1>
    {notice && <Alert variant={notice.error ? 'danger' : 'success'} role={notice.error ? 'alert' : 'status'}>{notice.message}</Alert>}
    <Card className="space-y-2">
      <h2 className="text-muv-h2 font-semibold">Identificação</h2>
      <p>Prestador responsável: {scope.label}</p>
      <p>Placa: {vehicle.plate} · {vehicleTypes[vehicle.type]} · {vehicle.year} · {vehicle.color}</p>
      <p>Situação cadastral: {statuses[vehicle.status]}</p>
      <p>Modalidades: {vehicle.modalities.map((mode) => modalityLabel[mode]).join(' e ')}</p>
      {vehicle.description && <p>{vehicle.description}</p>}
      <VehicleDivergence vehicle={vehicle} scope={scope} />
      <div className="flex flex-wrap items-center gap-4">
        <Link className={linkStyle} to={base + '/' + vehicle.id + '/editar'}>Editar veículo</Link>
        <Button variant={vehicle.status === 'active' ? 'danger' : 'secondary'}
          onClick={() => setTransition({ status: vehicle.status === 'active' ? 'inactive' : 'active', revision: vehicle.revision })}>
          {statusAction} veículo
        </Button>
      </div>
    </Card>
    <Card className="space-y-3">
      <h2 className="text-muv-h2 font-semibold">Capacidades declaradas</h2>
      <Capacities vehicle={vehicle} />
    </Card>
    <Card className="space-y-2">
      <h2 className="text-muv-h2 font-semibold">Dados técnicos declarados</h2>
      <dl className="grid gap-2 sm:grid-cols-2">
        <div><dt>Peso bruto total</dt><dd>{vehicle.technical?.grossWeightGrams !== undefined
          ? formatMeasure(vehicle.technical.grossWeightGrams, 3) + ' kg' : 'Não informado'}</dd></div>
        <div><dt>Lotação incluindo o condutor</dt><dd>{vehicle.technical?.totalSeats ?? 'Não informada'}</dd></div>
        <div><dt>Destinação técnica</dt><dd>{vehicle.technical?.purpose ? technicalPurposes[vehicle.technical.purpose] : 'Não informada'}</dd></div>
        <div><dt>Configuração veicular</dt><dd>{vehicle.technical?.configuration ? vehicleConfigurations[vehicle.technical.configuration] : 'Não informada'}</dd></div>
      </dl>
    </Card>
    <Card className="space-y-2">
      <h2 className="text-muv-h2 font-semibold">Histórico cadastral</h2>
      <p>Criação: {date(vehicle.created.at)} · Conta {vehicle.created.userId}</p>
      <p>Última atualização: {date(vehicle.updated.at)} · Conta {vehicle.updated.userId}</p>
      {vehicle.history.length > 0 && <ol className="list-inside list-decimal space-y-1">
        {vehicle.history.map((entry, index) => <li key={index}>
          {entry.kind === 'plateCorrected' ? `Correção de placa: ${entry.from} → ${entry.to}`
            : entry.kind === 'deactivated' ? 'Inativação' : 'Reativação'} · {date(entry.at)} · Conta {entry.userId}
        </li>)}
      </ol>}
    </Card>
    <ConfirmDialog open={!!transition} title={confirmation + ' veículo'} confirmLabel={confirmation}
      description="O registro, o histórico e a reserva da placa atual serão preservados."
      variant={transition?.status === 'inactive' ? 'danger' : 'primary'} loading={busy}
      onClose={() => setTransition(undefined)} onConfirm={() => void apply()} />
  </>
}

export default function VehiclesPage({ mode, profile }: {
  mode: 'list' | 'create' | 'detail' | 'edit'; profile: ActiveProvider['provider']['kind']
}) {
  const { user } = useAuth()
  const { vehicleId } = useParams()
  const [, refresh] = useReducer((n: number) => n + 1, 0)
  useEffect(() => {
    function onStorage(event: StorageEvent) {
      if (event.storageArea === localStorage && (event.key === null || event.key === vehicleStorageKey)) refresh()
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])
  const result = readVehicles()
  const base = vehicleRoutes[profile]
  if (result.kind !== 'ready' || result.scope.provider.kind !== profile || result.scope.userId !== user?.id) {
    return <Alert role="alert" variant="danger">{result.kind === 'readError' ? 'Não foi possível ler a frota. Os registros foram preservados.'
      : result.kind === 'missingProvider' ? 'Conclua o cadastro de prestador para gerenciar veículos.' : 'A frota está indisponível neste contexto.'}</Alert>
  }
  const { scope, vehicles } = result
  const vehicle = vehicles.find((row) => row.id === vehicleId)
  const key = scope.userId + ':' + providerKey(scope.provider)
  return <div className="space-y-4 [overflow-wrap:anywhere]">
    {mode === 'list' ? <Fleet key={key} scope={scope} vehicles={vehicles} base={base} />
      : mode === 'create' ? <VehicleForm key={key} scope={scope} base={base} />
        : !vehicle ? <><Link className={linkStyle} to={base}>Voltar à frota</Link>
          <Alert role="alert" variant="danger">{errors.notFound}</Alert></>
          : mode === 'edit' ? <VehicleForm key={key + ':' + vehicle.id} scope={scope} vehicle={vehicle} base={base} />
            : <VehicleDetails key={key + ':' + vehicle.id} scope={scope} vehicle={vehicle} base={base} refresh={refresh} />}
  </div>
}
