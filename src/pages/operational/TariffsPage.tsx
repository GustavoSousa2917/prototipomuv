import { useEffect, useReducer, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import Alert from '../../components/feedback/Alert'
import ConfirmDialog from '../../components/feedback/ConfirmDialog'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import { tariffRoutes } from '../../constants/environmentRoutes'
import { useAuth } from '../../contexts/authContext'
import { freightModalities } from '../../domain/autonomousProvider'
import { providerKey } from '../../domain/providerReference'
import { formatTariffAmount, parseDistanceMeters, parseTariffCents, tariffAmountInput } from '../../domain/tariff'
import type { Tariff, TariffAmounts, TariffStatus } from '../../domain/tariff'
import { vehicleTypes } from '../../domain/vehicle'
import { tariffStorageKey } from '../../repositories/tariffRepository'
import { vehicleStorageKey } from '../../repositories/vehicleRepository'
import type { ActiveProvider } from '../../services/providerAccess'
import { changeTariff, readTariffs, simulateTariff } from '../../services/tariffs'
import { readVehicles } from '../../services/vehicles'

const linkStyle = 'font-semibold text-primary underline underline-offset-2'
const statusLabels = { active: 'Ativa', inactive: 'Inativa' }
const operationErrors = {
  stale: 'O contexto ou a tarifa mudou. Reabra o registro para continuar.',
  notFound: 'Tarifa indisponível neste contexto.',
  invalid: 'Confira os campos indicados.',
  readError: 'Não foi possível ler as tarifas.',
  storageError: 'Não foi possível salvar a alteração. Os registros anteriores foram preservados.',
}
const moneyError = 'Informe um valor positivo, com até duas casas decimais e dentro do limite técnico.'
const dateLabel = (at: string) => new Date(at).toLocaleString('pt-BR')
const combinationLabel = (tariff: Tariff) => freightModalities[tariff.modality] + ' · ' + vehicleTypes[tariff.vehicleType]
type Fleet = ReturnType<typeof readVehicles>

function Amounts({ amounts }: { amounts: TariffAmounts }) {
  return <p>Valor mínimo: R$ {formatTariffAmount(amounts.minimumFareCents)} · Valor por km: R$ {formatTariffAmount(amounts.ratePerKilometerCents)}/km</p>
}

function Indicators({ tariff, scope, fleet }: { tariff: Tariff; scope: ActiveProvider; fleet: Fleet }) {
  const ownFleet = fleet.kind === 'ready' && fleet.scope.userId === scope.userId
    && providerKey(fleet.scope.provider) === providerKey(scope.provider)
  const corresponding = ownFleet && fleet.vehicles.some((vehicle) => vehicle.status === 'active'
    && vehicle.type === tariff.vehicleType && vehicle.modalities.includes(tariff.modality))
  return <div className="space-y-2">
    {!scope.intendedModalities.includes(tariff.modality) && <Alert variant="warning">Modalidade fora da intenção atual do prestador.</Alert>}
    {ownFleet ? <p>{corresponding ? 'Existe veículo ativo cadastrado para esta combinação.'
      : 'Nenhum veículo ativo cadastrado corresponde a esta combinação.'}</p>
      : <Alert variant="warning">Não foi possível verificar a frota.</Alert>}
  </div>
}

function TariffList({ scope, tariffs, fleet, base }: {
  scope: ActiveProvider; tariffs: Tariff[]; fleet: Fleet; base: string
}) {
  const [modality, setModality] = useState('')
  const [vehicleType, setVehicleType] = useState('')
  const [status, setStatus] = useState('')
  const active = tariffs.filter((tariff) => tariff.status === 'active').length
  const visible = tariffs.filter((tariff) => (!modality || tariff.modality === modality)
    && (!vehicleType || tariff.vehicleType === vehicleType) && (!status || tariff.status === status))
  return <>
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h1 className="text-muv-h1 font-bold">Tarifas</h1>
      <Link className={linkStyle} to={base + '/novo'}>Cadastrar tarifa</Link>
    </div>
    <p>Prestador responsável: {scope.label}</p>
    <Card className="grid gap-3 sm:grid-cols-3">
      <p>Total de configurações: <strong>{tariffs.length}</strong></p>
      <p>Ativas: <strong>{active}</strong></p>
      <p>Inativas: <strong>{tariffs.length - active}</strong></p>
    </Card>
    {tariffs.length > 0 && <Card className="grid min-w-0 gap-3 sm:grid-cols-3">
      <Select label="Modalidade" value={modality} onChange={(event) => setModality(event.target.value)}>
        <option value="">Todas</option>
        {Object.entries(freightModalities).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
      </Select>
      <Select label="Categoria veicular" value={vehicleType} onChange={(event) => setVehicleType(event.target.value)}>
        <option value="">Todas</option>
        {Object.entries(vehicleTypes).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
      </Select>
      <Select label="Situação" value={status} onChange={(event) => setStatus(event.target.value)}>
        <option value="">Todas</option>
        {Object.entries(statusLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
      </Select>
    </Card>}
    {visible.length ? <ul className="grid gap-4 lg:grid-cols-2">{visible.map((tariff) => <li className="min-w-0" key={tariff.id}>
      <Card className="h-full space-y-3">
        <h2 className="text-muv-h2 font-semibold">{combinationLabel(tariff)}</h2>
        <Amounts amounts={tariff} />
        <p>Situação cadastral: {statusLabels[tariff.status]}</p>
        <Indicators tariff={tariff} scope={scope} fleet={fleet} />
        <Link className={linkStyle} to={base + '/' + tariff.id} aria-label={'Consultar tarifa: ' + combinationLabel(tariff)}>Consultar tarifa</Link>
      </Card>
    </li>)}</ul> : <Card>{tariffs.length ? 'Nenhuma tarifa corresponde aos filtros.' : 'Nenhuma tarifa cadastrada.'}</Card>}
  </>
}

type Issues = Partial<Record<'modality' | 'vehicleType' | 'minimum' | 'rate', string>>

function TariffForm({ scope, tariff, base }: { scope: ActiveProvider; tariff?: Tariff; base: string }) {
  const [original] = useState(tariff)
  const [modality, setModality] = useState('')
  const [vehicleType, setVehicleType] = useState('')
  const [minimum, setMinimum] = useState(() => tariff ? tariffAmountInput(tariff.minimumFareCents) : '')
  const [rate, setRate] = useState(() => tariff ? tariffAmountInput(tariff.ratePerKilometerCents) : '')
  const [issues, setIssues] = useState<Issues>({})
  const [notice, setNotice] = useState('')
  const [duplicate, setDuplicate] = useState('')
  const [busy, setBusy] = useState(false)
  const pending = useRef(false)
  const focusError = useRef(false)
  const form = useRef<HTMLFormElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!busy && focusError.current) {
      focusError.current = false
      form.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
    }
  }, [busy, issues])

  async function save(event: FormEvent) {
    event.preventDefault()
    if (pending.current) return
    setNotice('')
    setDuplicate('')
    const minimumFareCents = parseTariffCents(minimum)
    const ratePerKilometerCents = parseTariffCents(rate)
    const errors: Issues = {}
    if (!original && !Object.hasOwn(freightModalities, modality)) errors.modality = 'Selecione uma modalidade.'
    if (!original && !Object.hasOwn(vehicleTypes, vehicleType)) errors.vehicleType = 'Selecione uma categoria veicular.'
    if (minimumFareCents === null) errors.minimum = moneyError
    if (ratePerKilometerCents === null) errors.rate = moneyError
    setIssues(errors)
    if (Object.keys(errors).length || minimumFareCents === null || ratePerKilometerCents === null) {
      focusError.current = true
      return
    }

    pending.current = true
    setBusy(true)
    const amounts = { minimumFareCents, ratePerKilometerCents }
    const result = await changeTariff(scope, original
      ? { kind: 'edit', id: original.id, revision: original.revision, amounts }
      : { kind: 'create', combination: { modality, vehicleType }, amounts })
    pending.current = false
    setBusy(false)

    if (result.kind === 'saved' || result.kind === 'unchanged') {
      navigate(base + '/' + result.id, { replace: true })
    } else if (result.kind === 'duplicate') {
      setDuplicate(result.id)
      setNotice('Já existe uma tarifa para esta combinação.')
    } else {
      setNotice(operationErrors[result.kind])
    }
  }

  return <>
    <Link className={linkStyle} to={original ? base + '/' + original.id : base}>Voltar</Link>
    <h1 className="text-muv-h1 font-bold">{original ? 'Editar tarifa' : 'Cadastrar tarifa'}</h1>
    <p>Prestador responsável: {scope.label}</p>
    {original && tariff && original.revision !== tariff.revision &&
      <Alert variant="warning">A tarifa mudou em outra operação. Volte aos detalhes e reabra a edição.</Alert>}
    {notice && <Alert variant="danger" role="alert">{notice}{duplicate && <> <Link className={linkStyle} to={base + '/' + duplicate}>Consultar tarifa existente</Link></>}</Alert>}
    <Card>
      <form className="space-y-4" ref={form} noValidate onSubmit={(event) => void save(event)} aria-busy={busy}>
        <fieldset disabled={busy} className="grid min-w-0 gap-4 sm:grid-cols-2">
          {original ? <div className="sm:col-span-2">
            <p>{combinationLabel(original)}</p>
            <p>Situação cadastral: {statusLabels[tariff?.status ?? original.status]}</p>
          </div> : <>
            <Select label="Modalidade" name="modality" required value={modality} error={issues.modality}
              onChange={(event) => { setModality(event.target.value); setIssues({ ...issues, modality: undefined }) }}>
              <option value="">Selecione</option>
              {Object.entries(freightModalities).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
            </Select>
            <Select label="Categoria veicular" name="vehicleType" required value={vehicleType} error={issues.vehicleType}
              onChange={(event) => { setVehicleType(event.target.value); setIssues({ ...issues, vehicleType: undefined }) }}>
              <option value="">Selecione</option>
              {Object.entries(vehicleTypes).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
            </Select>
          </>}
          <p className="sm:col-span-2">Estes valores serão usados em futuras estimativas.</p>
          <Input label="Valor mínimo (R$)" name="minimum" inputMode="decimal" required value={minimum} error={issues.minimum}
            onChange={(event) => { setMinimum(event.target.value); setIssues({ ...issues, minimum: undefined }) }} />
          <Input label="Valor por quilômetro (R$/km)" name="rate" inputMode="decimal" required value={rate} error={issues.rate}
            onChange={(event) => { setRate(event.target.value); setIssues({ ...issues, rate: undefined }) }} />
        </fieldset>
        <Button type="submit" loading={busy}>Salvar tarifa</Button>
      </form>
    </Card>
  </>
}

const estimateBasis = {
  minimum: 'Aplicação do valor mínimo.',
  distance: 'Aplicação do cálculo pela distância.',
  tie: 'Empate entre o valor mínimo e o cálculo pela distância.',
}
type Simulation = ReturnType<typeof simulateTariff>

function TariffSimulation({ tariff, scope }: { tariff: Tariff; scope: ActiveProvider }) {
  const [distance, setDistance] = useState('')
  const [simulation, setSimulation] = useState<{ revision: number; result: Simulation }>()
  const [invalid, setInvalid] = useState(false)
  const simulationForm = useRef<HTMLFormElement>(null)
  const outdated = simulation && simulation.revision !== tariff.revision
  const result = outdated ? undefined : simulation?.result
  useEffect(() => {
    if (invalid) simulationForm.current?.querySelector<HTMLInputElement>('[name="distance"]')?.focus()
  }, [invalid])

  function simulate(event: FormEvent) {
    event.preventDefault()
    const meters = parseDistanceMeters(distance)
    setInvalid(!!distance.trim() && meters === null)
    setSimulation(meters === null ? undefined : {
      revision: tariff.revision, result: simulateTariff(scope, tariff.id, tariff.revision, meters),
    })
  }

  return <Card className="space-y-3">
    <h2 className="text-muv-h2 font-semibold">Simulação manual</h2>
    <p>Tarifa selecionada: {combinationLabel(tariff)}</p>
    <Amounts amounts={tariff} />
    <p>Simulação demonstrativa, sem solicitação, negociação ou contratação.</p>
    <form ref={simulationForm} className="space-y-3" noValidate onSubmit={simulate}>
      <Input label="Distância (km)" name="distance" inputMode="decimal" value={distance}
        helperText="Use até três casas decimais."
        error={invalid ? 'Informe uma distância positiva em quilômetros, dentro do limite técnico.' : undefined}
        onChange={(event) => { setDistance(event.target.value); setInvalid(false); setSimulation(undefined) }} />
      <Button type="submit">Simular valor base</Button>
    </form>
    {outdated && <Alert variant="warning" role="status">A tarifa mudou. Simule novamente com os valores atuais.</Alert>}
    {result?.kind === 'estimated' && <Alert variant="success" role="status">
      Distância informada: {distance.trim()} km · Valor base estimado: R$ {formatTariffAmount(result.cents)}. {estimateBasis[result.basis]}
    </Alert>}
    {result && result.kind !== 'estimated' && <Alert variant="danger" role="alert">
      {result.kind === 'overflow' ? 'O valor estimado excede o limite técnico.'
        : result.kind === 'inactive' ? 'Tarifa inativa. A simulação está indisponível.' : operationErrors[result.kind]}
    </Alert>}
  </Card>
}

function TariffDetails({ tariff, scope, fleet, base, refresh }: {
  tariff: Tariff; scope: ActiveProvider; fleet: Fleet; base: string; refresh: () => void
}) {
  const [transition, setTransition] = useState<{ status: TariffStatus; revision: number }>()
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState<{ text: string; error: boolean }>()
  const pending = useRef(false)
  const heading = useRef<HTMLHeadingElement>(null)
  const action = tariff.status === 'active' ? 'Inativar' : 'Reativar'
  const confirmation = transition?.status === 'inactive' ? 'Inativar' : 'Reativar'

  async function apply() {
    if (!transition || pending.current) return
    pending.current = true
    setBusy(true)
    const result = await changeTariff(scope, { kind: 'status', id: tariff.id, ...transition })
    pending.current = false
    setBusy(false)
    setTransition(undefined)
    if (result.kind === 'saved') {
      setNotice({ text: 'Situação cadastral atualizada.', error: false })
    } else {
      const text = result.kind === 'duplicate' || result.kind === 'unchanged'
        ? operationErrors.stale : operationErrors[result.kind]
      setNotice({ text, error: true })
    }
    refresh()
    requestAnimationFrame(() => heading.current?.focus())
  }

  return <>
    <Link className={linkStyle} to={base}>Voltar às tarifas</Link>
    <h1 ref={heading} tabIndex={-1} className="text-muv-h1 font-bold">{combinationLabel(tariff)}</h1>
    {notice && <Alert variant={notice.error ? 'danger' : 'success'} role={notice.error ? 'alert' : 'status'}>{notice.text}</Alert>}
    <Card className="space-y-3">
      <p>Prestador responsável: {scope.label}</p>
      <p>Situação cadastral: {statusLabels[tariff.status]}</p>
      <Amounts amounts={tariff} />
      <p>Criação: {dateLabel(tariff.created.at)} · Última atualização: {dateLabel(tariff.updated.at)}</p>
      <Indicators tariff={tariff} scope={scope} fleet={fleet} />
      <div className="flex flex-wrap items-center gap-4">
        <Link className={linkStyle} to={base + '/' + tariff.id + '/editar'}>Editar tarifa</Link>
        <Button variant={tariff.status === 'active' ? 'danger' : 'secondary'} onClick={() =>
          setTransition({ status: tariff.status === 'active' ? 'inactive' : 'active', revision: tariff.revision })}>
          {action} tarifa
        </Button>
      </div>
    </Card>
    {tariff.status === 'active' ? <TariffSimulation tariff={tariff} scope={scope} />
      : <Alert variant="info">Tarifa inativa. A simulação está indisponível.</Alert>}
    <Card className="space-y-3">
      <h2 className="text-muv-h2 font-semibold">Histórico tarifário</h2>
      <ol className="space-y-3">
        {tariff.history.map((event, index) => <li className="space-y-1" key={index}>
          <p><strong>{event.kind === 'created' ? 'Criação' : event.kind === 'amountsChanged' ? 'Alteração monetária'
            : event.kind === 'deactivated' ? 'Inativação' : 'Reativação'}</strong> · {dateLabel(event.at)} · Conta {event.userId}</p>
          {event.kind === 'created' && <Amounts amounts={event.amounts} />}
          {event.kind === 'amountsChanged' && <>
            <h3 className="font-semibold">Valores anteriores</h3><Amounts amounts={event.from} />
            <h3 className="font-semibold">Novos valores</h3><Amounts amounts={event.to} />
          </>}
        </li>)}
      </ol>
    </Card>
    <ConfirmDialog open={!!transition} title={confirmation + ' tarifa'} confirmLabel={confirmation}
      description="Os valores, a combinação cadastrada e o histórico serão preservados."
      variant={transition?.status === 'inactive' ? 'danger' : 'primary'} loading={busy}
      onClose={() => setTransition(undefined)} onConfirm={() => void apply()} />
  </>
}

export default function TariffsPage({ mode, profile }: {
  mode: 'list' | 'create' | 'detail' | 'edit'; profile: ActiveProvider['provider']['kind']
}) {
  const { user } = useAuth()
  const { tariffId } = useParams()
  const [, refresh] = useReducer((revision: number) => revision + 1, 0)
  useEffect(() => {
    function synchronize(event: StorageEvent) {
      if (event.storageArea === localStorage && (event.key === null || event.key === tariffStorageKey
        || event.key === vehicleStorageKey)) refresh()
    }
    window.addEventListener('storage', synchronize)
    return () => window.removeEventListener('storage', synchronize)
  }, [])
  const result = readTariffs()
  if (result.kind !== 'ready' || result.scope.provider.kind !== profile || result.scope.userId !== user?.id) {
    return <Alert variant="danger" role="alert">{result.kind === 'readError' ? operationErrors.readError
      : result.kind === 'missingProvider' ? 'Conclua o cadastro de prestador para gerenciar tarifas.'
        : 'As tarifas estão indisponíveis neste contexto.'}</Alert>
  }
  const { scope, tariffs } = result
  const base = tariffRoutes[profile]
  const key = scope.userId + ':' + providerKey(scope.provider)
  const tariff = tariffs.find((row) => row.id === tariffId)
  const fleet = mode === 'list' || (mode === 'detail' && tariff) ? readVehicles() : undefined
  return <div className="space-y-4 [overflow-wrap:anywhere]">
    {mode === 'list' && fleet ? <TariffList key={key} scope={scope} tariffs={tariffs} fleet={fleet} base={base} />
      : mode === 'create' ? <TariffForm key={key + ':create'} scope={scope} base={base} />
        : !tariff ? <><Link className={linkStyle} to={base}>Voltar às tarifas</Link>
          <Alert variant="danger" role="alert">{operationErrors.notFound}</Alert></>
          : mode === 'edit' ? <TariffForm key={key + ':edit:' + tariff.id} scope={scope} tariff={tariff} base={base} />
            : fleet && <TariffDetails key={key + ':' + tariff.id} scope={scope} tariff={tariff} fleet={fleet} base={base} refresh={refresh} />}
  </div>
}
