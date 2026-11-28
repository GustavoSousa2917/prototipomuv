import { decideAccess } from '../domain/accessPolicy'
import { resolveContexts } from '../domain/accountAccess'
import { organizationPair } from '../domain/driverLink'
import type { DriverInvitation, DriverLink, OrganizationReference } from '../domain/driverLink'
import { providerKey } from '../domain/providerReference'
import { isValidEmail, normalizeEmail } from '../domain/userRegistration'
import { readAccessAssignments } from '../repositories/accessAssignmentRepository'
import { driverLinkRepository } from '../repositories/driverLinkRepository'
import { driverProfessionalRepository } from '../repositories/driverProfessionalRepository'
import { organizationRepository } from '../repositories/organizationRepository'
import { sessionRepository } from '../repositories/sessionRepository'
import { userRepository } from '../repositories/userRepository'
import { resolveAccountAccess } from './accountAccess'
import { withAuthMutation } from './authMutation'
import { authenticatedProfessionalOwner } from './driverProfessional'
import { resolveActiveProvider } from './providerAccess'

function resolveOrganization(expectedUserId: string, expectedOrganization: OrganizationReference) {
  const scope = resolveActiveProvider()
  if (scope.kind !== 'ready' || scope.userId !== expectedUserId || scope.provider.kind === 'autonomous'
    || providerKey(scope.provider) !== providerKey(expectedOrganization)) return null
  return scope
}

function findOrganization(reference: OrganizationReference) {
  const { organizations, responsibilities } = organizationRepository.read()
  const organization = organizations.find(({ id, kind }) => id === reference.organizationId && kind === reference.kind)
  const responsible = responsibilities.find(({ organizationId }) => organizationId === reference.organizationId)
  return organization && responsible && userRepository.findById(responsible.userId)
    && resolveContexts(responsible.userId, readAccessAssignments()).some(({ kind }) => kind === 'client') ? organization : undefined
}

function invitationSummary(row: DriverInvitation) {
  return {
    id: row.id, status: row.status, sentAt: row.createdAt,
    decidedAt: row.status === 'pending' ? undefined : row.decision.at,
  }
}

function linkSummary(row: DriverLink) {
  return { id: row.id, status: row.status, acceptedAt: row.acceptedAt }
}

export function readOrganizationDrivers(userId: string, organization: OrganizationReference) {
  try {
    const scope = resolveOrganization(userId, organization)
    if (!scope) return { kind: 'denied' } as const
    const { invitations, links } = driverLinkRepository.read()
    const belongs = (row: { organization: OrganizationReference }) => providerKey(row.organization) === providerKey(organization)
    const ownLinks = links.filter(belongs)
    const professionals = ownLinks.length ? driverProfessionalRepository.read().store.professionals : []
    return {
      kind: 'ready', label: scope.label,
      invitations: invitations.filter(belongs).reverse().map((row) => ({ ...invitationSummary(row), email: row.email })),
      links: ownLinks.map((row) => {
        const professional = professionals.find(({ id, userId }) => id === row.professionalId && userId === row.acceptedBy)
        const owner = professional && userRepository.findById(professional.userId)
        return { ...linkSummary(row), name: owner?.fullName, professionalId: professional?.id }
      }),
    } as const
  } catch {
    return { kind: 'storageError' } as const
  }
}

export function readDriverInvitations(userId: string) {
  try {
    if (!authenticatedProfessionalOwner(userId)) return { kind: 'denied' } as const
    const { invitations, links } = driverLinkRepository.read()
    return {
      kind: 'ready',
      invitations: invitations.filter(({ recipientId }) => recipientId === userId).reverse().map((row) => ({
        ...invitationSummary(row), organizationName: row.organizationName, organizationKind: row.organization.kind,
        linkStatus: row.status === 'accepted' ? links.find(({ id }) => id === row.linkId)?.status : undefined,
      })),
    } as const
  } catch {
    return { kind: 'storageError' } as const
  }
}

export async function sendDriverInvitation(userId: string, organization: OrganizationReference, input: string) {
  const email = normalizeEmail(input)
  if (!isValidEmail(email)) return { kind: 'invalidEmail' } as const
  try {
    return await withAuthMutation(async () => {
      const scope = resolveOrganization(userId, organization)
      if (!scope) return { kind: 'denied' } as const
      const assignments = readAccessAssignments()
      const recipient = userRepository.findByEmail(email)
      if (!recipient || !resolveContexts(recipient.id, assignments).some(({ kind }) => kind === 'client')) {
        return { kind: 'processed' } as const
      }
      const store = driverLinkRepository.read()
      const target = organizationPair(organization, recipient.id)
      if (store.invitations.some((row) => row.status === 'pending' && organizationPair(row.organization, row.recipientId) === target)
        || store.links.some((row) => row.status === 'active' && organizationPair(row.organization, row.acceptedBy) === target)) {
        return { kind: 'processed' } as const
      }
      const invitation: DriverInvitation = {
        id: crypto.randomUUID(), organization: { kind: organization.kind, organizationId: organization.organizationId },
        organizationName: scope.label, recipientId: recipient.id, email, senderId: userId,
        status: 'pending', createdAt: new Date().toISOString(),
      }
      driverLinkRepository.write({ ...store, invitations: [...store.invitations, invitation] })
      return { kind: 'processed' } as const
    })
  } catch {
    return { kind: 'storageError' } as const
  }
}

type InvitationAction =
  | { kind: 'cancel'; organization: OrganizationReference }
  | { kind: 'accept' | 'decline' }

export async function decideDriverInvitation(userId: string, id: string, action: InvitationAction) {
  try {
    return await withAuthMutation(async () => {
      const allowed = action.kind === 'cancel'
        ? resolveOrganization(userId, action.organization) : authenticatedProfessionalOwner(userId)
      if (!allowed) return { kind: 'denied' } as const
      const store = driverLinkRepository.read()
      const invitation = store.invitations.find((row) => row.id === id)
      if (!invitation || (action.kind === 'cancel'
        ? providerKey(invitation.organization) !== providerKey(action.organization)
        : invitation.recipientId !== userId)) return { kind: 'denied' } as const
      if (invitation.status !== 'pending') return { kind: 'stale' } as const
      const decision = { userId, at: new Date(Math.max(Date.now(), Date.parse(invitation.createdAt))).toISOString() }
      let decided: DriverInvitation
      let links = store.links
      if (action.kind === 'accept') {
        const profile = driverProfessionalRepository.findByUserId(userId)
        if (!profile) return { kind: 'missingProfile' } as const
        if (!findOrganization(invitation.organization)) return { kind: 'missingOrganization' } as const
        const pair = organizationPair(invitation.organization, profile.id)
        if (links.some((row) => row.status === 'active' && organizationPair(row.organization, row.professionalId) === pair)) {
          return { kind: 'stale' } as const
        }
        const linkId = crypto.randomUUID()
        links = [...links, {
          id: linkId, organization: invitation.organization, professionalId: profile.id, invitationId: invitation.id,
          acceptedBy: userId, acceptedAt: decision.at, status: 'active',
        }]
        decided = { ...invitation, status: 'accepted', decision, linkId }
      } else {
        decided = { ...invitation, status: action.kind === 'cancel' ? 'canceled' : 'declined', decision }
      }
      driverLinkRepository.write({ invitations: store.invitations.map((row) => row.id === id ? decided : row), links })
      return { kind: 'saved' } as const
    })
  } catch {
    return { kind: 'storageError' } as const
  }
}

export function readActiveDriverLink(expectedUserId: string, expectedLinkId: string) {
  try {
    const session = sessionRepository.read()
    const user = session?.userId === expectedUserId && authenticatedProfessionalOwner(expectedUserId)
    if (!user) return { kind: 'denied' } as const
    const access = resolveAccountAccess(user.id, false, false)
    if (decideAccess({ user, access }, { capabilities: ['accessLinkedDriver'], scope: { linkId: expectedLinkId } }).kind !== 'allowed') {
      return { kind: 'denied' } as const
    }
    const link = driverLinkRepository.read().links.find(({ id }) => id === expectedLinkId)
    const professional = link && driverProfessionalRepository.findByUserId(user.id)
    if (!link || link.status !== 'active' || !professional || link.professionalId !== professional.id || link.acceptedBy !== user.id) {
      return { kind: 'missingLink' } as const
    }
    const organization = findOrganization(link.organization)
    if (!organization) return { kind: 'missingLink' } as const
    return {
      kind: 'ready', link: linkSummary(link), name: user.fullName,
      organizationName: organization.tradeName || organization.legalName, organizationKind: organization.kind, cnpj: organization.cnpj,
    } as const
  } catch {
    return { kind: 'storageError' } as const
  }
}
