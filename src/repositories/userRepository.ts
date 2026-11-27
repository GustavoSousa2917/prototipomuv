import { digitsOnly, isInitialPurpose, isValidCpf, isValidEmail, isValidPhone, normalizeEmail } from '../domain/userRegistration'
import type { User } from '../domain/userRegistration'

export const userStorageKey = 'muv.users.v1'

type DuplicateFields = { cpf: boolean; email: boolean }
type CreateResult = { kind: 'created' } | { kind: 'duplicate'; fields: DuplicateFields }

export interface UserRepository {
  create(user: User): Promise<CreateResult>
  updateCredential(id: string, credential: User['credential'], updatedAt: string): Promise<boolean>
  findById(id: string): User | undefined
  findByCpf(cpf: string): User | undefined
  findByEmail(email: string): User | undefined
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function isDate(value: unknown) {
  return typeof value === 'string' && Number.isFinite(Date.parse(value))
}

function isStoredUser(value: unknown): value is User {
  if (!isRecord(value) || !isRecord(value.credential)) return false
  const credential = value.credential

  return typeof value.id === 'string' && value.id.length > 0
    && typeof value.fullName === 'string' && value.fullName.trim().length > 0
    && typeof value.cpf === 'string' && isValidCpf(value.cpf)
    && typeof value.phone === 'string' && isValidPhone(value.phone)
    && typeof value.email === 'string' && isValidEmail(value.email) && value.email === normalizeEmail(value.email)
    && isInitialPurpose(value.initialPurpose)
    && isDate(value.termsAndPrivacyAcceptedAt) && isDate(value.createdAt) && isDate(value.updatedAt)
    && credential.algorithm === 'PBKDF2' && credential.hash === 'SHA-256'
    && typeof credential.iterations === 'number' && Number.isSafeInteger(credential.iterations) && credential.iterations > 0
    && typeof credential.salt === 'string' && /^[a-f0-9]{32}$/.test(credential.salt)
    && typeof credential.derivedKey === 'string' && /^[a-f0-9]{64}$/.test(credential.derivedKey)
}

function readUsers(): User[] {
  const raw = localStorage.getItem(userStorageKey)
  if (raw === null) return []
  const stored: unknown = JSON.parse(raw)
  if (!Array.isArray(stored) || !stored.every(isStoredUser)
    || new Set(stored.map((user) => user.id)).size !== stored.length
    || new Set(stored.map((user) => user.cpf)).size !== stored.length
    || new Set(stored.map((user) => user.email)).size !== stored.length) {
    throw new Error('Registros de usuários inválidos.')
  }
  return stored
}

export const userRepository: UserRepository = {
  async create(user) {
    function save(): CreateResult {
      const users = readUsers()
      if (users.some((existing) => existing.id === user.id)) {
        throw new Error('Identificador de conta já existente.')
      }

      const fields = {
        cpf: users.some((existing) => existing.cpf === user.cpf),
        email: users.some((existing) => existing.email === user.email),
      }
      if (fields.cpf || fields.email) return { kind: 'duplicate', fields }

      localStorage.setItem(userStorageKey, JSON.stringify([...users, user]))
      return { kind: 'created' }
    }

    return navigator.locks ? navigator.locks.request(userStorageKey, save) : save()
  },
  async updateCredential(id, credential, updatedAt) {
    function save() {
      const users = readUsers()
      const index = users.findIndex((user) => user.id === id)
      if (index < 0) return false
      users[index] = { ...users[index], credential, updatedAt }
      localStorage.setItem(userStorageKey, JSON.stringify(users))
      return true
    }

    return navigator.locks ? navigator.locks.request(userStorageKey, save) : save()
  },
  findById: (id) => readUsers().find((user) => user.id === id),
  findByCpf: (cpf) => readUsers().find((user) => user.cpf === digitsOnly(cpf)),
  findByEmail: (email) => readUsers().find((user) => user.email === normalizeEmail(email)),
}
