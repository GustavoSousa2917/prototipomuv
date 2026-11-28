import { findMunicipality } from '../data/municipalities'
import { isServiceRegion, serviceRegionKey } from '../domain/serviceRegion'
import type { ServiceRegion } from '../domain/serviceRegion'
import { providerKey } from '../domain/providerReference'
import type { ProviderReference } from '../domain/providerReference'
import type { FreightModality } from '../domain/autonomousProvider'

export const serviceRegionStorageKey = 'muv.serviceRegions.v1'

export const serviceRegionRepository = {
  read(): ServiceRegion[] {
    const raw = localStorage.getItem(serviceRegionStorageKey)
    if (raw === null) return []
    const rows: unknown = JSON.parse(raw)
    if (!Array.isArray(rows) || !rows.every((row: unknown) =>
      isServiceRegion(row) && findMunicipality(row.municipalityCode))
      || new Set(rows.map(serviceRegionKey)).size !== rows.length) {
      throw new Error('Coleção de regiões inconsistente.')
    }
    return rows
  },

  forProvider(provider: ProviderReference, modality?: FreightModality) {
    const key = providerKey(provider)
    return this.read().filter((row) => providerKey(row.provider) === key && (!modality || row.modality === modality))
  },

  change(action: 'add' | 'remove', region: ServiceRegion, beforeWrite: () => boolean) {
    if (!isServiceRegion(region) || !findMunicipality(region.municipalityCode)) return 'invalid'
    const rows = this.read()
    const key = serviceRegionKey(region)
    const index = rows.findIndex((row) => serviceRegionKey(row) === key)
    if (action === 'add' && index >= 0) return 'duplicate'
    if (action === 'remove' && index < 0) return 'missingRegion'
    if (action === 'add') rows.push(region)
    else rows.splice(index, 1)
    if (!beforeWrite()) return 'stale'
    localStorage.setItem(serviceRegionStorageKey, JSON.stringify(rows))
    const scopeKey = providerKey(region.provider)
    return { kind: 'saved', regions: rows.filter((row) => providerKey(row.provider) === scopeKey) } as const
  },
}
