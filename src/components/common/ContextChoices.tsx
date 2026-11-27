import { useId, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router'

import { environmentRoutes } from '../../constants/environmentRoutes'
import { useAuth } from '../../contexts/authContext'
import { contextKey, contextLabel } from '../../domain/accountAccess'
import type { ActingContext } from '../../domain/accountAccess'
import Alert from '../feedback/Alert'
import Button from '../ui/Button'
import RadioGroup from '../ui/RadioGroup'

export default function ContextChoices({
  contexts,
  destination,
  onCancel,
  onComplete,
}: {
  contexts: readonly ActingContext[]
  destination?: string
  onCancel?: () => void
  onComplete?: () => void
}) {
  const { access, changeContext } = useAuth()
  const navigate = useNavigate()
  const name = useId()
  const [selection, setSelection] = useState('')
  const [error, setError] = useState('')
  const [processing, setProcessing] = useState(false)
  const submitting = useRef(false)
  const activeKey = access?.activeContext && contextKey(access.activeContext)
  const selected = contexts.find((context) => contextKey(context) === selection)
    ?? (contexts.length === 1 ? contexts[0] : undefined)

  async function submit(event: FormEvent) {
    event.preventDefault()
    if (submitting.current) return
    if (!selected) {
      setError('Selecione um contexto para continuar.')
      return
    }
    submitting.current = true
    setProcessing(true)
    setError('')
    const result = await changeContext(contextKey(selected))
    submitting.current = false
    setProcessing(false)
    if (result.kind === 'selected') {
      onComplete?.()
      navigate(destination ?? environmentRoutes[selected.kind], { replace: Boolean(destination) })
    } else {
      setError(result.kind === 'storageError'
        ? 'Não foi possível salvar a seleção nesta aba.'
        : 'Este contexto não está disponível para a conta atual.')
    }
  }

  return (
    <form onSubmit={submit} className="min-w-0 space-y-4 [overflow-wrap:anywhere]" aria-busy={processing}>
      {contexts.length > 1 && (
        <RadioGroup
          name={name}
          label="Contextos disponíveis"
          options={contexts.map((context) => ({
            value: contextKey(context),
            label: contextLabel(context),
            description: activeKey === contextKey(context) ? 'Contexto ativo' : undefined,
          }))}
          value={selection}
          onChange={(value) => { setSelection(value); setError('') }}
          disabled={processing}
        />
      )}
      {contexts.length === 1 && <p className="break-words font-medium">{contextLabel(contexts[0])}</p>}
      {error && <Alert role="alert" variant="danger">{error}</Alert>}
      <div className="flex flex-wrap gap-2">
        <Button type="submit" loading={processing}>Acessar contexto</Button>
        {onCancel && <Button variant="secondary" disabled={processing} onClick={onCancel}>Cancelar</Button>}
      </div>
    </form>
  )
}
