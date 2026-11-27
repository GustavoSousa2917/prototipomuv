import { Link } from 'react-router'

import AccessScreen from '../../components/common/AccessScreen'
import { environmentRoutes } from '../../constants/environmentRoutes'
import { useAuth } from '../../contexts/authContext'

export default function AccessDeniedPage() {
  const { access } = useAuth()
  const active = access?.activeContext
  const destination = active ? environmentRoutes[active.kind] : '/'

  return (
    <AccessScreen title="Acesso negado" code="403">
      <p className="text-muted">Sua conta não tem acesso a este ambiente.</p>
      <Link to={destination} className="inline-flex rounded-muv-button bg-primary px-4 py-3 font-medium text-white hover:bg-primary-dark">
        {active ? 'Voltar ao meu ambiente' : 'Voltar ao site'}
      </Link>
    </AccessScreen>
  )
}
