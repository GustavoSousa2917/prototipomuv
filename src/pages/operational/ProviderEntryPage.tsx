import { Link } from 'react-router'

import AccessScreen from '../../components/common/AccessScreen'
import ContextChoices from '../../components/common/ContextChoices'
import { autonomousProfileRoute, autonomousRegistrationRoute, environmentRoutes } from '../../constants/environmentRoutes'
import { useAuth } from '../../contexts/authContext'
import { readOwnProfessionalRegistration } from '../../services/autonomousProvider'
import { contextLabel } from '../../domain/accountAccess'

export default function ProviderEntryPage() {
  const { access, user } = useAuth()
  const contexts = access?.contexts.filter(({ kind }) => kind === 'autonomous' || kind === 'company' || kind === 'cooperative') ?? []
  const active = access?.activeContext

  const registration = user && readOwnProfessionalRegistration(user.id)

  return (
    <AccessScreen title="Área do prestador">
      {active && <p className="break-words text-muted">Contexto ativo: {contextLabel(active)}</p>}
      {contexts.length > 0 && <ContextChoices contexts={contexts} />}
      <section className="space-y-2" aria-label="Tipos de prestador">
        <p className="font-semibold">Autônomo</p>
        {registration?.kind === 'ready' ? (
          <Link to={registration.provider ? autonomousProfileRoute : autonomousRegistrationRoute} className="font-semibold text-primary underline">
            {registration.provider ? 'Consultar cadastro profissional' : 'Iniciar cadastro autônomo'}
          </Link>
        ) : <p className="text-muted">Cadastro profissional indisponível no momento.</p>}
        <p className="text-muted">Empresa — cadastro em etapa futura.</p>
        <p className="text-muted">Cooperativa — cadastro em etapa futura.</p>
      </section>
      <Link to={active ? environmentRoutes[active.kind] : '/'} className="inline-block font-semibold text-primary underline">
        Voltar ao meu ambiente
      </Link>
    </AccessScreen>
  )
}
