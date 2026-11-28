import { isDriverLinkStore } from '../domain/driverLink'
import type { DriverLinkStore } from '../domain/driverLink'

export const driverLinkStorageKey = 'muv.driverLinks.v1'

function validate(value: unknown): DriverLinkStore {
  if (!isDriverLinkStore(value)) throw new Error('Registros de convites e vínculos inconsistentes.')
  return value
}

export const driverLinkRepository = {
  read() {
    return validate(JSON.parse(localStorage.getItem(driverLinkStorageKey) ?? '{"invitations":[],"links":[]}'))
  },
  // As operações chamadoras releem e gravam a coleção na mesma seção serializada.
  write(store: DriverLinkStore) {
    validate(store)
    localStorage.setItem(driverLinkStorageKey, JSON.stringify(store))
  },
}
