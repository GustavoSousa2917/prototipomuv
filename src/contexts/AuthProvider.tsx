import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router'

import { AuthContext } from './authContext'
import { accessAssignmentStorageKey } from '../repositories/accessAssignmentRepository'
import { sessionStorageKey } from '../repositories/sessionRepository'
import { userStorageKey } from '../repositories/userRepository'
import { loginUser, logoutUser, restoreSession, switchContext } from '../services/authSession'
import type { Authentication } from '../services/authSession'

const observedKeys = [sessionStorageKey, userStorageKey, accessAssignmentStorageKey]

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [authentication, setAuthentication] = useState<Authentication | null>(null)
  const [initializing, setInitializing] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()
  const [logoutOrigin, setLogoutOrigin] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    function synchronize(event: StorageEvent) {
      // Ignora alterações no sessionStorage, inclusive as de iframes da mesma aba.
      if (event.storageArea !== localStorage) return
      if (event.key === null || observedKeys.includes(event.key)) {
        setAuthentication(restoreSession())
      }
    }

    window.addEventListener('storage', synchronize)
    queueMicrotask(() => {
      if (!active) return
      setAuthentication(restoreSession())
      setInitializing(false)
    })

    return () => {
      active = false
      window.removeEventListener('storage', synchronize)
    }
  }, [])

  const login: typeof loginUser = async (input) => {
    const result = await loginUser(input)
    if (result.kind === 'authenticated') {
      setAuthentication(restoreSession())
    }
    return result
  }

  function refreshSession() {
    setAuthentication(restoreSession())
  }

  async function changeContext(contextKey: string) {
    if (!authentication) return { kind: 'unavailable' } as const
    const result = await switchContext(authentication.user.id, contextKey)
    if (result.kind !== 'storageError') refreshSession()
    return result
  }

  async function logout() {
    if (!authentication) return 'sessionChanged'

    setLogoutOrigin(location.key)
    const result = await logoutUser(authentication.user.id)
    if (result === 'loggedOut') navigate('/login', { replace: true, state: null })
    else setLogoutOrigin(null)
    if (result !== 'storageError') refreshSession()
    return result
  }

  return (
    <AuthContext.Provider value={{
      user: authentication?.user ?? null,
      access: authentication?.access ?? null,
      initializing,
      logoutFromCurrentRoute: logoutOrigin === location.key,
      login,
      changeContext,
      refreshSession,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  )
}
