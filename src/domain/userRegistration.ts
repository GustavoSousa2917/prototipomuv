export const initialPurposes = ['requestFreight', 'offerFreight', 'linkedDriver'] as const

type InitialPurpose = typeof initialPurposes[number]

export type RegistrationDetails = {
  fullName: string
  cpf: string
  phone: string
  email: string
  password: string
  passwordConfirmation: string
}

export type RegistrationInput = RegistrationDetails & {
  initialPurpose: string
  acceptedTerms: boolean
}

export type RegistrationErrors = Partial<Record<keyof RegistrationInput, string>>

type PasswordCredential = {
  algorithm: 'PBKDF2'
  hash: 'SHA-256'
  iterations: number
  salt: string
  derivedKey: string
}

export type User = {
  id: string
  fullName: string
  cpf: string
  phone: string
  email: string
  credential: PasswordCredential
  initialPurpose: InitialPurpose
  termsAndPrivacyAcceptedAt: string
  createdAt: string
  updatedAt: string
}

export function digitsOnly(value: string) {
  return value.replace(/\D/g, '')
}

export function normalizeEmail(value: string) {
  return value.trim().toLowerCase()
}

export function isInitialPurpose(value: unknown): value is InitialPurpose {
  return initialPurposes.some((purpose) => purpose === value)
}

export function isValidCpf(cpf: string) {
  if (!/^\d{11}$/.test(cpf) || /^(\d)\1{10}$/.test(cpf)) return false

  for (const length of [9, 10]) {
    const sum = [...cpf.slice(0, length)].reduce(
      (total, digit, index) => total + Number(digit) * (length + 1 - index),
      0,
    )
    if (((sum * 10) % 11) % 10 !== Number(cpf[length])) return false
  }
  return true
}

export function isValidPhone(phone: string) {
  return /^(?:1[1-9]|2[12478]|3[1-578]|4[1-9]|5[1345]|6[1-9]|7[134579]|8[1-9]|9[1-9])(?:[2-5]\d{7}|9\d{8})$/.test(phone)
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/.test(email)
}

export function validateRegistrationDetails(details: RegistrationDetails): RegistrationErrors {
  const errors: RegistrationErrors = {}
  const cpf = details.cpf.trim()
  const phone = details.phone.trim()

  if (!details.fullName.trim()) errors.fullName = 'Informe o nome completo.'
  if (!/^[\d.\-\s]+$/.test(cpf) || !isValidCpf(digitsOnly(cpf))) {
    errors.cpf = 'Informe um CPF válido com 11 dígitos.'
  }
  if (!/^[\d()\-\s]+$/.test(phone) || !isValidPhone(digitsOnly(phone))) {
    errors.phone = 'Informe um telefone brasileiro válido com DDD.'
  }
  if (!isValidEmail(normalizeEmail(details.email))) {
    errors.email = 'Informe um e-mail válido.'
  }
  return { ...errors, ...validatePasswordFields(details.password, details.passwordConfirmation) }
}

export function validatePasswordFields(password: string, passwordConfirmation: string) {
  const errors: Pick<RegistrationErrors, 'password' | 'passwordConfirmation'> = {}
  if (Array.from(password).length < 8 || !/\p{L}/u.test(password) || !/[0-9]/.test(password)) {
    errors.password = 'Use pelo menos oito caracteres, incluindo uma letra e um número.'
  }
  if (!passwordConfirmation || passwordConfirmation !== password) {
    errors.passwordConfirmation = 'Repita a senha informada.'
  }
  return errors
}

export function validateRegistrationChoices(input: Pick<RegistrationInput, 'initialPurpose' | 'acceptedTerms'>): RegistrationErrors {
  const errors: RegistrationErrors = {}
  if (!isInitialPurpose(input.initialPurpose)) errors.initialPurpose = 'Selecione uma finalidade inicial.'
  if (input.acceptedTerms !== true) errors.acceptedTerms = 'Aceite os termos de uso e a política de privacidade.'
  return errors
}
