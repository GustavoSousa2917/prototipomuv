import { useEffect, useReducer } from 'react'
import { Link } from 'react-router'
import Alert from '../../components/feedback/Alert'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import { driverProfessionalRoute, environmentRoutes, serviceRegionRoutes, tariffRoutes, vehicleRoutes } from '../../constants/environmentRoutes'
import { useAuth } from '../../contexts/authContext'
import { freightModalities } from '../../domain/autonomousProvider'
import { authorizationStatuses } from '../../domain/providerAuthorization'
import type { ReadinessEvaluation, ReadinessState, Reason } from '../../domain/providerReadiness'
import { compatibilityReasons } from '../../domain/vehicleCompatibility'
import type { CompatibilityState } from '../../domain/vehicleCompatibility'
import { vehicleTypes } from '../../domain/vehicle'
import { readOwnReadiness, readinessStorageKeys } from '../../services/providerReadiness'

type Profile = ReadinessEvaluation['provider']['kind']
type Modality = ReadinessEvaluation['modalities'][number]

const compatibilityLabels: Record<CompatibilityState, string> = {
  met: 'Compatibilidade demonstrativa atendida',
  notMet: 'Compatibilidade demonstrativa não atendida',
  notEvaluable: 'Compatibilidade não avaliável',
}
const combinedLabel = 'Condições cadastrais e compatibilidade demonstrativa atendidas.'

const stateLabels: Record<ReadinessState, string> = {
  conditionsMet: 'Condições cadastrais atendidas',
  conditionsPending: 'Condições cadastrais pendentes',
  notIntended: 'Não pretende atuar',
  inconclusive: 'Avaliação inconclusiva',
}
const reasons: Record<Reason, string> = {
  registrationMissing: 'Cadastro de negócio ou responsabilidade ausente.',
  registrationUnavailable: 'Não foi possível verificar o cadastro de negócio.',
  notIntended: 'Modalidade fora da intenção atual.',
  intentionUnavailable: 'Não foi possível verificar a intenção.',
  authorizationNotRequested: 'Autorização não solicitada.',
  authorizationPending: 'Autorização pendente.',
  authorizationRejected: 'Autorização rejeitada.',
  authorizationUnavailable: 'Não foi possível verificar a autorização.',
  regionMissing: 'Nenhum município cadastrado nesta modalidade.',
  regionsUnavailable: 'Não foi possível verificar as regiões.',
  licenseMissing: 'Habilitação ausente.',
  licenseExpired: 'Habilitação vencida.',
  professionalUnavailable: 'Dados profissionais indisponíveis ou inconsistentes.',
  linkMissing: 'Nenhum vínculo ativo nesta organização.',
  linksUnavailable: 'Não foi possível verificar os vínculos.',
  verificationMissing: 'Verificação aprovada ausente.',
  verificationRejected: 'Última verificação rejeitada.',
  verificationUnavailable: 'Não foi possível consultar as verificações.',
  professionalDivergence: 'Habilitação atual divergente do retrato aprovado.',
  noSufficientProfessional: 'Nenhum profissional confirmou todos os critérios cadastrais.',
  vehicleMissing: 'Veículo correspondente ausente.',
  vehiclesUnavailable: 'Não foi possível verificar a frota.',
  tariffMissing: 'Tarifa correspondente ausente.',
  tariffsUnavailable: 'Não foi possível verificar as tarifas.',
}

const unavailableReasons = new Set<Reason>([
  'registrationUnavailable', 'intentionUnavailable', 'authorizationUnavailable', 'regionsUnavailable',
  'professionalUnavailable', 'linksUnavailable', 'verificationUnavailable', 'vehiclesUnavailable', 'tariffsUnavailable',
])

function Reasons({ items }: { items: Reason[] }) {
  const missing = items.filter((reason) => !unavailableReasons.has(reason))
  const unknown = items.filter((reason) => unavailableReasons.has(reason))
  return <>
    {missing.length > 0 && <ul aria-label="Impedimentos conhecidos" className="list-disc space-y-1 pl-5">
      {missing.map((reason) => <li key={reason}>{reasons[reason]}</li>)}
    </ul>}
    {unknown.length > 0 && <ul aria-label="Informações indisponíveis" className="list-disc space-y-1 pl-5">
      {unknown.map((reason) => <li key={reason}>{reasons[reason]}</li>)}
    </ul>}
  </>
}

function RegulatoryLinks({ profile }: { profile: Profile }) {
  const base = environmentRoutes[profile]
  const links = [
    ['Perfil do prestador', base + '/perfil'],
    profile === 'autonomous' ? ['Perfil profissional próprio', driverProfessionalRoute] : ['Motoristas e verificações', base + '/motoristas'],
    ['Regiões de atendimento', serviceRegionRoutes[profile]],
    ['Autorizações', base + '/autorizacoes'],
    ['Veículos', vehicleRoutes[profile]],
    ['Tarifas', tariffRoutes[profile]],
  ]
  return <Card className="space-y-2">
    <h2 className="text-muv-h2 font-semibold">Consultar e regularizar dados</h2>
    <ul className="flex flex-wrap gap-x-4 gap-y-2">
      {links.map(([label, path]) => <li key={path}><Link className="font-semibold text-primary underline underline-offset-2" to={path}>{label}</Link></li>)}
    </ul>
  </Card>
}

function ModalitySection({ row, professional, registration, profile }: {
  row: Modality; professional: ReadinessEvaluation['professional']; registration: ReadinessEvaluation['registration']; profile: Profile
}) {
  const authorization = row.authorization.kind === 'unavailable' ? 'Informação indisponível'
    : row.authorization.value === 'NOT_REQUESTED' ? 'Não solicitada' : authorizationStatuses[row.authorization.value]
  const intention = row.intended.kind === 'unavailable' ? 'Informação indisponível' : row.intended.value ? 'Pretendida' : 'Não pretendida'
  const region = row.region.kind === 'unavailable' ? 'Informação indisponível' : row.region.value ? 'Município cadastrado' : 'Nenhum município cadastrado'
  const condition = { met: 'Atendida', pending: 'Pendente', unavailable: 'Informação indisponível' }
  return <section aria-labelledby={'readiness-' + row.modality} className="space-y-3">
    <h2 id={'readiness-' + row.modality} className="text-muv-h2 font-semibold">{freightModalities[row.modality]}</h2>
    <Card className="space-y-2">
      <h3 className="font-semibold">{stateLabels[row.state]}.</h3>
      <dl className="grid gap-x-4 gap-y-2 sm:grid-cols-2">
        <div><dt className="font-semibold">Intenção atual</dt><dd>{intention}</dd></div>
        <div><dt className="font-semibold">Autorização administrativa</dt><dd>{authorization}</dd></div>
        <div><dt className="font-semibold">Cadastro de negócio</dt><dd>{condition[registration.state]}</dd></div>
        <div><dt className="font-semibold">Cobertura cadastrada</dt><dd>{region}</dd></div>
        <div><dt className="font-semibold">Condição profissional cadastral</dt>
          <dd>{profile !== 'autonomous' && professional.state === 'met'
            ? 'Pelo menos um profissional reúne os critérios cadastrais.' : condition[professional.state]}</dd></div>
        {professional.declared && <div><dt className="font-semibold">Dados profissionais declarados</dt>
          <dd>Categoria da CNH {professional.declared.cnhCategory} · EAR {professional.declared.hasEar ? 'Sim' : 'Não'}</dd></div>}
      </dl>
      <p>{compatibilityLabels[row.compatibility]}.</p>
      {row.combinedMet && <p className="font-semibold">{combinedLabel}</p>}
      <Reasons items={row.reasons} />
    </Card>
    <div className="grid gap-3 sm:grid-cols-2">
      {row.categories.map((category) => <Card key={category.type} className="min-w-0 space-y-2">
        <h3 className="font-semibold">{vehicleTypes[category.type]}</h3>
        <p>{stateLabels[category.state]}.</p>
        <p>Correspondência entre veículo e tarifa: {condition[category.correspondence]}.</p>
        {category.vehicle.state === 'met' && <p>Veículo correspondente cadastrado.</p>}
        {category.tariff.state === 'met' && <p>Tarifa correspondente cadastrada.</p>}
        <Reasons items={[...category.vehicle.reasons, ...category.tariff.reasons]} />
        <p className="font-semibold">{compatibilityLabels[category.compatibility.state]}.</p>
        {category.combinedMet && <p>{combinedLabel}</p>}
        {category.compatibility.reasons.length > 0 && <ul aria-label="Motivos de compatibilidade" className="list-disc space-y-1 pl-5">
          {category.compatibility.reasons.map((reason) => <li key={reason}>{compatibilityReasons[reason]}</li>)}
        </ul>}
      </Card>)}
    </div>
  </section>
}

export default function ProviderReadinessPage({ profile }: { profile: Profile }) {
  const { user } = useAuth()
  const [revision, refresh] = useReducer((value: number) => value + 1, 0)
  useEffect(() => {
    let timer: number | undefined

    function scheduleMidnight() {
      window.clearTimeout(timer)
      if (document.visibilityState !== 'visible') return
      const now = new Date()
      const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
      timer = window.setTimeout(update, Math.max(1, midnight.getTime() - now.getTime()))
    }

    function update() {
      refresh()
      scheduleMidnight()
    }

    function synchronize(event: StorageEvent) {
      if (event.storageArea === localStorage && (event.key === null || readinessStorageKeys.has(event.key))) update()
    }

    function visibilityChanged() {
      if (document.visibilityState === 'visible') update()
      else window.clearTimeout(timer)
    }

    scheduleMidnight()
    window.addEventListener('storage', synchronize)
    window.addEventListener('focus', update)
    document.addEventListener('visibilitychange', visibilityChanged)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('storage', synchronize)
      window.removeEventListener('focus', update)
      document.removeEventListener('visibilitychange', visibilityChanged)
    }
  }, [])

  const date = new Date()
  const result = user ? readOwnReadiness(profile, user.id, date) : { kind: 'denied' as const }
  return <div className="space-y-4 [overflow-wrap:anywhere]">
    <h1 className="text-muv-h1 font-bold">Prontidão operacional</h1>
    {result.kind === 'evaluated' && <p>Prestador avaliado: {result.label}</p>}
    <p>Diagnóstico demonstrativo das condições cadastrais por modalidade e categoria.</p>
    <Button variant="outline" onClick={refresh}>Atualizar avaliação</Button>
    <p role="status" className="text-sm text-muted">
      {result.kind === 'evaluated'
        ? (revision ? 'Avaliação atualizada. ' : '') + result.evaluation.modalities
          .map((row) => freightModalities[row.modality] + ': ' + stateLabels[row.state] + '. ' + compatibilityLabels[row.compatibility] + '.').join(' ')
        : result.kind === 'readError' ? 'Não foi possível consultar a avaliação.'
          : result.kind === 'missingProvider' ? 'Cadastro de negócio ausente.' : 'Diagnóstico indisponível neste contexto.'}
    </p>
    {result.kind === 'evaluated' ? <>
      <Alert variant="info">
        <strong>Compatibilidade avaliada somente no recorte demonstrativo da DEC-051.</strong>
        <p>A avaliação usa dados declarados. Regularidade de documentos, aptidão legal, disponibilidade e compatibilidade com um frete específico ficam fora deste diagnóstico.</p>
      </Alert>
      {result.evaluation.modalities.map((row) => <ModalitySection key={row.modality} row={row} profile={profile}
        professional={result.evaluation.professional} registration={result.evaluation.registration} />)}
      <RegulatoryLinks profile={profile} />
    </> : <Alert variant="warning">
      {result.kind === 'missingProvider' ? 'Conclua o cadastro de prestador para consultar este diagnóstico.'
        : 'Confira o contexto e a disponibilidade dos dados do prestador antes de atualizar.'}
    </Alert>}
  </div>
}
