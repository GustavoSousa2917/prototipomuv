import { freightModalities } from './autonomousProvider'
import type { FreightModality } from './autonomousProvider'
import { isCnhCurrent, isProfessionalDetails } from './driverProfessional'
import type { DriverProfessionalDetails } from './driverProfessional'
import { evidenceDifferences } from './driverVerification'
import type { DriverEvidence } from './driverVerification'
import type { AuthorizationStatus } from './providerAuthorization'
import type { ProviderReference } from './providerReference'
import { vehicleTypes } from './vehicle'
import type { VehicleType } from './vehicle'

export type Fact<T> = { kind: 'known'; value: T } | { kind: 'unavailable' }
export const known = <T>(value: T): Fact<T> => ({ kind: 'known', value })
export const unavailable = { kind: 'unavailable' } as const

export type AdministrativeStatus = AuthorizationStatus | 'NOT_REQUESTED'
export type ReadinessProfessionalEvidence =
  | { kind: 'available'; details: DriverProfessionalDetails }
  | { kind: 'unavailable'; reason: 'missing' | 'inconsistent' }

type Candidate = {
  professional: Fact<ReadinessProfessionalEvidence>
  verification: Fact<{ result: 'approved' | 'rejected'; evidence: DriverEvidence } | null>
}
export type ProfessionalFacts =
  | { kind: 'autonomous'; details: Fact<DriverProfessionalDetails | null> }
  | { kind: 'organization'; candidates: Fact<Candidate[]> }

type CategoryFacts = { vehicle: Fact<boolean>; tariff: Fact<boolean> }
type ModalityFacts = {
  intended: Fact<boolean>
  authorization: Fact<AdministrativeStatus>
  region: Fact<boolean>
  categories: Record<VehicleType, CategoryFacts>
}
export type ReadinessFacts = {
  provider: ProviderReference
  registration: Fact<boolean>
  professional: ProfessionalFacts
  modalities: Record<FreightModality, ModalityFacts>
}

export type ReadinessState = 'conditionsMet' | 'conditionsPending' | 'notIntended' | 'inconclusive'
type ConditionState = 'met' | 'pending' | 'unavailable'
export type Reason =
  | 'registrationMissing' | 'registrationUnavailable' | 'notIntended' | 'intentionUnavailable'
  | 'authorizationNotRequested' | 'authorizationPending' | 'authorizationRejected' | 'authorizationUnavailable'
  | 'regionMissing' | 'regionsUnavailable'
  | 'licenseMissing' | 'licenseExpired' | 'professionalUnavailable' | 'linkMissing' | 'linksUnavailable'
  | 'verificationMissing' | 'verificationRejected' | 'verificationUnavailable' | 'professionalDivergence'
  | 'noSufficientProfessional' | 'vehicleMissing' | 'vehiclesUnavailable' | 'tariffMissing' | 'tariffsUnavailable'

type Condition = { state: ConditionState; reasons: Reason[] }
type ProfessionalCondition = Condition & {
  declared?: Pick<DriverProfessionalDetails, 'cnhCategory' | 'hasEar'>
}

function check(fact: Fact<boolean>, missing: Reason, unknown: Reason): Condition {
  if (fact.kind === 'unavailable') return { state: 'unavailable', reasons: [unknown] }
  return fact.value ? { state: 'met', reasons: [] } : { state: 'pending', reasons: [missing] }
}

function all(checks: Condition[]): Condition {
  const state = checks.some((item) => item.state === 'pending') ? 'pending'
    : checks.some((item) => item.state === 'unavailable') ? 'unavailable' : 'met'
  return { state, reasons: [...new Set(checks.flatMap((item) => item.reasons))] }
}

function stateFor(intention: Fact<boolean>, condition: Condition): ReadinessState {
  if (intention.kind === 'known' && !intention.value) return 'notIntended'
  if (condition.state === 'pending') return 'conditionsPending'
  return condition.state === 'met' ? 'conditionsMet' : 'inconclusive'
}

function license(fact: Fact<DriverProfessionalDetails | null>, date: Date): ProfessionalCondition {
  if (fact.kind === 'unavailable') return { state: 'unavailable', reasons: ['professionalUnavailable'] }
  if (!fact.value) return { state: 'pending', reasons: ['licenseMissing'] }
  if (!isProfessionalDetails(fact.value)) return { state: 'unavailable', reasons: ['professionalUnavailable'] }
  const { cnhCategory, hasEar, cnhExpiresAt } = fact.value
  return {
    ...check(known(isCnhCurrent(cnhExpiresAt, date)), 'licenseExpired', 'professionalUnavailable'),
    declared: { cnhCategory, hasEar },
  }
}

function candidateCondition(candidate: Candidate, date: Date): Condition {
  const { professional, verification } = candidate
  const current = professional.kind === 'known' ? professional.value : undefined
  const currentLicense = current?.kind === 'available' ? license(known(current.details), date)
    : current?.reason === 'missing' ? license(known(null), date) : license(unavailable, date)
  if (verification.kind === 'unavailable') {
    return all([currentLicense, { state: 'unavailable', reasons: ['verificationUnavailable'] }])
  }
  if (!verification.value || verification.value.result === 'rejected') {
    return all([currentLicense, { state: 'pending', reasons: [verification.value ? 'verificationRejected' : 'verificationMissing'] }])
  }
  const reviewed = verification.value.evidence
  const matches = currentLicense.state === 'pending' && current?.kind === 'unavailable'
    ? currentLicense
    : check(current?.kind === 'available' && reviewed.kind === 'available'
      ? known(evidenceDifferences(current, reviewed).length === 0) : unavailable,
    'professionalDivergence', 'professionalUnavailable')
  return all([currentLicense, matches])
}

function professionalCondition(facts: ProfessionalFacts, date: Date): ProfessionalCondition {
  if (facts.kind === 'autonomous') return license(facts.details, date)
  if (facts.candidates.kind === 'unavailable') return { state: 'unavailable', reasons: ['linksUnavailable'] }
  if (!facts.candidates.value.length) return { state: 'pending', reasons: ['linkMissing'] }
  const candidates = facts.candidates.value.map((candidate) => candidateCondition(candidate, date))
  if (candidates.some((candidate) => candidate.state === 'met')) return { state: 'met', reasons: [] }
  const state = candidates.some((candidate) => candidate.state === 'unavailable') ? 'unavailable' : 'pending'
  const reasons: Reason[] = state === 'pending' ? ['noSufficientProfessional'] : []
  return { state, reasons: [...new Set([...reasons, ...candidates.flatMap((item) => item.reasons)])] }
}

const authorizationReasons = {
  NOT_REQUESTED: 'authorizationNotRequested', PENDING: 'authorizationPending', REJECTED: 'authorizationRejected',
} as const

export function evaluateReadiness(facts: ReadinessFacts, date: Date) {
  const registration = check(facts.registration, 'registrationMissing', 'registrationUnavailable')
  const professional = professionalCondition(facts.professional, date)
  const modalities = (Object.keys(freightModalities) as FreightModality[]).map((modality) => {
    const input = facts.modalities[modality]
    const authorization: Condition = input.authorization.kind === 'unavailable'
      ? { state: 'unavailable', reasons: ['authorizationUnavailable'] }
      : input.authorization.value === 'APPROVED' ? { state: 'met', reasons: [] }
        : { state: 'pending', reasons: [authorizationReasons[input.authorization.value]] }
    const intention = check(input.intended, 'notIntended', 'intentionUnavailable')
    const region = check(input.region, 'regionMissing', 'regionsUnavailable')
    const common = all([registration, intention, authorization, region, professional])
    const categories = (Object.keys(vehicleTypes) as VehicleType[]).map((type) => {
      const vehicle = check(input.categories[type].vehicle, 'vehicleMissing', 'vehiclesUnavailable')
      const tariff = check(input.categories[type].tariff, 'tariffMissing', 'tariffsUnavailable')
      const correspondence = all([vehicle, tariff])
      return { type, vehicle, tariff, correspondence: correspondence.state,
        state: stateFor(input.intended, all([common, correspondence])) }
    })
    const categoryState = categories.some((category) => category.correspondence === 'met') ? 'met'
      : categories.some((category) => category.correspondence === 'unavailable') ? 'unavailable' : 'pending'
    return { modality, intended: input.intended, authorization: input.authorization, region: input.region,
      state: stateFor(input.intended, all([common, { state: categoryState, reasons: [] }])),
      reasons: common.reasons, categories }
  })
  return { provider: facts.provider, compatibility: 'notVerified' as const, registration, professional, modalities }
}

export type ReadinessEvaluation = ReturnType<typeof evaluateReadiness>
