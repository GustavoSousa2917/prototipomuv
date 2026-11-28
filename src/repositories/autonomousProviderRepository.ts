import type { AutonomousProvider, AutonomousRegistration } from '../domain/autonomousProvider'
import { driverDetails } from '../domain/driverProfessional'
import { driverProfessionalRepository } from './driverProfessionalRepository'
import type { ProfessionalStore } from './driverProfessionalRepository'

export { autonomousProviderStorageKey } from './driverProfessionalRepository'

function project(store: ProfessionalStore, row?: AutonomousRegistration): AutonomousProvider | undefined {
  if (!row) return undefined
  const professional = store.professionals.find(({ id }) => id === row.professionalId)
  if (!professional) throw new Error('Cadastros profissionais inconsistentes.')
  const { id, userId, createdAt, updatedAt, intendedModalities } = row
  return { id, userId, createdAt, updatedAt, intendedModalities, ...driverDetails(professional) }
}

export const autonomousProviderRepository = {
  readForAccount(userId: string) {
    const { store, active } = driverProfessionalRepository.read()
    return {
      provider: project(store, store.autonomousRegistrations.find((row) => row.userId === userId)),
      professional: store.professionals.find((row) => row.userId === userId),
      legacyChanged: active && driverProfessionalRepository.legacyChanged(store),
    }
  },
  findById(id: string) {
    const { store } = driverProfessionalRepository.read()
    return project(store, store.autonomousRegistrations.find((row) => row.id === id))
  },
  findByUserId(userId: string) {
    const { store } = driverProfessionalRepository.read()
    return project(store, store.autonomousRegistrations.find((row) => row.userId === userId))
  },
  // Retorna apenas a atuação autônoma. Unicidade global usa o repositório profissional.
  findByCnh(cnhNumber: string) {
    const { store } = driverProfessionalRepository.read()
    const professional = store.professionals.find((row) => row.cnhNumber === cnhNumber)
    return professional && project(store, store.autonomousRegistrations.find((row) => row.professionalId === professional.id))
  },
  save(record: AutonomousProvider) {
    const { store, active } = driverProfessionalRepository.read()
    const registration = store.autonomousRegistrations.find((row) => row.id === record.id)
    if (registration && (registration.userId !== record.userId || registration.createdAt !== record.createdAt)) {
      throw new Error('Identidade do prestador incompatível.')
    }
    const previous = store.professionals.find((row) => row.userId === record.userId)
    const details = driverDetails(record)
    const changed = !previous || JSON.stringify(driverDetails(previous)) !== JSON.stringify(details)
    const professional = {
      ...details, id: previous?.id ?? crypto.randomUUID(), userId: record.userId,
      createdAt: previous?.createdAt ?? record.createdAt,
      updatedAt: changed ? record.updatedAt : previous.updatedAt,
    }
    const { id, userId, createdAt, updatedAt, intendedModalities } = record
    const next = { id, userId, createdAt, updatedAt, intendedModalities, professionalId: professional.id }
    driverProfessionalRepository.write({
      ...store,
      professionals: [...store.professionals.filter((row) => row.id !== professional.id), professional],
      autonomousRegistrations: [...store.autonomousRegistrations.filter((row) => row.id !== id), next],
    }, active)
  },
}
