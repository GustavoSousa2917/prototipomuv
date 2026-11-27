import { isAutonomousProvider } from '../domain/autonomousProvider'
import type { AutonomousProvider } from '../domain/autonomousProvider'

export const autonomousProviderStorageKey = 'muv.autonomousProviders.v1'

function readProviders(): AutonomousProvider[] {
  const stored: unknown = JSON.parse(localStorage.getItem(autonomousProviderStorageKey) ?? '[]')
  if (!Array.isArray(stored) || !stored.every(isAutonomousProvider)
    || new Set(stored.map(({ id }) => id)).size !== stored.length
    || new Set(stored.map(({ userId }) => userId)).size !== stored.length
    || new Set(stored.map(({ cnhNumber }) => cnhNumber)).size !== stored.length) {
    throw new Error('Cadastros profissionais inconsistentes.')
  }
  return stored
}

export const autonomousProviderRepository = {
  findById: (id: string) => readProviders().find((row) => row.id === id),
  findByUserId: (userId: string) => readProviders().find((row) => row.userId === userId),
  findByCnh: (cnhNumber: string) => readProviders().find((row) => row.cnhNumber === cnhNumber),
  save(record: AutonomousProvider) {
    const stored = readProviders()
    const existing = stored.find((row) => row.id === record.id)
    if (!isAutonomousProvider(record) || (existing && existing.userId !== record.userId)
      || stored.some((row) => row.id !== record.id && (row.userId === record.userId || row.cnhNumber === record.cnhNumber))) {
      throw new Error('Não foi possível preservar a unicidade do cadastro profissional.')
    }
    localStorage.setItem(autonomousProviderStorageKey, JSON.stringify([
      ...stored.filter((row) => row.id !== record.id),
      record,
    ]))
  },
}
