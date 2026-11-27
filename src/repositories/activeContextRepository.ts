const storageKey = 'muv.activeContext.v1'

type ActiveContextSelection = { userId: string; contextKey: string }

export const activeContextRepository = {
  read(): ActiveContextSelection | null {
    const raw = sessionStorage.getItem(storageKey)
    if (!raw) return null
    const value: unknown = JSON.parse(raw)
    if (typeof value !== 'object' || value === null || Array.isArray(value)
      || !('userId' in value) || typeof value.userId !== 'string'
      || !('contextKey' in value) || typeof value.contextKey !== 'string') return null
    return { userId: value.userId, contextKey: value.contextKey }
  },
  save(selection: ActiveContextSelection) {
    sessionStorage.setItem(storageKey, JSON.stringify(selection))
  },
  remove() {
    sessionStorage.removeItem(storageKey)
  },
}
