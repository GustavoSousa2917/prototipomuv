import type { FreightModality } from '../domain/autonomousProvider'
import type { ProviderReference } from '../domain/providerReference'
import { providerAuthorizationRepository } from '../repositories/providerAuthorizationRepository'

export const pendingIntentMessage = 'Mantenha a intenção da modalidade com solicitação de autorização pendente.'

export function removesPendingModality(
  provider: ProviderReference, previous: FreightModality[], next: FreightModality[],
) {
  const removed = previous.filter((modality) => !next.includes(modality))
  return removed.length > 0 && providerAuthorizationRepository.forProvider(provider)
    .some((attempt) => attempt.decision === null && removed.includes(attempt.modality))
}
