import { findMunicipality, municipalityCatalogEdition } from '../data/municipalities'
import { isCnhCurrent } from '../domain/autonomousProvider'
import type { FreightModality } from '../domain/autonomousProvider'
import { authorizationModalities, authorizationStatus, compareSubmissions, normalizeReason, submissionReviewKey } from '../domain/providerAuthorization'
import type { AuthorizationDecision, Submission } from '../domain/providerAuthorization'
import { providerKey } from '../domain/providerReference'
import type { ProviderReference } from '../domain/providerReference'
import { isFreightModality } from '../domain/serviceRegion'
import { autonomousProviderRepository } from '../repositories/autonomousProviderRepository'
import { organizationRepository } from '../repositories/organizationRepository'
import { providerAuthorizationRepository } from '../repositories/providerAuthorizationRepository'
import { serviceRegionRepository } from '../repositories/serviceRegionRepository'
import { sessionRepository } from '../repositories/sessionRepository'
import { userRepository } from '../repositories/userRepository'
import { activeAuthorizationAdministrator } from './authorizationAdministration'
import { withAuthMutation } from './authMutation'
import { resolveActiveProvider } from './providerAccess'
import type { ActiveProvider } from './providerAccess'

export const authorizationIssues = {
  missing: 'Cadastro do prestador ausente.',
  invalidRegistration: 'Cadastro do prestador inconsistente. Regularize os dados antes da aprovação.',
  readError: 'Não foi possível ler os dados atuais do prestador.',
  notIntended: 'A modalidade precisa estar na intenção cadastral vigente.',
  noRegions: 'Configure pelo menos um município para a modalidade.',
  expiredCnh: 'A CNH do prestador precisa estar vigente.',
} as const

type Issue = keyof typeof authorizationIssues

function currentRegistration(provider: ProviderReference, modality: FreightModality):
  | { kind: 'missing' | 'invalidRegistration' }
  | { kind: 'ready'; name: string; intended: boolean; expiresAt: string | null; fields: Record<string, string> } {
  if (provider.kind === 'autonomous') {
    const registration = autonomousProviderRepository.findById(provider.providerId)
    if (!registration) return { kind: 'missing' } as const
    const account = userRepository.findById(registration.userId)
    if (!account) return { kind: 'invalidRegistration' } as const
    return {
      kind: 'ready', name: account.fullName, intended: registration.intendedModalities.includes(modality),
      expiresAt: registration.cnhExpiresAt,
      fields: {
        Nome: account.fullName, CPF: account.cpf, Telefone: account.phone, 'E-mail': account.email,
        CNH: registration.cnhNumber, Categoria: registration.cnhCategory,
        'Validade da CNH': registration.cnhExpiresAt, 'EAR declarado': registration.hasEar ? 'Sim' : 'Não',
      } satisfies Record<string, string>,
    } as const
  }

  const { organizations, responsibilities } = organizationRepository.read()
  const organization = organizations.find(({ id }) => id === provider.organizationId)
  if (!organization) return { kind: 'missing' } as const
  const responsibility = responsibilities.find(({ organizationId }) => organizationId === organization.id)
  const responsible = responsibility && userRepository.findById(responsibility.userId)
  if (!responsible || organization.kind !== provider.kind) return { kind: 'invalidRegistration' } as const
  const { address } = organization
  return {
    kind: 'ready', name: organization.tradeName || organization.legalName,
    intended: organization.intendedModalities.includes(modality), expiresAt: null,
    fields: {
      'Razão social': organization.legalName, 'Nome fantasia': organization.tradeName, CNPJ: organization.cnpj,
      'Telefone comercial': organization.phone, 'E-mail comercial': organization.email, CEP: address.cep,
      Logradouro: address.street, Número: address.number, Complemento: address.complement, Bairro: address.neighborhood,
      'Município cadastral': address.city, 'UF cadastral': address.state, Responsável: responsible.fullName,
    } satisfies Record<string, string>,
  } as const
}

function currentData(provider: ProviderReference, modality: FreightModality): { submission: Submission | null; issues: Issue[] } {
  let registration: ReturnType<typeof currentRegistration>
  try {
    registration = currentRegistration(provider, modality)
  } catch (error) {
    const inconsistent = error instanceof SyntaxError || (error instanceof Error
      && /^(Cadastros profissionais inconsistentes|Registros organizacionais inválidos|Associações organizacionais inconsistentes|Registros de usuários inválidos)\.$/.test(error.message))
    return { submission: null, issues: [inconsistent ? 'invalidRegistration' : 'readError'] }
  }
  if (registration.kind !== 'ready') return { submission: null, issues: [registration.kind] }

  try {
    const regions = serviceRegionRepository.forProvider(provider, modality)
      .map(({ municipalityCode }) => findMunicipality(municipalityCode))
      .filter((municipality) => municipality !== undefined)
      .sort((a, b) => a.code.localeCompare(b.code))
    const issues: Issue[] = []
    if (!registration.intended) issues.push('notIntended')
    if (!regions.length) issues.push('noRegions')
    if (registration.expiresAt && !isCnhCurrent(registration.expiresAt)) issues.push('expiredCnh')
    return {
      issues, submission: {
        name: registration.name, fields: registration.fields, intended: registration.intended, regions,
        catalogEdition: municipalityCatalogEdition,
      },
    }
  } catch {
    return { submission: null, issues: ['readError'] }
  }
}

export const authorizationOperationMessages = {
  invalid: 'Informe uma modalidade válida.',
  stale: 'A conta ou o contexto mudou. Atualize a página antes de tentar novamente.',
  blocked: 'Os requisitos atuais precisam ser atendidos.',
  pending: 'A modalidade já possui solicitação pendente.',
  approved: 'A modalidade já está aprovada.',
  closed: 'A tentativa já foi decidida ou não está disponível.',
  reviewChanged: 'Os dados atuais mudaram. Revise os valores e confirme novamente.',
  reviewRequired: 'Confirme que leu as diferenças antes de aprovar.',
  invalidDecision: 'Informe uma decisão válida.',
  reasonRequired: 'Informe a justificativa da rejeição.',
  writeError: 'Não foi possível concluir a gravação. Confira os dados e tente novamente.',
} as const

export function readOwnAuthorizations() {
  try {
    const scope = resolveActiveProvider()
    if (scope.kind !== 'ready') return scope
    const history = providerAuthorizationRepository.forProvider(scope.provider)
    const modalities = authorizationModalities.map((modality) => ({
      modality, history: history.filter((row) => row.modality === modality),
      ...currentData(scope.provider, modality),
    }))
    return { kind: 'ready', scope, modalities } as const
  } catch {
    return { kind: 'readError' } as const
  }
}

type ProviderScope = Pick<ActiveProvider, 'provider' | 'userId'>

function atOrAfter(previous?: string) {
  const now = new Date().toISOString()
  return previous && previous > now ? previous : now
}

export async function requestAuthorization(expected: ProviderScope, modality: unknown) {
  if (!isFreightModality(modality)) return 'invalid'
  try {
    return await withAuthMutation(async () => {
      const scope = resolveActiveProvider()
      if (scope.kind !== 'ready' || scope.userId !== expected.userId
        || providerKey(scope.provider) !== providerKey(expected.provider)) return 'stale'
      const previous = providerAuthorizationRepository.forProvider(scope.provider, modality)[0]
      if (previous && !previous.decision) return 'pending'
      if (previous?.decision?.status === 'APPROVED') return 'approved'
      const { submission, issues } = currentData(scope.provider, modality)
      if (!submission || issues.length) return 'blocked'
      const account = userRepository.findById(scope.userId)
      const finalScope = resolveActiveProvider()
      if (!account || sessionRepository.read()?.userId !== scope.userId
        || finalScope.kind !== 'ready' || finalScope.userId !== scope.userId
        || providerKey(finalScope.provider) !== providerKey(scope.provider)) return 'stale'
      providerAuthorizationRepository.create({
        id: crypto.randomUUID(), provider: scope.provider, modality,
        requester: { id: account.id, name: account.fullName },
        requestedAt: atOrAfter(previous?.decision?.decidedAt), sequence: (previous?.sequence ?? 0) + 1,
        submission, decision: null,
      })
      return 'saved'
    })
  } catch {
    return 'writeError'
  }
}

export function readAuthorizationAttempt(id: string) {
  try {
    const admin = activeAuthorizationAdministrator()
    if (!admin) return { kind: 'denied' } as const
    const attempt = providerAuthorizationRepository.find(id)
    if (!attempt) return { kind: 'notFound' } as const
    const attempts = providerAuthorizationRepository.forProvider(attempt.provider)
    const { submission: current, issues } = currentData(attempt.provider, attempt.modality)
    const differences = current ? compareSubmissions(attempt.submission, current) : []
    return {
      kind: 'ready', administratorId: admin.id, attempt, current, issues, differences,
      reviewKey: current ? submissionReviewKey(current) : null,
      history: attempts.filter((row) => row.modality === attempt.modality),
      other: authorizationStatus(attempts.find((row) => row.modality !== attempt.modality)),
    } as const
  } catch {
    return { kind: 'readError' } as const
  }
}

type Analysis =
  | { action: 'approve'; reviewKey: string | null; acknowledged: boolean }
  | { action: 'reject'; reason: string }

export async function decideAuthorizationAttempt(id: string, expectedAdministrator: string, analysis: Analysis) {
  if (analysis.action !== 'approve' && analysis.action !== 'reject') return 'invalidDecision'
  try {
    return await withAuthMutation(async () => {
      const admin = activeAuthorizationAdministrator()
      if (!admin || admin.id !== expectedAdministrator) return 'stale'
      const attempt = providerAuthorizationRepository.find(id)
      if (!attempt || attempt.decision !== null) return 'closed'
      const base = { administrator: admin, decidedAt: atOrAfter(attempt.requestedAt) }
      let decision: AuthorizationDecision
      if (analysis.action === 'reject') {
        const reason = typeof analysis.reason === 'string' ? normalizeReason(analysis.reason) : ''
        if (!reason) return 'reasonRequired'
        decision = { ...base, status: 'REJECTED', reason }
      } else {
        const { submission, issues } = currentData(attempt.provider, attempt.modality)
        if (!submission || issues.length) return 'blocked'
        if (submissionReviewKey(submission) !== analysis.reviewKey) return 'reviewChanged'
        const hasDifferences = compareSubmissions(attempt.submission, submission).length > 0
        if (hasDifferences && analysis.acknowledged !== true) return 'reviewRequired'
        decision = { ...base, status: 'APPROVED', reviewedSubmission: hasDifferences ? submission : null }
      }

      if (activeAuthorizationAdministrator()?.id !== admin.id) return 'stale'
      return providerAuthorizationRepository.decide(id, decision) ? 'saved' : 'closed'
    })
  } catch {
    return 'writeError'
  }
}
