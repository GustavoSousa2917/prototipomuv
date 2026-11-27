import { contextKey, isAccessAssignment } from '../domain/accountAccess'
import type { AssignedContext } from '../domain/accountAccess'

export const accessAssignmentStorageKey = 'muv.accessAssignments.v1'

export function readAccessAssignments(): unknown {
  try {
    return JSON.parse(localStorage.getItem(accessAssignmentStorageKey) ?? '[]') as unknown
  } catch {
    return null
  }
}

export function ensureAccessAssignments(userId: string, contexts: readonly AssignedContext[], persist = true) {
  const stored = readAccessAssignments()
  if (!Array.isArray(stored) || !stored.every(isAccessAssignment)) return false

  const existing = stored.filter((assignment) => assignment.userId === userId)
  if (existing.length) {
    const keys = new Set(existing.map(({ context }) => contextKey(context)))
    return keys.size === existing.length && keys.size === contexts.length
      && contexts.every((context) => keys.has(contextKey(context)))
  }

  if (persist && contexts.length) {
    localStorage.setItem(accessAssignmentStorageKey, JSON.stringify([
      ...stored,
      ...contexts.map((context) => ({ userId, context })),
    ]))
  }
  return true
}
