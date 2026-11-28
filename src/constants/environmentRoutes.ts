import { matchPath } from 'react-router'
import type { ActingContext } from '../domain/accountAccess'
import { operationalProfiles } from './operationalNavigation'

export const environmentRoutes = {
  client: '/cliente',
  autonomous: '/prestador/autonomo',
  company: '/prestador/empresa',
  cooperative: '/prestador/cooperativa',
  linkedDriver: '/motorista',
  admin: '/admin',
} as const satisfies Record<ActingContext['kind'], string>

const clientRoutes = ['', '/solicitar-frete', '/prestadores', '/solicitacoes', '/fretes', '/historico', '/notificacoes', '/conta', '/seja-prestador']
  .map((suffix) => environmentRoutes.client + suffix)
export const accountRoute = '/conta'
export const driverProfessionalRoute = accountRoute + '/motorista'
export const driverInvitationsRoute = driverProfessionalRoute + '/convites'
export const driverOwnLinksRoute = driverProfessionalRoute + '/vinculos'
export const autonomousRegistrationRoute = environmentRoutes.autonomous + '/cadastro'
export const autonomousProfileRoute = environmentRoutes.autonomous + '/perfil'

export const organizationRegistrationRoutes = {
  company: environmentRoutes.company + '/cadastro',
  cooperative: environmentRoutes.cooperative + '/cadastro',
} as const

export const serviceRegionsPath = 'perfil/regioes'
export const serviceRegionRoutes = {
  autonomous: environmentRoutes.autonomous + '/' + serviceRegionsPath,
  company: environmentRoutes.company + '/' + serviceRegionsPath,
  cooperative: environmentRoutes.cooperative + '/' + serviceRegionsPath,
} as const

export const vehicleRoutes = {
  autonomous: environmentRoutes.autonomous + '/veiculos',
  company: environmentRoutes.company + '/veiculos',
  cooperative: environmentRoutes.cooperative + '/veiculos',
} as const

export const tariffRoutes = {
  autonomous: environmentRoutes.autonomous + '/tarifas',
  company: environmentRoutes.company + '/tarifas',
  cooperative: environmentRoutes.cooperative + '/tarifas',
} as const

export const adminAuthorizationRoute = environmentRoutes.admin + '/autorizacoes'

const protectedPaths = [
  adminAuthorizationRoute + '/:id',
  ...Object.values(serviceRegionRoutes),
  ...Object.values(vehicleRoutes).flatMap((base) => [base + '/novo', base + '/:vehicleId', base + '/:vehicleId/editar']),
  ...Object.values(tariffRoutes).flatMap((base) => [base + '/novo', base + '/:tariffId', base + '/:tariffId/editar']),
  ...Object.values(organizationRegistrationRoutes),
  accountRoute,
  driverProfessionalRoute,
  driverInvitationsRoute,
  driverOwnLinksRoute,
  environmentRoutes.company + '/motoristas/:linkId',
  environmentRoutes.cooperative + '/motoristas/:linkId',
  autonomousRegistrationRoute,
  '/prestador',
  ...clientRoutes,
  ...operationalProfiles.flatMap(({ basePath, pages }) => [
    basePath,
    ...pages.filter(({ path }) => path).map(({ path }) => basePath + '/' + path),
    basePath + '/conta',
    basePath + '/notificacoes',
  ]),
]

export function protectedReturn(value: unknown): string | null {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//')
    || value.includes('\\')
    || [...value].some((character) => character.charCodeAt(0) <= 32 || character.charCodeAt(0) === 127)) return null
  const path = value.split(/[?#]/, 1)[0]
  if (!protectedPaths.some((candidate) => matchPath(candidate, path))) return null
  return value
}
