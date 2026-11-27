import {
  digitsOnly,
  isInitialPurpose,
  normalizeEmail,
  validateRegistrationChoices,
  validateRegistrationDetails,
} from '../domain/userRegistration'
import type { RegistrationErrors, RegistrationInput, User } from '../domain/userRegistration'
import { userRepository } from '../repositories/userRepository'

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

function toHex(buffer: Uint8Array) {
  return Array.from(buffer, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

async function deriveCredential(password: string): Promise<User['credential']> {
  const algorithm = 'PBKDF2'
  const hash = 'SHA-256'
  const iterations = 600_000
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), algorithm, false, ['deriveBits'])
  const bits = await crypto.subtle.deriveBits({ name: algorithm, hash, iterations, salt }, key, 256)
  return { algorithm, hash, iterations, salt: toHex(salt), derivedKey: toHex(new Uint8Array(bits)) }
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
