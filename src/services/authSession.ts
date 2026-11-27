import { isValidEmail, normalizeEmail } from '../domain/userRegistration'
import type { User } from '../domain/userRegistration'
import { sessionRepository } from '../repositories/sessionRepository'
import { userRepository } from '../repositories/userRepository'
import { clearActiveContext, initialAccountDestination, resolveAccountAccess, selectAccountContext } from './accountAccess'
import type { AccountAccess, ContextSelectionResult } from './accountAccess'
import { withAuthMutation } from './authMutation'
import { verifyCredential } from './passwordCredential'

export type AuthenticatedUser = Pick<User, 'id' | 'fullName'>
export type Authentication = { user: AuthenticatedUser; access: AccountAccess }
type LoginFields = { email: string; password: string }
type LoginErrors = Partial<Record<keyof LoginFields, string>>
export type LoginResult =
  | ({ kind: 'authenticated'; destination: string } & Authentication)
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
    const verifiedUser = user
    return await withAuthMutation(async (): Promise<LoginResult> => {
      const currentUser = userRepository.findById(verifiedUser.id)
      if (!currentUser || currentUser.credential.derivedKey !== verifiedUser.credential.derivedKey) {
        return { kind: 'invalidCredentials' }
      }
      sessionRepository.save(currentUser.id)
      const access = resolveAccountAccess(currentUser.id, true)
      return {
        kind: 'authenticated',
        user: toAuthenticatedUser(currentUser),
        access,
        destination: initialAccountDestination(access),
      }
    })
  } catch {
    return { kind: 'storageError' }
  }
}

function readAuthenticatedUser(): AuthenticatedUser | null {
  try {
    const session = sessionRepository.read()
    if (!session) return null
    const user = userRepository.findById(session.userId)
    return user ? toAuthenticatedUser(user) : null
  } catch {
    return null
  }
}

export function restoreSession(): Authentication | null {
  const user = readAuthenticatedUser()
  if (user) return { user, access: resolveAccountAccess(user.id) }

  clearActiveContext()
  return null
}

export async function logoutUser(expectedUserId: string): Promise<'loggedOut' | 'sessionChanged' | 'storageError'> {
  try {
    return await withAuthMutation(async () => {
      return sessionRepository.removeForUser(expectedUserId) ? 'loggedOut' : 'sessionChanged'
    })
  } catch {
    return 'storageError'
  }
}


export async function switchContext(expectedUserId: string, contextKey: string): Promise<ContextSelectionResult> {
  try {
    return await withAuthMutation(async () => {
      if (readAuthenticatedUser()?.id !== expectedUserId) return { kind: 'unavailable' }
      return selectAccountContext(expectedUserId, contextKey)
    })
  } catch {
    return { kind: 'storageError' }
  }
}
