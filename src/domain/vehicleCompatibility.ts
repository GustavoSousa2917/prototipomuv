import type { FreightModality } from './autonomousProvider'
import { isCnhCurrent, isProfessionalDetails } from './driverProfessional'
import type { DriverProfessionalDetails } from './driverProfessional'
import type { Vehicle } from './vehicle'

export const vehicleCompatibilityPolicy = 'MUV-DEC-051-v1'
export type CompatibilityState = 'met' | 'notMet' | 'notEvaluable'

export const compatibilityReasons = {
  professionalUnavailable: 'Dados ou condição profissional indisponíveis.',
  professionalNotMet: 'Condição profissional cadastral não atendida.',
  noProfessional: 'Nenhum profissional pertinente encontrado.',
  expiredLicense: 'Habilitação vencida.',
  invalidReferenceDate: 'Data de referência indisponível ou inválida.',
  earRequired: 'EAR declarada afirmativa necessária.',
  categoryInsufficient: 'Categoria da CNH insuficiente no recorte.',
  categoryOutside: 'Categoria E ou AE fora do recorte.',
  inactiveVehicle: 'Veículo inativo.',
  modalityMissing: 'Modalidade não declarada no veículo.',
  invalidCapacity: 'Capacidade declarada inválida ou inconsistente.',
  missingWeight: 'PBT não informado.',
  missingSeats: 'Lotação não informada.',
  missingPurpose: 'Destinação técnica não informada.',
  missingConfiguration: 'Configuração não informada.',
  purposeMismatch: 'Destinação técnica não atende à modalidade no recorte.',
  configurationOutside: 'Configuração ou operação fora do recorte.',
  purposeOutside: 'Destinação fora do recorte.',
  seatsOutside: 'Lotação fora do recorte.',
  heavyOutside: 'Veículo de passageiros ou misto acima do PBT do recorte.',
  propulsionUnknown: 'Exceção potencial de propulsão para B/AB não verificável.',
  vehiclesUnavailable: 'Fonte de veículos indisponível ou inconsistente.',
  vehicleMissing: 'Nenhum veículo ativo correspondente.',
  tariffsUnavailable: 'Fonte de tarifas indisponível ou inconsistente.',
  tariffMissing: 'Nenhuma tarifa ativa correspondente.',
} as const
export type CompatibilityReason = keyof typeof compatibilityReasons
export type CompatibilityAssessment = { state: CompatibilityState; reasons: CompatibilityReason[] }
export type CompatibilityDriver = {
  state: 'met' | 'pending' | 'unavailable'
  details?: DriverProfessionalDetails
}

const baseWeight = 3_500_000
const exceptionalWeight = 4_250_000
const validPositive = (value: number | undefined): value is number =>
  value !== undefined && Number.isSafeInteger(value) && value > 0

export function evaluateVehiclePair(
  driver: CompatibilityDriver,
  vehicle: Pick<Vehicle, 'status' | 'modalities' | 'passengers' | 'cargo' | 'technical'>,
  modality: FreightModality,
  date: Date,
): CompatibilityAssessment {
  const blocked: CompatibilityReason[] = []
  const unknown: CompatibilityReason[] = []
  const details = driver.details
  const license = details && isProfessionalDetails(details) ? details : undefined
  if (driver.state === 'pending') blocked.push('professionalNotMet')
  if (driver.state === 'unavailable' || !license) unknown.push('professionalUnavailable')
  if (license) {
    if (!Number.isFinite(date.getTime())) unknown.push('invalidReferenceDate')
    else if (!isCnhCurrent(license.cnhExpiresAt, date)) blocked.push('expiredLicense')
    if (!license.hasEar) blocked.push('earRequired')
    if (license.cnhCategory === 'E' || license.cnhCategory === 'AE') unknown.push('categoryOutside')
  }

  const { grossWeightGrams: weight, totalSeats: seats, purpose, configuration } = vehicle.technical ?? {}
  if (vehicle.status !== 'active') blocked.push('inactiveVehicle')
  if (!vehicle.modalities.includes(modality)) blocked.push('modalityMissing')
  else {
    const capacity = modality === 'PESSOA' ? vehicle.passengers?.count : vehicle.cargo?.grams
    const limit = modality === 'PESSOA' ? (seats === undefined ? undefined : seats - 1) : weight
    const cargo = vehicle.cargo
    const cargoInvalid = modality === 'ENCOMENDA' && (!cargo || !validPositive(cargo.liters)
      || (cargo.millimeters !== null && ![cargo.millimeters.length, cargo.millimeters.width, cargo.millimeters.height].every(validPositive)))
    if (!validPositive(capacity) || (limit !== undefined && capacity > limit) || cargoInvalid) blocked.push('invalidCapacity')
  }

  if (!validPositive(weight)) unknown.push('missingWeight')
  if (!validPositive(seats)) unknown.push('missingSeats')
  else if (seats > 9) unknown.push('seatsOutside')
  if (!configuration) unknown.push('missingConfiguration')
  else if (configuration !== 'SIMPLE') unknown.push('configurationOutside')
  if (!purpose) unknown.push('missingPurpose')
  else if (purpose === 'OTHER') unknown.push('purposeOutside')
  else if (purpose === (modality === 'PESSOA' ? 'CARGO' : 'PASSENGER')) blocked.push('purposeMismatch')
  if (weight !== undefined && weight > baseWeight && (purpose === 'PASSENGER' || purpose === 'MIXED')) unknown.push('heavyOutside')

  const covered = validPositive(weight) && validPositive(seats) && seats <= 9 && configuration === 'SIMPLE'
    && (modality === 'PESSOA'
      ? (purpose === 'PASSENGER' || purpose === 'MIXED') && weight <= baseWeight
      : purpose === 'CARGO' || (purpose === 'MIXED' && weight <= baseWeight))
  if (license && covered) {
    const category = license.cnhCategory
    if (category === 'A') blocked.push('categoryInsufficient')
    if ((category === 'B' || category === 'AB') && weight > baseWeight) {
      if (weight <= exceptionalWeight) unknown.push('propulsionUnknown')
      else blocked.push('categoryInsufficient')
    }
  }
  return { state: blocked.length ? 'notMet' : unknown.length ? 'notEvaluable' : 'met', reasons: [...blocked, ...unknown] }
}
