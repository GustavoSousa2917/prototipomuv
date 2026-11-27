import { Link } from 'react-router'

import AccessScreen from '../../components/common/AccessScreen'
import ContextChoices from '../../components/common/ContextChoices'
import { environmentRoutes } from '../../constants/environmentRoutes'
import { useAuth } from '../../contexts/authContext'
import { contextLabel } from '../../domain/accountAccess'

export default function ProviderEntryPage() {
  const { access } = useAuth()
  const contexts = access?.contexts.filter(({ kind }) => kind === 'autonomous' || kind === 'company' || kind === 'cooperative') ?? []
  const active = access?.activeContext

  return (
    <AccessScreen title="Área do prestador">
      {active && <p className="break-words text-muted">Contexto ativo: {contextLabel(active)}</p>}
      {contexts.length ? (
        <ContextChoices contexts={contexts} />
      ) : (
        <p className="text-muted">Sua conta ainda não possui contexto de prestação de serviços. O cadastro profissional será disponibilizado em uma etapa futura.</p>
      )}
      <Link to={active ? environmentRoutes[active.kind] : '/'} className="inline-block font-semibold text-primary underline">
        Voltar ao meu ambiente
      </Link>
    </AccessScreen>
  )
}
