export type ProviderReference =
  | { kind: 'autonomous'; providerId: string }
  | { kind: 'company'; organizationId: string }
  | { kind: 'cooperative'; organizationId: string }

export function providerKey(provider: ProviderReference) {
  return JSON.stringify([
    provider.kind,
    provider.kind === 'autonomous' ? provider.providerId : provider.organizationId,
  ])
}

export function isProviderReference(value: unknown): value is ProviderReference {
  if (typeof value !== 'object' || value === null || !('kind' in value) || Object.keys(value).length !== 2) return false
  const id = value.kind === 'autonomous' && 'providerId' in value ? value.providerId
    : (value.kind === 'company' || value.kind === 'cooperative') && 'organizationId' in value ? value.organizationId
      : null
  return typeof id === 'string' && id.length > 0 && id.trim() === id
}
