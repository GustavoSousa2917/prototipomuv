import { isOrganization, isOrganizationResponsibility } from '../domain/organization'
import type { Organization, OrganizationResponsibility } from '../domain/organization'

export const organizationStorageKey = 'muv.organizations.v1'

type OrganizationStore = { organizations: Organization[]; responsibilities: OrganizationResponsibility[] }

function validateStore(value: unknown): OrganizationStore {
  if (!value || typeof value !== 'object' || Object.keys(value).length !== 2
    || !('organizations' in value) || !('responsibilities' in value)
    || !Array.isArray(value.organizations) || !value.organizations.every(isOrganization)
    || !Array.isArray(value.responsibilities) || !value.responsibilities.every(isOrganizationResponsibility)) {
    throw new Error('Registros organizacionais inválidos.')
  }

  const { organizations, responsibilities } = value
  const ids = new Set(organizations.map(({ id }) => id))
  const unique = ids.size === organizations.length
    && new Set(organizations.map(({ cnpj }) => cnpj)).size === organizations.length
    && new Set(responsibilities.map(({ id }) => id)).size === responsibilities.length
    && new Set(responsibilities.map(({ organizationId }) => organizationId)).size === organizations.length
  if (!unique || responsibilities.length !== organizations.length
    || responsibilities.some(({ organizationId }) => !ids.has(organizationId))) {
    throw new Error('Associações organizacionais inconsistentes.')
  }
  return { organizations, responsibilities }
}

function read() {
  return validateStore(JSON.parse(localStorage.getItem(organizationStorageKey) ?? '{"organizations":[],"responsibilities":[]}'))
}

function save(store: OrganizationStore) {
  localStorage.setItem(organizationStorageKey, JSON.stringify(validateStore(store)))
}

export const organizationRepository = {
  read,
  findById: (id: string) => read().organizations.find((organization) => organization.id === id),
  findByCnpj: (cnpj: string) => read().organizations.find((organization) => organization.cnpj === cnpj),
  responsibilitiesFor: (userId: string) => read().responsibilities.filter((entry) => entry.userId === userId),
  findResponsibility: (userId: string, organizationId: string) =>
    read().responsibilities.find((entry) => entry.userId === userId && entry.organizationId === organizationId),
  create(organization: Organization, responsibility: OrganizationResponsibility) {
    if (responsibility.organizationId !== organization.id) throw new Error('Organização e responsabilidade incompatíveis.')
    const { organizations, responsibilities } = read()
    save({ organizations: [...organizations, organization], responsibilities: [...responsibilities, responsibility] })
  },
  update(organization: Organization) {
    const store = read()
    const previous = store.organizations.find(({ id }) => id === organization.id)
    if (!previous || previous.cnpj !== organization.cnpj || previous.kind !== organization.kind
      || previous.createdAt !== organization.createdAt) throw new Error('Identidade organizacional incompatível.')
    save({ ...store, organizations: store.organizations.map((row) => row.id === organization.id ? organization : row) })
  },
}
