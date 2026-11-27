import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useLocation } from 'react-router'

import Alert from '../../components/feedback/Alert'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import { useAuth } from '../../contexts/authContext'
import { checkRecoveryToken, resetPassword } from '../../services/passwordRecovery'

const textLink = 'inline-block font-semibold text-primary underline underline-offset-2'

export default function ResetPasswordPage() {
  const { hash } = useLocation()
  const token = new URLSearchParams(hash.slice(1)).get('token') ?? ''
  return <ResetPasswordForm key={token} token={token} />
}

function ResetPasswordForm({ token }: { token: string }) {
  const { refreshSession } = useAuth()
  const [status, setStatus] = useState<'checking' | Awaited<ReturnType<typeof checkRecoveryToken>>['kind']>('checking')
  const [result, setResult] = useState<Awaited<ReturnType<typeof resetPassword>> | null>(null)
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [processing, setProcessing] = useState(false)
  const submitting = useRef(false)
  const formRef = useRef<HTMLFormElement>(null)
  const feedbackRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    let active = true
    void checkRecoveryToken(token).then((response) => {
      if (active) setStatus(response.kind)
    })
    return () => { active = false }
  }, [token])

  useEffect(() => {
    if (!result) return
    const invalid = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')
    const target = invalid ?? feedbackRef.current ?? titleRef.current
    target?.focus()
  }, [result])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (status !== 'valid' || submitting.current) return
    submitting.current = true
    setProcessing(true)
    setResult(null)
    const response = await resetPassword(token, password, confirmation)
    if (response.kind === 'reset' || response.kind === 'partialFailure') {
      refreshSession()
      setPassword('')
      setConfirmation('')
    }
    setResult(response)
    setProcessing(false)
    submitting.current = false
  }

  const errors = result?.kind === 'invalidFields' ? result.errors : {}
  const invalid = status === 'invalidToken' || result?.kind === 'invalidToken'
  const partial = result?.kind === 'partialFailure'
  const success = result?.kind === 'reset'
  const canSubmit = status === 'valid' && !invalid && !partial && !success
  const technicalError = result?.kind === 'storageError' || status === 'storageError'
    ? 'Não foi possível acessar ou gravar os dados de recuperação neste navegador. Tente novamente.'
    : result?.kind === 'cryptoError' || status === 'cryptoError'
      ? 'Não foi possível verificar o link ou proteger a senha. Abra o protótipo em HTTPS ou localhost.'
      : ''

  return (
    <div className="space-y-5">
      <div>
        <h1 ref={titleRef} tabIndex={-1} className="text-muv-h1 font-bold">Redefinir senha</h1>
        <p className="mt-2 text-muted">Crie uma nova senha para a sua conta demonstrativa.</p>
      </div>

      <Card className="space-y-4">
        {status === 'checking' && <p role="status" className="text-muted">Verificando o link…</p>}
        {(invalid || partial || success || technicalError) && (
          <div ref={feedbackRef} tabIndex={-1}>
            {success ? (
              <Alert variant="success" role="status">Senha redefinida. Use a nova senha para entrar.</Alert>
            ) : invalid ? (
              <Alert role="status">O link está ausente, inválido, expirado ou já foi utilizado. Solicite uma nova recuperação.</Alert>
            ) : (
              <Alert variant="danger" role="alert">
                {partial
                  ? 'A redefinição não foi concluída. O link foi consumido e a sessão pode ter sido encerrada. Solicite um novo link.'
                  : technicalError}
              </Alert>
            )}
          </div>
        )}
        {canSubmit && (
          <form ref={formRef} noValidate onSubmit={handleSubmit} aria-busy={processing} className="space-y-4">
            <Input
              id="reset-password"
              name="password"
              label="Nova senha"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              disabled={processing}
              value={password}
              error={errors.password}
              helperText="Pelo menos oito caracteres, com uma letra e um número."
              onChange={(event) => { setPassword(event.target.value); setResult(null) }}
            />
            <Input
              id="reset-confirmation"
              name="passwordConfirmation"
              label="Confirmar nova senha"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              disabled={processing}
              value={confirmation}
              error={errors.passwordConfirmation}
              onChange={(event) => { setConfirmation(event.target.value); setResult(null) }}
            />
            <Button
              variant="ghost"
              size="sm"
              disabled={processing}
              aria-controls="reset-password reset-confirmation"
              onClick={() => setShowPassword((previous) => !previous)}
            >
              {showPassword ? 'Ocultar senhas' : 'Mostrar senhas'}
            </Button>
            {processing && <p role="status" className="text-muv-small text-muted">Redefinindo senha…</p>}
            <Button type="submit" fullWidth loading={processing}>Redefinir senha</Button>
          </form>
        )}
        {success && <Link replace to="/login" className={textLink}>Acessar a página de login</Link>}
        {(!canSubmit && status !== 'checking' && !success) && (
          <Link to="/recuperar-senha" className={textLink}>Solicitar nova recuperação</Link>
        )}
      </Card>
    </div>
  )
}
