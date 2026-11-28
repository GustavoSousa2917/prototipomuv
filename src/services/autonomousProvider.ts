import { validateProfessionalInput } from '../domain/autonomousProvider'
import type { ProfessionalInput } from '../domain/autonomousProvider'
import { autonomousProviderRepository } from '../repositories/autonomousProviderRepository'
import { driverProfessionalRepository } from '../repositories/driverProfessionalRepository'
import { driverRevision } from '../domain/driverProfessional'
import { authenticatedProfessionalOwner, professionalStorageFailure } from './driverProfessional'
import { withAuthMutation } from './authMutation'
import { pendingIntentMessage, removesPendingModality } from './protectAuthorizationIntent'

function registrationRevision({ provider, professional }: ReturnType<typeof autonomousProviderRepository.readForAccount>) {
  return JSON.stringify([provider?.id, provider?.updatedAt, provider?.intendedModalities, driverRevision(professional)])
}

export function readOwnProfessionalRegistration(expectedUserId: string) {
  try {
    const user = authenticatedProfessionalOwner(expectedUserId)
    if (!user) return { kind: 'denied' } as const
    const { fullName, cpf, phone, email } = user
    const registration = autonomousProviderRepository.readForAccount(user.id)
    return { kind: 'ready', account: { fullName, cpf, phone, email }, ...registration,
      revision: registrationRevision(registration) } as const
  } catch (error) {
    return professionalStorageFailure(error)
  }
}

export async function saveOwnProfessionalRegistration(
  expectedUserId: string,
  input: ProfessionalInput,
  mode: 'create' | 'edit',
  expectedRevision?: string,
) {
  if (!input || Object.keys(input).some((field) => !['cnhNumber', 'cnhCategory', 'cnhExpiresAt', 'hasEar', 'intendedModalities'].includes(field))) {
    return { kind: 'invalidInput' } as const
  }

  try {
    if (!authenticatedProfessionalOwner(expectedUserId)) return { kind: 'denied' } as const
    const revision = expectedRevision ?? registrationRevision(autonomousProviderRepository.readForAccount(expectedUserId))
    return await withAuthMutation(async () => {
      const user = authenticatedProfessionalOwner(expectedUserId)
      if (!user) return { kind: 'denied' } as const
      const validation = validateProfessionalInput(input)
      if (validation.kind === 'invalid') return validation

      const registration = autonomousProviderRepository.readForAccount(user.id)
      const existing = registration.provider
      if (mode === 'create' && existing) return { kind: 'alreadyExists' } as const
      if (registrationRevision(registration) !== revision) return { kind: 'stale' } as const
      if (mode === 'edit' && !existing) return { kind: 'missing' } as const
      if (existing && removesPendingModality({ kind: 'autonomous', providerId: existing.id },
        existing.intendedModalities, validation.details.intendedModalities)) {
        return { kind: 'invalid', errors: { intendedModalities: pendingIntentMessage } } as const
      }
      const owner = driverProfessionalRepository.findByCnh(validation.details.cnhNumber)
      if (owner && owner.userId !== user.id) {
        return { kind: 'invalid', errors: { cnhNumber: 'Esta CNH já está associada a outro cadastro.' } } as const
      }

      const now = new Date().toISOString()
      const record = {
        ...validation.details,
        id: existing?.id ?? crypto.randomUUID(),
        userId: user.id,
        createdAt: existing?.createdAt ?? now,
        updatedAt: now,
      }
      if (!authenticatedProfessionalOwner(expectedUserId)) return { kind: 'denied' } as const
      autonomousProviderRepository.save(record)
      return { kind: 'saved', provider: record } as const
    })
  } catch (error) {
    return professionalStorageFailure(error)
  }
}
