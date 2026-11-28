import { freightModalities } from './autonomousProvider'
import type { FreightModality } from './autonomousProvider'
import { isCnhCurrent, isProfessionalDetails } from './driverProfessional'
import type { DriverProfessionalDetails } from './driverProfessional'
import { evidenceDifferences } from './driverVerification'
import type { DriverEvidence } from './driverVerification'
import type { AuthorizationStatus } from './providerAuthorization'
import { providerKey } from './providerReference'
import type { ProviderReference } from './providerReference'
import { vehicleTypes } from './vehicle'
import type { Vehicle, VehicleType } from './vehicle'
import { evaluateVehiclePair, vehicleCompatibilityPolicy } from './vehicleCompatibility'
import type { CompatibilityAssessment, CompatibilityDriver, CompatibilityReason, CompatibilityState } from './vehicleCompatibility'

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

function candidateCondition(candidate: Candidate, date: Date): ProfessionalCondition {
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

function professionalCondition(facts: ProfessionalFacts, candidates: ProfessionalCondition[]): ProfessionalCondition {
  if (facts.kind === 'autonomous') return candidates[0]
  if (facts.candidates.kind === 'unavailable') return { state: 'unavailable', reasons: ['linksUnavailable'] }
  if (!facts.candidates.value.length) return { state: 'pending', reasons: ['linkMissing'] }
  if (candidates.some((candidate) => candidate.state === 'met')) return { state: 'met', reasons: [] }
  const state = candidates.some((candidate) => candidate.state === 'unavailable') ? 'unavailable' : 'pending'
  const reasons: Reason[] = state === 'pending' ? ['noSufficientProfessional'] : []
  return { state, reasons: [...new Set([...reasons, ...candidates.flatMap((item) => item.reasons)])] }
}

function professionalCandidates(facts: ProfessionalFacts, date: Date) {
  if (facts.kind === 'autonomous') {
    return [{ condition: license(facts.details, date), details: facts.details.kind === 'known' ? facts.details.value ?? undefined : undefined }]
  }
  return facts.candidates.kind === 'unavailable' ? [] : facts.candidates.value.map((candidate) => {
    const current = candidate.professional.kind === 'known' ? candidate.professional.value : undefined
    return { condition: candidateCondition(candidate, date), details: current?.kind === 'available' ? current.details : undefined }
  })
}

function categoryCompatibility(
  drivers: Fact<CompatibilityDriver[]>, vehicles: Fact<Vehicle[]>, tariff: Condition,
  modality: FreightModality, date: Date,
): CompatibilityAssessment {
  const missing: CompatibilityReason[] = []
  const unknown: CompatibilityReason[] = []
  if (drivers.kind === 'unavailable') unknown.push('professionalUnavailable')
  else if (!drivers.value.length) missing.push('noProfessional')
  if (vehicles.kind === 'unavailable') unknown.push('vehiclesUnavailable')
  else if (!vehicles.value.length) missing.push('vehicleMissing')
  if (tariff.state === 'unavailable') unknown.push('tariffsUnavailable')
  else if (tariff.state === 'pending') missing.push('tariffMissing')
  if (missing.length || drivers.kind === 'unavailable' || vehicles.kind === 'unavailable') {
    return { state: missing.length ? 'notMet' : 'notEvaluable', reasons: [...missing, ...unknown] }
  }

  const reasons = new Set<CompatibilityReason>(unknown)
  let uncertain = false
  for (const vehicle of vehicles.value) {
    for (const driver of drivers.value) {
      const result = evaluateVehiclePair(driver, vehicle, modality, date)
      if (result.state === 'met') {
        return tariff.state === 'met' ? { state: 'met', reasons: [] } : { state: 'notEvaluable', reasons: unknown }
      }
      if (result.state === 'notEvaluable') uncertain = true
      for (const reason of result.reasons) reasons.add(reason)
    }
  }
  return { state: uncertain ? 'notEvaluable' : 'notMet', reasons: [...reasons] }
}

const authorizationReasons = {
  NOT_REQUESTED: 'authorizationNotRequested', PENDING: 'authorizationPending', REJECTED: 'authorizationRejected',
} as const

export function evaluateReadiness(facts: ReadinessFacts, date: Date, fleet: Fact<Vehicle[]> = unavailable) {
  const scopedFleet = fleet.kind === 'unavailable' ? unavailable
    : known(fleet.value.filter((row) => providerKey(row.provider) === providerKey(facts.provider)))
  const registration = check(facts.registration, 'registrationMissing', 'registrationUnavailable')
  const candidates = professionalCandidates(facts.professional, date)
  const professional = professionalCondition(facts.professional, candidates.map(({ condition }) => condition))
  const drivers = facts.professional.kind === 'organization' && facts.professional.candidates.kind === 'unavailable'
    ? unavailable : known(candidates.map(({ condition, details }) => ({ state: condition.state, details })))
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
      const currentVehicles = scopedFleet.kind === 'known'
        ? known(scopedFleet.value.filter((row) => row.type === type && row.status === 'active' && row.modalities.includes(modality)))
        : unavailable
      const compatibility = categoryCompatibility(drivers, currentVehicles, tariff, modality, date)
      const state = stateFor(input.intended, all([common, correspondence]))
      return { type, vehicle, tariff, correspondence: correspondence.state, state, compatibility,
        combinedMet: state === 'conditionsMet' && compatibility.state === 'met' }
    })
    const categoryState = categories.some((category) => category.correspondence === 'met') ? 'met'
      : categories.some((category) => category.correspondence === 'unavailable') ? 'unavailable' : 'pending'
    const compatibility: CompatibilityState = categories.some((category) => category.compatibility.state === 'met') ? 'met'
      : categories.some((category) => category.compatibility.state === 'notEvaluable') ? 'notEvaluable' : 'notMet'
    return { modality, compatibility, combinedMet: categories.some((category) => category.combinedMet), intended: input.intended, authorization: input.authorization, region: input.region,
      state: stateFor(input.intended, all([common, { state: categoryState, reasons: [] }])),
      reasons: common.reasons, categories }
  })
  return { provider: facts.provider, compatibilityPolicy: vehicleCompatibilityPolicy, registration, professional, modalities }
}

export type ReadinessEvaluation = ReturnType<typeof evaluateReadiness>
