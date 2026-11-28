import type { FreightModality } from '../domain/autonomousProvider'
import { driverDetails } from '../domain/driverProfessional'
import { providerKey } from '../domain/providerReference'
import { evaluateReadiness, known, unavailable } from '../domain/providerReadiness'
import type { Fact, ProfessionalFacts, ReadinessFacts, ReadinessProfessionalEvidence } from '../domain/providerReadiness'
import { authorizationModalities, authorizationStatus } from '../domain/providerAuthorization'
import { vehicleTypes } from '../domain/vehicle'
import type { VehicleType } from '../domain/vehicle'
import { accessAssignmentStorageKey } from '../repositories/accessAssignmentRepository'
import { autonomousProviderStorageKey, driverProfessionalRepository, driverProfessionalStorageKey } from '../repositories/driverProfessionalRepository'
import { driverLinkRepository, driverLinkStorageKey } from '../repositories/driverLinkRepository'
import { driverVerificationRepository, driverVerificationStorageKey } from '../repositories/driverVerificationRepository'
import { organizationStorageKey } from '../repositories/organizationRepository'
import { providerAuthorizationRepository, providerAuthorizationStorageKey } from '../repositories/providerAuthorizationRepository'
import { serviceRegionRepository, serviceRegionStorageKey } from '../repositories/serviceRegionRepository'
import { sessionStorageKey } from '../repositories/sessionRepository'
import { tariffRepository, tariffStorageKey } from '../repositories/tariffRepository'
import { userStorageKey } from '../repositories/userRepository'
import { vehicleRepository, vehicleStorageKey } from '../repositories/vehicleRepository'
import { resolveActiveProvider } from './providerAccess'
import type { ActiveProvider } from './providerAccess'

export const readinessStorageKeys: ReadonlySet<string> = new Set([
  accessAssignmentStorageKey, autonomousProviderStorageKey, driverProfessionalStorageKey,
  driverLinkStorageKey, driverVerificationStorageKey, organizationStorageKey, providerAuthorizationStorageKey,
  serviceRegionStorageKey, sessionStorageKey, tariffStorageKey, userStorageKey, vehicleStorageKey,
])

function readFact<T>(read: () => T): Fact<T> {
  try {
    return known(read())
  } catch {
    return unavailable
  }
}

function mapFact<A, B>(fact: Fact<A>, map: (value: A) => B): Fact<B> {
  return fact.kind === 'known' ? known(map(fact.value)) : unavailable
}

function readProfessional(scope: ActiveProvider): ProfessionalFacts {
  const key = providerKey(scope.provider)
  const provider = scope.provider
  if (provider.kind === 'autonomous') {
    const professionals = readFact(() => driverProfessionalRepository.read().store)
    return { kind: 'autonomous', details: mapFact(professionals, (store) => {
      const registration = store.autonomousRegistrations.find((row) => row.id === provider.providerId)
      const profile = store.professionals.find((row) => row.id === registration?.professionalId && row.userId === scope.userId)
      return profile ? driverDetails(profile) : null
    }) }
  }
  const links = readFact(() => driverLinkRepository.read().links)
  if (links.kind === 'unavailable') return { kind: 'organization', candidates: unavailable }
  const active = links.value.filter((link) => link.status === 'active' && providerKey(link.organization) === key)
  if (!active.length) return { kind: 'organization', candidates: known([]) }
  const professionals = readFact(() => {
    const { store } = driverProfessionalRepository.read()
    return {
      byAccount: new Map(store.professionals.map((row) => [row.userId, row])),
      ids: new Set(store.professionals.map((row) => row.id)),
    }
  })
  const activeIds = new Set(active.map((link) => link.id))
  const decisions = readFact(() => {
    const latest = new Map<string, ReturnType<typeof driverVerificationRepository.read>[number]>()
    for (const decision of driverVerificationRepository.read(links.value)) {
      if (activeIds.has(decision.linkId) && decision.sequence > (latest.get(decision.linkId)?.sequence ?? 0)) {
        latest.set(decision.linkId, decision)
      }
    }
    return latest
  })

  return { kind: 'organization', candidates: known(active.map((link) => ({
    professional: mapFact(professionals, ({ byAccount, ids }): ReadinessProfessionalEvidence => {
      const profile = byAccount.get(link.acceptedBy)
      if (!profile || profile.id !== link.professionalId) {
        const inconsistent = profile || ids.has(link.professionalId)
        return { kind: 'unavailable', reason: inconsistent ? 'inconsistent' : 'missing' }
      }
      return { kind: 'available', details: driverDetails(profile) }
    }),
    verification: mapFact(decisions, (latest) => latest.get(link.id) ?? null),
  }))) }
}

function collectReadiness(scope: ActiveProvider): ReadinessFacts {
  const key = providerKey(scope.provider)
  const own = (record: { provider: ActiveProvider['provider'] }) => providerKey(record.provider) === key
  const authorizations = readFact(() => providerAuthorizationRepository.forProvider(scope.provider))
  const regions = readFact(() => serviceRegionRepository.forProvider(scope.provider))
  const vehicles = readFact(() => vehicleRepository.read().filter(own))
  const tariffs = readFact(() => tariffRepository.read().filter(own))
  const professional = readProfessional(scope)
  const types = Object.keys(vehicleTypes) as VehicleType[]
  const modalities = Object.fromEntries(authorizationModalities.map((modality) => [modality, {
    intended: known(scope.intendedModalities.includes(modality)),
    authorization: mapFact(authorizations, (rows) => authorizationStatus(rows.find((row) => row.modality === modality))),
    region: mapFact(regions, (rows) => rows.some((row) => row.modality === modality)),
    categories: Object.fromEntries(types.map((type) => [type, {
      vehicle: mapFact(vehicles, (rows) => rows.some((row) => row.status === 'active' && row.type === type && row.modalities.includes(modality))),
      tariff: mapFact(tariffs, (rows) => rows.some((row) => row.status === 'active' && row.vehicleType === type && row.modality === modality)),
    }])),
  }])) as Record<FreightModality, ReadinessFacts['modalities'][FreightModality]>
  return { provider: scope.provider, registration: known(true), professional, modalities }
}

export function readOwnReadiness(profile: ActiveProvider['provider']['kind'], userId: string, date: Date) {
  try {
    const scope = resolveActiveProvider()
    if (scope.kind !== 'ready') return scope
    if (scope.userId !== userId || scope.provider.kind !== profile) return { kind: 'denied' } as const
    const facts = collectReadiness(scope)
    const current = resolveActiveProvider()
    if (current.kind !== 'ready' || current.userId !== userId || providerKey(current.provider) !== providerKey(scope.provider)) {
      return { kind: 'denied' } as const
    }
    return { kind: 'evaluated', label: current.label, evaluation: evaluateReadiness(facts, date) } as const
  } catch {
    return { kind: 'readError' } as const
  }
}
