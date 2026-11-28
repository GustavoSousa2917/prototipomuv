import { providerKey } from '../domain/providerReference'
import { estimateTariff, isTariffAmounts, isTariffCombination, sameTariffAmounts, tariffAmounts, tariffKey } from '../domain/tariff'
import type { Tariff, TariffAmounts, TariffStatus } from '../domain/tariff'
import { tariffRepository } from '../repositories/tariffRepository'
import { withAuthMutation } from './authMutation'
import { resolveActiveProvider } from './providerAccess'
import type { ActiveProvider } from './providerAccess'

type ExpectedScope = Pick<ActiveProvider, 'provider' | 'userId'>
type TariffChange =
  | { kind: 'create'; combination: { modality: string; vehicleType: string }; amounts: TariffAmounts }
  | { kind: 'edit'; id: string; revision: number; amounts: TariffAmounts }
  | { kind: 'status'; id: string; revision: number; status: TariffStatus }

function matchesScope(scope: ActiveProvider, expected: ExpectedScope) {
  return scope.userId === expected.userId && providerKey(scope.provider) === providerKey(expected.provider)
}

function ownsTariff(scope: ActiveProvider, tariff: Tariff) {
  return providerKey(scope.provider) === providerKey(tariff.provider)
}

export function readTariffs() {
  try {
    const scope = resolveActiveProvider()
    if (scope.kind !== 'ready') return scope
    const tariffs = tariffRepository.read().filter((row) => ownsTariff(scope, row))
    return { kind: 'ready', scope, tariffs } as const
  } catch {
    return { kind: 'readError' } as const
  }
}

export function simulateTariff(expected: ExpectedScope, id: string, revision: number, distanceMeters: number) {
  const result = readTariffs()
  if (result.kind === 'readError') return result
  if (result.kind !== 'ready' || !matchesScope(result.scope, expected)) return { kind: 'stale' } as const
  const tariff = result.tariffs.find((row) => row.id === id)
  if (!tariff) return { kind: 'notFound' } as const
  if (tariff.status !== 'active') return { kind: 'inactive' } as const
  if (tariff.revision !== revision) return { kind: 'stale' } as const
  return estimateTariff(tariff, distanceMeters)
}

export async function changeTariff(expected: ExpectedScope, change: TariffChange) {
  try {
    const initial = resolveActiveProvider()
    if (initial.kind !== 'ready' || !matchesScope(initial, expected)) return { kind: 'stale' } as const
    return await withAuthMutation(async () => {
      const scope = resolveActiveProvider()
      if (scope.kind !== 'ready' || !matchesScope(scope, expected)) return { kind: 'stale' } as const
      let rows: Tariff[]
      try {
        rows = tariffRepository.read()
      } catch {
        return { kind: 'readError' } as const
      }
      if (change.kind === 'create') {
        const { combination, amounts } = change
        if (!isTariffCombination(combination) || !isTariffAmounts(amounts)) return { kind: 'invalid' } as const
        const key = tariffKey(scope.provider, combination)
        const duplicate = rows.find((row) => tariffKey(row.provider, row) === key)
        if (duplicate) return { kind: 'duplicate', id: duplicate.id } as const
        const stamp = { at: new Date().toISOString(), userId: scope.userId }
        const tariff: Tariff = {
          id: crypto.randomUUID(), provider: scope.provider, modality: combination.modality, vehicleType: combination.vehicleType,
          currency: 'BRL', ...tariffAmounts(amounts), status: 'active', revision: 1, created: stamp, updated: stamp,
          history: [{ ...stamp, kind: 'created', amounts: tariffAmounts(amounts) }],
        }
        tariffRepository.write([...rows, tariff])
        return { kind: 'saved', id: tariff.id } as const
      }

      const previous = rows.find((row) => row.id === change.id && ownsTariff(scope, row))
      if (!previous) return { kind: 'notFound' } as const
      if (previous.revision !== change.revision) return { kind: 'stale' } as const

      const updated = {
        at: new Date(Math.max(Date.now(), Date.parse(previous.updated.at))).toISOString(),
        userId: scope.userId,
      }
      const next = { ...previous, updated, revision: previous.revision + 1, history: [...previous.history] }
      if (change.kind === 'edit') {
        if (!isTariffAmounts(change.amounts)) return { kind: 'invalid' } as const
        if (sameTariffAmounts(previous, change.amounts)) return { kind: 'unchanged', id: previous.id } as const
        const to = tariffAmounts(change.amounts)
        Object.assign(next, to)
        next.history.push({ ...updated, kind: 'amountsChanged', from: tariffAmounts(previous), to })
      } else {
        if (change.status !== 'active' && change.status !== 'inactive') return { kind: 'invalid' } as const
        if (change.status === previous.status) return { kind: 'stale' } as const
        next.status = change.status
        next.history.push({ ...updated, kind: next.status === 'active' ? 'reactivated' : 'deactivated' })
      }
      tariffRepository.write(rows.map((row) => row.id === next.id ? next : row))
      return { kind: 'saved', id: next.id } as const
    })
  } catch {
    return { kind: 'storageError' } as const
  }
}
