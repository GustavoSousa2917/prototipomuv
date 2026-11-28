import { isAutonomousProvider, isAutonomousRegistration } from '../domain/autonomousProvider'
import type { AutonomousRegistration } from '../domain/autonomousProvider'
import { driverDetails, isDriverProfessional } from '../domain/driverProfessional'
import type { DriverProfessional } from '../domain/driverProfessional'
import { registeredUserIds } from './userRepository'

export const driverProfessionalStorageKey = 'muv.driverProfessionals.v1'
export const autonomousProviderStorageKey = 'muv.autonomousProviders.v1'

export type ProfessionalStore = {
  professionals: DriverProfessional[]
  autonomousRegistrations: AutonomousRegistration[]
  legacySignature: string
}

export class ProfessionalStorageError extends Error {
  readonly kind: 'invalidLegacy' | 'invalidStore' | 'transitionError'

  constructor(kind: ProfessionalStorageError['kind']) {
    super('Cadastros profissionais inconsistentes.')
    this.kind = kind
  }
}

// Identifica alterações do legado para diagnóstico. A assinatura não é um controle de segurança.
function signature(raw: string | null) {
  if (raw === null) return 'absent'
  let hash = 2166136261
  for (let index = 0; index < raw.length; index++) hash = Math.imul(hash ^ raw.charCodeAt(index), 16777619)
  return `${raw.length}:${(hash >>> 0).toString(16)}`
}

function validate(value: unknown): ProfessionalStore {
  if (!value || typeof value !== 'object' || Array.isArray(value) || Object.keys(value).length !== 3
    || !('professionals' in value) || !('autonomousRegistrations' in value) || !('legacySignature' in value)
    || typeof value.legacySignature !== 'string' || !/^(absent|\d+:[0-9a-f]{1,8})$/.test(value.legacySignature)
    || !Array.isArray(value.professionals) || !value.professionals.every(isDriverProfessional)
    || !Array.isArray(value.autonomousRegistrations) || !value.autonomousRegistrations.every(isAutonomousRegistration)) {
    throw new ProfessionalStorageError('invalidStore')
  }
  const { professionals, autonomousRegistrations, legacySignature } = value
  const byId = new Map(professionals.map((row) => [row.id, row]))
  const users = professionals.length ? registeredUserIds() : new Set<string>()
  if (byId.size !== professionals.length
    || new Set(professionals.map(({ userId }) => userId)).size !== professionals.length
    || new Set(professionals.map(({ cnhNumber }) => cnhNumber)).size !== professionals.length
    || new Set(autonomousRegistrations.map(({ id }) => id)).size !== autonomousRegistrations.length
    || new Set(autonomousRegistrations.map(({ userId }) => userId)).size !== autonomousRegistrations.length
    || professionals.some(({ userId }) => !users.has(userId))
    || autonomousRegistrations.some(({ professionalId, userId }) => byId.get(professionalId)?.userId !== userId)) {
    throw new ProfessionalStorageError('invalidStore')
  }
  return { professionals, autonomousRegistrations, legacySignature }
}

function parse(raw: string, kind: 'invalidStore' | 'invalidLegacy'): unknown {
  try {
    return JSON.parse(raw)
  } catch {
    throw new ProfessionalStorageError(kind)
  }
}

function projectLegacy(raw: string | null): ProfessionalStore {
  const legacy = raw === null ? [] : parse(raw, 'invalidLegacy')
  if (!Array.isArray(legacy) || !legacy.every(isAutonomousProvider)) throw new ProfessionalStorageError('invalidLegacy')
  const professionals = legacy.map((row) => ({
    ...driverDetails(row), id: 'legacy:' + row.id, userId: row.userId,
    createdAt: row.createdAt, updatedAt: row.updatedAt,
  }))
  const autonomousRegistrations = legacy.map(({ id, userId, createdAt, updatedAt, intendedModalities }) => ({
    id, userId, createdAt, updatedAt, intendedModalities, professionalId: 'legacy:' + id,
  }))
  try {
    return validate({ professionals, autonomousRegistrations, legacySignature: signature(raw) })
  } catch (error) {
    if (error instanceof ProfessionalStorageError) throw new ProfessionalStorageError('invalidLegacy')
    throw error
  }
}

function read() {
  const active = localStorage.getItem(driverProfessionalStorageKey)
  if (active !== null) return { store: validate(parse(active, 'invalidStore')), active: true } as const
  return { store: projectLegacy(localStorage.getItem(autonomousProviderStorageKey)), active: false } as const
}

export const driverProfessionalRepository = {
  read,
  findByUserId(userId: string) {
    return read().store.professionals.find((row) => row.userId === userId)
  },
  findByCnh(cnhNumber: string) {
    return read().store.professionals.find((row) => row.cnhNumber === cnhNumber)
  },
  legacyChanged(store: ProfessionalStore) {
    return store.legacySignature !== signature(localStorage.getItem(autonomousProviderStorageKey))
  },
  // Chamado dentro da seção serializada. A primeira gravação publica a projeção completa.
  write(store: ProfessionalStore, active: boolean) {
    const validated = validate(store)
    if (!active && (localStorage.getItem(driverProfessionalStorageKey) !== null || this.legacyChanged(store))) {
      throw new ProfessionalStorageError('transitionError')
    }
    try {
      localStorage.setItem(driverProfessionalStorageKey, JSON.stringify(validated))
    } catch (error) {
      if (!active) throw new ProfessionalStorageError('transitionError')
      throw error
    }
  },
}
