import { resolveContexts } from '../domain/accountAccess'
import { validateProfessionalInput } from '../domain/autonomousProvider'
import type { ProfessionalInput } from '../domain/autonomousProvider'
import { readAccessAssignments } from '../repositories/accessAssignmentRepository'
import { autonomousProviderRepository } from '../repositories/autonomousProviderRepository'
import { sessionRepository } from '../repositories/sessionRepository'
import { userRepository } from '../repositories/userRepository'
import { withAuthMutation } from './authMutation'
import { pendingIntentMessage, removesPendingModality } from './protectAuthorizationIntent'

function eligibleUser(expectedUserId: string) {
  const session = sessionRepository.read()
  if (!session || session.userId !== expectedUserId) return null
  const user = userRepository.findById(session.userId)
  if (!user || !resolveContexts(user.id, readAccessAssignments()).some(({ kind }) => kind === 'client')) return null
  return user
}

export function readOwnProfessionalRegistration(expectedUserId: string) {
  try {
    const user = eligibleUser(expectedUserId)
    if (!user) return { kind: 'denied' } as const
    const { fullName, cpf, phone, email } = user
    const provider = autonomousProviderRepository.findByUserId(user.id)
    return { kind: 'ready', account: { fullName, cpf, phone, email }, provider } as const
  } catch {
    return { kind: 'storageError' } as const
  }
}

export async function saveOwnProfessionalRegistration(
  expectedUserId: string,
  input: ProfessionalInput,
  mode: 'create' | 'edit',
) {
  if (!input || Object.keys(input).some((field) => !['cnhNumber', 'cnhCategory', 'cnhExpiresAt', 'hasEar', 'intendedModalities'].includes(field))) {
    return { kind: 'invalidInput' } as const
  }

  try {
    return await withAuthMutation(async () => {
      const user = eligibleUser(expectedUserId)
      if (!user) return { kind: 'denied' } as const
      const validation = validateProfessionalInput(input)
      if (validation.kind === 'invalid') return validation

      const existing = autonomousProviderRepository.findByUserId(user.id)
      if (mode === 'create' && existing) return { kind: 'alreadyExists' } as const
      if (mode === 'edit' && !existing) return { kind: 'missing' } as const
      if (existing && removesPendingModality({ kind: 'autonomous', providerId: existing.id },
        existing.intendedModalities, validation.details.intendedModalities)) {
        return { kind: 'invalid', errors: { intendedModalities: pendingIntentMessage } } as const
      }
      const owner = autonomousProviderRepository.findByCnh(validation.details.cnhNumber)
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
      if (!eligibleUser(expectedUserId)) return { kind: 'denied' } as const
      autonomousProviderRepository.save(record)
      return { kind: 'saved', provider: record } as const
    })
  } catch {
    return { kind: 'storageError' } as const
  }
}
