import { contextCapabilities, contextKey, resolveContexts } from '../domain/accountAccess'
import type { ActingContext, EnvironmentCapability } from '../domain/accountAccess'
import { readAccessAssignments } from '../repositories/accessAssignmentRepository'
import { activeContextRepository } from '../repositories/activeContextRepository'

export type AccountAccess = {
  contexts: ActingContext[]
  activeContext: ActingContext | null
  capabilities: EnvironmentCapability[]
}

export type ContextSelectionResult = { kind: 'selected'; access: AccountAccess } | { kind: 'unavailable' | 'storageError' }

export function selectAccountContext(userId: string, requestedKey: string): ContextSelectionResult {
  const contexts = resolveContexts(userId, readAccessAssignments())
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

export function resolveAccountAccess(userId: string, useDefault = false): AccountAccess {
  const contexts = resolveContexts(userId, readAccessAssignments())
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
