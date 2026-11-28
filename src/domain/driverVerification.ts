import { date, identifier, normalizeDecisionReason } from './driverLink'
import type { DriverLink, OrganizationReference } from './driverLink'
import { isProfessionalDetails } from './driverProfessional'
import type { DriverProfessionalDetails } from './driverProfessional'
import { isProviderReference, providerKey } from './providerReference'

export type DriverEvidence =
  | { kind: 'available'; name: string; details: DriverProfessionalDetails }
  | { kind: 'unavailable'; name: string; reason: 'missing' | 'inconsistent' }

export type DriverVerification = {
  id: string
  linkId: string
  organization: OrganizationReference
  professionalId: string
  authorId: string
  authorName: string
  at: string
  sequence: number
  evidence: DriverEvidence
} & ({ result: 'approved' } | { result: 'rejected'; reason: string })

function object(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isEvidence(value: unknown): value is DriverEvidence {
  if (!object(value) || Object.keys(value).length !== 3 || !identifier(value.name)) return false
  if (value.kind === 'unavailable') return value.reason === 'missing' || value.reason === 'inconsistent'
  return value.kind === 'available' && object(value.details) && Object.keys(value.details).length === 4
    && isProfessionalDetails(value.details)
}

function isDecision(value: unknown): value is DriverVerification {
  if (!object(value) || !identifier(value.id) || !identifier(value.linkId) || !identifier(value.professionalId)
    || !isProviderReference(value.organization) || value.organization.kind === 'autonomous'
    || !identifier(value.authorId) || !identifier(value.authorName) || !date(value.at)
    || typeof value.sequence !== 'number' || !Number.isSafeInteger(value.sequence) || value.sequence < 1
    || !isEvidence(value.evidence)) return false
  return (Object.keys(value).length === 10 && value.result === 'approved' && value.evidence.kind === 'available')
    || (Object.keys(value).length === 11 && value.result === 'rejected' && identifier(value.reason)
      && normalizeDecisionReason(value.reason) === value.reason)
}

export function isDriverVerificationCollection(value: unknown, links: readonly DriverLink[]): value is DriverVerification[] {
  if (!Array.isArray(value) || !value.every(isDecision)) return false
  const byId = new Map(links.map((row) => [row.id, row]))
  const last = new Map<string, DriverVerification>()
  const ids = new Set<string>()
  for (const row of [...value].sort((a, b) => a.sequence - b.sequence)) {
    const link = byId.get(row.linkId)
    const previous = last.get(row.linkId)
    if (!link || link.professionalId !== row.professionalId || providerKey(link.organization) !== providerKey(row.organization)
      || row.at < link.acceptedAt || (link.status === 'ended' && row.at > link.ending.at)
      || ids.has(row.id) || row.sequence !== (previous?.sequence ?? 0) + 1 || (previous && row.at < previous.at)) return false
    ids.add(row.id)
    last.set(row.linkId, row)
  }
  return true
}

export function verificationHistory(decisions: DriverVerification[], linkId: string) {
  return decisions.filter((row) => row.linkId === linkId).sort((a, b) => b.sequence - a.sequence)
}

export const evidenceFields = {
  cnhNumber: 'Número da CNH', cnhCategory: 'Categoria', cnhExpiresAt: 'Validade da CNH', hasEar: 'EAR autodeclarada',
} as const

export function evidenceDifferences(current?: DriverEvidence, historical?: DriverEvidence) {
  if (current?.kind !== 'available' || historical?.kind !== 'available') return []
  return (Object.keys(evidenceFields) as (keyof DriverProfessionalDetails)[])
    .filter((key) => current.details[key] !== historical.details[key])
}
