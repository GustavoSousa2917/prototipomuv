import { freightModalities } from './autonomousProvider'
import type { FreightModality } from './autonomousProvider'
import { isProviderReference } from './providerReference'
import type { ProviderReference } from './providerReference'

export const vehicleTypes = { CAR: 'Automóvel', VAN: 'Van', CARGO_VAN: 'Furgão', TRUCK: 'Caminhão' } as const
export type VehicleType = keyof typeof vehicleTypes
export const vehicleTextLimits = { brand: 80, model: 100, color: 40, description: 500, luggage: 240 } as const
export const dimensionFields = { length: 'Comprimento útil', width: 'Largura útil', height: 'Altura útil' } as const
export type Dimension = keyof typeof dimensionFields

type VehicleData = {
  plate: string
  type: VehicleType
  brand: string
  model: string
  year: number
  color: string
  description: string | null
  modalities: FreightModality[]
  passengers: { count: number; luggage: string | null } | null
  cargo: { grams: number; liters: number; millimeters: Record<Dimension, number> | null } | null
}
type Stamp = { at: string; userId: string }
type VehicleEvent = Stamp & (
  { kind: 'plateCorrected'; from: string; to: string } | { kind: 'deactivated' | 'reactivated' }
)
export type VehicleStatus = 'active' | 'inactive'
export type Vehicle = VehicleData & {
  id: string
  provider: ProviderReference
  status: VehicleStatus
  created: Stamp
  updated: Stamp
  revision: number
  history: VehicleEvent[]
}

export type VehicleDraft = {
  plate: string; type: string; brand: string; model: string; year: string; color: string; description: string
  modalities: FreightModality[]
  passengers: string; luggage: string; payload: string; volume: string
} & Record<Dimension, string>

export type VehicleErrors = Partial<Record<keyof VehicleDraft, string>>

export function normalizePlate(input: string) {
  const value = input.trim()
  if (!/^(?:[a-zA-Z]{3}-?[0-9]{4}|[a-zA-Z]{3}[0-9][a-zA-Z][0-9]{2})$/.test(value)) return null
  return value.toUpperCase().replace('-', '')
}

export function parsePositiveMeasure(raw: string, decimals: 0 | 1 | 3): number | null {
  const match = /^(\d+)(?:[.,](\d+))?$/.exec(raw.trim())
  if (!match || (match[2]?.length ?? 0) > decimals) return null
  const value = Number(match[1] + (match[2] ?? '').padEnd(decimals, '0'))
  return positiveInteger(value) ? value : null
}

export function formatMeasure(value: number, decimals: 0 | 1 | 3): string {
  const digits = String(value).padStart(decimals + 1, '0')
  if (decimals === 0) return digits
  const fraction = digits.slice(-decimals).replace(/0+$/, '')
  return digits.slice(0, -decimals) + (fraction ? ',' + fraction : '')
}

export function vehicleDraft(vehicle?: Vehicle): VehicleDraft {
  const dimensions = vehicle?.cargo?.millimeters
  return {
    plate: vehicle?.plate ?? '', type: vehicle?.type ?? '', brand: vehicle?.brand ?? '',
    model: vehicle?.model ?? '', year: vehicle ? String(vehicle.year) : '', color: vehicle?.color ?? '',
    description: vehicle?.description ?? '', modalities: vehicle?.modalities ?? [],
    passengers: vehicle?.passengers ? String(vehicle.passengers.count) : '', luggage: vehicle?.passengers?.luggage ?? '',
    payload: vehicle?.cargo ? formatMeasure(vehicle.cargo.grams, 3) : '',
    volume: vehicle?.cargo ? formatMeasure(vehicle.cargo.liters, 3) : '',
    length: dimensions ? formatMeasure(dimensions.length, 1) : '',
    width: dimensions ? formatMeasure(dimensions.width, 1) : '',
    height: dimensions ? formatMeasure(dimensions.height, 1) : '',
  }
}

function positiveInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value > 0
}

function validYear(value: unknown, now: Date) {
  return typeof value === 'number' && Number.isInteger(value) && value >= 1900 && value <= now.getFullYear() + 1
}

function validType(value: unknown): value is VehicleType {
  return typeof value === 'string' && Object.hasOwn(vehicleTypes, value)
}

function validModalities(value: unknown): value is FreightModality[] {
  return Array.isArray(value) && value.length > 0 && new Set(value).size === value.length
    && value.every((key: unknown) => typeof key === 'string' && Object.hasOwn(freightModalities, key))
}

function textValue(value: unknown, limit = Infinity): value is string {
  return typeof value === 'string' && value.length > 0 && value.length <= limit && value.trim() === value
}

function optionalText(value: unknown, limit: number) {
  return value === null || textValue(value, limit)
}

export function validateVehicleDraft(input: VehicleDraft, previous?: Vehicle, now = new Date()) {
  const errors: VehicleErrors = {}
  const plate = normalizePlate(input.plate)
  const year = /^\d{4}$/.test(input.year.trim()) ? Number(input.year) : NaN
  const type = input.type
  const brand = input.brand.trim(), model = input.model.trim(), color = input.color.trim()
  const description = input.description.trim() || null
  for (const [key, value] of Object.entries({ brand, model, color }) as ['brand' | 'model' | 'color', string][]) {
    if (!textValue(value, vehicleTextLimits[key])) errors[key] = `Informe de 1 a ${vehicleTextLimits[key]} caracteres.`
  }
  if (!optionalText(description, vehicleTextLimits.description)) errors.description = 'Use até 500 caracteres.'
  if (!plate) errors.plate = 'Informe uma placa no formato AAA-1234 ou AAA1A23.'
  if (!validYear(year, now)) errors.year = `Informe um ano inteiro entre 1900 e ${now.getFullYear() + 1}.`
  if (!validType(type)) errors.type = 'Selecione o tipo do veículo.'
  if (!validModalities(input.modalities)) errors.modalities = 'Selecione uma ou ambas as modalidades disponíveis.'

  let passengers = previous?.passengers ?? null
  let cargo = previous?.cargo ?? null
  if (input.modalities.includes('PESSOA')) {
    const count = parsePositiveMeasure(input.passengers, 0)
    const luggage = input.luggage.trim() || null
    if (count === null) errors.passengers = 'Informe um número inteiro positivo de passageiros.'
    if (!optionalText(luggage, vehicleTextLimits.luggage)) errors.luggage = 'Use até 240 caracteres.'
    if (count !== null) passengers = { count, luggage }
  }
  if (input.modalities.includes('ENCOMENDA')) {
    const grams = parsePositiveMeasure(input.payload, 3)
    const liters = parsePositiveMeasure(input.volume, 3)
    if (grams === null) errors.payload = 'Informe uma carga positiva com até três casas decimais.'
    if (liters === null) errors.volume = 'Informe um volume positivo com até três casas decimais.'
    const fields = Object.keys(dimensionFields) as Dimension[]
    let millimeters: Record<Dimension, number> | null = null
    if (fields.some((field) => input[field].trim() !== '')) {
      const length = parsePositiveMeasure(input.length, 1)
      const width = parsePositiveMeasure(input.width, 1)
      const height = parsePositiveMeasure(input.height, 1)
      const parsed = { length, width, height }
      for (const field of fields) {
        if (parsed[field] === null) errors[field] = 'Preencha as três dimensões com valores positivos e até uma casa decimal.'
      }
      if (length !== null && width !== null && height !== null) millimeters = { length, width, height }
    }
    if (grams !== null && liters !== null) cargo = { grams, liters, millimeters }
  }
  if (Object.keys(errors).length || !plate || !validType(type)) return { kind: 'invalid', errors } as const
  const data: VehicleData = { plate, type, brand, model, year, color, description, modalities: [...input.modalities], passengers, cargo }
  return { kind: 'valid', data } as const
}

function record(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}

function stamp(value: unknown): value is Stamp & Record<string, unknown> {
  if (!record(value) || !textValue(value.userId) || typeof value.at !== 'string') return false
  const date = new Date(value.at)
  return Number.isFinite(date.getTime()) && date.toISOString() === value.at
}

function storedPlate(value: unknown): value is string {
  return typeof value === 'string' && normalizePlate(value) === value
}

function coherentHistory(value: unknown[], plate: string, status: VehicleStatus, created: Stamp, updated: Stamp, revision: number) {
  if (value.length >= revision || created.at > updated.at) return false
  let current = status
  let currentPlate = plate
  let cutoff = updated.at
  for (const event of [...value].reverse()) {
    if (!record(event) || !stamp(event) || event.at < created.at || event.at > cutoff) return false
    cutoff = event.at
    if (event.kind === 'plateCorrected' && Object.keys(event).length === 5) {
      if (!storedPlate(event.from) || event.to !== currentPlate || event.from === event.to) return false
      currentPlate = event.from
    } else if (Object.keys(event).length === 3 && event.kind === 'deactivated' && current === 'inactive') current = 'active'
    else if (Object.keys(event).length === 3 && event.kind === 'reactivated' && current === 'active') current = 'inactive'
    else return false
  }
  return current === 'active'
}

export function isVehicle(value: unknown, now = new Date()): value is Vehicle {
  if (!record(value) || Object.keys(value).length !== 17 || !textValue(value.id) || !isProviderReference(value.provider)
    || !storedPlate(value.plate) || !validType(value.type) || !validYear(value.year, now)
    || !textValue(value.brand, vehicleTextLimits.brand) || !textValue(value.model, vehicleTextLimits.model)
    || !textValue(value.color, vehicleTextLimits.color) || !optionalText(value.description, vehicleTextLimits.description)
    || !validModalities(value.modalities) || (value.status !== 'active' && value.status !== 'inactive')
    || !stamp(value.created) || Object.keys(value.created).length !== 2
    || !stamp(value.updated) || Object.keys(value.updated).length !== 2 || !positiveInteger(value.revision)
    || !Array.isArray(value.history) || !coherentHistory(value.history, value.plate, value.status, value.created, value.updated, value.revision)) return false
  const { passengers, cargo, modalities } = value
  const peopleValid = passengers === null ? !modalities.includes('PESSOA')
    : record(passengers) && Object.keys(passengers).length === 2 && positiveInteger(passengers.count)
      && optionalText(passengers.luggage, vehicleTextLimits.luggage)
  const cargoValid = cargo === null ? !modalities.includes('ENCOMENDA')
    : record(cargo) && Object.keys(cargo).length === 3 && positiveInteger(cargo.grams) && positiveInteger(cargo.liters)
      && (cargo.millimeters === null || (record(cargo.millimeters) && Object.keys(cargo.millimeters).length === 3
        && positiveInteger(cargo.millimeters.length) && positiveInteger(cargo.millimeters.width) && positiveInteger(cargo.millimeters.height)))
  return peopleValid && cargoValid
}
