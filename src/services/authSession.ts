import { isValidEmail, normalizeEmail } from '../domain/userRegistration'
import type { User } from '../domain/userRegistration'
import { sessionRepository } from '../repositories/sessionRepository'
import { userRepository } from '../repositories/userRepository'
import { verifyCredential } from './passwordCredential'

export type AuthenticatedUser = Pick<User, 'id' | 'fullName'>
type LoginFields = { email: string; password: string }
type LoginErrors = Partial<Record<keyof LoginFields, string>>
export type LoginResult =
  | { kind: 'authenticated'; user: AuthenticatedUser }
  | { kind: 'invalidFields'; errors: LoginErrors }
  | { kind: 'invalidCredentials' }
  | { kind: 'storageError' }
  | { kind: 'cryptoError' }

function toAuthenticatedUser({ id, fullName }: User): AuthenticatedUser {
  return { id, fullName }
}

export async function loginUser(input: LoginFields): Promise<LoginResult> {
  const email = normalizeEmail(input.email)
  const errors: LoginErrors = {}
  if (!email) errors.email = 'Informe o e-mail.'
  else if (!isValidEmail(email)) errors.email = 'Informe um e-mail válido.'
  if (!input.password) errors.password = 'Informe a senha.'
  if (Object.keys(errors).length) return { kind: 'invalidFields', errors }

  let user: User | undefined
  try {
    user = userRepository.findByEmail(email)
  } catch {
    return { kind: 'storageError' }
  }

  if (!user) return { kind: 'invalidCredentials' }
  try {
    if (!await verifyCredential(input.password, user.credential)) return { kind: 'invalidCredentials' }
  } catch {
    return { kind: 'cryptoError' }
  }

  try {
    sessionRepository.save(user.id)
    return { kind: 'authenticated', user: toAuthenticatedUser(user) }
  } catch {
    return { kind: 'storageError' }
  }
}

export function restoreSession(): AuthenticatedUser | null {
  try {
    const session = sessionRepository.read()
    if (!session) return null
    const user = userRepository.findById(session.userId)
    return user ? toAuthenticatedUser(user) : null
  } catch {
    return null
  }
}

export function logoutUser() {
  try {
    sessionRepository.remove()
    return true
  } catch {
    return false
  }
}
