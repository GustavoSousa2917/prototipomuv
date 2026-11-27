import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'

import Alert from '../../components/feedback/Alert'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import { protectedReturn } from '../../constants/environmentRoutes'
import { useAuth } from '../../contexts/authContext'

const errorMessages = {
  invalidCredentials: 'E-mail ou senha inválidos.',
  storageError: 'Não foi possível acessar ou gravar a sessão neste navegador. Tente novamente.',
  cryptoError: 'Não foi possível verificar a senha. Abra o protótipo em HTTPS ou localhost e tente novamente.',
}

export default function LoginPage() {
  const { initializing, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [message, setMessage] = useState('')
  const submitting = useRef(false)
  const focusRequested = useRef(false)
  const formRef = useRef<HTMLFormElement>(null)
  const alertRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!focusRequested.current) return
    focusRequested.current = false
    const invalid = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')
    const target = invalid ?? alertRef.current
    target?.focus()
  }, [errors, message, processing])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (initializing || submitting.current) return

    submitting.current = true
    setProcessing(true)
    setErrors({})
    setMessage('')
    const result = await login({ email, password })
    submitting.current = false
    setProcessing(false)

    if (result.kind === 'authenticated') {
      navigate(protectedReturn(location.state?.returnTo) ?? result.destination, { replace: true })
      return
    }

    focusRequested.current = true
    if (result.kind === 'invalidFields') setErrors(result.errors)
    else setMessage(errorMessages[result.kind])
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="text-muv-label font-semibold uppercase tracking-wide text-primary">Acesso ao MUV</p>
        <h1 className="mt-2 text-muv-h1 font-bold">Entrar no MUV</h1>
        <p className="mt-2 text-muted">Ambiente demonstrativo. Utilize somente dados fictícios.</p>
      </div>

      <Card>
        <form ref={formRef} noValidate onSubmit={handleSubmit} aria-busy={processing} className="space-y-4">
          {message && (
            <div ref={alertRef} tabIndex={-1}>
              <Alert variant="danger" role="alert">{message}</Alert>
            </div>
          )}
          <Input
            name="email"
            label="E-mail"
            type="email"
            autoComplete="username"
            required
            disabled={processing}
            value={email}
            error={errors.email}
            onChange={(event) => {
              setEmail(event.target.value)
              setErrors((previous) => ({ ...previous, email: undefined }))
              setMessage('')
            }}
          />
          <Input
            id="login-password"
            name="password"
            label="Senha"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            required
            disabled={processing}
            value={password}
            error={errors.password}
            onChange={(event) => {
              setPassword(event.target.value)
              setErrors((previous) => ({ ...previous, password: undefined }))
              setMessage('')
            }}
          />
          <Button
            variant="ghost"
            size="sm"
            disabled={processing}
            aria-controls="login-password"
            onClick={() => setShowPassword((previous) => !previous)}
          >
            {showPassword ? 'Ocultar senha' : 'Mostrar senha'}
          </Button>
          <Link to="/recuperar-senha" className="block font-semibold text-primary underline underline-offset-2">
            Esqueci minha senha
          </Link>
          {processing && <p role="status" className="text-muv-small text-muted">Entrando…</p>}
          <Button type="submit" fullWidth loading={processing} disabled={initializing}>Entrar</Button>
        </form>
      </Card>

      <p className="text-center text-muted">
        Ainda não tem conta?{' '}
        <Link to="/cadastro" className="font-semibold text-primary underline underline-offset-2">
          Criar conta
        </Link>
      </p>
    </div>
  )
}
