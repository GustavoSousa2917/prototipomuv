import type { FreightModality } from './autonomousProvider'
import { isProviderReference, providerKey } from './providerReference'
import type { ProviderReference } from './providerReference'

export type ServiceRegion = {
  provider: ProviderReference
  modality: FreightModality
  municipalityCode: string
  createdAt: string
}

export function isFreightModality(value: unknown): value is FreightModality {
  return value === 'PESSOA' || value === 'ENCOMENDA'
}

export function serviceRegionKey(region: Pick<ServiceRegion, 'provider' | 'modality' | 'municipalityCode'>) {
  return JSON.stringify([providerKey(region.provider), region.modality, region.municipalityCode])
}

export function isServiceRegion(value: unknown): value is ServiceRegion {
  if (typeof value !== 'object' || value === null || Object.keys(value).length !== 4) return false
  const row = value as Partial<ServiceRegion>
  return isProviderReference(row.provider) && isFreightModality(row.modality)
    && typeof row.municipalityCode === 'string' && /^[0-9]{7}$/.test(row.municipalityCode)
    && typeof row.createdAt === 'string' && Number.isFinite(Date.parse(row.createdAt))
    && new Date(row.createdAt).toISOString() === row.createdAt
}
