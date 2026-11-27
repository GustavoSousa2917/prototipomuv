import { decideAccess } from '../domain/accessPolicy'
import { resolveContexts } from '../domain/accountAccess'
import { validateOrganizationInput } from '../domain/organization'
import { readAccessAssignments } from '../repositories/accessAssignmentRepository'
import { organizationRepository } from '../repositories/organizationRepository'
import { sessionRepository } from '../repositories/sessionRepository'
import { userRepository } from '../repositories/userRepository'
import { resolveAccountAccess } from './accountAccess'
import { withAuthMutation } from './authMutation'

function authenticatedAccount(expectedUserId: string) {
  if (sessionRepository.read()?.userId !== expectedUserId) return null
  const user = userRepository.findById(expectedUserId)
  if (!user || !resolveContexts(user.id, readAccessAssignments()).some(({ kind }) => kind === 'client')) return null
  return { id: user.id, fullName: user.fullName, cpf: user.cpf, phone: user.phone, email: user.email }
}

export function readOrganizationRegistrant(expectedUserId: string) {
  try {
    return authenticatedAccount(expectedUserId)
  } catch {
    return null
  }
}

function scopedOrganization(expectedUserId: string, organizationId: string) {
  const account = authenticatedAccount(expectedUserId)
  if (!account) return { kind: 'denied' } as const

  const access = resolveAccountAccess(account.id, false, false)
  const active = access.activeContext
  if (!active || (active.kind !== 'company' && active.kind !== 'cooperative')) return { kind: 'denied' } as const
  const decision = decideAccess({ user: account, access }, {
    capabilities: [active.kind === 'company' ? 'accessCompany' : 'accessCooperative'],
    scope: { organizationId },
  })
  if (decision.kind !== 'allowed') return { kind: 'denied' } as const

  const organization = organizationRepository.findById(organizationId)
  if (!organization) return { kind: 'missing' } as const
  if (organization.kind !== active.kind || !organizationRepository.findResponsibility(account.id, organizationId)) {
    return { kind: 'denied' } as const
  }
  return { kind: 'ready', organization, account } as const
}

export function readOwnOrganization(expectedUserId: string, organizationId: string) {
  try {
    return scopedOrganization(expectedUserId, organizationId)
  } catch {
    return { kind: 'storageError' } as const
  }
}

export async function registerOrganization(expectedUserId: string, input: unknown) {
  try {
    return await withAuthMutation(async () => {
      const account = authenticatedAccount(expectedUserId)
      if (!account) return { kind: 'denied' } as const
      const validation = validateOrganizationInput(input, true)
      if (validation.kind !== 'valid') return validation
      if (!validation.identity) return { kind: 'invalidInput' } as const
      if (organizationRepository.findByCnpj(validation.identity.cnpj)) {
        return { kind: 'invalid', errors: { cnpj: 'Já existe um cadastro com este CNPJ.' } } as const
      }
      const date = new Date().toISOString()
      const organization = {
        ...validation.details, ...validation.identity, id: crypto.randomUUID(), createdAt: date, updatedAt: date,
      }
      if (!authenticatedAccount(expectedUserId)) return { kind: 'denied' } as const
      organizationRepository.create(organization, {
        id: crypto.randomUUID(), organizationId: organization.id, userId: account.id,
        role: 'responsible', declaredAt: date, createdAt: date,
      })
      return { kind: 'saved', organizationId: organization.id } as const
    })
  } catch {
    return { kind: 'storageError' } as const
  }
}

export async function updateOwnOrganization(expectedUserId: string, organizationId: string, input: unknown) {
  try {
    return await withAuthMutation(async () => {
      const validation = validateOrganizationInput(input, false)
      if (validation.kind !== 'valid') return validation
      const current = scopedOrganization(expectedUserId, organizationId)
      if (current.kind !== 'ready') return current
      organizationRepository.update({
        ...current.organization, ...validation.details, updatedAt: new Date().toISOString(),
      })
      return { kind: 'saved', organizationId } as const
    })
  } catch {
    return { kind: 'storageError' } as const
  }
}
