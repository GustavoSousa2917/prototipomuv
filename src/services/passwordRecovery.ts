import { isActiveRecovery, recoveryLifetimeMs } from '../domain/passwordRecovery'
import { isValidEmail, normalizeEmail, validatePasswordFields } from '../domain/userRegistration'
import { passwordRecoveryRepository } from '../repositories/passwordRecoveryRepository'
import { sessionRepository } from '../repositories/sessionRepository'
import { userRepository } from '../repositories/userRepository'
import { withAuthMutation } from './authMutation'
import { deriveCredential, toHex } from './passwordCredential'

type TechnicalError = { kind: 'storageError' | 'cryptoError' }
type RequestResult = TechnicalError | { kind: 'invalidEmail' } | { kind: 'processed'; token?: string }
type TokenStatus = TechnicalError | { kind: 'valid' | 'invalidToken' }
type ResetResult = TechnicalError
  | { kind: 'invalidFields'; errors: ReturnType<typeof validatePasswordFields> }
  | { kind: 'invalidToken' | 'partialFailure' | 'reset' }

async function digestToken(token: string) {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token))
  return toHex(new Uint8Array(bytes))
}

function activeRequest(digest: string) {
  const request = passwordRecoveryRepository.findByDigest(digest)
  return request && isActiveRecovery(request, Date.now()) && userRepository.findById(request.userId)
    ? request
    : undefined
}

export async function requestPasswordRecovery(value: string): Promise<RequestResult> {
  const email = normalizeEmail(value)
  if (!isValidEmail(email)) return { kind: 'invalidEmail' }

  try {
    return await withAuthMutation(async (): Promise<RequestResult> => {
      const user = userRepository.findByEmail(email)
      if (!user) return { kind: 'processed' }

      let token: string
      let tokenDigest: string
      let id: string
      try {
        token = toHex(crypto.getRandomValues(new Uint8Array(32)))
        tokenDigest = await digestToken(token)
        id = crypto.randomUUID()
      } catch {
        return { kind: 'cryptoError' }
      }

      const createdAt = Date.now()
      passwordRecoveryRepository.create({
        id,
        userId: user.id,
        tokenDigest,
        createdAt,
        expiresAt: createdAt + recoveryLifetimeMs,
        status: 'active',
      })
      return { kind: 'processed', token }
    })
  } catch {
    return { kind: 'storageError' }
  }
}

async function resolveToken(token: string) {
  if (!/^[a-f0-9]{64}$/.test(token)) return { kind: 'invalidToken' } as const
  try {
    return { kind: 'digested', digest: await digestToken(token) } as const
  } catch {
    return { kind: 'cryptoError' } as const
  }
}

export async function checkRecoveryToken(token: string): Promise<TokenStatus> {
  const result = await resolveToken(token)
  if (result.kind !== 'digested') return result
  try {
    return { kind: activeRequest(result.digest) ? 'valid' : 'invalidToken' }
  } catch {
    return { kind: 'storageError' }
  }
}

export async function resetPassword(token: string, password: string, confirmation: string): Promise<ResetResult> {
  const result = await resolveToken(token)
  if (result.kind !== 'digested') return result

  try {
    return await withAuthMutation(async (): Promise<ResetResult> => {
      const request = activeRequest(result.digest)
      if (!request) return { kind: 'invalidToken' }

      const errors = validatePasswordFields(password, confirmation)
      if (Object.keys(errors).length) return { kind: 'invalidFields', errors }

      let credential: Awaited<ReturnType<typeof deriveCredential>>
      try {
        credential = await deriveCredential(password)
      } catch {
        return { kind: 'cryptoError' }
      }

      if (!passwordRecoveryRepository.consume(request)) return { kind: 'invalidToken' }
      try {
        sessionRepository.removeForUser(request.userId)
        const updated = await userRepository.updateCredential(request.userId, credential, new Date().toISOString())
        return { kind: updated ? 'reset' : 'partialFailure' }
      } catch {
        return { kind: 'partialFailure' }
      }
    })
  } catch {
    return { kind: 'storageError' }
  }
}
