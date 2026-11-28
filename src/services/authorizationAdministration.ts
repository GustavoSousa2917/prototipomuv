import { decideAccess } from '../domain/accessPolicy'
import { authorizationStatus } from '../domain/providerAuthorization'
import { providerAuthorizationRepository } from '../repositories/providerAuthorizationRepository'
import { sessionRepository } from '../repositories/sessionRepository'
import { userRepository } from '../repositories/userRepository'
import { resolveAccountAccess } from './accountAccess'

export function activeAuthorizationAdministrator() {
  const session = sessionRepository.read()
  const user = session && userRepository.findById(session.userId)
  if (!user) return null
  const access = resolveAccountAccess(user.id, false, false)
  if (access.contexts.length !== 1 || access.contexts[0].kind !== 'admin'
    || decideAccess({ user, access }, { capabilities: ['accessAdmin'] }).kind !== 'allowed') return null
  return { id: user.id, name: user.fullName }
}

export function listAuthorizationAttempts() {
  try {
    if (!activeAuthorizationAdministrator()) return { kind: 'denied' } as const
    const attempts = providerAuthorizationRepository.read().map((row) => ({
      id: row.id, name: row.submission.name, providerType: row.provider.kind,
      organizationName: row.provider.kind === 'autonomous' ? '' : row.submission.fields['Razão social'],
      modality: row.modality, status: authorizationStatus(row), requestedAt: row.requestedAt,
    }))
    return { kind: 'ready', attempts } as const
  } catch {
    return { kind: 'readError' } as const
  }
}
