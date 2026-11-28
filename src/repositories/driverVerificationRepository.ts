import type { DriverLink } from '../domain/driverLink'
import { isDriverVerificationCollection } from '../domain/driverVerification'
import type { DriverVerification } from '../domain/driverVerification'

export const driverVerificationStorageKey = 'muv.driverVerifications.v1'

function validate(value: unknown, links: readonly DriverLink[]) {
  if (!isDriverVerificationCollection(value, links)) throw new Error('Histórico de verificações inconsistente.')
  return value
}

export const driverVerificationRepository = {
  read(links: readonly DriverLink[]) {
    return validate(JSON.parse(localStorage.getItem(driverVerificationStorageKey) ?? '[]'), links)
  },
  write(decisions: DriverVerification[], links: readonly DriverLink[]) {
    localStorage.setItem(driverVerificationStorageKey, JSON.stringify(validate(decisions, links)))
  },
}
