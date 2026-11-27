export const recoveryLifetimeMs = 15 * 60 * 1000

export type RecoveryRequest = {
  id: string
  userId: string
  tokenDigest: string
  createdAt: number
  expiresAt: number
  status: 'active' | 'used' | 'invalidated'
}

export function isActiveRecovery(request: RecoveryRequest, now: number) {
  return request.status === 'active' && now >= request.createdAt && now < request.expiresAt
}
