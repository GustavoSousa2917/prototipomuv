import { decideAccess } from '../domain/accessPolicy'
import { normalizeDecisionReason } from '../domain/driverLink'
import type { DriverLink, OrganizationReference } from '../domain/driverLink'
import { driverDetails, isCnhCurrent } from '../domain/driverProfessional'
import { evidenceDifferences, verificationHistory } from '../domain/driverVerification'
import type { DriverEvidence, DriverVerification } from '../domain/driverVerification'
import { providerKey } from '../domain/providerReference'
import { driverLinkRepository } from '../repositories/driverLinkRepository'
import { driverProfessionalRepository, ProfessionalStorageError } from '../repositories/driverProfessionalRepository'
import { driverVerificationRepository } from '../repositories/driverVerificationRepository'
import { userRepository } from '../repositories/userRepository'
import { resolveAccountAccess } from './accountAccess'
import { withAuthMutation } from './authMutation'
import { findOrganization, resolveOrganization } from './driverLinks'
import { authenticatedProfessionalOwner } from './driverProfessional'

export type DriverLinkActor =
  | { kind: 'organization'; userId: string; organization: OrganizationReference }
  | { kind: 'driver'; userId: string; activeContext?: true }

function actorIdentity(actor: DriverLinkActor) {
  const account = authenticatedProfessionalOwner(actor.userId)
  if (!account || (actor.kind === 'organization' && !resolveOrganization(actor.userId, actor.organization))) return null
  return account
}

function canReadLink(actor: DriverLinkActor, link: DriverLink) {
  if (actor.kind === 'organization') return providerKey(link.organization) === providerKey(actor.organization)
  if (link.acceptedBy !== actor.userId) return false
  if (!actor.activeContext) return true
  const access = resolveAccountAccess(actor.userId, false, false)
  return link.status === 'active' && decideAccess({ user: { id: actor.userId }, access }, {
    capabilities: ['accessLinkedDriver'], scope: { linkId: link.id },
  }).kind === 'allowed'
}

function currentEvidence(link: DriverLink, name: string): DriverEvidence {
  try {
    const professional = driverProfessionalRepository.findByUserId(link.acceptedBy)
    if (!professional) return { kind: 'unavailable', name, reason: 'missing' }
    if (professional.id !== link.professionalId) return { kind: 'unavailable', name, reason: 'inconsistent' }
    return { kind: 'available', name, details: driverDetails(professional) }
  } catch (error) {
    if (error instanceof ProfessionalStorageError && error.kind !== 'transitionError') {
      return { kind: 'unavailable', name, reason: 'inconsistent' }
    }
    throw error
  }
}

function fallbackName(history: DriverVerification[]) {
  return history[0]?.evidence.name ?? 'Motorista vinculado'
}

function projectLink(link: DriverLink, invitationName: string, decisions: DriverVerification[]) {
  const history = verificationHistory(decisions, link.id)
  const base = {
    id: link.id, professionalId: link.professionalId, organizationKind: link.organization.kind,
    acceptedAt: link.acceptedAt, history, verification: history[0]?.result ?? 'pending',
  }
  if (link.status === 'ended') return {
    ...base, status: 'ended' as const, name: link.ending.driverName,
    organizationName: link.ending.organizationName, ending: link.ending,
  }
  const name = userRepository.findById(link.acceptedBy)?.fullName ?? fallbackName(history)
  const organization = findOrganization(link.organization)
  const evidence = currentEvidence(link, name)
  return {
    ...base, status: 'active' as const, name, organizationName: organization?.tradeName || organization?.legalName || invitationName,
    evidence, differences: evidenceDifferences(evidence, history[0]?.evidence),
    expired: evidence.kind === 'available' && !isCnhCurrent(evidence.details.cnhExpiresAt),
    revision: JSON.stringify([history[0]?.id ?? null, evidence]),
  }
}

export function readDriverLinkDetails(actor: DriverLinkActor, linkId?: string) {
  try {
    if (!actorIdentity(actor)) return { kind: 'denied' } as const
    const store = driverLinkRepository.read()
    const candidates = store.links.filter((row) => (!linkId || row.id === linkId) && canReadLink(actor, row))
    if (linkId && !candidates.length) return { kind: 'notFound' } as const
    const decisions = driverVerificationRepository.read(store.links)
    return { kind: 'ready', links: candidates.map((row) =>
      projectLink(row, store.invitations.find(({ id }) => id === row.invitationId)?.organizationName ?? 'Organização', decisions)) } as const
  } catch {
    return { kind: 'storageError' } as const
  }
}

export type DriverLinkDetail = Extract<ReturnType<typeof readDriverLinkDetails>, { kind: 'ready' }>['links'][number]

export async function recordDriverVerification(
  actor: Extract<DriverLinkActor, { kind: 'organization' }>,
  linkId: string,
  result: 'approved' | 'rejected',
  revision: string,
  justification = '',
) {
  try {
    return await withAuthMutation(async () => {
      const account = actor.kind === 'organization' && actorIdentity(actor)
      if (!account) return 'denied'
      const store = driverLinkRepository.read()
      const link = store.links.find(({ id }) => id === linkId)
      if (!link || !canReadLink(actor, link)) return 'denied'
      if (link.status !== 'active') return 'ended'
      const reason = normalizeDecisionReason(justification)
      if (result !== 'approved' && (result !== 'rejected' || !reason)) return 'reasonRequired'
      const decisions = driverVerificationRepository.read(store.links)
      const current = projectLink(link, '', decisions)
      if (current.status !== 'active' || current.revision !== revision) return 'stale'
      if (result === 'approved' && (current.evidence.kind !== 'available' || current.expired)) return 'ineligible'
      const previous = current.history[0]
      const fields = {
        id: crypto.randomUUID(), linkId, organization: link.organization, professionalId: link.professionalId,
        authorId: account.id, authorName: account.fullName, evidence: current.evidence,
        at: new Date(Math.max(Date.now(), Date.parse(previous?.at ?? link.acceptedAt))).toISOString(),
        sequence: (previous?.sequence ?? 0) + 1,
      }
      const decision: DriverVerification = result === 'approved'
        ? { ...fields, result } : { ...fields, result, reason }
      driverVerificationRepository.write([...decisions, decision], store.links)
      return 'saved'
    })
  } catch {
    return 'storageError'
  }
}

export async function endDriverLink(actor: DriverLinkActor, linkId: string, justification: string) {
  try {
    return await withAuthMutation(async () => {
      const account = actorIdentity(actor)
      if (!account) return 'denied'
      const store = driverLinkRepository.read()
      const link = store.links.find(({ id }) => id === linkId)
      if (!link || !canReadLink(actor, link)) return 'denied'
      if (link.status !== 'active') return 'ended'
      const reason = normalizeDecisionReason(justification)
      if (!reason) return 'reasonRequired'
      const history = verificationHistory(driverVerificationRepository.read(store.links), linkId)
      const organization = findOrganization(link.organization)
      const invitation = store.invitations.find(({ id }) => id === link.invitationId)
      const ended: DriverLink = {
        ...link, status: 'ended', ending: {
          at: new Date(Math.max(Date.now(), Date.parse(history[0]?.at ?? link.acceptedAt))).toISOString(),
          authorId: account.id, authorName: account.fullName, source: actor.kind, reason,
          driverName: userRepository.findById(link.acceptedBy)?.fullName ?? fallbackName(history),
          organizationName: organization?.tradeName || organization?.legalName || invitation?.organizationName || 'Organização',
        },
      }
      driverLinkRepository.write({ ...store, links: store.links.map((row) => row.id === linkId ? ended : row) })
      return 'saved'
    })
  } catch {
    return 'storageError'
  }
}
