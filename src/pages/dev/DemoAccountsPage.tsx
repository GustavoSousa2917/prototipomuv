import { useRef, useState } from 'react'
import { Link } from 'react-router'

import Alert from '../../components/feedback/Alert'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import { useAuth } from '../../contexts/authContext'
import { demoAccountEmail, demoAccounts, demoPassword, provisionDemoAccounts } from '../../services/demoAccounts'

const statusLabels = {
  created: 'Conta provisionada.',
  preserved: 'Conta existente preservada.',
  conflict: 'Colisão de dados ou atribuições. Registro preservado.',
  failed: 'Não foi possível concluir. Tente novamente.',
}

export default function DemoAccountsPage() {
  const { refreshSession } = useAuth()
  const [results, setResults] = useState<Awaited<ReturnType<typeof provisionDemoAccounts>>>([])
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState(false)
  const pending = useRef(false)

  async function provision() {
    if (pending.current) return
    pending.current = true
    setProcessing(true)
    setError(false)
    try {
      setResults(await provisionDemoAccounts())
      refreshSession()
    } catch {
      setError(true)
    } finally {
      pending.current = false
      setProcessing(false)
    }
  }

  return (
    <main className="mx-auto max-w-3xl space-y-5 px-4 py-8">
      <h1 className="text-muv-h1 font-bold">Contas demonstrativas</h1>
      <Alert>Modo de desenvolvimento. Use estas credenciais fictícias apenas no protótipo.</Alert>
      <p className="text-muted">Senha inicial de todas as contas: <code>{demoPassword}</code>.</p>
      <Button loading={processing} onClick={provision}>Provisionar contas demonstrativas</Button>
      {error && <Alert variant="danger" role="alert">Não foi possível iniciar o provisionamento.</Alert>}
      <ul className="grid gap-3 sm:grid-cols-2" aria-live="polite">
        {demoAccounts.map(({ key, name }) => {
          const status = results.find((result) => result.key === key)?.status
          return (
            <li key={key}>
              <Card className="break-words">
                <h2 className="font-semibold">{name}</h2>
                <p className="text-muted">{demoAccountEmail(key)}</p>
                {status && <p className="mt-2">{statusLabels[status]}</p>}
              </Card>
            </li>
          )
        })}
      </ul>
      <Link to="/login" className="inline-block font-semibold text-primary underline">Acessar a página de login</Link>
    </main>
  )
}
