import { createContext, useContext } from 'react'

import type { Authentication, LoginResult, logoutUser, switchContext } from '../services/authSession'

type AuthContextValue = {
  user: Authentication['user'] | null
  access: Authentication['access'] | null
  initializing: boolean
  logoutFromCurrentRoute: boolean
  login: (input: { email: string; password: string }) => Promise<LoginResult>
  changeContext: (contextKey: string) => ReturnType<typeof switchContext>
  refreshSession: () => void
  logout: () => ReturnType<typeof logoutUser>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('O contexto de autenticação deve estar disponível.')
  return context
}
