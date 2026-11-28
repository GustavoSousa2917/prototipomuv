import type { FreightModality } from './autonomousProvider'
import { isProviderReference, providerKey } from './providerReference'
import type { ProviderReference } from './providerReference'
import { isFreightModality } from './serviceRegion'

export const authorizationStatuses = { PENDING: 'Pendente', APPROVED: 'Aprovada', REJECTED: 'Rejeitada' } as const
export type AuthorizationStatus = keyof typeof authorizationStatuses

export const providerTypes = { autonomous: 'Autônomo', company: 'Empresa', cooperative: 'Cooperativa' } as const
export const authorizationModalities: readonly FreightModality[] = ['PESSOA', 'ENCOMENDA']
export const autonomousFields = ['Nome', 'CPF', 'Telefone', 'E-mail', 'CNH', 'Categoria', 'Validade da CNH', 'EAR declarado'] as const
export const organizationFields = ['Razão social', 'Nome fantasia', 'CNPJ', 'Telefone comercial', 'E-mail comercial',
  'CEP', 'Logradouro', 'Número', 'Complemento', 'Bairro', 'Município cadastral', 'UF cadastral', 'Responsável'] as const

export type Submission = {
  name: string
  fields: Record<string, string>
  intended: boolean
  regions: { code: string; name: string; uf: string }[]
  catalogEdition: string
}

type Actor = { id: string; name: string }
type Decision = { administrator: Actor; decidedAt: string }
export type AuthorizationDecision =
  | (Decision & { status: 'APPROVED'; reviewedSubmission: Submission | null })
  | (Decision & { status: 'REJECTED'; reason: string })

export type AuthorizationAttempt = {
  id: string
  provider: ProviderReference
  modality: FreightModality
  requester: Actor
  requestedAt: string
  sequence: number
  submission: Submission
  decision: AuthorizationDecision | null
}

export function normalizeReason(value: string) {
  return value.trim().replace(/\s+/g, ' ')
}

export function authorizationStatus(attempt?: AuthorizationAttempt): AuthorizationStatus | 'NOT_REQUESTED' {
  if (!attempt) return 'NOT_REQUESTED'
  return attempt.decision?.status ?? 'PENDING'
}

export function authorizationPair(provider: ProviderReference, modality: FreightModality) {
  return JSON.stringify([providerKey(provider), modality])
}

export function compareAttempts(a: AuthorizationAttempt, b: AuthorizationAttempt) {
  return b.requestedAt.localeCompare(a.requestedAt) || b.sequence - a.sequence || a.id.localeCompare(b.id)
}

function record(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}

function nonEmpty(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function timestamp(value: unknown): value is string {
  return typeof value === 'string' && Number.isFinite(Date.parse(value)) && new Date(value).toISOString() === value
}

function actor(value: unknown): value is Actor {
  return record(value) && Object.keys(value).length === 2 && nonEmpty(value.id) && nonEmpty(value.name)
}

function region(value: unknown): value is Submission['regions'][number] {
  return record(value) && Object.keys(value).length === 3 && typeof value.code === 'string'
    && /^\d{7}$/.test(value.code) && nonEmpty(value.name) && typeof value.uf === 'string' && /^[A-Z]{2}$/.test(value.uf)
}

function submission(value: unknown, kind: ProviderReference['kind']): value is Submission {
  if (!record(value) || Object.keys(value).length !== 5 || !nonEmpty(value.name)
    || !nonEmpty(value.catalogEdition) || value.intended !== true || !record(value.fields)
    || !Array.isArray(value.regions) || !value.regions.length || !value.regions.every(region)
    || new Set(value.regions.map(({ code }) => code)).size !== value.regions.length) return false
  const fields = value.fields
  const keys = kind === 'autonomous' ? autonomousFields : organizationFields
  return Object.keys(fields).length === keys.length && keys.every((key) => typeof fields[key] === 'string'
    && (key === 'Complemento' || key === 'Nome fantasia' || nonEmpty(fields[key])))
}

export function isAuthorizationAttempt(value: unknown): value is AuthorizationAttempt {
  if (!record(value) || Object.keys(value).length !== 8 || !nonEmpty(value.id) || !isProviderReference(value.provider)
    || !isFreightModality(value.modality) || !actor(value.requester) || !timestamp(value.requestedAt)
    || typeof value.sequence !== 'number' || !Number.isSafeInteger(value.sequence) || value.sequence < 1
    || !submission(value.submission, value.provider.kind)) return false
  const decision = value.decision
  if (decision === null) return true
  if (!record(decision) || Object.keys(decision).length !== 4 || !actor(decision.administrator)
    || !timestamp(decision.decidedAt) || decision.decidedAt < value.requestedAt) return false
  if (decision.status === 'REJECTED') return nonEmpty(decision.reason) && decision.reason === normalizeReason(decision.reason)
  return decision.status === 'APPROVED'
    && (decision.reviewedSubmission === null || submission(decision.reviewedSubmission, value.provider.kind))
}

function normalize(value: string) {
  return value.normalize('NFC').trim().replace(/\s+/g, ' ')
}

function reviewFields(submission: Submission) {
  const regions = [...submission.regions].sort((a, b) => a.code.localeCompare(b.code))
  return {
    ...submission.fields,
    'Identificação apresentada': submission.name,
    'Intenção da modalidade': submission.intended ? 'Sim' : 'Não',
    'Regiões de atendimento': regions.map(({ code, name, uf }) => `${name} · ${uf} (${code})`).join(', ') || 'Sem municípios',
    'Edição do catálogo': submission.catalogEdition,
  } as Record<string, string>
}

export function compareSubmissions(submitted: Submission, current: Submission) {
  const previous = reviewFields(submitted)
  const actual = reviewFields(current)
  return Object.keys(previous)
    .filter((field) => normalize(previous[field]) !== normalize(actual[field]))
    .map((field) => ({ field, submitted: previous[field], current: actual[field] }))
}

export function submissionReviewKey(submission: Submission) {
  return JSON.stringify(Object.entries(reviewFields(submission)).sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => [key, normalize(value)]))
}
