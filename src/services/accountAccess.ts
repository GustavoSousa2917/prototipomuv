import { contextCapabilities, contextKey, resolveContexts } from '../domain/accountAccess'
import type { ActingContext, EnvironmentCapability } from '../domain/accountAccess'
import { readAccessAssignments } from '../repositories/accessAssignmentRepository'
import { autonomousProviderRepository } from '../repositories/autonomousProviderRepository'
import { organizationRepository } from '../repositories/organizationRepository'
import { driverLinkRepository } from '../repositories/driverLinkRepository'
import { driverProfessionalRepository } from '../repositories/driverProfessionalRepository'
import { organizationKinds } from '../domain/organization'
import { userRepository } from '../repositories/userRepository'
import { activeContextRepository } from '../repositories/activeContextRepository'

export type AccountAccess = {
  contexts: ActingContext[]
  activeContext: ActingContext | null
  capabilities: EnvironmentCapability[]
}

export type ContextSelectionResult = { kind: 'selected'; access: AccountAccess } | { kind: 'unavailable' | 'storageError' }

function availableContexts(userId: string): ActingContext[] {
  const contexts = resolveContexts(userId, readAccessAssignments())
  if (!contexts.some(({ kind }) => kind === 'client')) return contexts

  if (!contexts.some(({ kind }) => kind === 'autonomous')) {
    try {
      if (autonomousProviderRepository.findByUserId(userId)) contexts.push({ kind: 'autonomous' })
    } catch {
      // A fonte autônoma não impede a resolução organizacional.
    }
  }

  try {
    const { organizations, responsibilities } = organizationRepository.read()
    const ownedIds = new Set(responsibilities.filter((entry) => entry.userId === userId).map(({ organizationId }) => organizationId))
    const owned = organizations.filter(({ id }) => ownedIds.has(id))
    const byKey = new Map(contexts.map((context) => [contextKey(context), context]))
    for (const organization of owned) {
      const name = organization.tradeName || organization.legalName
      const ambiguous = owned.some((other) => other.id !== organization.id && other.kind === organization.kind
        && (other.tradeName || other.legalName).toLocaleLowerCase('pt-BR') === name.toLocaleLowerCase('pt-BR'))
      const context: ActingContext = {
        kind: organization.kind,
        organizationId: organization.id,
        organizationLabel: ambiguous ? `${name} (${organization.cnpj})` : name,
      }
      byKey.set(contextKey(context), context)
    }
    contexts.splice(0, contexts.length, ...byKey.values())
  } catch {
    // Uma leitura inconsistente não concede contextos organizacionais.
  }
  try {
    const linked = driverLinkRepository.read().links.filter(({ acceptedBy, status }) => acceptedBy === userId && status === 'active')
    if (linked.length) {
      const profile = driverProfessionalRepository.findByUserId(userId)
      const { organizations, responsibilities } = organizationRepository.read()
      const assignments = readAccessAssignments()
      const entries = linked.flatMap((link) => {
        if (link.professionalId !== profile?.id) return []
        const organization = organizations.find(({ kind, id }) => kind === link.organization.kind && id === link.organization.organizationId)
        const responsible = responsibilities.find(({ organizationId }) => organizationId === organization?.id)
        if (!organization || !responsible || !userRepository.findById(responsible.userId)
          || !resolveContexts(responsible.userId, assignments).some(({ kind }) => kind === 'client')) return []
        return [{ link, organization, name: organization.tradeName || organization.legalName }]
      })
      const byKey = new Map(contexts.map((context) => [contextKey(context), context]))
      for (const { link, organization, name } of entries) {
        const ambiguous = entries.some((entry) => entry.link.id !== link.id && entry.organization.kind === organization.kind
          && entry.name.toLocaleLowerCase('pt-BR') === name.toLocaleLowerCase('pt-BR'))
        const context: ActingContext = { kind: 'linkedDriver', linkId: link.id,
          organizationLabel: organizationKinds[organization.kind] + ' · ' + name + (ambiguous ? ' (' + organization.cnpj + ')' : '') }
        byKey.set(contextKey(context), context)
      }
      return [...byKey.values()]
    }
  } catch {
    // A indisponibilidade de vínculos não invalida os demais contextos.
  }
  return contexts
}

export function selectAccountContext(userId: string, requestedKey: string): ContextSelectionResult {
  const contexts = availableContexts(userId)
  const activeContext = contexts.find((context) => contextKey(context) === requestedKey)
  if (!activeContext) return { kind: 'unavailable' }

  try {
    activeContextRepository.save({ userId, contextKey: requestedKey })
    return { kind: 'selected', access: { contexts, activeContext, capabilities: contextCapabilities(activeContext) } }
  } catch {
    return { kind: 'storageError' }
  }
}

export function clearActiveContext() {
  try {
    activeContextRepository.remove()
  } catch {
    // A sessão de autenticação independe da disponibilidade de sessionStorage.
  }
}

export function resolveAccountAccess(userId: string, useDefault = false, persistSelection = true): AccountAccess {
  const contexts = availableContexts(userId)
  let activeContext = contexts[0] ?? null
  if (!useDefault) {
    try {
      const selection = activeContextRepository.read()
      if (selection?.userId === userId) {
        activeContext = contexts.find((context) => contextKey(context) === selection.contextKey) ?? activeContext
      }
    } catch {
      // A seleção ilegível será substituída pelo contexto padrão permitido.
    }
  }

  if (!persistSelection) return { contexts, activeContext, capabilities: contextCapabilities(activeContext) }

  if (activeContext) {
    try {
      activeContextRepository.save({ userId, contextKey: contextKey(activeContext) })
    } catch {
      // A resolução permanece disponível em memória.
    }
  } else {
    clearActiveContext()
  }

  return { contexts, activeContext, capabilities: contextCapabilities(activeContext) }
}

export function initialAccountDestination(access: AccountAccess) {
  if (access.capabilities.includes('accessAdmin')) return '/admin'
  if (access.capabilities.includes('accessClient')) return '/cliente'
  return '/'
}
