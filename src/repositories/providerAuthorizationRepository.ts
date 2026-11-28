import { authorizationPair, compareAttempts, isAuthorizationAttempt } from '../domain/providerAuthorization'
import type { AuthorizationAttempt, AuthorizationDecision } from '../domain/providerAuthorization'
import { providerKey } from '../domain/providerReference'
import type { ProviderReference } from '../domain/providerReference'
import type { FreightModality } from '../domain/autonomousProvider'

export const providerAuthorizationStorageKey = 'muv.providerAuthorizations.v1'

function validate(rows: unknown): AuthorizationAttempt[] {
  if (!Array.isArray(rows) || !rows.every(isAuthorizationAttempt)
    || new Set(rows.map((row) => row.id)).size !== rows.length) throw new Error('Tentativas de autorização inválidas.')

  const lastByPair = new Map<string, AuthorizationAttempt>()
  for (const row of [...rows].sort((a, b) => a.sequence - b.sequence)) {
    const key = authorizationPair(row.provider, row.modality)
    const previous = lastByPair.get(key)
    if (row.sequence !== (previous?.sequence ?? 0) + 1
      || (previous && (previous.decision?.status !== 'REJECTED' || previous.decision.decidedAt > row.requestedAt))) {
      throw new Error('Histórico de autorizações inconsistente.')
    }
    lastByPair.set(key, row)
  }
  return rows
}

function read() {
  const raw = localStorage.getItem(providerAuthorizationStorageKey)
  return raw === null ? [] : validate(JSON.parse(raw)).sort(compareAttempts)
}

function write(rows: AuthorizationAttempt[]) {
  localStorage.setItem(providerAuthorizationStorageKey, JSON.stringify(validate(rows)))
}

export const providerAuthorizationRepository = {
  read,
  find(id: string) {
    return read().find((row) => row.id === id)
  },
  forProvider(provider: ProviderReference, modality?: FreightModality) {
    const key = providerKey(provider)
    return read().filter((row) => providerKey(row.provider) === key && (!modality || row.modality === modality))
  },
  create(attempt: AuthorizationAttempt) {
    if (attempt.decision !== null) throw new Error('Uma nova tentativa deve estar pendente.')
    write([...read(), attempt])
  },
  decide(id: string, decision: AuthorizationDecision) {
    const rows = read()
    const index = rows.findIndex((row) => row.id === id)
    if (index < 0 || rows[index].decision !== null) return false
    rows[index] = { ...rows[index], decision }
    write(rows)
    return true
  },
}
