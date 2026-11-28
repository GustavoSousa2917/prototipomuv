import { isProfessionalDetails, isProfessionalIdentity, validateDriverProfessional } from './driverProfessional'
import type { DriverProfessional, DriverProfessionalDetails, DriverProfessionalInput } from './driverProfessional'

export { cnhCategories, isCnhCurrent, isValidCnh } from './driverProfessional'

export const freightModalities = {
  PESSOA: 'Frete de pessoas',
  ENCOMENDA: 'Frete de encomendas',
} as const

export type FreightModality = keyof typeof freightModalities
export type ProfessionalInput = DriverProfessionalInput & { intendedModalities: string[] }

export type AutonomousRegistration = Pick<DriverProfessional, 'id' | 'userId' | 'createdAt' | 'updatedAt'> & {
  professionalId: string
  intendedModalities: FreightModality[]
}

export type AutonomousProvider = Omit<AutonomousRegistration, 'professionalId'> & DriverProfessionalDetails

function validModalities(value: unknown): value is FreightModality[] {
  return Array.isArray(value) && value.length > 0 && new Set(value).size === value.length
    && value.every((entry) => typeof entry === 'string' && Object.hasOwn(freightModalities, entry))
}

export function validateProfessionalInput(input: ProfessionalInput, now = new Date()) {
  const validation = validateDriverProfessional(input, now)
  if (!validModalities(input.intendedModalities)) {
    return { kind: 'invalid', errors: {
      ...(validation.kind === 'invalid' ? validation.errors : {}),
      intendedModalities: 'Selecione pelo menos uma modalidade válida.',
    } } as const
  }
  if (validation.kind === 'invalid') return validation

  const intendedModalities = [...input.intendedModalities]
  return { kind: 'valid', details: { ...validation.details, intendedModalities } } as const
}

export function isAutonomousProvider(value: unknown): value is AutonomousProvider {
  if (!value || typeof value !== 'object' || Array.isArray(value) || Object.keys(value).length !== 9) return false
  const row = value as Partial<AutonomousProvider>
  return isProfessionalIdentity(row) && isProfessionalDetails(row) && validModalities(row.intendedModalities)
}

export function isAutonomousRegistration(value: unknown): value is AutonomousRegistration {
  if (!value || typeof value !== 'object' || Array.isArray(value) || Object.keys(value).length !== 6) return false
  const row = value as Partial<AutonomousRegistration>
  return isProfessionalIdentity(row) && typeof row.professionalId === 'string' && !!row.professionalId.trim()
    && validModalities(row.intendedModalities)
}
