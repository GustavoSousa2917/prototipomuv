import { isProviderReference, providerKey } from './providerReference'
import type { ProviderReference } from './providerReference'
import { isValidEmail, normalizeEmail } from './userRegistration'

export type OrganizationReference = Exclude<ProviderReference, { kind: 'autonomous' }>
type Decision = { userId: string; at: string }

export type DriverInvitation = {
  id: string
  organization: OrganizationReference
  organizationName: string
  recipientId: string
  email: string
  senderId: string
  createdAt: string
} & (
  | { status: 'pending' }
  | { status: 'declined' | 'canceled'; decision: Decision }
  | { status: 'accepted'; decision: Decision; linkId: string }
)

export type LinkEnding = {
  at: string
  authorId: string
  authorName: string
  source: 'driver' | 'organization'
  reason: string
  driverName: string
  organizationName: string
}

export function normalizeDecisionReason(value: string) {
  return value.trim().replace(/\s+/g, ' ')
}

export type DriverLink = {
  id: string
  organization: OrganizationReference
  professionalId: string
  invitationId: string
  acceptedBy: string
  acceptedAt: string
} & ({ status: 'active' } | { status: 'ended'; ending: LinkEnding })

export type DriverLinkStore = { invitations: DriverInvitation[]; links: DriverLink[] }

export function organizationPair(organization: OrganizationReference, id: string) {
  return JSON.stringify([providerKey(organization), id])
}

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function identifier(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0 && value.trim() === value
}

export function date(value: unknown): value is string {
  if (typeof value !== 'string') return false
  const instant = new Date(value)
  return Number.isFinite(instant.getTime()) && instant.toISOString() === value
}

function organization(value: unknown): value is OrganizationReference {
  return isProviderReference(value) && value.kind !== 'autonomous'
}

function invitation(value: unknown): value is DriverInvitation {
  if (!record(value) || !identifier(value.id) || !organization(value.organization)
    || !identifier(value.organizationName) || !identifier(value.recipientId) || !identifier(value.senderId)
    || typeof value.email !== 'string' || normalizeEmail(value.email) !== value.email
    || !isValidEmail(value.email) || !date(value.createdAt)) return false
  const fields = Object.keys(value).length
  if (value.status === 'pending') return fields === 8
  if (!record(value.decision) || Object.keys(value.decision).length !== 2
    || !identifier(value.decision.userId) || !date(value.decision.at) || value.decision.at < value.createdAt) return false
  if (value.status === 'canceled') return fields === 9
  if (value.decision.userId !== value.recipientId) return false
  return (value.status === 'accepted' && fields === 10 && identifier(value.linkId))
    || (value.status === 'declined' && fields === 9)
}

function link(value: unknown): value is DriverLink {
  if (!record(value) || !identifier(value.id) || !organization(value.organization)
    || !identifier(value.professionalId) || !identifier(value.invitationId)
    || !identifier(value.acceptedBy) || !date(value.acceptedAt)) return false
  if (value.status === 'active') return Object.keys(value).length === 7
  const ending = value.ending
  return value.status === 'ended' && Object.keys(value).length === 8 && record(ending)
    && Object.keys(ending).length === 7 && date(ending.at) && ending.at >= value.acceptedAt
    && identifier(ending.authorId) && identifier(ending.authorName)
    && (ending.source === 'organization' || (ending.source === 'driver' && ending.authorId === value.acceptedBy))
    && identifier(ending.reason) && normalizeDecisionReason(ending.reason) === ending.reason
    && identifier(ending.driverName) && identifier(ending.organizationName)
}

function unique(values: string[]) {
  return new Set(values).size === values.length
}

export function isDriverLinkStore(value: unknown): value is DriverLinkStore {
  if (!record(value) || Object.keys(value).length !== 2 || !Array.isArray(value.invitations)
    || !value.invitations.every(invitation) || !Array.isArray(value.links) || !value.links.every(link)) return false
  const { invitations, links } = value
  const byInvitation = new Map(invitations.map((row) => [row.id, row]))
  const byLink = new Map(links.map((row) => [row.id, row]))
  const active = links.filter(({ status }) => status === 'active')
  const pending = invitations.filter(({ status }) => status === 'pending')
  const activeAccounts = new Set(active.map((row) => organizationPair(row.organization, row.acceptedBy)))
  const accountByProfessional = new Map(links.map((row) => [row.professionalId, row.acceptedBy]))
  const professionalByAccount = new Map(links.map((row) => [row.acceptedBy, row.professionalId]))
  return byInvitation.size === invitations.length && byLink.size === links.length
    && unique(pending.map((row) => organizationPair(row.organization, row.recipientId)))
    && unique(active.map((row) => organizationPair(row.organization, row.professionalId)))
    && activeAccounts.size === active.length
    && pending.every((row) => !activeAccounts.has(organizationPair(row.organization, row.recipientId)))
    && invitations.every((row) => row.status !== 'accepted' || byLink.get(row.linkId)?.invitationId === row.id)
    && links.every((row) => {
      const origin = byInvitation.get(row.invitationId)
      return origin?.status === 'accepted' && origin.linkId === row.id
        && providerKey(origin.organization) === providerKey(row.organization)
        && origin.recipientId === row.acceptedBy && origin.decision.at === row.acceptedAt
        && accountByProfessional.get(row.professionalId) === row.acceptedBy
        && professionalByAccount.get(row.acceptedBy) === row.professionalId
    })
}
