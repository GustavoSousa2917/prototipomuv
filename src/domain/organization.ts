import { freightModalities } from './autonomousProvider'
import type { FreightModality } from './autonomousProvider'
import { digitsOnly, isValidEmail, isValidPhone, normalizeEmail } from './userRegistration'

export const organizationKinds = { company: 'Empresa', cooperative: 'Cooperativa' } as const
export type OrganizationKind = keyof typeof organizationKinds
export const brazilianStates = 'AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO'.split(' ')

export type OrganizationAddress = {
  cep: string
  street: string
  number: string
  complement: string
  neighborhood: string
  city: string
  state: string
}

export type OrganizationInput = {
  legalName: string
  tradeName: string
  phone: string
  email: string
  address: OrganizationAddress
  intendedModalities: string[]
}

export type OrganizationRegistration = OrganizationInput & {
  kind: OrganizationKind
  cnpj: string
  acceptsResponsibility: boolean
}

export type Organization = Omit<OrganizationInput, 'intendedModalities'> & {
  id: string
  kind: OrganizationKind
  cnpj: string
  intendedModalities: FreightModality[]
  createdAt: string
  updatedAt: string
}

export type OrganizationResponsibility = {
  id: string
  organizationId: string
  userId: string
  role: 'responsible'
  declaredAt: string
  createdAt: string
}

type ErrorField = Exclude<keyof OrganizationRegistration, 'address'> | keyof OrganizationAddress
export type OrganizationErrors = Partial<Record<ErrorField, string>>

export function isOrganizationKind(value: unknown): value is OrganizationKind {
  return value === 'company' || value === 'cooperative'
}

export function normalizeCnpj(value: string) {
  if (!/^[A-Za-z0-9./\- ]+$/.test(value)) return ''
  return value.replace(/[./\- ]/g, '').toUpperCase()
}

function checkDigit(base: string) {
  const sum = Array.from(base).reduce((total, char, index) =>
    total + (char.charCodeAt(0) - 48) * (2 + (base.length - 1 - index) % 8), 0)
  const remainder = sum % 11
  return remainder < 2 ? 0 : 11 - remainder
}

export function isValidCnpj(value: string) {
  if (!/^[A-Z0-9]{12}\d{2}$/.test(value) || /^(\d)\1{13}$/.test(value)) return false
  const base = value.slice(0, 12)
  const first = checkDigit(base)
  return value.slice(12) === `${first}${checkDigit(base + first)}`
}

const addressKeys = ['cep', 'street', 'number', 'complement', 'neighborhood', 'city', 'state'] as const
const inputKeys = ['legalName', 'tradeName', 'phone', 'email', 'address', 'intendedModalities'] as const

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}

function hasKeys(value: Record<string, unknown>, keys: readonly string[]) {
  return Object.keys(value).length === keys.length && keys.every((key) => Object.hasOwn(value, key))
}

function isAddress(value: unknown): value is OrganizationAddress {
  return isRecord(value) && hasKeys(value, addressKeys) && addressKeys.every((key) => typeof value[key] === 'string')
}

function isModality(value: unknown): value is FreightModality {
  return typeof value === 'string' && Object.hasOwn(freightModalities, value)
}

export function validateOrganizationInput(value: unknown, create: boolean) {
  const keys = create ? [...inputKeys, 'kind', 'cnpj', 'acceptsResponsibility'] : inputKeys
  if (!isRecord(value) || !hasKeys(value, keys) || !isAddress(value.address)
    || typeof value.legalName !== 'string' || typeof value.tradeName !== 'string'
    || typeof value.phone !== 'string' || typeof value.email !== 'string' || !Array.isArray(value.intendedModalities)) {
    return { kind: 'invalidInput' } as const
  }

  const errors: OrganizationErrors = {}
  const { address: rawAddress } = value
  const address = {
    cep: digitsOnly(rawAddress.cep),
    street: rawAddress.street.trim(),
    number: rawAddress.number.trim(),
    complement: rawAddress.complement.trim(),
    neighborhood: rawAddress.neighborhood.trim(),
    city: rawAddress.city.trim(),
    state: rawAddress.state.trim().toUpperCase(),
  }
  const legalName = value.legalName.trim()
  const tradeName = value.tradeName.trim()
  const phone = digitsOnly(value.phone)
  const email = normalizeEmail(value.email)
  const intendedModalities = value.intendedModalities.filter(isModality)
  const cnpj = typeof value.cnpj === 'string' ? normalizeCnpj(value.cnpj) : ''

  if (!legalName) errors.legalName = 'Informe a razão social.'
  if (!/^[\d()\s-]+$/.test(value.phone.trim()) || !isValidPhone(phone)) errors.phone = 'Informe um telefone brasileiro válido com DDD.'
  if (!isValidEmail(email)) errors.email = 'Informe um e-mail comercial válido.'
  if (!/^\d{5}-?\d{3}$/.test(rawAddress.cep.trim())) errors.cep = 'Informe um CEP com oito dígitos.'
  for (const [key, label] of [['street', 'logradouro'], ['number', 'número'], ['neighborhood', 'bairro'], ['city', 'município']] as const) {
    if (!address[key]) errors[key] = `Informe o campo ${label}.`
  }
  if (!brazilianStates.includes(address.state)) errors.state = 'Selecione uma UF brasileira.'
  if (!intendedModalities.length || intendedModalities.length !== value.intendedModalities.length
    || new Set(intendedModalities).size !== intendedModalities.length) errors.intendedModalities = 'Selecione uma ou ambas as modalidades.'
  if (create) {
    if (!isOrganizationKind(value.kind)) errors.kind = 'Selecione o tipo organizacional.'
    if (!isValidCnpj(cnpj)) errors.cnpj = 'Informe um CNPJ válido.'
    if (value.acceptsResponsibility !== true) errors.acceptsResponsibility = 'Confirme a declaração de responsabilidade.'
  }

  if (Object.keys(errors).length) return { kind: 'invalid', errors } as const
  return {
    kind: 'valid',
    details: { legalName, tradeName, phone, email, address, intendedModalities },
    identity: create && isOrganizationKind(value.kind) ? { kind: value.kind, cnpj } : null,
  } as const
}

function isIdentifier(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0 && value.trim() === value
}

function isTimestamp(value: unknown): value is string {
  return typeof value === 'string' && Number.isFinite(Date.parse(value)) && new Date(value).toISOString() === value
}

export function isOrganization(value: unknown): value is Organization {
  if (!isRecord(value) || !hasKeys(value, [...inputKeys, 'id', 'kind', 'cnpj', 'createdAt', 'updatedAt'])
    || !isIdentifier(value.id) || !isOrganizationKind(value.kind)
    || typeof value.cnpj !== 'string' || !isValidCnpj(value.cnpj)
    || !isTimestamp(value.createdAt) || !isTimestamp(value.updatedAt) || value.updatedAt < value.createdAt) return false
  const { legalName, tradeName, phone, email, address, intendedModalities } = value
  const validation = validateOrganizationInput({ legalName, tradeName, phone, email, address, intendedModalities }, false)
  return validation.kind === 'valid' && legalName === validation.details.legalName
    && tradeName === validation.details.tradeName && phone === validation.details.phone && email === validation.details.email
    && isAddress(address) && addressKeys.every((key) => address[key] === validation.details.address[key])
}

export function isOrganizationResponsibility(value: unknown): value is OrganizationResponsibility {
  return isRecord(value) && hasKeys(value, ['id', 'organizationId', 'userId', 'role', 'declaredAt', 'createdAt'])
    && isIdentifier(value.id) && isIdentifier(value.organizationId) && isIdentifier(value.userId)
    && value.role === 'responsible' && isTimestamp(value.declaredAt) && isTimestamp(value.createdAt)
}
