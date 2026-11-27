export type ActingContext =
  | { kind: 'client' }
  | { kind: 'autonomous' | 'admin' }
  | { kind: 'company' | 'cooperative'; organizationId: string }
  | { kind: 'linkedDriver'; linkId: string }

export type AccessAssignment = {
  userId: string
  context: Exclude<ActingContext, { kind: 'client' }>
}

const capabilities = {
  client: 'accessClient',
  autonomous: 'accessAutonomous',
  company: 'accessCompany',
  cooperative: 'accessCooperative',
  linkedDriver: 'accessLinkedDriver',
  admin: 'accessAdmin',
} as const

export type EnvironmentCapability = typeof capabilities[keyof typeof capabilities]

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isIdentifier(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0 && value.trim() === value
}

function isAssignment(value: unknown): value is AccessAssignment {
  if (!isRecord(value) || Object.keys(value).length !== 2 || !isIdentifier(value.userId) || !isRecord(value.context)) return false

  const { context } = value
  switch (context.kind) {
    case 'autonomous':
    case 'admin':
      return Object.keys(context).length === 1
    case 'company':
    case 'cooperative':
      return Object.keys(context).length === 2 && isIdentifier(context.organizationId)
    case 'linkedDriver':
      return Object.keys(context).length === 2 && isIdentifier(context.linkId)
    default:
      return false
  }
}

export function contextKey(context: ActingContext) {
  if ('organizationId' in context) return `${context.kind}:${context.organizationId}`
  if ('linkId' in context) return `${context.kind}:${context.linkId}`
  return context.kind
}

export function resolveContexts(userId: string, stored: unknown): ActingContext[] {
  const client: ActingContext = { kind: 'client' }
  if (!Array.isArray(stored)) return [client]

  const candidates = stored.filter((entry: unknown) => isRecord(entry) && entry.userId === userId)
  const contexts = candidates.filter(isAssignment).map(({ context }) => context)
  const consistent = candidates.length === contexts.length
    && new Set(contexts.map(contextKey)).size === contexts.length

  if (contexts.some(({ kind }) => kind === 'admin')) {
    return consistent && contexts.length === 1 ? [{ kind: 'admin' }] : []
  }

  return consistent ? [client, ...contexts] : [client]
}

export function contextCapabilities(context: ActingContext | null): EnvironmentCapability[] {
  return context ? [capabilities[context.kind]] : []
}
