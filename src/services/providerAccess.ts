import { decideAccess } from '../domain/accessPolicy'
import type { ProviderReference } from '../domain/providerReference'
import { autonomousProviderRepository } from '../repositories/autonomousProviderRepository'
import { organizationRepository } from '../repositories/organizationRepository'
import { sessionRepository } from '../repositories/sessionRepository'
import { userRepository } from '../repositories/userRepository'
import { resolveAccountAccess } from './accountAccess'

export function resolveActiveProvider() {
  const session = sessionRepository.read()
  const user = session && userRepository.findById(session.userId)
  if (!user) return { kind: 'denied' } as const

  const access = resolveAccountAccess(user.id, false, false)
  const active = access.activeContext
  if (!access.contexts.some(({ kind }) => kind === 'client')) return { kind: 'denied' } as const

  if (active?.kind === 'autonomous') {
    if (decideAccess({ user, access }, { capabilities: ['accessAutonomous'] }).kind !== 'allowed') {
      return { kind: 'denied' } as const
    }
    const registration = autonomousProviderRepository.findByUserId(user.id)
    if (!registration) return { kind: 'missingProvider' } as const
    return {
      kind: 'ready', userId: user.id, label: user.fullName,
      provider: { kind: 'autonomous', providerId: registration.id } satisfies ProviderReference,
      intendedModalities: registration.intendedModalities,
    } as const
  }

  if (active?.kind !== 'company' && active?.kind !== 'cooperative') return { kind: 'denied' } as const
  const { organizationId } = active
  const capability = active.kind === 'company' ? 'accessCompany' : 'accessCooperative'
  if (decideAccess({ user, access }, { capabilities: [capability], scope: { organizationId } }).kind !== 'allowed') {
    return { kind: 'denied' } as const
  }
  const organization = organizationRepository.findById(organizationId)
  if (!organization) return { kind: 'missingProvider' } as const
  if (organization.kind !== active.kind || !organizationRepository.findResponsibility(user.id, organizationId)) {
    return { kind: 'denied' } as const
  }
  return {
    kind: 'ready', userId: user.id, label: active.organizationLabel ?? (organization.tradeName || organization.legalName),
    provider: { kind: organization.kind, organizationId } satisfies ProviderReference,
    intendedModalities: organization.intendedModalities,
  } as const
}

export type ActiveProvider = Extract<ReturnType<typeof resolveActiveProvider>, { kind: 'ready' }>
