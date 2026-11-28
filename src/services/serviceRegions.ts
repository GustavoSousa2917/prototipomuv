import { findMunicipality } from '../data/municipalities'
import { providerKey } from '../domain/providerReference'
import { isFreightModality } from '../domain/serviceRegion'
import { serviceRegionRepository } from '../repositories/serviceRegionRepository'
import { withAuthMutation } from './authMutation'
import { resolveActiveProvider } from './providerAccess'
import type { ActiveProvider } from './providerAccess'

export function readServiceRegions() {
  try {
    const scope = resolveActiveProvider()
    if (scope.kind !== 'ready') return scope
    return { kind: 'ready', scope, regions: serviceRegionRepository.forProvider(scope.provider) } as const
  } catch {
    return { kind: 'readError' } as const
  }
}

type ExpectedScope = Pick<ActiveProvider, 'provider' | 'userId'>

export async function changeServiceRegion(
  action: 'add' | 'remove', expected: ExpectedScope, modality: unknown, municipalityCode: string,
) {
  if (!isFreightModality(modality) || typeof municipalityCode !== 'string' || !findMunicipality(municipalityCode)) {
    return 'invalid'
  }

  const requestedModality = modality

  function current() {
    const scope = resolveActiveProvider()
    if (scope.kind !== 'ready' || scope.userId !== expected.userId
      || providerKey(scope.provider) !== providerKey(expected.provider)) return 'stale'
    if (!scope.intendedModalities.includes(requestedModality)) return 'unavailable'
    return scope
  }

  try {
    const initial = current()
    if (typeof initial === 'string') return initial
    return await withAuthMutation(async () => {
      const scope = current()
      if (typeof scope === 'string') return scope
      return serviceRegionRepository.change(action, {
        provider: scope.provider, modality, municipalityCode, createdAt: new Date().toISOString(),
      }, () => typeof current() !== 'string')
    })
  } catch {
    return 'writeError'
  }
}
