import { isActiveRecovery, recoveryLifetimeMs } from '../domain/passwordRecovery'
import type { RecoveryRequest } from '../domain/passwordRecovery'

const storageKey = 'muv.passwordRecovery.v1'

function isRecoveryRequest(value: unknown): value is RecoveryRequest {
  if (typeof value !== 'object' || value === null) return false
  const record = value as Record<string, unknown>
  return typeof record.id === 'string' && record.id.length > 0
    && typeof record.userId === 'string' && record.userId.length > 0
    && typeof record.tokenDigest === 'string' && /^[a-f0-9]{64}$/.test(record.tokenDigest)
    && typeof record.createdAt === 'number' && Number.isSafeInteger(record.createdAt)
    && typeof record.expiresAt === 'number' && record.expiresAt === record.createdAt + recoveryLifetimeMs
    && ['active', 'used', 'invalidated'].some((status) => status === record.status)
}

function readRequests(): RecoveryRequest[] {
  const raw = localStorage.getItem(storageKey)
  if (raw === null) return []
  const stored: unknown = JSON.parse(raw)
  if (!Array.isArray(stored) || !stored.every(isRecoveryRequest)
    || new Set(stored.map((request) => request.id)).size !== stored.length
    || new Set(stored.map((request) => request.tokenDigest)).size !== stored.length) {
    throw new Error('Registros de recuperação inválidos.')
  }
  return stored
}

function invalidateRequests(requests: RecoveryRequest[], userId: string, usedId?: string) {
  return requests.map((request) => {
    if (request.userId !== userId || request.status !== 'active') return request
    return { ...request, status: request.id === usedId ? 'used' : 'invalidated' }
  })
}

export const passwordRecoveryRepository = {
  findByDigest(digest: string) {
    return readRequests().find((request) => request.tokenDigest === digest)
  },
  create(request: RecoveryRequest) {
    const requests = invalidateRequests(readRequests(), request.userId)
    localStorage.setItem(storageKey, JSON.stringify([...requests, request]))
  },
  consume(request: RecoveryRequest) {
    const requests = readRequests()
    const current = requests.find((item) => item.id === request.id && item.tokenDigest === request.tokenDigest)
    if (!current || !isActiveRecovery(current, Date.now())) return false
    localStorage.setItem(storageKey, JSON.stringify(invalidateRequests(requests, current.userId, current.id)))
    return true
  },
}
