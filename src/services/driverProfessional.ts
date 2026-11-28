import { resolveContexts } from '../domain/accountAccess'
import { driverDetails, driverRevision, validateDriverProfessional } from '../domain/driverProfessional'
import type { DriverProfessionalInput } from '../domain/driverProfessional'
import { readAccessAssignments } from '../repositories/accessAssignmentRepository'
import { driverProfessionalRepository, ProfessionalStorageError } from '../repositories/driverProfessionalRepository'
import { sessionRepository } from '../repositories/sessionRepository'
import { userRepository } from '../repositories/userRepository'
import { withAuthMutation } from './authMutation'

export function authenticatedProfessionalOwner(expectedUserId: string) {
  const session = sessionRepository.read()
  if (!session || session.userId !== expectedUserId) return null
  const user = userRepository.findById(session.userId)
  if (!user || !resolveContexts(user.id, readAccessAssignments()).some(({ kind }) => kind === 'client')) return null
  const { id, fullName, cpf, phone, email } = user
  return { id, fullName, cpf, phone, email }
}

export function professionalStorageFailure(error: unknown) {
  return { kind: error instanceof ProfessionalStorageError ? error.kind : 'storageError' } as const
}

export function readOwnDriverProfessional(expectedUserId: string) {
  try {
    const account = authenticatedProfessionalOwner(expectedUserId)
    if (!account) return { kind: 'denied' } as const
    const { store, active } = driverProfessionalRepository.read()
    const professional = store.professionals.find(({ userId }) => userId === account.id)
    return {
      kind: 'ready', account, professional, revision: driverRevision(professional),
      hasAutonomous: store.autonomousRegistrations.some(({ userId }) => userId === account.id),
      needsTransition: !active && store.legacySignature !== 'absent',
      legacyChanged: active && driverProfessionalRepository.legacyChanged(store),
    } as const
  } catch (error) {
    return professionalStorageFailure(error)
  }
}

export async function transitionOwnDriverProfessional(expectedUserId: string) {
  try {
    return await withAuthMutation(async () => {
      if (!authenticatedProfessionalOwner(expectedUserId)) return { kind: 'denied' } as const
      const { store, active } = driverProfessionalRepository.read()
      if (active || store.legacySignature === 'absent') return { kind: 'ready' } as const
      if (!authenticatedProfessionalOwner(expectedUserId)) return { kind: 'denied' } as const
      driverProfessionalRepository.write(store, false)
      return { kind: 'saved' } as const
    })
  } catch (error) {
    return professionalStorageFailure(error)
  }
}

export async function saveOwnDriverProfessional(
  expectedUserId: string, input: DriverProfessionalInput, expectedRevision: string | null,
) {
  try {
    return await withAuthMutation(async () => {
      const account = authenticatedProfessionalOwner(expectedUserId)
      if (!account) return { kind: 'denied' } as const
      const validation = validateDriverProfessional(input)
      if (validation.kind === 'invalid') return validation
      const { store, active } = driverProfessionalRepository.read()
      const existing = store.professionals.find(({ userId }) => userId === account.id)
      if (driverRevision(existing) !== expectedRevision) return { kind: 'stale' } as const
      if (store.professionals.some(({ cnhNumber, userId }) =>
        cnhNumber === validation.details.cnhNumber && userId !== account.id)) {
        return { kind: 'invalid', errors: { cnhNumber: 'Esta CNH já está associada a outro cadastro.' } } as const
      }
      const now = new Date().toISOString()
      const changed = !existing || JSON.stringify(driverDetails(existing)) !== JSON.stringify(validation.details)
      const professional = {
        ...validation.details, id: existing?.id ?? crypto.randomUUID(), userId: account.id,
        createdAt: existing?.createdAt ?? now, updatedAt: changed ? now : existing.updatedAt,
      }
      if (!authenticatedProfessionalOwner(expectedUserId)) return { kind: 'denied' } as const
      if (!active || changed) driverProfessionalRepository.write({
        ...store, professionals: [...store.professionals.filter(({ userId }) => userId !== account.id), professional],
      }, active)
      return { kind: 'saved', professional } as const
    })
  } catch (error) {
    return professionalStorageFailure(error)
  }
}
