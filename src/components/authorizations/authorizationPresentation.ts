import { useReducer, useSyncExternalStore } from 'react'
import { serviceRegionStorageKey } from '../../constants/storageKeys'
import { providerAuthorizationStorageKey } from '../../repositories/providerAuthorizationRepository'

const dateFormat = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' })

function subscribe(onChange: () => void) {
  function synchronize(event: StorageEvent) {
    if (event.storageArea === localStorage && (event.key === null
      || event.key === providerAuthorizationStorageKey || event.key === serviceRegionStorageKey)) onChange()
  }
  window.addEventListener('storage', synchronize)
  return () => window.removeEventListener('storage', synchronize)
}

function snapshot(key: string) {
  try {
    return localStorage.getItem(key)
  } catch {
    return undefined
  }
}

function authorizationSnapshot() {
  return snapshot(providerAuthorizationStorageKey)
}

function regionSnapshot() {
  return snapshot(serviceRegionStorageKey)
}

export function useAuthorizationRefresh() {
  useSyncExternalStore(subscribe, authorizationSnapshot)
  useSyncExternalStore(subscribe, regionSnapshot)
  const [, refresh] = useReducer((revision: number) => revision + 1, 0)
  return refresh
}

export function authorizationDate(value: string) {
  return dateFormat.format(new Date(value))
}
