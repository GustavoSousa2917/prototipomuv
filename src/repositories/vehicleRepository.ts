import { isVehicle } from '../domain/vehicle'
import type { Vehicle } from '../domain/vehicle'

export const vehicleStorageKey = 'muv.vehicles.v1'

function validate(value: unknown): Vehicle[] {
  if (!Array.isArray(value) || !value.every((row: unknown) => isVehicle(row))
    || new Set(value.map((row) => row.id)).size !== value.length
    || new Set(value.map((row) => row.plate)).size !== value.length) {
    throw new Error('Frota inconsistente.')
  }
  return value
}

export const vehicleRepository = {
  read() {
    return validate(JSON.parse(localStorage.getItem(vehicleStorageKey) ?? '[]'))
  },
  write(vehicles: Vehicle[]) {
    localStorage.setItem(vehicleStorageKey, JSON.stringify(validate(vehicles)))
  },
}
