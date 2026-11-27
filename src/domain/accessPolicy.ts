import { contextCapabilities, contextKey } from './accountAccess'
import type { ActingContext, EnvironmentCapability } from './accountAccess'

type AccessScope = { organizationId: string } | { linkId: string }

export type AccessRequirement = { ownAccount: true } | {
  capabilities: readonly EnvironmentCapability[]
  scope?: AccessScope
}

export type AccessSubject = {
  user: { id: string } | null
  access: { contexts: readonly ActingContext[]; activeContext: ActingContext | null } | null
}

export function decideAccess(subject: AccessSubject, requirement: AccessRequirement) {
  if (!subject.user) return { kind: 'login' } as const
  if ('ownAccount' in requirement) return { kind: 'allowed' } as const
  const candidates = subject.access?.contexts.filter((context) => {
    if (!contextCapabilities(context).some((capability) => requirement.capabilities.includes(capability))) return false
    const { scope } = requirement
    if (!scope) return true
    if ('organizationId' in scope) {
      return 'organizationId' in context && context.organizationId === scope.organizationId
    }
    return 'linkId' in context && context.linkId === scope.linkId
  }) ?? []

  const active = subject.access?.activeContext
  if (active && candidates.some((context) => contextKey(context) === contextKey(active))) {
    return { kind: 'allowed' } as const
  }
  if (candidates.length) return { kind: 'switch', candidates } as const
  return { kind: 'denied' } as const
}
