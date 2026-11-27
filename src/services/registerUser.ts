import {
  digitsOnly,
  isInitialPurpose,
  normalizeEmail,
  validateRegistrationChoices,
  validateRegistrationDetails,
} from '../domain/userRegistration'
import type { RegistrationErrors, RegistrationInput, User } from '../domain/userRegistration'
import { userRepository } from '../repositories/userRepository'
import { deriveCredential } from './passwordCredential'

type RegistrationResult =
  | { kind: 'registered'; userId: string }
  | { kind: 'invalid'; errors: RegistrationErrors }
  | { kind: 'storageError' }
  | { kind: 'cryptoError' }

function duplicateErrors(cpf: boolean, email: boolean): RegistrationErrors {
  return {
    ...(cpf && { cpf: 'Já existe uma conta com este CPF.' }),
    ...(email && { email: 'Já existe uma conta com este e-mail.' }),
  }
}

export async function registerUser(input: RegistrationInput): Promise<RegistrationResult> {
  const errors = { ...validateRegistrationDetails(input), ...validateRegistrationChoices(input) }
  const { initialPurpose } = input
  if (Object.keys(errors).length || !isInitialPurpose(initialPurpose)) return { kind: 'invalid', errors }

  const cpf = digitsOnly(input.cpf)
  const email = normalizeEmail(input.email)
  try {
    const duplicates = duplicateErrors(Boolean(userRepository.findByCpf(cpf)), Boolean(userRepository.findByEmail(email)))
    if (Object.keys(duplicates).length) return { kind: 'invalid', errors: duplicates }
  } catch {
    return { kind: 'storageError' }
  }

  let id: string
  let credential: User['credential']
  try {
    id = crypto.randomUUID()
    credential = await deriveCredential(input.password)
  } catch {
    return { kind: 'cryptoError' }
  }

  const timestamp = new Date().toISOString()
  try {
    const result = await userRepository.create({
      id,
      fullName: input.fullName.trim(),
      cpf,
      phone: digitsOnly(input.phone),
      email,
      credential,
      initialPurpose,
      termsAndPrivacyAcceptedAt: timestamp,
      createdAt: timestamp,
      updatedAt: timestamp,
    })
    if (result.kind === 'duplicate') {
      return { kind: 'invalid', errors: duplicateErrors(result.fields.cpf, result.fields.email) }
    }
    return { kind: 'registered', userId: id }
  } catch {
    return { kind: 'storageError' }
  }
}
