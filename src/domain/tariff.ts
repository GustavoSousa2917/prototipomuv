import { freightModalities } from './autonomousProvider'
import type { FreightModality } from './autonomousProvider'
import { isProviderReference, providerKey } from './providerReference'
import type { ProviderReference } from './providerReference'
import { vehicleTypes } from './vehicle'
import type { VehicleType } from './vehicle'

export type TariffCombination = { modality: FreightModality; vehicleType: VehicleType }
export type TariffAmounts = { minimumFareCents: number; ratePerKilometerCents: number }
export type TariffStatus = 'active' | 'inactive'
type Stamp = { at: string; userId: string }
type TariffEvent = Stamp & (
  { kind: 'created'; amounts: TariffAmounts }
  | { kind: 'amountsChanged'; from: TariffAmounts; to: TariffAmounts }
  | { kind: 'deactivated' | 'reactivated' }
)
export type Tariff = TariffCombination & TariffAmounts & {
  id: string
  provider: ProviderReference
  currency: 'BRL'
  status: TariffStatus
  revision: number
  created: Stamp
  updated: Stamp
  history: TariffEvent[]
}

const safeLimit = BigInt(Number.MAX_SAFE_INTEGER)
const amountFormatter = new Intl.NumberFormat('pt-BR')

function positiveInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value > 0
}

function parseDecimal(input: string, decimals: 2 | 3) {
  const match = /^(\d+)(?:[.,](\d+))?$/.exec(input.trim())
  if (!match || (match[2]?.length ?? 0) > decimals) return null
  const units = Number(match[1] + (match[2] ?? '').padEnd(decimals, '0'))
  return positiveInteger(units) ? units : null
}

export const parseTariffCents = (input: string) => parseDecimal(input, 2)
export const parseDistanceMeters = (input: string) => parseDecimal(input, 3)

export function tariffAmountInput(cents: number) {
  const digits = String(cents).padStart(3, '0')
  return digits.slice(0, -2) + ',' + digits.slice(-2)
}

export function formatTariffAmount(cents: number) {
  const units = BigInt(cents)
  return amountFormatter.format(units / 100n) + ',' + String(units % 100n).padStart(2, '0')
}

export function estimateTariff(amounts: TariffAmounts, distanceMeters: number) {
  if (!isTariffAmounts(amounts) || !positiveInteger(distanceMeters)) return { kind: 'invalid' } as const
  const minimum = BigInt(amounts.minimumFareCents) * 1000n
  const distance = BigInt(distanceMeters) * BigInt(amounts.ratePerKilometerCents)
  const basis = minimum === distance ? 'tie' : minimum > distance ? 'minimum' : 'distance'
  const cents = ((minimum > distance ? minimum : distance) + 500n) / 1000n
  if (cents > safeLimit) return { kind: 'overflow' } as const
  return { kind: 'estimated', cents: Number(cents), basis } as const
}

function record(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}

export function isTariffCombination(value: unknown): value is TariffCombination & Record<string, unknown> {
  return record(value) && typeof value.modality === 'string' && Object.hasOwn(freightModalities, value.modality)
    && typeof value.vehicleType === 'string' && Object.hasOwn(vehicleTypes, value.vehicleType)
}

export function isTariffAmounts(value: unknown): value is TariffAmounts & Record<string, unknown> {
  return record(value) && positiveInteger(value.minimumFareCents) && positiveInteger(value.ratePerKilometerCents)
}

export function tariffAmounts(value: TariffAmounts): TariffAmounts {
  return { minimumFareCents: value.minimumFareCents, ratePerKilometerCents: value.ratePerKilometerCents }
}

export function sameTariffAmounts(a: TariffAmounts, b: TariffAmounts) {
  return a.minimumFareCents === b.minimumFareCents && a.ratePerKilometerCents === b.ratePerKilometerCents
}

export function tariffKey(provider: ProviderReference, combination: TariffCombination) {
  return JSON.stringify([providerKey(provider), combination.modality, combination.vehicleType])
}

function isStamp(value: unknown): value is Stamp & Record<string, unknown> {
  if (!record(value) || typeof value.userId !== 'string' || !value.userId.trim()
    || value.userId !== value.userId.trim() || typeof value.at !== 'string') return false
  const date = new Date(value.at)
  return Number.isFinite(date.getTime()) && date.toISOString() === value.at
}

function isSnapshot(value: unknown): value is TariffAmounts & Record<string, unknown> {
  return isTariffAmounts(value) && Object.keys(value).length === 2
}

function coherentHistory(value: Record<string, unknown> & TariffAmounts, created: Stamp, updated: Stamp, history: unknown[]) {
  const [first, ...rest] = history
  if (!isStamp(first) || first.kind !== 'created' || !isSnapshot(first.amounts) || Object.keys(first).length !== 4
    || first.at !== created.at || first.userId !== created.userId) return false
  let amounts = first.amounts
  let status: TariffStatus = 'active'
  let last = first
  for (const event of rest) {
    if (!isStamp(event) || event.at < last.at) return false
    if (event.kind === 'amountsChanged' && Object.keys(event).length === 5 && isSnapshot(event.from) && isSnapshot(event.to)
      && sameTariffAmounts(amounts, event.from) && !sameTariffAmounts(event.from, event.to)) amounts = event.to
    else if (event.kind === 'deactivated' && Object.keys(event).length === 3 && status === 'active') status = 'inactive'
    else if (event.kind === 'reactivated' && Object.keys(event).length === 3 && status === 'inactive') status = 'active'
    else return false
    last = event
  }
  return status === value.status && sameTariffAmounts(amounts, value)
    && updated.at === last.at && updated.userId === last.userId
}

export function isTariff(value: unknown): value is Tariff {
  return record(value) && Object.keys(value).length === 12
    && typeof value.id === 'string' && !!value.id.trim() && value.id === value.id.trim()
    && isProviderReference(value.provider) && isTariffCombination(value) && isTariffAmounts(value)
    && value.currency === 'BRL' && (value.status === 'active' || value.status === 'inactive')
    && isStamp(value.created) && Object.keys(value.created).length === 2
    && isStamp(value.updated) && Object.keys(value.updated).length === 2
    && positiveInteger(value.revision) && Array.isArray(value.history) && value.history.length === value.revision
    && coherentHistory(value, value.created, value.updated, value.history)
}
