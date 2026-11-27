const storageKey = 'muv.session.v1'

type StoredSession = { userId: string }

function isStoredSession(value: unknown): value is StoredSession {
  return typeof value === 'object' && value !== null
    && 'userId' in value && typeof value.userId === 'string' && value.userId.trim().length > 0
    && Object.keys(value).length === 1
}

export const sessionRepository = {
  read(): StoredSession | null {
    const raw = localStorage.getItem(storageKey)
    if (raw === null) return null
    try {
      const value: unknown = JSON.parse(raw)
      return isStoredSession(value) ? value : null
    } catch {
      return null
    }
  },
  save(userId: string) {
    localStorage.setItem(storageKey, JSON.stringify({ userId }))
  },
  remove() {
    localStorage.removeItem(storageKey)
  },
}
