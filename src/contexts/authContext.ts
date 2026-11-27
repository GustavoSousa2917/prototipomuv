import { createContext, useContext } from 'react'

import type { Authentication, LoginResult, logoutUser } from '../services/authSession'

type AuthContextValue = {
  user: Authentication['user'] | null
  access: Authentication['access'] | null
  initializing: boolean
  login: (input: { email: string; password: string }) => Promise<LoginResult>
  refreshSession: () => void
  logout: () => ReturnType<typeof logoutUser>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('O contexto de autenticação deve estar disponível.')
  return context
}
