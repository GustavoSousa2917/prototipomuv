import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router'

import Alert from '../../components/feedback/Alert'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Checkbox from '../../components/ui/Checkbox'
import Input from '../../components/ui/Input'
import RadioGroup from '../../components/ui/RadioGroup'
import {
  digitsOnly,
  initialPurposes,
  validateRegistrationChoices,
  validateRegistrationDetails,
} from '../../domain/userRegistration'
import type { RegistrationDetails, RegistrationErrors, RegistrationInput } from '../../domain/userRegistration'
import { registerUser } from '../../services/registerUser'

const emptyInput: RegistrationInput = {
  fullName: '',
  cpf: '',
  phone: '',
  email: '',
  password: '',
  passwordConfirmation: '',
  initialPurpose: '',
  acceptedTerms: false,
}

const detailFields = [
  { name: 'fullName', label: 'Nome completo', autoComplete: 'name' },
  { name: 'cpf', label: 'CPF', inputMode: 'numeric' },
  { name: 'phone', label: 'Telefone', type: 'tel', autoComplete: 'tel-national' },
  { name: 'email', label: 'E-mail', type: 'email', autoComplete: 'email' },
  { name: 'password', label: 'Senha', type: 'password', autoComplete: 'new-password', helperText: 'Pelo menos oito caracteres, com uma letra e um número.' },
  { name: 'passwordConfirmation', label: 'Confirmar senha', type: 'password', autoComplete: 'new-password' },
] as const

const purposeOptions = [
  {
    value: initialPurposes[0],
    label: 'Solicitar fretes',
    description: 'Encontrar prestadores e solicitar transporte de pessoas ou encomendas.',
  },
  {
    value: initialPurposes[1],
    label: 'Oferecer serviços de frete',
    description: 'Iniciar futuramente o processo para atuar como autônomo, empresa ou cooperativa.',
  },
  {
    value: initialPurposes[2],
    label: 'Atuar como motorista vinculado',
    description: 'Participar futuramente de operações de transporte por meio de vínculos com empresas ou cooperativas.',
  },
]

const textLink = 'font-semibold text-primary underline underline-offset-2 hover:text-primary-dark'

function formatDetail(name: keyof RegistrationDetails, value: string) {
  const digits = digitsOnly(value)
  if (name === 'cpf' && /^[\d.\s-]+$/.test(value) && digits.length === 11) {
    return digits.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4')
  }
  if (name === 'phone' && /^[\d()\s-]+$/.test(value) && [10, 11].includes(digits.length)) {
    return digits.replace(/^(\d{2})(\d{4,5})(\d{4})$/, '($1) $2-$3')
  }
  return value
}

export default function RegisterPage() {
  const [step, setStep] = useState<1 | 2>(1)
  const [input, setInput] = useState(emptyInput)
  const [errors, setErrors] = useState<RegistrationErrors>({})
  const [showPasswords, setShowPasswords] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [registered, setRegistered] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const submitting = useRef(false)
  const focusRequested = useRef(false)
  const formRef = useRef<HTMLFormElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const feedbackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!focusRequested.current) return
    focusRequested.current = false
    const invalid = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')
    const target = invalid ?? (submitError ? feedbackRef.current : headingRef.current)
    target?.focus()
  }, [step, errors, registered, submitError, processing])

  function updateField<Key extends keyof RegistrationInput>(name: Key, value: RegistrationInput[Key]) {
    setInput((previous) => ({ ...previous, [name]: value }))
    setErrors((previous) => ({ ...previous, [name]: undefined }))
    setSubmitError('')
  }

  function showErrors(nextErrors: RegistrationErrors) {
    focusRequested.current = true
    setErrors(nextErrors)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting.current) return

    if (step === 1) {
      const nextErrors = validateRegistrationDetails(input)
      showErrors(nextErrors)
      if (!Object.keys(nextErrors).length) {
        setShowPasswords(false)
        setStep(2)
      }
      return
    }

    const nextErrors = validateRegistrationChoices(input)
    if (Object.keys(nextErrors).length) {
      showErrors(nextErrors)
      return
    }

    submitting.current = true
    setProcessing(true)
    setSubmitError('')
    const result = await registerUser(input)
    submitting.current = false
    focusRequested.current = true
    setProcessing(false)

    if (result.kind === 'registered') {
      setInput(emptyInput)
      setRegistered(true)
    } else if (result.kind === 'invalid') {
      if (detailFields.some(({ name }) => result.errors[name])) setStep(1)
      setErrors(result.errors)
    } else {
      setSubmitError(result.kind === 'storageError'
        ? 'Não foi possível acessar ou gravar o cadastro neste navegador. Confira o armazenamento e tente novamente.'
        : 'Não foi possível proteger a senha neste navegador. Abra o protótipo em HTTPS ou localhost e tente novamente.')
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="text-muv-label font-semibold uppercase tracking-wide text-primary">Acesso ao MUV</p>
        <h1
          ref={registered ? headingRef : undefined}
          tabIndex={registered ? -1 : undefined}
          className="mt-2 text-muv-h1 font-bold"
        >
          {registered ? 'Cadastro realizado' : 'Criar sua conta'}
        </h1>
        <p className="mt-2 text-muted">Ambiente demonstrativo. Utilize somente dados fictícios.</p>
      </div>

      {registered ? (
        <Card className="space-y-4">
          <Alert variant="success" role="status">Sua conta foi cadastrada neste navegador.</Alert>
          <Link to="/login" className={textLink}>Acessar a página de login</Link>
        </Card>
      ) : (
        <>
          <Card>
            <p aria-current="step" className="text-muv-label font-semibold text-primary">Etapa {step} de 2</p>
            <h2 ref={headingRef} tabIndex={-1} className="mt-1 text-muv-h2 font-semibold">
              {step === 1 ? 'Seus dados' : 'Como você deseja utilizar o MUV?'}
            </h2>
            <form ref={formRef} noValidate onSubmit={handleSubmit} aria-busy={processing} className="mt-5 space-y-4">
              {step === 1 ? (
                <>
                  {detailFields.map((field) => {
                    const type = 'type' in field ? field.type : 'text'
                    return (
                      <Input
                        key={field.name}
                        id={`register-${field.name}`}
                        name={field.name}
                        label={field.label}
                        required
                        type={type === 'password' && showPasswords ? 'text' : type}
                        autoComplete={'autoComplete' in field ? field.autoComplete : undefined}
                        inputMode={'inputMode' in field ? field.inputMode : undefined}
                        value={input[field.name]}
                        helperText={'helperText' in field ? field.helperText : undefined}
                        error={errors[field.name]}
                        onChange={(event) => updateField(field.name, event.target.value)}
                        onBlur={(event) => {
                          const value = formatDetail(field.name, event.target.value)
                          if (value !== input[field.name]) {
                            setInput((previous) => ({ ...previous, [field.name]: value }))
                          }
                        }}
                      />
                    )
                  })}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      aria-controls="register-password register-passwordConfirmation"
                      onClick={() => setShowPasswords((previous) => !previous)}
                    >
                      {showPasswords ? 'Ocultar senhas' : 'Mostrar senhas'}
                    </Button>
                    <Button type="submit">Continuar</Button>
                  </div>
                </>
              ) : (
                <>
                  <RadioGroup
                    name="initialPurpose"
                    label="Finalidade inicial"
                    options={purposeOptions}
                    value={input.initialPurpose}
                    variant="card"
                    required
                    disabled={processing}
                    error={errors.initialPurpose}
                    onChange={(value) => updateField('initialPurpose', value)}
                  />
                  <Checkbox
                    name="acceptedTerms"
                    label="Aceito os termos de uso e a política de privacidade."
                    aria-describedby="registration-legal-links"
                    required
                    disabled={processing}
                    checked={input.acceptedTerms}
                    error={errors.acceptedTerms}
                    onChange={(event) => updateField('acceptedTerms', event.target.checked)}
                  />
                  <p id="registration-legal-links" className="text-muv-small text-muted">
                    Consulte os <Link to="/termos-de-uso" target="_blank" rel="noopener" className={textLink}>termos de uso</Link> e a{' '}
                    <Link to="/privacidade" target="_blank" rel="noopener" className={textLink}>política de privacidade</Link> em outra aba.
                  </p>
                  {submitError && (
                    <div ref={feedbackRef} tabIndex={-1}>
                      <Alert variant="danger" role="alert">{submitError}</Alert>
                    </div>
                  )}
                  {processing && <p role="status" className="text-muv-small text-muted">Criando conta…</p>}
                  <div className="flex flex-wrap justify-between gap-3">
                    <Button
                      variant="outline"
                      disabled={processing}
                      onClick={() => {
                        focusRequested.current = true
                        setErrors({})
                        setSubmitError('')
                        setStep(1)
                      }}
                    >
                      Voltar
                    </Button>
                    <Button type="submit" loading={processing}>Criar conta</Button>
                  </div>
                </>
              )}
            </form>
          </Card>
          <p className="text-center text-muted">
            Já possui uma conta? <Link to="/login" className={textLink}>Entrar</Link>
          </p>
        </>
      )}
    </div>
  )
}
