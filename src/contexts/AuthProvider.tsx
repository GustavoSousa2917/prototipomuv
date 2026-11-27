import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'

import { AuthContext } from './authContext'
import { loginUser, logoutUser, restoreSession } from '../services/authSession'
import type { AuthenticatedUser } from '../services/authSession'

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthenticatedUser | null>(null)
  const [initializing, setInitializing] = useState(true)

  useEffect(() => {
    let active = true
    queueMicrotask(() => {
      if (!active) return
      setUser(restoreSession())
      setInitializing(false)
    })
    return () => { active = false }
  }, [])

  const login: typeof loginUser = async (input) => {
    const result = await loginUser(input)
    if (result.kind === 'authenticated') setUser(result.user)
    return result
  }

  function refreshSession() {
    setUser(restoreSession())
  }

  function logout() {
    if (!logoutUser()) return false
    setUser(null)
    return true
  }

  return (
    <AuthContext.Provider value={{ user, initializing, login, refreshSession, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
