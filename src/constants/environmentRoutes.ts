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
export const autonomousRegistrationRoute = environmentRoutes.autonomous + '/cadastro'
export const autonomousProfileRoute = environmentRoutes.autonomous + '/perfil'

const protectedPaths = [
  accountRoute,
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
