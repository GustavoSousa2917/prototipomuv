import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router'

import Alert from '../../components/feedback/Alert'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import { requestPasswordRecovery } from '../../services/passwordRecovery'

const confirmation = 'Se houver uma conta associada ao e-mail informado, as instruções de recuperação estarão disponíveis no ambiente de demonstração.'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState<Awaited<ReturnType<typeof requestPasswordRecovery>> | null>(null)
  const submitting = useRef(false)
  const formRef = useRef<HTMLFormElement>(null)
  const feedbackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!result) return
    const target = result.kind === 'invalidEmail'
      ? formRef.current?.querySelector<HTMLInputElement>('input[name="email"]')
      : feedbackRef.current
    target?.focus()
  }, [result])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting.current) return
    submitting.current = true
    setProcessing(true)
    setResult(null)
    const response = await requestPasswordRecovery(email)
    setResult(response)
    setProcessing(false)
    submitting.current = false
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-muv-h1 font-bold">Recuperar senha</h1>
        <p className="mt-2 text-muted">Informe o e-mail cadastrado para solicitar a recuperação no ambiente de demonstração.</p>
      </div>
      <Card>
        <form ref={formRef} noValidate onSubmit={handleSubmit} aria-busy={processing} className="space-y-4">
          <Input
            name="email"
            label="E-mail"
            type="email"
            autoComplete="email"
            required
            disabled={processing}
            value={email}
            error={result?.kind === 'invalidEmail' ? 'Informe um e-mail válido.' : undefined}
            onChange={(event) => {
              setEmail(event.target.value)
              setResult(null)
            }}
          />
          {processing && <p role="status" className="text-muv-small text-muted">Processando solicitação…</p>}
          <Button type="submit" fullWidth loading={processing}>Solicitar recuperação</Button>
        </form>
      </Card>
      {result && result.kind !== 'invalidEmail' && (
        <div ref={feedbackRef} tabIndex={-1} className="space-y-4">
          {result.kind === 'processed' ? (
            <>
              <Alert role="status">{confirmation}</Alert>
              {result.token && (
                <Card className="space-y-3">
                  <h2 className="text-muv-h3 font-semibold">Simulação de recebimento de e-mail</h2>
                  <p className="text-muted">Nenhum e-mail real foi enviado. O link está disponível aqui apenas para demonstrar o protótipo.</p>
                  <Link
                    to={{ pathname: '/redefinir-senha', hash: '#token=' + result.token }}
                    className="font-semibold text-primary underline underline-offset-2"
                  >
                    Abrir link de redefinição
                  </Link>
                </Card>
              )}
            </>
          ) : (
            <Alert variant="danger" role="alert">
              {result.kind === 'cryptoError'
                ? 'Não foi possível gerar o link. Abra o protótipo em HTTPS ou localhost e tente novamente.'
                : 'Não foi possível acessar ou gravar a solicitação neste navegador. Tente novamente.'}
            </Alert>
          )}
        </div>
      )}
      <Link to="/login" className="inline-block font-semibold text-primary underline underline-offset-2">
        Voltar para o login
      </Link>
    </div>
  )
}
