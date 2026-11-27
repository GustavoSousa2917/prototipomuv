import type { ReactNode } from 'react'
import { Link, Navigate, Outlet, useLocation } from 'react-router'

import AccessScreen from '../components/common/AccessScreen'
import ContextChoices from '../components/common/ContextChoices'
import Loading from '../components/feedback/Loading'
import { environmentRoutes, protectedReturn } from '../constants/environmentRoutes'
import { useAuth } from '../contexts/authContext'
import { contextLabel } from '../domain/accountAccess'
import { decideAccess } from '../domain/accessPolicy'
import type { AccessRequirement } from '../domain/accessPolicy'
import AccessDeniedPage from '../pages/errors/AccessDeniedPage'

export default function AccessGuard({ requirement, children }: { requirement: AccessRequirement; children?: ReactNode }) {
  const auth = useAuth()
  const location = useLocation()
  if (auth.initializing) {
    return <main className="grid min-h-dvh place-items-center"><Loading /></main>
  }

  const decision = decideAccess(auth, requirement)
  if (decision.kind === 'allowed') return children ?? <Outlet />

  const destination = protectedReturn(location.pathname + location.search + location.hash)
  if (decision.kind === 'login') {
    return <Navigate to="/login" replace state={auth.logoutFromCurrentRoute ? null : { returnTo: destination }} />
  }
  if (decision.kind === 'denied') return <AccessDeniedPage />

  const active = auth.access?.activeContext
  return (
    <AccessScreen title="Troca de contexto necessária">
      <p className="text-muted">Escolha a atuação que deseja usar para acessar este ambiente.</p>
      {active && <p className="break-words">Contexto ativo: {contextLabel(active)}</p>}
      <ContextChoices contexts={decision.candidates} destination={destination ?? undefined} />
      <Link to={active ? environmentRoutes[active.kind] : '/'} className="inline-block font-semibold text-primary underline">
        Voltar sem trocar
      </Link>
    </AccessScreen>
  )
}
