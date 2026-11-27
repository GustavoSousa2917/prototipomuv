import { digitsOnly, validatePersonalDetails } from '../domain/userRegistration'
import type { PersonalDetails, User } from '../domain/userRegistration'
import { sessionRepository } from '../repositories/sessionRepository'
import { userRepository } from '../repositories/userRepository'
import { resolveAccountAccess } from './accountAccess'
import { withAuthMutation } from './authMutation'

function accountView({ fullName, cpf, phone, email, initialPurpose, createdAt, id }: User) {
  const { contexts, activeContext } = resolveAccountAccess(id, false, false)
  return { fullName, cpf, phone, email, initialPurpose, createdAt, contexts, activeContext }
}

export function readOwnAccount(expectedUserId: string) {
  try {
    const session = sessionRepository.read()
    if (!session || session.userId !== expectedUserId) return null
    const user = userRepository.findById(session.userId)
    return user ? accountView(user) : null
  } catch {
    return null
  }
}

export async function updateOwnAccount(expectedUserId: string, input: PersonalDetails) {
  if (!input || typeof input.fullName !== 'string' || typeof input.phone !== 'string'
    || Object.keys(input).some((key) => key !== 'fullName' && key !== 'phone')) {
    return { kind: 'invalidInput' } as const
  }
  const errors = validatePersonalDetails(input)
  if (Object.keys(errors).length) return { kind: 'invalidFields', errors } as const

  try {
    return await withAuthMutation(async () => {
      const session = sessionRepository.read()
      if (!session || session.userId !== expectedUserId) return { kind: 'sessionChanged' } as const

      const updated = await userRepository.updatePersonalDetails(session.userId, {
        fullName: input.fullName.trim(),
        phone: digitsOnly(input.phone),
      }, () => sessionRepository.read()?.userId === session.userId)

      return updated
        ? { kind: 'updated', account: accountView(updated) } as const
        : { kind: 'sessionChanged' } as const
    })
  } catch {
    return { kind: 'storageError' } as const
  }
}
