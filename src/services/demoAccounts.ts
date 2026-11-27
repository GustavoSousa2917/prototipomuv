import type { AssignedContext } from '../domain/accountAccess'
import { validateRegistrationDetails } from '../domain/userRegistration'
import { ensureAccessAssignments } from '../repositories/accessAssignmentRepository'
import { userRepository } from '../repositories/userRepository'
import { withAuthMutation } from './authMutation'
import { deriveCredential } from './passwordCredential'

export const demoPassword = 'MuvDemo2026'

export const demoAccounts = [
  { key: 'cliente', name: 'Cliente Demonstração', cpf: '70000000159', contexts: [] },
  { key: 'autonomo', name: 'Autônomo Demonstração', cpf: '70000000230', contexts: [{ kind: 'autonomous' }] },
  { key: 'empresa', name: 'Empresa Demonstração', cpf: '70000000310', contexts: [{ kind: 'company', organizationId: 'empresa-a' }] },
  { key: 'cooperativa', name: 'Cooperativa Demonstração', cpf: '70000000400', contexts: [{ kind: 'cooperative', organizationId: 'coop-a' }] },
  { key: 'motorista', name: 'Motorista Demonstração', cpf: '70000000582', contexts: [{ kind: 'linkedDriver', linkId: 'vinculo-a' }] },
  { key: 'multiperfil', name: 'Multiperfil Demonstração', cpf: '70000000663', contexts: [{ kind: 'autonomous' }, { kind: 'linkedDriver', linkId: 'vinculo-b' }] },
  { key: 'multiorganizacao', name: 'Multiorganização Demonstração', cpf: '70000000744', contexts: [{ kind: 'company', organizationId: 'empresa-a' }, { kind: 'company', organizationId: 'empresa-b' }, { kind: 'cooperative', organizationId: 'coop-b' }] },
  { key: 'admin', name: 'Administração Demonstração', cpf: '70000000825', contexts: [{ kind: 'admin' }] },
] as const satisfies readonly { key: string; name: string; cpf: string; contexts: readonly AssignedContext[] }[]

export function demoAccountEmail(key: string) {
  return `${key}@demo.muv.invalid`
}

type DemoResult = { key: string; status: 'created' | 'preserved' | 'conflict' | 'failed' }
type ExistingAccountResult = Exclude<DemoResult['status'], 'failed'>

async function provisionAccount(fixture: typeof demoAccounts[number]): Promise<ExistingAccountResult> {
  const id = 'muv-demo-' + fixture.key
  const email = demoAccountEmail(fixture.key)
  const existing = userRepository.findById(id)

  if (existing && (existing.email !== email || existing.cpf !== fixture.cpf)) return 'conflict'
  if (!existing && (userRepository.findByEmail(email) || userRepository.findByCpf(fixture.cpf))) return 'conflict'
  if (!ensureAccessAssignments(id, fixture.contexts, false)) return 'conflict'

  if (!existing) {
    const details = {
      fullName: fixture.name,
      email,
      cpf: fixture.cpf,
      phone: '85900000000',
      password: demoPassword,
      passwordConfirmation: demoPassword,
    }
    if (Object.keys(validateRegistrationDetails(details)).length) throw new Error('Conta demonstrativa inválida.')

    const credential = await deriveCredential(demoPassword)
    const now = new Date().toISOString()
    const result = await userRepository.create({
      id,
      fullName: details.fullName,
      email,
      cpf: details.cpf,
      phone: details.phone,
      initialPurpose: 'requestFreight',
      credential,
      termsAndPrivacyAcceptedAt: now,
      createdAt: now,
      updatedAt: now,
    })
    if (result.kind === 'duplicate') return 'conflict'
  }

  if (!ensureAccessAssignments(id, fixture.contexts)) return 'conflict'
  return existing ? 'preserved' : 'created'
}

export async function provisionDemoAccounts(): Promise<DemoResult[]> {
  if (!import.meta.env.DEV) return []
  return withAuthMutation(async () => {
    const results: DemoResult[] = []
    for (const fixture of demoAccounts) {
      try {
        results.push({ key: fixture.key, status: await provisionAccount(fixture) })
      } catch {
        results.push({ key: fixture.key, status: 'failed' })
      }
    }
    return results
  })
}
