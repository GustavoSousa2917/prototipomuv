import { isTariff, tariffKey } from '../domain/tariff'
import type { Tariff } from '../domain/tariff'

export const tariffStorageKey = 'muv.tariffs.v1'

function validate(value: unknown): Tariff[] {
  if (!Array.isArray(value) || !value.every(isTariff)
    || new Set(value.map((row) => row.id)).size !== value.length
    || new Set(value.map((row) => tariffKey(row.provider, row))).size !== value.length) {
    throw new Error('Coleção de tarifas inconsistente.')
  }
  return value
}

export const tariffRepository = {
  read() {
    return validate(JSON.parse(localStorage.getItem(tariffStorageKey) ?? '[]'))
  },
  write(tariffs: Tariff[]) {
    localStorage.setItem(tariffStorageKey, JSON.stringify(validate(tariffs)))
  },
}
