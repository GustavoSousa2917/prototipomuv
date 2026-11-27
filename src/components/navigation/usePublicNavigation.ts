import { accountRoute, environmentRoutes } from '../../constants/environmentRoutes'
import { useAuth } from '../../contexts/authContext'

export function usePublicNavigation() {
  const { initializing, user, access, logout } = useAuth()
  const active = access?.activeContext
  const hasClient = access?.contexts.some(({ kind }) => kind === 'client')
  const links = initializing ? [] : user ? [
    ...(active ? [{ label: 'Acessar meu ambiente', to: environmentRoutes[active.kind] }] : []),
    { label: 'Minha conta', to: accountRoute },
  ] : [
    { label: 'Entrar', to: '/login' },
    { label: 'Criar conta', to: '/cadastro' },
  ]

  return {
    links,
    logout: user && !initializing ? logout : null,
    requestTo: initializing ? null : user ? hasClient ? environmentRoutes.client : null : '/cadastro',
    offerTo: initializing ? null : user ? hasClient ? '/prestador' : null : '/cadastro',
  }
}
