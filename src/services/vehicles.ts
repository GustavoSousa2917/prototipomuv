import { providerKey } from '../domain/providerReference'
import { validateVehicleDraft } from '../domain/vehicle'
import type { Vehicle, VehicleDraft, VehicleStatus } from '../domain/vehicle'
import { vehicleRepository } from '../repositories/vehicleRepository'
import { withAuthMutation } from './authMutation'
import { resolveActiveProvider } from './providerAccess'
import type { ActiveProvider } from './providerAccess'

type ExpectedScope = Pick<ActiveProvider, 'provider' | 'userId'>
function matchesScope(scope: ActiveProvider, expected: ExpectedScope) {
  return scope.userId === expected.userId && providerKey(scope.provider) === providerKey(expected.provider)
}

export function readVehicles() {
  try {
    const scope = resolveActiveProvider()
    if (scope.kind !== 'ready') return scope
    const vehicles = vehicleRepository.read().filter((row) => providerKey(row.provider) === providerKey(scope.provider))
    return { kind: 'ready', scope, vehicles } as const
  } catch {
    return { kind: 'readError' } as const
  }
}

type VehicleChange =
  | { kind: 'create'; draft: VehicleDraft }
  | { kind: 'edit'; id: string; revision: number; draft: VehicleDraft; confirmedPlate?: string }
  | { kind: 'status'; id: string; revision: number; status: VehicleStatus }

export async function changeVehicle(expected: ExpectedScope, change: VehicleChange) {
  try {
    const initial = resolveActiveProvider()
    if (initial.kind !== 'ready' || !matchesScope(initial, expected)) return { kind: 'stale' } as const
    return await withAuthMutation(async () => {
      const scope = resolveActiveProvider()
      if (scope.kind !== 'ready' || !matchesScope(scope, expected)) return { kind: 'stale' } as const
      const rows = vehicleRepository.read()
      const previous = change.kind === 'create' ? undefined : rows.find((row) => row.id === change.id
        && providerKey(row.provider) === providerKey(scope.provider))
      if (change.kind !== 'create') {
        if (!previous) return { kind: 'notFound' } as const
        if (previous.revision !== change.revision) return { kind: 'stale' } as const
      }
      const date = new Date(Math.max(Date.now(), previous ? Date.parse(previous.updated.at) : 0))
      const updated = { at: date.toISOString(), userId: scope.userId }
      let next: Vehicle
      if (change.kind === 'status') {
        if (!previous || previous.status === change.status) return { kind: 'stale' } as const
        next = {
          ...previous, status: change.status, updated, revision: previous.revision + 1,
          history: [...previous.history, { ...updated, kind: change.status === 'active' ? 'reactivated' : 'deactivated' }],
        }
      } else {
        const validation = validateVehicleDraft(change.draft, previous, date)
        if (validation.kind === 'invalid') return validation
        const { data } = validation
        if (rows.some((row) => row.id !== previous?.id && row.plate === data.plate)) return { kind: 'duplicate' } as const
        const history = [...(previous?.history ?? [])]
        if (previous && previous.plate !== data.plate) {
          if (change.kind !== 'edit' || change.confirmedPlate !== data.plate) return { kind: 'confirmationRequired' } as const
          history.push({ ...updated, kind: 'plateCorrected', from: previous.plate, to: data.plate })
        }
        next = {
          ...data, id: previous?.id ?? crypto.randomUUID(), provider: previous?.provider ?? scope.provider,
          status: previous?.status ?? 'active', created: previous?.created ?? updated,
          updated, revision: (previous?.revision ?? 0) + 1, history,
        }
      }
      vehicleRepository.write(previous ? rows.map((row) => row.id === previous.id ? next : row) : [...rows, next])
      return { kind: 'saved', id: next.id } as const
    })
  } catch {
    return { kind: 'storageError' } as const
  }
}
