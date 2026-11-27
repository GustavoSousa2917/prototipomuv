import { createContext, useContext } from 'react'

import type { AuthenticatedUser, LoginResult } from '../services/authSession'

type AuthContextValue = {
  user: AuthenticatedUser | null
  initializing: boolean
  login: (input: { email: string; password: string }) => Promise<LoginResult>
  logout: () => boolean
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('O contexto de autenticação deve estar disponível.')
  return context
}
