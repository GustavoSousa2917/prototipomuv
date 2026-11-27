import { digitsOnly } from './userRegistration'

export const cnhCategories = ['A', 'B', 'C', 'D', 'E', 'AB', 'AC', 'AD', 'AE'] as const
export const freightModalities = {
  PESSOA: 'Frete de pessoas',
  ENCOMENDA: 'Frete de encomendas',
} as const

export type FreightModality = keyof typeof freightModalities
type CnhCategory = typeof cnhCategories[number]

export type ProfessionalInput = {
  cnhNumber: string
  cnhCategory: string
  cnhExpiresAt: string
  hasEar: boolean | null
  intendedModalities: string[]
}

type ProfessionalDetails = Omit<ProfessionalInput, 'cnhCategory' | 'hasEar' | 'intendedModalities'> & {
  cnhCategory: CnhCategory
  hasEar: boolean
  intendedModalities: FreightModality[]
}

export type AutonomousProvider = ProfessionalDetails & {
  id: string
  userId: string
  createdAt: string
  updatedAt: string
}

type FieldErrors = Partial<Record<keyof ProfessionalInput, string>>

export function isValidCnh(value: string) {
  if (!/^\d{11}$/.test(value) || /^(\d)\1{10}$/.test(value)) return false

  // Referência técnica: validate-docbr, validate_docbr/CNH.py.
  const base = Array.from(value.slice(0, 9), Number)
  const first = base.reduce((sum, digit, index) => sum + digit * (9 - index), 0) % 11
  const second = base.reduce((sum, digit, index) => sum + digit * (index + 1), 0) % 11
  const adjustedSecond = (second + (first === 10 ? 9 : 0)) % 11
  return Number(value[9]) === first % 10 && Number(value[10]) === adjustedSecond % 10
}

function isCalendarDate(value: unknown): value is string {
  if (typeof value !== 'string' || !/^[1-9]\d{3}-\d{2}-\d{2}$/.test(value)) return false
  const date = new Date(value)
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value
}

function isCnhCategory(value: unknown): value is CnhCategory {
  return cnhCategories.some((category) => category === value)
}

function validModalities(value: unknown): value is FreightModality[] {
  return Array.isArray(value) && value.length > 0 && new Set(value).size === value.length
    && value.every((entry) => typeof entry === 'string' && Object.hasOwn(freightModalities, entry))
}

export function validateProfessionalInput(input: ProfessionalInput, now = new Date()) {
  const errors: FieldErrors = {}
  const { cnhCategory, cnhExpiresAt, hasEar, intendedModalities } = input
  const cnhNumber = typeof input.cnhNumber === 'string' ? digitsOnly(input.cnhNumber) : ''
  const today = [now.getFullYear(), now.getMonth() + 1, now.getDate()]
    .map((part) => String(part).padStart(2, '0')).join('-')

  if (!cnhNumber || !/^[\d\s.-]+$/.test(input.cnhNumber) || !isValidCnh(cnhNumber)) {
    errors.cnhNumber = 'Informe um número de registro da CNH válido.'
  }
  if (!isCalendarDate(cnhExpiresAt) || cnhExpiresAt < today) {
    errors.cnhExpiresAt = 'Informe uma data de validade válida e vigente.'
  }
  if (!isCnhCategory(cnhCategory)) errors.cnhCategory = 'Selecione uma categoria.'
  if (typeof hasEar !== 'boolean') errors.hasEar = 'Informe se a CNH possui EAR.'
  if (!validModalities(intendedModalities)) errors.intendedModalities = 'Selecione pelo menos uma modalidade válida.'

  if (Object.keys(errors).length || !isCnhCategory(cnhCategory) || typeof hasEar !== 'boolean' || !validModalities(intendedModalities)) {
    return { kind: 'invalid', errors } as const
  }

  const details: ProfessionalDetails = { cnhNumber, cnhCategory, cnhExpiresAt, hasEar, intendedModalities: [...intendedModalities] }
  return { kind: 'valid', details } as const
}

export function isAutonomousProvider(value: unknown): value is AutonomousProvider {
  if (!value || typeof value !== 'object') return false
  const row = value as Partial<Record<keyof AutonomousProvider, unknown>>
  return Object.keys(row).length === 9
    && typeof row.id === 'string' && row.id.trim().length > 0
    && typeof row.userId === 'string' && row.userId.trim().length > 0
    && typeof row.cnhNumber === 'string' && isValidCnh(row.cnhNumber)
    && isCnhCategory(row.cnhCategory) && isCalendarDate(row.cnhExpiresAt)
    && typeof row.hasEar === 'boolean' && validModalities(row.intendedModalities)
    && typeof row.createdAt === 'string' && Number.isFinite(Date.parse(row.createdAt))
    && typeof row.updatedAt === 'string' && Number.isFinite(Date.parse(row.updatedAt))
}
