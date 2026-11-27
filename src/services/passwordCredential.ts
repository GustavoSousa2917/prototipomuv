import type { User } from '../domain/userRegistration'

type Credential = User['credential']
const keyLength = 32

function toHex(buffer: Uint8Array) {
  return Array.from(buffer, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

function fromHex(value: string) {
  return Uint8Array.from(value.match(/../g) ?? [], (byte) => Number.parseInt(byte, 16))
}

async function deriveKey(password: string, algorithm: Credential['algorithm'], hash: Credential['hash'], iterations: number, salt: Uint8Array<ArrayBuffer>) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), algorithm, false, ['deriveBits'])
  const bits = await crypto.subtle.deriveBits({ name: algorithm, hash, iterations, salt }, key, keyLength * 8)
  return new Uint8Array(bits)
}

export async function deriveCredential(password: string): Promise<Credential> {
  const algorithm = 'PBKDF2'
  const hash = 'SHA-256'
  const iterations = 600_000
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const derivedKey = await deriveKey(password, algorithm, hash, iterations, salt)
  return { algorithm, hash, iterations, salt: toHex(salt), derivedKey: toHex(derivedKey) }
}

export async function verifyCredential(password: string, credential: Credential) {
  const { algorithm, hash, iterations, salt, derivedKey } = credential
  const key = await deriveKey(password, algorithm, hash, iterations, fromHex(salt))
  const storedKey = fromHex(derivedKey)
  let difference = key.length ^ storedKey.length
  for (const [index, byte] of key.entries()) difference |= byte ^ storedKey[index]
  return difference === 0
}
