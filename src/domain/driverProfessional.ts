import { digitsOnly } from './userRegistration'

export const cnhCategories = ['A', 'B', 'C', 'D', 'E', 'AB', 'AC', 'AD', 'AE'] as const
type CnhCategory = typeof cnhCategories[number]

export type DriverProfessionalInput = {
  cnhNumber: string
  cnhCategory: string
  cnhExpiresAt: string
  hasEar: boolean | null
}

export type DriverProfessionalDetails = {
  cnhNumber: string
  cnhCategory: CnhCategory
  cnhExpiresAt: string
  hasEar: boolean
}

export type DriverProfessional = DriverProfessionalDetails & {
  id: string
  userId: string
  createdAt: string
  updatedAt: string
}

export type DriverProfessionalErrors = Partial<Record<keyof DriverProfessionalInput, string>>

export const emptyDriverProfessional: DriverProfessionalInput = {
  cnhNumber: '', cnhCategory: '', cnhExpiresAt: '', hasEar: null,
}

export function normalizeCnh(value: string) {
  return digitsOnly(value)
}

export function formatCnh(number: string) {
  return number.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1 $2 $3 $4')
}

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

export function isCnhCurrent(expiresAt: string, now = new Date()) {
  const today = [now.getFullYear(), now.getMonth() + 1, now.getDate()]
    .map((part) => String(part).padStart(2, '0')).join('-')
  return isCalendarDate(expiresAt) && expiresAt >= today
}

export function validateDriverProfessional(input: DriverProfessionalInput, now = new Date()) {
  const errors: DriverProfessionalErrors = {}
  const { cnhCategory, cnhExpiresAt, hasEar } = input
  const cnhNumber = typeof input.cnhNumber === 'string' ? normalizeCnh(input.cnhNumber) : ''

  if (!cnhNumber || !/^[\d\s.-]+$/.test(input.cnhNumber) || !isValidCnh(cnhNumber)) {
    errors.cnhNumber = 'Informe um número de registro da CNH válido.'
  }
  if (!isCnhCurrent(cnhExpiresAt, now)) errors.cnhExpiresAt = 'Informe uma data de validade válida e vigente.'
  if (!isCnhCategory(cnhCategory)) errors.cnhCategory = 'Selecione uma categoria.'
  if (typeof hasEar !== 'boolean') errors.hasEar = 'Informe se a CNH possui EAR.'

  if (Object.keys(errors).length || !isCnhCategory(cnhCategory) || typeof hasEar !== 'boolean') {
    return { kind: 'invalid', errors } as const
  }
  return { kind: 'valid', details: { cnhNumber, cnhCategory, cnhExpiresAt, hasEar } } as const
}

export function isProfessionalIdentity(row: Partial<DriverProfessional>) {
  return typeof row.id === 'string' && row.id.trim().length > 0
    && typeof row.userId === 'string' && row.userId.trim().length > 0
    && typeof row.createdAt === 'string' && Number.isFinite(Date.parse(row.createdAt))
    && typeof row.updatedAt === 'string' && Number.isFinite(Date.parse(row.updatedAt))
}

export function isProfessionalDetails(row: Partial<DriverProfessionalDetails>) {
  return typeof row.cnhNumber === 'string' && isValidCnh(row.cnhNumber)
    && isCnhCategory(row.cnhCategory) && isCalendarDate(row.cnhExpiresAt) && typeof row.hasEar === 'boolean'
}

export function isDriverProfessional(value: unknown): value is DriverProfessional {
  if (!value || typeof value !== 'object' || Array.isArray(value) || Object.keys(value).length !== 8) return false
  const row = value as Partial<DriverProfessional>
  return isProfessionalIdentity(row) && isProfessionalDetails(row)
}

export function driverDetails({ cnhNumber, cnhCategory, cnhExpiresAt, hasEar }: DriverProfessionalDetails): DriverProfessionalDetails {
  return { cnhNumber, cnhCategory, cnhExpiresAt, hasEar }
}

export function driverRevision(value?: DriverProfessional) {
  if (!value) return null
  return JSON.stringify([value.id, value.updatedAt, driverDetails(value)])
}
